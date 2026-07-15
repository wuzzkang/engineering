# Dynamic Paid Landing Page Edits

Introduce a dynamic paid edit mechanism for deployed landing pages. Once the free edit quota is exhausted, users are charged a configurable credit amount (defaulting to 1 credit) from their wallet balance for each subsequent edit.

## User Review Required

- The default free edit quota will remain at 3 edits, and subsequent edits will cost 1 credit per save. These values are dynamic and can be configured in the database `system_settings` table using the keys `max_project_edits` and `project_edit_cost`.

## Proposed Changes

### Database Migration

#### [NEW] [20260715083500_add_project_edit_settings.sql](file:///home/bms-del112/BMS/personal-project/wuzzkang/wuzzkang-api/supabase/migrations/20260715083500_add_project_edit_settings.sql)
- Seed `max_project_edits` (value `3`) and `project_edit_cost` (value `1`) into the `system_settings` table.

---

### wuzzkang-api (Backend)

#### [MODIFY] [project.service.js](file:///home/bms-del112/BMS/personal-project/wuzzkang/wuzzkang-api/src/services/project.service.js)
- Modify `editDeployedProject` logic:
  - If `currentEdits < maxEdits`, save changes directly (free edits).
  - If `currentEdits >= maxEdits`, apply paid edit logic:
    - Get user profile balance.
    - If balance is insufficient for `project_edit_cost`, throw an error.
    - Deduct `project_edit_cost` credits using `walletService.deductBalance` (creates a `PENDING` transaction of type `'edit'`).
    - Attempt to update the project in the database.
    - If successful, mark the transaction as `PAID`.
    - If failed, issue a refund transaction.

#### [MODIFY] [profile.route.js](file:///home/bms-del112/BMS/personal-project/wuzzkang/wuzzkang-api/src/routes/profile.route.js)
- Return `project_edit_cost` (fetched dynamically from settings) inside the `systemSettings` response block in `GET /api/profile`.

---

### wuzzkang-dashboard (Frontend)

#### [MODIFY] [page.js (Dashboard Home)](file:///home/bms-del112/BMS/personal-project/wuzzkang/wuzzkang-dashboard/src/app/page.js)
- Add state `projectEditCost` defaulting to `1`.
- Fetch `project_edit_cost` in the profile `useEffect` hook.
- Modify the Edit button layout so that it is never disabled when `edit_count >= maxProjectEdits`.
- When `edit_count >= maxProjectEdits`, display `Edit (X Credit)` where X is the dynamic cost. Show a tooltip/title explaining that the free quota is exhausted.

#### [MODIFY] [page.js (Generate / Edit Page)](file:///home/bms-del112/BMS/personal-project/wuzzkang/wuzzkang-dashboard/src/app/generate/page.js)
- Add state `projectEditCost` defaulting to `1`.
- Fetch `project_edit_cost` in the profile `useEffect` hook.
- Update the remaining quota description:
  - If under quota, show `Kuota edit gratis tersisa: X dari Y kali`.
  - If over quota, show `Kuota edit gratis telah habis. Edit selanjutnya dikenakan biaya X credit per simpan.`
- Update the "Simpan Perubahan" button:
  - Do not disable it when edits exceed the free quota.
  - Disable it only if the user has insufficient balance for the paid edit.
  - Update the button label to display `Simpan Perubahan (X Credit)` when edits exceed the free quota.

---

### Unit Tests

#### [MODIFY] [project.service.test.js](file:///home/bms-del112/BMS/personal-project/wuzzkang/wuzzkang-api/tests/unit/project.service.test.js)
- Update existing tests for `editDeployedProject` to reflect the new dynamic paid edit mechanics.
- Add test coverage for paid edit flow, balance deduction, insufficient balance handling, and rollback/refund handling.

## Verification Plan

### Automated Tests
- Run unit tests to verify backend changes:
  `npm run test:unit`

### Manual Verification
- Test creating a project and publishing it.
- Edit it within the free edit limit (e.g. 3 times) and verify no balance is deducted.
- Edit it for the 4th time and verify:
  - A deduction transaction is created and balance is reduced.
  - Success message is shown and project is saved.
- Edit it with insufficient balance and verify that the dashboard blocks submission or shows an appropriate error message.
