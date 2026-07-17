# Implementation Plan: Security & Logic Remediation

## Goal
Implement critical and high-priority security fixes across the `wuzzkang-api` repositories, focusing on Broken Object Level Authorization (IDOR), data integrity issues (non-atomic wallet and coupon updates), path traversal protection, and role-based privilege checks.

## Proposed Changes

### Component: API Routes & Controllers
*   **Modify** [payment.controller.js](file:///home/bms-del112/BMS/personal-project/wuzzkang/wuzzkang-api/src/controllers/payment.controller.js): Populate `userId` directly from `req.user.id` to prevent IDOR parameter manipulation.
*   **Modify** [project.route.js](file:///home/bms-del112/BMS/personal-project/wuzzkang/wuzzkang-api/src/routes/project.route.js): Enforce user ownership check on `GET /api/projects/:id` to prevent unauthorized draft leaks.
*   **Modify** [deploy.route.js](file:///home/bms-del112/BMS/personal-project/wuzzkang/wuzzkang-api/src/routes/deploy.route.js): Validate project ownership before queueing deployment tasks to BullMQ.
*   **Modify** [image.route.js](file:///home/bms-del112/BMS/personal-project/wuzzkang/wuzzkang-api/src/routes/image.route.js): Resolve and normalize requested file deletion paths via Node.js `path.normalize` to eliminate path traversal vulnerabilities.
*   **Modify** [admin.route.js](file:///home/bms-del112/BMS/personal-project/wuzzkang/wuzzkang-api/src/routes/admin.route.js): Enforce `superAdminMiddleware` on the user deletion endpoint to prevent standard admins from deleting user accounts.

### Component: Database & Core Services
*   **New Migration** `20260716120000_add_increment_balance_rpc.sql`: Add SQL-level atomic user balance mutations.
*   **New Migration** `20260716130000_add_unique_index_projects_domain.sql`: Create partial unique constraint index on `projects(custom_domain)` to lock subdomain uniqueness.
*   **New Migration** `20260716140000_add_increment_coupon_uses_rpc.sql`: Add SQL-level atomic coupon usage mutations.
*   **Modify** [wallet.service.js](file:///home/bms-del112/BMS/personal-project/wuzzkang/wuzzkang-api/src/services/wallet.service.js): Refactor balance modifications to use the new atomic RPC.
*   **Modify** [coupon.service.js](file:///home/bms-del112/BMS/personal-project/wuzzkang/wuzzkang-api/src/services/coupon.service.js): Refactor coupon use counts to use the new atomic RPC.

## Verification
*   Execute Node syntax check (`node --check`) to verify syntax correctness across all modified files.
*   Ensure all new database migrations are successfully pushed/applied on the database.
