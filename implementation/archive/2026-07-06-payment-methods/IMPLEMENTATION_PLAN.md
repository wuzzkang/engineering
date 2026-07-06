# Dynamic Payment Methods & QRIS Integration

This implementation plan details the addition of a dynamic payment methods system to Wuzzkang. It enables toggling and configuring payment methods (specifically Virtual Accounts and QRIS) via the database. It also implements a flexible QRIS system that can either hit a payment gateway or display a static image stored in the project assets folder.

Additionally, this plan incorporates a **Pending Transaction Spam Prevention mechanism** to prevent users from creating multiple duplicate pending transactions in the database.

## User Review Required

> [!IMPORTANT]
> **Anti-Spam Strategy:**
> - Users will be restricted to **at most one active PENDING top-up transaction** at any given time.
> - If they try to create a new top-up when an active one exists:
>   - The API will reject it and return the active transaction.
>   - The Dashboard will display the existing active invoice (QRIS/VA) immediately on load.
> - Clicking **"Batal / Kembali"** on the dashboard will now make an API call to **cancel the transaction in the database** (setting status to `'EXPIRED'`), allowing the user to create a new invoice.
> - A default expiration of **2 hours** will be enforced for manual QRIS transactions (Winpay has its own 25-minute timeout). If an active transaction has passed its expiration window, it is automatically marked `'EXPIRED'` and a new invoice can be created.

---

## Proposed Changes

### Database Layer

#### [NEW] [20260706080000_create_payment_methods.sql](file:///home/bms-del112/BMS/personal-project/wuzzkang/wuzzkang-api/supabase/migrations/20260706080000_create_payment_methods.sql)
- Creates the `public.payment_methods` table.
- Enables Row Level Security (RLS) and sets up read policies.
- Adds trigger to automatically update `updated_at` column.
- Seeds default payment methods:
  - `qris` (active, image mode pointing to `/qris.png`).
  - `virtual_account` (active, with BCA, Mandiri, BNI, and BRI channels configured).

---

### Backend (wuzzkang-api)

#### [MODIFY] [supabase.service.js](file:///home/bms-del112/BMS/personal-project/wuzzkang/wuzzkang-api/src/services/supabase.service.js)
- Implements `getPaymentMethods()` to query `payment_methods` from the database.

#### [MODIFY] [payment.route.js](file:///home/bms-del112/BMS/personal-project/wuzzkang/wuzzkang-api/src/routes/payment.route.js)
- Adds `GET /api/payment-methods` route to retrieve active payment methods.
- Adds `GET /api/payments/pending` route to check for any active, unexpired pending top-up.
- Adds `POST /api/payments/:id/cancel` route to cancel a pending transaction.

#### [MODIFY] [transaction.service.js](file:///home/bms-del112/BMS/personal-project/wuzzkang/wuzzkang-api/src/services/transaction.service.js)
- Updates `createTransaction`:
  - Before creating, query the database for existing `'PENDING'` transactions of type `'topup'` for this user.
  - If a pending transaction is found:
    - Check if it has expired (created > 2 hours ago for manual QRIS, or > 25 minutes ago for Winpay VAs).
    - If expired, update its status to `'EXPIRED'` and proceed to create the new transaction.
    - If NOT expired, throw an error: `"Anda memiliki transaksi pending yang belum diselesaikan."` and return the transaction details.
  - Generates pre-filled WhatsApp link with Order ID and Amount for manual QRIS mode.
- Implements `getPendingTransaction(userId)` helper to fetch any active, unexpired pending top-up.
- Implements `cancelTransaction(transactionId, userId)` to mark a pending transaction as `'EXPIRED'`.

#### [MODIFY] [dummy.provider.js](file:///home/bms-del112/BMS/personal-project/wuzzkang/wuzzkang-api/src/services/payments/dummy.provider.js)
- Adds support for generating QRIS checkout mock URLs or mock QR images if the channel is `'QRIS'` in gateway mode.

---

### Dashboard (wuzzkang-dashboard)

#### [MODIFY] [page.js](file:///home/bms-del112/BMS/personal-project/wuzzkang/wuzzkang-dashboard/src/app/topup/page.js)
- On page load (`useEffect`), fetches `GET /api/payments/pending` to check for active payments.
  - If found, sets `activeTransaction` directly, bypassing the top-up form.
- Dynamically fetches active payment methods from the `/api/payment-methods` endpoint.
- Updates the payment confirmation view:
  - If the active transaction has channel `'QRIS'`, display the QR code image instead of the Virtual Account bank number.
  - Display the "Verifikasi Pembayaran via WhatsApp" button linking to `confirm_payment_url` if in Image Mode.
  - Support simulating payment success for QRIS via the existing webhook simulator.
  - Clicking **"Batal / Kembali"** now triggers a `POST /api/payments/:id/cancel` API call to properly cancel the transaction in the database and resets `activeTransaction` to `null`.

#### [NEW] [qris.png](file:///home/bms-del112/BMS/personal-project/wuzzkang/wuzzkang-dashboard/public/qris.png)
- Default mock QRIS image placeholder for local demonstration.

---

## Verification Plan

### Automated Tests
We will run and verify that all current tests continue to pass:
- `npm run test` or running existing integration scripts.

### Manual Verification
1. Verify that `payment_methods` table is created and seeded successfully.
2. Verify API routes (`GET /api/payment-methods`, `GET /api/payments/pending`, `POST /api/payments/:id/cancel`).
3. Open `/topup` page on the dashboard and verify:
   - Dynamic payment options are fetched and rendered.
   - Initiating a top-up creates a pending transaction.
   - Reloading or closing/reopening `/topup` immediately displays the active invoice (no double billing).
   - Clicking **"Batal / Kembali"** successfully cancels the transaction in the database (verify transaction status becomes `'EXPIRED'`) and lets you create a new top-up.
   - Simulator payment still successfully updates status to `'PAID'` and credits the wallet.
