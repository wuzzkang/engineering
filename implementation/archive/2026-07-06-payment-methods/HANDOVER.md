# Handover - Dynamic Payment Methods & QRIS Integration

This document outlines the handover specifications for the dynamic payment methods implementation and the **pending transaction anti-spam system**.

## Completed Tasks
- Created `payment_methods` DB table and default seeds for QRIS and Virtual Accounts.
- Created script `scripts/create-payment-methods.js` to run the migration.
- Implemented `getPaymentMethods()` database query API.
- Implemented `GET /api/payment-methods` route.
- Configured Zod schemas and environment variables to support `WA_CONFIRM_PAYMENT`.
- Added manual image mode and WhatsApp redirect link generation inside `transactionService.createTransaction`.
- Modified `DummyPaymentProvider` for dynamic mock QRIS gateway parameters.
- Built dynamic dashboard top-up channels selector and QR code display inside `topup/page.js`.
- Generated realistic merchant-ready placeholder asset at `public/qris.png`.

### Anti-Spam & Cancellation Integration
- Added `getPendingTransaction(userId)` and `cancelTransaction(transactionId, userId)` inside `transaction.service.js`.
  - Stale pending payments are automatically marked as `EXPIRED` (using 25 minutes limit for Winpay/gateway and 2 hours for manual QRIS).
  - Active pending transactions block the creation of new ones, returning a conflict error instead.
- Added `GET /api/payments/pending` and `POST /api/payments/:id/cancel` endpoints in `payment.route.js`.
- Updated Dashboard `topup/page.js` to:
  - Check for any pending payments on load and automatically show the invoice UI.
  - Link the "Batal / Kembali" button to the cancellation API, marking the transaction as `EXPIRED` in the database.

## Code Walkthrough
- Database Schema: [20260706080000_create_payment_methods.sql](file:///home/bms-del112/BMS/personal-project/wuzzkang/wuzzkang-api/supabase/migrations/20260706080000_create_payment_methods.sql)
- DB Service: [supabase.service.js](file:///home/bms-del112/BMS/personal-project/wuzzkang/wuzzkang-api/src/services/supabase.service.js)
- Routing: [payment.route.js](file:///home/bms-del112/BMS/personal-project/wuzzkang/wuzzkang-api/src/routes/payment.route.js)
- Core Logic: [transaction.service.js](file:///home/bms-del112/BMS/personal-project/wuzzkang/wuzzkang-api/src/services/transaction.service.js)
- Front-End Topup UI: [page.js](file:///home/bms-del112/BMS/personal-project/wuzzkang/wuzzkang-dashboard/src/app/topup/page.js)

## Manual Verification Steps
1. Execute the raw SQL migration in [20260706080000_create_payment_methods.sql](file:///home/bms-del112/BMS/personal-project/wuzzkang/wuzzkang-api/supabase/migrations/20260706080000_create_payment_methods.sql) inside your Supabase Dashboard SQL Editor (since REST-based SQL executor is locked down).
2. Start the API backend:
   ```bash
   npm run start
   ```
3. Boot the Next.js frontend and navigate to `/topup`.
4. Create a payment invoice (VA or QRIS).
5. Refresh the browser. Verify that the dashboard directly restores the pending invoice state (anti-spam working).
6. Click **Batal / Kembali**. Verify that the UI resets and the transaction status changes to `'EXPIRED'` in your database.
7. Trigger a new top-up. Click **Simulasikan Bayar Sukses** and verify that your wallet balance is credited and transaction status updates to `'PAID'`.
