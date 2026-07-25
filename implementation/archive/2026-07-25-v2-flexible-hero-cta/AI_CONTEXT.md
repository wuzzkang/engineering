# AI Context — Flexible Hero CTA Buttons & Target Section Selector

---

## 🎯 Target Repositories & Components
- **`wuzzkang-dashboard`**:
  - `/src/components/v2-editor/V2SectionStandardForms.jsx`: Enhanced `V2SectionHeroForm` with primary/secondary CTA text/url inputs and quick section dropdown selector (`🎯 Ke Section...`).
  - `/src/components/v2-editor/V2SectionFormDispatcher.jsx`: Passed `v2Sections` prop to `V2SectionHeroForm`.
  - `/public/preview/templates/components/sections/hero/hero-split-navy.js`: Updated `ctaSecondaryText` fallback check to permit empty string override.
- **`wuzzkang-lp`**:
  - `/templates/components/sections/hero/hero-split-navy.js`: Synced fallback check to permit empty string override for single CTA button configuration.

---

## 🛠️ Validation & Invariants
- Dual Directory Sync maintained between `wuzzkang-lp/` and `wuzzkang-dashboard/public/preview/`.
- CTA target links support internal section hashes (`#contact`, `#pricing`, `#services`, `#faq`, `#about`, `#custom`) as well as external URLs (`https://wa.me/...`).
