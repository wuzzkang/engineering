# AI Platform Context & Monorepo Map

This file provides a structured quick-reference map of the Wuzzkang monorepo architecture and conventions to quickly onboard incoming AI assistants.

---

## 1. Monorepo Directory Boundaries

*   **`wuzzkang-api/` (Backend Service):** Core Express.js application handling logic, dynamic pricing, database integration, and queue workers.
*   **`wuzzkang-dashboard/` (Admin Dashboard):** Next.js single-page client application where users manage profiles, templates, and trigger AI tasks.
*   **`wuzzkang-lp/` (Landing Page Runtime):** Vanilla HTML/JS lightweight landing page template renderer.
*   **`wuzzkang-engineering/` (Documentation):** Canonical architecture documentation, API specs, database schemas, and protocols.

---

## 2. Core Technical Paradigms

*   **ES Modules (ESM) Imports:** All import statements must explicitly contain the `.js` file extension suffix.
    *   *Correct:* `import { service } from './service.js';`
    *   *Incorrect:* `import { service } from './service';`
*   **API Payload Validation:** Router boundaries enforce input checking using **Zod** schema parses before calling service orchestrators.
*   **Centralized Error Handling:** Async routes forward exceptions to the centralized `errorMiddleware.js` using `next(err)`.
*   **Atomic Credit Transactions:** Wallet credit balance deductions are executed via database RPC functions *before* executing high-latency operations or queue pushes.
*   **Row-Level Security (RLS) Bypass:** The API connects to Supabase using the `service_role` secret to bypass RLS policies. Client queries to Supabase default to standard `authenticated` or `anon` roles governed by RLS.

---

## 3. Critical System File Pointers

*   **System Configuration:** `wuzzkang-api/src/config/index.js`
*   **API Router Index:** `wuzzkang-api/src/routes/`
*   **Database Schema Registry:** `wuzzkang-api/src/utils/schema.js`
*   **Dynamic Wallet Service:** `wuzzkang-api/src/services/wallet.service.js`
*   **Background Queue Handler:** `wuzzkang-api/src/queues/queue.js`

---

## 4. Current Task Scope Pointers

*(To be filled by the starting AI with links to active files, active routes, and database tables for the task at hand)*
- **Active Files:**
- **Active Routes:**
- **Active Tables:**
- **Required Env Variables:**
