# Handover Verification Report

Dynamic paid landing page edit mechanics are successfully implemented across the backend API and Dashboard frontend.

## Verification Proofs

### Automated Backend Tests
Unit tests were executed using Jest in Node 20 and successfully passed:

```bash
bash -c "source ~/.nvm/nvm.sh && nvm use v20.19.2 && npm run test:unit"
```

Output:
```text
PASS tests/unit/project.service.test.js
PASS tests/unit/wallet.service.test.js
PASS tests/unit/coupon.service.test.js

Test Suites: 3 passed, 3 total
Tests:       23 passed, 23 total
Snapshots:   0 total
Time:        2.059 s
Ran all test suites matching tests/unit.
```

### Manual Verification Path
1. **Migration Verification:** Run database seed migration `20260715083500_add_project_edit_settings.sql` to populate configurations:
   - `max_project_edits`: `3`
   - `project_edit_cost`: `1`
2. **Dashboard UI Verification:**
   - On the dashboard homepage, deployed projects with less than 3 edits will show `Edit (X/3)` where X is remaining free edits.
   - Deployed projects with 3 or more edits will show `Edit (1 Credit)`.
   - On the generate page, saving edits when under limit works without balance checks.
   - Saving edits when exceeding limit checks wallet balance, updates the save button label to `Simpan Perubahan (1 Credit)`, and deducts 1 credit atomically on success.
   - If user balance is insufficient, the button is disabled or a validation tooltip prevents click.
