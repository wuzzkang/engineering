# Implementation Plan — V2 Global Theme Palette Card & Mode Kontras Unification

---

## 🎯 Target Goals
1. Add a dedicated **🎨 Tema Warna Landing Page (Global)** card in the Left Column Editor Manager of V2 Builder (`v2/page.js`).
2. Keep color palette selection 1x globally across all landing page sections (`navy`, `emerald`, `amber`, `purple`, `rose`, `slate`).
3. Keep per-section control simplified to Mode Kontras Warna (`bg_brightness`: Default / Terang / Gelap).

---

## 📂 Affected Files
- [MODIFY] `wuzzkang-dashboard/src/app/generate/v2/page.js`
- [MODIFY] `wuzzkang-dashboard/src/components/v2-editor/V2SectionFormDispatcher.jsx`

---

## 🧪 Verification Plan
- Run `source ~/.nvm/nvm.sh && nvm use 24 && npm run build` to confirm zero build regressions.
