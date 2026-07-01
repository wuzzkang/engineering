# Wuzzkang Database Architecture & Implementation Quality Audit (July 1, 2026)

## 1. Document Metadata
* **Title:** Wuzzkang Database Architecture & Implementation Quality Audit
* **Audit Date:** July 1, 2026
* **Document Version:** 1.0.0
* **Status:** Final Report
* **Target System:** Wuzzkang Core Database (PostgreSQL / Supabase Managed)
* **Auditor Role:** Senior Database & System Architect

---

## 2. Executive Summary
This report evaluates the implementation quality of the Wuzzkang PostgreSQL database schema, RLS policies, trigger logic, and API-layer service integrations. As of July 1, 2026, the database successfully supports atomic balance deductions via RPC and enforces RLS policies. However, the database is exposed to referential integrity risks due to missing foreign keys, performance degradation due to missing indexes on join columns, and race conditions caused by non-atomic multi-query billing operations inside the application service layer.

---

## 3. Audit Scope & Exclusions
* **Audit Scope:**
  * Active PostgreSQL schemas, tables, and column configurations in `wuzzkang-api/supabase/`.
  * Referential integrity, primary/foreign keys, and constraint definitions.
  * Performance indexes (B-Tree and unique expression indexes).
  * Row-Level Security (RLS) configurations and policies.
  * Stored procedures, triggers, trigger functions, and RPC implementations.
  * Database queries, balance mutations, and transaction operations in `wuzzkang-api/src/services/`.
* **Exclusions:**
  * Supabase internal schema (`auth`, `vault`, `extensions`) implementation details.
  * WinPay payment gateway authentication and encryption keys.
  * Host infrastructure limits and raw CPU/memory performance characteristics.

---

## 4. Audit Methodology & Severity Levels
* **Methodology:** The audit was conducted via visual inspection of the active database migration SQL files located under `wuzzkang-api/supabase/migrations/` and static analysis of the database queries and connection handlers in the API repository (`wuzzkang-api/src/services/`).
* **Severity Definitions:**
  * **Critical:** Issues exposing the system to financial double-spending, data corruption, or severe security bypasses.
  * **Major:** Missing referential constraints or indexes that lead to orphan rows, memory-intensive table scans, or query bottlenecks.
  * **Minor:** Inconsistent naming patterns or nullable fields without default constraints that do not immediately degrade operation.
  * **Suggestion:** Minor style alignment, terminology normalization, or future-proofing suggestions.

---

## 5. Part I: Schema Audit Findings (Verified by Schema)

### Finding 1: Missing Physical Foreign Key Constraints on User Relations
* **Severity:** Major
* **Classification:** Verified by schema
* **Evidence:** 
  * `20260620063900_remote_schema.sql` (lines 52-61) defines `projects` containing `user_id uuid NOT NULL` without a `REFERENCES` clause.
  * `20260628061100_create_coupons.sql` (line 34) defines `coupon_usages` containing `user_id uuid NOT NULL` without a `REFERENCES` clause.
* **Impact:** PostgreSQL cannot enforce referential integrity. Deleting a user in the authentication provider (`auth.users`) will not cascade to delete their associated projects or coupon usages, causing orphaned records and data inconsistency.
* **Recommendation:** Add explicit foreign key constraints pointing to `auth.users(id) ON DELETE CASCADE` for both columns.

### Finding 2: Inefficient Indexing Configurations for Relations and Aggregates
* **Severity:** Major
* **Classification:** Verified by schema
* **Evidence:**
  * `20260620064715_create_saas_billing_and_projects.sql` (lines 9-18) establishes `transactions` with `project_id UUID REFERENCES projects(id) ON DELETE SET NULL` but defines no index on `project_id`.
  * `20260628061100_create_coupons.sql` (line 47) defines composite index `idx_coupon_usages_user_id_coupon_id` on `(user_id, coupon_id)`.
* **Impact:** 
  * Hard deleting a project triggers `ON DELETE SET NULL` on `transactions`, forcing a sequential scan on the `transactions` table.
  * Single-column queries joining on `coupon_id` (e.g., fetching a coupon's global `uses_count`) cannot utilize the composite index because `coupon_id` is the trailing column.
* **Recommendation:** Create B-Tree indexes on `transactions(project_id)` and a standalone index on `coupon_usages(coupon_id)`.

### Finding 3: Inconsistent Column Naming Schema for Order Idempotency References
* **Severity:** Minor
* **Classification:** Verified by schema
* **Evidence:**
  * `transactions.order_id` in `20260622130000_add_winpay_fields_to_transactions.sql` (line 13).
  * `user_domains.provider_order_id` in `20260620064715_create_saas_billing_and_projects.sql` (line 25).
  * `projects.domain_provider_order_id` in `20260620064715_create_saas_billing_and_projects.sql` (line 36).
* **Impact:** Inconsistent parameter prefixing increases developer overhead and increases risks of mismatched variables in future backend integrations.
* **Recommendation:** Establish a database naming standard and unify all third-party provider transaction references under a single suffix convention (e.g., `provider_order_id`).

### Finding 4: Inconsistent Nullability Constraints on Default-Valued Columns
* **Severity:** Minor
* **Classification:** Verified by schema
* **Evidence:**
  * `projects.status` (`20260620063900_remote_schema.sql` line 58) and `projects.edit_count` (`20260628145400_add_edit_count_to_projects.sql` line 2) allow `NULL` values even though they default to `'draft'` and `0` respectively.
  * `transactions.status` (`20260622130000_add_winpay_fields_to_transactions.sql` line 15) and `coupons.uses_count` (`20260628061100_create_coupons.sql` line 12) allow `NULL` values.
* **Impact:** Bypassing standard code defaults by inserting explicit `NULL` values can lead to unexpected state errors during runtime operations.
* **Recommendation:** Alter the tables to add `NOT NULL` constraints to all columns containing application-critical defaults.

---

## 6. Part II: Code Implementation Audit Findings (Verified by Code)

### Finding 5: Unused and Speculative Database Tables and Columns
* **Severity:** Suggestion
* **Classification:** Verified by code
* **Evidence:**
  * Table `public.user_domains` is defined in schema migrations but a codebase search (`grep_search`) for `user_domains` returns 0 references in API routes or services.
  * Columns `projects.custom_domain`, `projects.domain_status`, and `projects.domain_provider_order_id` are created in migrations but are omitted from all SQL queries in the `wuzzkang-api` repository.
* **Impact:** Dead schema columns and unused tables clutter the database catalog, making documentation maintenance and database maintenance harder.
* **Recommendation:** Remove the speculative tables and columns from the migrations and schema definitions.

### Finding 6: Non-Atomic Wallet Balance Mutations in Application Service Layer
* **Severity:** Critical
* **Classification:** Verified by code
* **Evidence:** 
  * `wuzzkang-api/src/services/wallet.service.js` in `addTransaction` (lines 76-93) and `completeTransaction` (lines 125-137) updates the balance in `public.profiles` and inserts or updates a row in `public.transactions` using two independent, sequential API calls.
* **Impact:** Lack of database-level transactions around these dual-table updates exposes the billing ledger to race conditions and double-spending vulnerabilities (e.g., if a payment provider webhook is called concurrently).
* **Recommendation:** Re-implement these operations inside a database transaction block or encapsulate them within a single atomic RPC function.

### Finding 7: Denormalized User Attributes Synchronization via Database Triggers
* **Severity:** Suggestion
* **Classification:** Verified by code
* **Evidence:**
  * `20260622140454_add_profile_fields.sql` (lines 8-25) triggers `public.handle_new_user()` to copy `email`, `full_name`, and `avatar_url` from `auth.users` into `public.profiles`.
* **Impact:** 
  * Duplicates data across schemas, but isolates RLS boundaries, eliminating slow joins on the protected `auth` schema.
  * This is a justified denormalization.
* **Recommendation:** Maintain the current implementation pattern but add an update trigger to sync metadata updates when users modify their profile data in the authentication system.

---

## 7. Part III: Architectural Recommendations (Audit Opinion)

### Recommendation 1: Consolidate Wallet Mutations into Atomic Transactions
* **Severity:** Critical
* **Classification:** Architectural recommendation
* **Evidence:** Observed non-atomic balance updates in `wallet.service.js` (lines 76-93, 125-137).
* **Impact:** Secures the wallet ledger against concurrent race conditions and double spend attempts.
* **Recommendation:** Encapsulate sequential updates in application service methods inside a PostgreSQL `BEGIN ... COMMIT;` transaction block or custom RPC.

### Recommendation 2: Introduce Database-Level Invariant Check Constraints
* **Severity:** Major
* **Classification:** Architectural recommendation
* **Evidence:** Observed complete absence of Check constraints across all migration SQL scripts.
* **Impact:** Guarantees data integrity directly at the storage level, protecting the system from bugs in the application code.
* **Recommendation:**
  * Add `CHECK (balance >= 0)` on `profiles.balance`.
  * Add `CHECK (status IN ('draft', 'deploying', 'deployed', 'failed'))` on `projects.status`.
  * Add `CHECK (discount_value > 0)` on `coupons.discount_value`.

### Recommendation 3: Optimize Performance Indexing for Joins and Counts
* **Severity:** Major
* **Classification:** Architectural recommendation
* **Evidence:** Missing indexes on `transactions.project_id` and single-column searches on `coupon_usages.coupon_id`.
* **Impact:** Eliminates full table scans during project deletes and optimizes aggregation query speeds.
* **Recommendation:** Implement B-Tree indexes on join columns and separate composite indexes into single-column indexing fields where necessary.

### Recommendation 4: Remove Speculative Custom Domain Schema Elements
* **Severity:** Suggestion
* **Classification:** Architectural recommendation
* **Evidence:** Identified speculative table `public.user_domains` and projects domain columns.
* **Impact:** Unclutters the database model and simplifies maintenance.
* **Recommendation:** Execute a clean migration script that drops `user_domains` and the unused domain columns from `projects`.

---

## 8. Consolidated Findings Inventory

| Finding ID | Category | Finding Title | Source | Severity | Verification Status |
|---|---|---|---|---|---|
| **F-01** | Schema | Missing Physical Foreign Key Constraints | Schema | Major | Verified by schema |
| **F-02** | Schema | Inefficient Indexing Configurations for Relations and Aggregates | Schema | Major | Verified by schema |
| **F-03** | Schema | Inconsistent Column Naming Schema | Schema | Minor | Verified by schema |
| **F-04** | Schema | Inconsistent Nullability Constraints | Schema | Minor | Verified by schema |
| **F-05** | Code | Unused and Speculative Database Objects | Code | Suggestion | Verified by code |
| **F-06** | Code | Non-Atomic Wallet Balance Mutations | Code | Critical | Verified by code |
| **F-07** | Code | Denormalized User Attributes Synchronization | Code | Suggestion | Verified by code |
| **A-01** | Recommendation | Consolidate Wallet Mutations into Atomic Transactions | Opinion | Critical | Architectural recommendation |
| **A-02** | Recommendation | Introduce Database-Level Invariant Check Constraints | Opinion | Major | Architectural recommendation |
| **A-03** | Recommendation | Optimize Performance Indexing for Joins and Counts | Opinion | Major | Architectural recommendation |
| **A-04** | Recommendation | Remove Speculative Custom Domain Schema Elements | Opinion | Suggestion | Architectural recommendation |

---

## 9. Conclusion & Engineering Roadmap
The Wuzzkang core database architecture is structurally sound for standard CRUD operations, but requires immediate remediation of billing concurrency risks (**F-06 / A-01**) and referential integrity gaps (**F-01 / A-02**). 

### High-Priority Action Items:
1. Wrap `walletService.addTransaction()` and `walletService.completeTransaction()` inside SQL transactions.
2. Add check constraint `CHECK (balance >= 0)` to the `profiles` table.
3. Establish index on `transactions(project_id)` to optimize cascading updates.
4. Establish foreign key constraint on `projects.user_id` pointing to `auth.users`.
