# Handover - Secure Hierarchical RBAC Admin API & Dynamic Expiration Countdown

This document outlines the final handover specifications for the secure administrative manual payment completion API, dynamic database-driven expiry configuration, and real-time frontend countdown timer integration.

## Completed Tasks
- Created SQL migrations for:
  - Role management, permissions mapping table, and role update SQL protection triggers.
  - Adding `expiry_duration_minutes` configuration keys to database-driven payment methods.
- Implemented absolute transaction expiry calculation (`expired_at`) inside `transaction.service.js`.
- Formatted structured payment details into the auto-filled WhatsApp confirmation URL text templates.
- Added stateful countdown timers (`timeLeft`) in Next.js `topup/page.js` to dynamically tick down every second.
- Mounted `/api/admin/payments/:id/complete` endpoint in `payment.route.js` supporting both UUID and `order_id` (starts with `INV-`) lookup translations.

## Key Source Files
- Database Migrations: 
  - [20260706090000_add_admin_role_and_protection.sql](file:///home/bms-del112/BMS/personal-project/wuzzkang/wuzzkang-api/supabase/migrations/20260706090000_add_admin_role_and_protection.sql)
  - [20260706090100_add_expiry_config.sql](file:///home/bms-del112/BMS/personal-project/wuzzkang/wuzzkang-api/supabase/migrations/20260706090100_add_expiry_config.sql)
- Middleware: [admin.middleware.js](file:///home/bms-del112/BMS/personal-project/wuzzkang/wuzzkang-api/src/middleware/admin.middleware.js)
- Routing: [payment.route.js](file:///home/bms-del112/BMS/personal-project/wuzzkang/wuzzkang-api/src/routes/payment.route.js)
- Service Layer: [transaction.service.js](file:///home/bms-del112/BMS/personal-project/wuzzkang/wuzzkang-api/src/services/transaction.service.js)
- Next.js Component: [page.js](file:///home/bms-del112/BMS/personal-project/wuzzkang/wuzzkang-dashboard/src/app/topup/page.js)

## Verification Steps
1. Execute the SQL queries inside both migration files inside your Supabase Dashboard SQL Editor.
2. Elevate your local profile's role to `'admin'` or `'super_admin'`:
   ```sql
   UPDATE public.profiles SET role = 'admin' WHERE email = 'your-login-email@example.com';
   ```
3. Boot the backend server (`npm run dev` in `wuzzkang-api`).
4. Boot the frontend server (`npm run dev` in `wuzzkang-dashboard`).
5. Open `http://localhost:3000/topup` in the browser, choose your credits amount, and click **Lanjut ke Pembayaran**.
6. Verify that the dynamic timer (e.g. `Sisa waktu: 1 jam 59 menit 59 detik`) shows and ticks down correctly.
7. Click the WhatsApp button. Verify the structured message layout is formatted correctly with order details.
8. Complete the payment using cURL:
   ```bash
   curl -X POST \
     -H "Authorization: Bearer <ADMIN_JWT>" \
     -H "X-Admin-Secret: wuzzkang_admin_secret_key_2026" \
     http://localhost:3026/api/admin/payments/INV-xxxxxxxx/complete
   ```
   Verify that it successfully completes and returns `200 OK` JSON response.
9. Verify the dashboard updates immediately.
