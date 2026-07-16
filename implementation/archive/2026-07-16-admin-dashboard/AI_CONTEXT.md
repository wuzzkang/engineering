# AI Context

## Target Files
- `wuzzkang-api/supabase/migrations/20260716140000_create_admin_stats_rpc.sql` [NEW]
- `wuzzkang-api/src/routes/admin.route.js` [NEW]
- `wuzzkang-api/src/controllers/admin.controller.js` [NEW]
- `wuzzkang-api/src/services/admin.service.js` [NEW]
- `wuzzkang-api/src/routes/payment.route.js` [MODIFY]
- `wuzzkang-api/server.js` [MODIFY]
- `wuzzkang-dashboard/src/hooks/useRequireAdmin.js` [NEW]
- `wuzzkang-dashboard/src/app/admin/page.js` [NEW]
- `wuzzkang-dashboard/src/components/Sidebar.js` [MODIFY]
- `wuzzkang-engineering/docs/02_CURRENT_STATE.md` [MODIFY]
- `wuzzkang-engineering/docs/05_API_SPECIFICATION.md` [MODIFY]

## Target Endpoints
- `GET /api/admin/transactions`
- `GET /api/admin/stats`
- `POST /api/admin/payments/:id/complete`

## Target Database Tables & Schemas
- Schema: `public`
- Tables: `profiles`, `transactions`, `role_access`
- Function: `get_admin_stats()`
