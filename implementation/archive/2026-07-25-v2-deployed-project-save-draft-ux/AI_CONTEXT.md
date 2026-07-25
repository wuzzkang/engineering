# AI Context — Deployed Project Save Draft UX & Backend Validation Fix

---

## 🎯 Target Repositories & Components
- **`wuzzkang-api`**:
  - `/src/routes/project.route.js`: Updated `PUT /api/projects/:id/draft` validation message when status is not `'draft'`.
- **`wuzzkang-dashboard`**:
  - `/src/app/generate/v2/page.js`: Added `editMode` check in `handleSaveDraft` to display friendly guidance tip when user clicks "Simpan Draft" on an already published/deployed project.

---

## 🛠️ Validation & Invariants
- Published projects (`status === 'deployed'`) update their live pages using `POST /api/projects/:id/edit-deployed` via the "Publikasikan / Deploy" button.
- Clicking "Simpan Draft" on a published project provides clear user guidance without throwing API errors.
