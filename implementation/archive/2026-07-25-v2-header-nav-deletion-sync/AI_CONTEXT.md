# AI Context — Automatic Header Navigation Sync on Section Deletion

---

## 🎯 Target Repositories & Components
- **`wuzzkang-dashboard`**:
  - `/src/app/generate/v2/page.js`: Updated `handleRemoveSection` to auto-prune deleted section types from header/footer `selected_nav_items`.
  - `/public/preview/templates/components/sections/header/header-navbar-navy.js`: Added runtime `existingSectionTypes` filter check against `pageConfig.content.sections`.
- **`wuzzkang-lp`**:
  - `/templates/components/sections/header/header-navbar-navy.js`: Synced runtime `existingSectionTypes` filter check identically.

---

## 🛠️ Validation & Invariants
- Dual Directory Sync maintained between `wuzzkang-lp/` and `wuzzkang-dashboard/public/preview/`.
- Deleting a section automatically removes its link from the header top navigation bar without leaving dead links.
