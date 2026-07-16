# Implementation Plan: Admin Dashboard

## Goal
Build a secure, premium Admin Dashboard for administrators of the Wuzzkang platform. The dashboard will allow them to check transaction logs (search, filter, pagination), view high-level platform stats (users, revenue, credits, queue), and manually complete pending transactions.

## Proposed Changes

### Database
- **[NEW]** [20260716140000_create_admin_stats_rpc.sql](file:///home/bms-del112/BMS/personal-project/wuzzkang/wuzzkang-api/supabase/migrations/20260716140000_create_admin_stats_rpc.sql): Add the `get_admin_stats()` RPC function to calculate aggregated revenue and user statistics.

### Backend API (`wuzzkang-api`)
- **[MODIFY]** [payment.route.js](file:///home/bms-del112/BMS/personal-project/wuzzkang/wuzzkang-api/src/routes/payment.route.js): Modify manual payment complete logic to allow authenticated admins without requiring the administrative API key header.
- **[NEW]** [admin.route.js](file:///home/bms-del112/BMS/personal-project/wuzzkang/wuzzkang-api/src/routes/admin.route.js): Route paths for admin actions (`/api/admin/transactions` and `/api/admin/stats`).
- **[NEW]** [admin.controller.js](file:///home/bms-del112/BMS/personal-project/wuzzkang/wuzzkang-api/src/controllers/admin.controller.js): Controller handlers.
- **[NEW]** [admin.service.js](file:///home/bms-del112/BMS/personal-project/wuzzkang/wuzzkang-api/src/services/admin.service.js): Query building, search matching profiles & transactions, paging, and calling stats RPC.
- **[MODIFY]** [server.js](file:///home/bms-del112/BMS/personal-project/wuzzkang/wuzzkang-api/server.js): Route registration.
- **[MODIFY]** [05_API_SPECIFICATION.md](file:///home/bms-del112/BMS/personal-project/wuzzkang/wuzzkang-engineering/docs/05_API_SPECIFICATION.md): Document new endpoints.

### Frontend Dashboard (`wuzzkang-dashboard`)
- **[NEW]** [useRequireAdmin.js](file:///home/bms-del112/BMS/personal-project/wuzzkang/wuzzkang-dashboard/src/hooks/useRequireAdmin.js): Protect admin paths.
- **[NEW]** [page.js](file:///home/bms-del112/BMS/personal-project/wuzzkang/wuzzkang-dashboard/src/app/admin/page.js): Dashboard interface with stats cards, list table, search, filters, complete action, and pagination.
- **[MODIFY]** [Sidebar.js](file:///home/bms-del112/BMS/personal-project/wuzzkang/wuzzkang-dashboard/src/components/Sidebar.js): Dynamic admin panel link.

## Verification
- Verify unauthorized page access redirects to `/`.
- Verify admin panel renders stats and transaction logs correctly.
- Verify searching and filtering work as expected.
- Verify manual completion triggers the database balance mutation, changes transaction status to `PAID`, and prompts a confirmation dialog.
