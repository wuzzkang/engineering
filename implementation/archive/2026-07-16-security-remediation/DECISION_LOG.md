# Decision Log: Security & Logic Remediation

This document logs key architectural or design decisions made during the security remediation phase.

### DEC-01: Atomic Wallet Balance Mutations via RPC
*   **Date:** 2026-07-16
*   **Context:** Sequential fetch-then-update of user balance in JS (`wallet.service.js`) was prone to race conditions (Lost Updates) during concurrent payment callbacks or refunds.
*   **Options Considered:**
    *   *Option A:* Retain JS-side calculation (vulnerable, no concurrency safety).
    *   *Option B:* Create a custom Postgres RPC function `increment_user_balance` with row-level locking (`FOR UPDATE`) to handle the calculations and updates atomically in a database transaction.
*   **Decision:** Selected **Option B** to ensure absolute financial ledger integrity.
*   **Impact:** [wallet.service.js](file:///home/bms-del112/BMS/personal-project/wuzzkang/wuzzkang-api/src/services/wallet.service.js)

### DEC-02: Atomic Coupon Usage Updates via RPC
*   **Date:** 2026-07-16
*   **Context:** `uses_count` increments for coupons were done non-atomically via JS, potentially allowing global coupon usage limits to be bypassed.
*   **Options Considered:**
    *   *Option A:* Keep JS-side counter increments.
    *   *Option B:* Implement an atomic RPC function `increment_coupon_uses` to run `UPDATE coupons SET uses_count = uses_count + 1` directly on the database row.
*   **Decision:** Selected **Option B** to enforce strict coupon validation limits.
*   **Impact:** [coupon.service.js](file:///home/bms-del112/BMS/personal-project/wuzzkang/wuzzkang-api/src/services/coupon.service.js)

### DEC-03: Partial Unique Constraint on `projects.custom_domain`
*   **Date:** 2026-07-16
*   **Context:** Checking subdomain availability in Node.js runtime was vulnerable to race conditions (two projects claiming the same domain simultaneously).
*   **Options Considered:**
    *   *Option A:* Maintain runtime validation only.
    *   *Option B:* Introduce a database-level partial unique index `idx_projects_custom_domain_unique` on `projects(custom_domain) WHERE custom_domain IS NOT NULL` to enforce database-level uniqueness.
*   **Decision:** Selected **Option B** to prevent subdomain takeover/hijacking attempts.
*   **Impact:** Database schema level constraint.
