# Decision Log

### DEC-1: Dynamic Payment Methods Database Schema
*   **Date:** 2026-07-06T14:20:00+07:00
*   **Context:** Hardcoded payment channels in the dashboard are rigid and prevent enabling/disabling specific channels or adding QRIS.
*   **Options Considered:** 
    *   *Option A:* Store payment options in existing `system_settings` table as a JSON array. (Pros: No new tables needed. Cons: Harder to manage individual status toggles and configs per method).
    *   *Option B:* Create a dedicated `payment_methods` table. (Pros: Clean, scalable, allows custom JSONB configuration payloads per method. Cons: Requires a new table and migration).
*   **Decision:** Option B (Dedicated `payment_methods` table).
*   **Impact:** Created `payment_methods` table, enabled RLS, seeded default entries, and implemented API / dashboard dynamic fetch logic.

### DEC-2: Manual QRIS Image Mode Verification via WhatsApp
*   **Date:** 2026-07-06T14:21:00+07:00
*   **Context:** QRIS manual payment has no gateway webhook callback. Admin must manually verify transfer proof.
*   **Options Considered:** 
    *   *Option A:* Hardcode WhatsApp verification logic and template in the dashboard frontend. (Pros: Quick frontend changes. Cons: Tight coupling, environment configuration leakage).
    *   *Option B:* Generate pre-filled WhatsApp redirection URL on the backend during transaction creation and return it in metadata. (Pros: Decoupled design, keeps env variables secure, backend controls message templates. Cons: Slightly more data stored in transaction metadata).
*   **Decision:** Option B (Backend-generated WhatsApp redirect URL).
*   **Impact:** Modifies `createTransaction` inside `transaction.service.js` to return `confirm_payment_url` within metadata.

### DEC-3: Anti-Spam Strategy and Expiration/Cancellation Handler
*   **Date:** 2026-07-06T14:32:00+07:00
*   **Context:** Repeated top-up attempts created multiple PENDING rows in the database, spamming the storage engine.
*   **Options Considered:**
    *   *Option A:* Auto-cancel older transactions immediately when a new one is requested. (Pros: Simple. Cons: Invalidates active external gateway payment VAs prematurely).
    *   *Option B:* Block creating new requests while an active unexpired request exists, and force resolution or manual cancellation. (Pros: Prevents duplicate VAs on Winpay, clean invoice restoration on page load. Cons: Requires adding check and cancel endpoints).
*   **Decision:** Option B (Block creation and enforce manual/auto cancellation).
*   **Impact:** Implemented pending payment locks, added `GET /api/payments/pending` and `POST /api/payments/:id/cancel` endpoints, and integrated the logic into the dashboard frontend.
