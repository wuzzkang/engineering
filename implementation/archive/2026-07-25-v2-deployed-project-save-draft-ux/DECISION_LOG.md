# Decision Log — Deployed Project Save Draft UX & Backend Validation Fix

---

### DEC-009: Actionable Guidance for Deployed Project Save Draft Attempts
* **Date:** 2026-07-25T23:58:00+07:00
* **Context:** Clicking "Simpan Draft" on an already published project (`status: 'deployed'`) formerly returned a generic HTTP 400 error.
* **Decision:** Provide instant friendly UI guidance in `v2/page.js` directing users to use the "Publikasikan / Deploy" button (`edit-deployed` route) to update live pages, and clarify backend API error messaging.
* **Impact:** `v2/page.js`, `project.route.js`.
