# AI Context — Active Session

- **Task**: Migrasi V2 Produksi → V2 First Principles (Full Takeover)
- **Session Started**: 2026-08-01
- **Target Repositories**:
  - `wuzzkang-dashboard` — routing, editor pages, komponen
  - `wuzzkang-sections` — preview-app, section renderers
  - `wuzzkang-api` — (tidak ada perubahan, endpoint sudah ada)
- **Target Files**:
  - `wuzzkang-dashboard/src/app/generate/page.js` (Auto-Redirect Router)
  - `wuzzkang-dashboard/src/app/generate/v2/page.js` (Halaman inisiasi proyek baru)
  - `wuzzkang-dashboard/src/app/generate/v2/[projectId]/page.jsx` (Editor utama)
  - `wuzzkang-dashboard/src/components/v2/` (komponen editor)
  - `wuzzkang-sections/apps/preview-app/src/main.jsx` (Preview Bridge)
- **Key Decision**: Proyek V2 produksi lama (dynamic-builder/sections[]) yang sudah published = read-only / tidak bisa diedit. Tidak ada backward compat edit.
- **Architecture**: First Principles (AST nodes[], PageDocument schema, postMessage Bridge, preview-app di :3333)
- **Constraint**: Preview-app harus bisa diakses dari dashboard (saat ini hardcoded localhost:3333 — perlu solusi embedding)
