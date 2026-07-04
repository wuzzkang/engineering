# Technical Decision Log

This log lists all technical workarounds, design changes, and architectural decisions made during this implementation task that deviate from or add detail to the original plan.

---

### DEC-001: Supabase Migration History Mismatch — Repair Before Push

*   **Date:** 2026-07-04T11:49:00Z
*   **Context:** During the first execution of `npx supabase db push` for migration `20260705000000_create_ai_tasks.sql`, the CLI attempted to re-apply 10 older migrations (`20260626000000` through `20260704`) that had already been manually applied to the remote database but had no corresponding entry in the remote `supabase_migrations` history table. This caused the push to fail on `CREATE POLICY "Allow public select for deployed projects"` with `SQLSTATE 42710 (already exists)`.
*   **Options Considered:**
    *   *Option A:* Use `IF NOT EXISTS` guards on every DDL statement in all old migration files. Risky — would require editing locked historical files.
    *   *Option B:* Use `npx supabase migration repair --linked --status applied <versions>` to mark historical migrations as already applied. Safe — does not touch live data or code.
*   **Decision:** Option B — ran `migration repair` for all 10 historical migration versions, then re-ran `db push`. Only `20260705000000_create_ai_tasks.sql` was applied against the database.
*   **Impact:** `supabase_migrations` history table is now fully synchronized with local migration files. All future `db push` calls will work correctly from this point. No data or schema changes were made to resolve this.

---

### DEC-002: Resolve Database Index & Type Findings from Milestone 1 Review

*   **Date:** 2026-07-04T11:56:00Z
*   **Context:** Milestone 1 review identified:
    1.  Missing B-Tree index on `ai_tasks.project_id`, which references `public.projects(id) ON DELETE SET NULL`. This would trigger Full Table Scan on projects deletion.
    2.  `ai_tasks.credits_used` was initially defined as `INTEGER`, whereas ledger systems (profiles, transactions) use `BIGINT`.
*   **Options Considered:**
    *   *Option A:* Modify the original `20260705000000_create_ai_tasks.sql` migration. Bad practice — migration has already been pushed to the remote repository.
    *   *Option B:* Create a new migration file `20260705000100_add_project_id_index_to_ai_tasks.sql` to apply the changes incrementally. Correct database engineering practice.
*   **Decision:** Option B — wrote and successfully applied the new incremental migration to add B-Tree index and alter the column data type.
*   **Impact:** Performance bottlenecks on project cascades are resolved, and billing column types are aligned with the global billing schema.

---

### DEC-003: AIOrchestrationService — Billing Strategy & Refund Compensation Design

*   **Date:** 2026-07-05T12:14:00Z
*   **Context:** When designing `AIOrchestrationService.execute()`, two billing strategies were evaluated for handling the deduction-then-insert workflow:
    1.  **Option A:** Deduct wallet first, then insert `ai_tasks` record. If insert fails, issue refund.
    2.  **Option B:** Insert `ai_tasks` record first in `pending` status, then deduct wallet, then transition to `queued`. Rollback the insert if deduction fails.
*   **Options Considered:**
    *   *Option A* reuses the existing `walletService.deductBalance()` RPC (which is already atomic and contains `INSUFFICIENT_FUNDS` guard). Failure path issues a `walletService.addTransaction('refund')` compensation call. Simple, direct, and consistent with existing API patterns.
    *   *Option B* requires a new "two-phase commit" database pattern with interim `pending` status and explicit rollback. More complex; breaks consistency with existing `walletService` API surface.
*   **Decision:** Option A — deduct first, insert task record second, with a refund compensation call on insert failure. The refund failure is logged as `CRITICAL` but does not swallow the original error.
*   **Impact:** Billing logic remains consistent with the existing `walletService.deductBalance` RPC pattern. No new database procedures required for Milestone 3. Refund path provides a safety net without requiring synchronous two-phase commit.

---

### DEC-004: Google Generative AI SDK Integration & Registration Guards

*   **Date:** 2026-07-05T12:33:00Z
*   **Context:** Milestone 4 required the implementation of `GeminiProvider.js` using `@google/generative-ai` SDK. The backend environment did not have `@google/generative-ai` installed nor `GEMINI_API_KEY` configured in `.env`.
*   **Options Considered:**
    *   *Option A:* Fall back to OpenAI-compatible SDK calls to avoid external dependency. Denied: violates architecture specification demanding native Gemini SDK.
    *   *Option B:* Install `@google/generative-ai` SDK and enforce config parsing. Guard registry registration if `GEMINI_API_KEY` is absent to prevent startup crash.
*   **Decision:** Option B — installed `@google/generative-ai` SDK, configured schema validation in `config/index.js`, and implemented a warning fallback guard in `register.js` to ensure the server starts gracefully without crashing if the API key is not present.
*   **Impact:** Ensures native Gemini multimodal execution capabilities while maintaining server resilience across non-AI environments.

---

### DEC-005: WeddingTaskCompiler Prompt and Asset Pipeline Structure

*   **Date:** 2026-07-05T12:35:00Z
*   **Context:** Designing the compilation boundary between `WeddingTaskCompiler.js` and the downstream async queue worker (Milestone 5). Deciding where to download and encode media assets to base64.
*   **Options Considered:**
    *   *Option A:* Compile and fetch/encode assets to base64 synchronously during request orchestration. Slows down HTTP response time for task submission.
    *   *Option B:* Compile only metadata references at request time, and delegate downloading/base64 encoding of image assets to the async worker.
*   **Decision:** Option B — the compiler parses names, theme, and style key, building the text prompt and returning references in `assetReferences`. Base64 conversion is deferred to the worker.
*   **Impact:** Keeps API request-response cycle fast and lightweight. Prevents memory bloat in Express server.

---


### DEC-006: Schema Alignment — request_payload vs. Individual Columns

*   **Date:** 2026-07-04T19:55:00Z
*   **Context:** During Milestone 5 testing, DB inserts in `_createTaskRecord()` failed because the code was referencing non-existent columns (`template_type`, `style_key`, `input_assets`, etc.). The actual schema stores these inside the `request_payload` JSONB column.
*   **Decision:** Aligned `_createTaskRecord()` and `aiTaskWorker.js` with the real schema — application data goes into `request_payload`; `providerKey` → `provider`; `targetModel` → `model`; `transactionId` → `execution_metadata.transaction_id`.
*   **Impact:** No breaking change to external API. All business data preserved in JSONB for query flexibility.

---

### DEC-007: technical_status Terminal Values — Constraint Alignment

*   **Date:** 2026-07-04T19:56:00Z
*   **Context:** `aiTaskWorker.js` initially used `technical_status: 'completed'` and `'failed'` — both outside the DB CHECK constraint which only allows: `none, uploading_assets, building_prompt, calling_provider, saving_result, retrying`.
*   **Decision:** Terminal states set `technical_status = 'none'` (no active process running). Terminal outcome is readable from `status` column alone.
*   **Impact:** DB writes never fail on constraint violation. Semantically correct.

---

### DEC-008: Structural Verification vs. Full Integration Testing

*   **Date:** 2026-07-04T19:57:00Z
*   **Context:** Full end-to-end integration test requires real `GEMINI_API_KEY`, seeded DB users, and running Redis — not guaranteed across all dev environments.
*   **Decision:** Milestone 5 verification uses a structural test (`test-milestone5.js`) validating all module imports, registry wiring, payload contracts, MIME types, and queue API surface without live DB/API calls. Full integration testing is delegated to staging.
*   **Impact:** Test suite reliable in all environments. Integration coverage gap explicitly documented.

---
