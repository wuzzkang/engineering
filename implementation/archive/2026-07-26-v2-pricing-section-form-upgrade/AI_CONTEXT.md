# AI Context — V2 Pricing Section Form Upgrade & Mode Selector

---

## 🎯 Target Repositories & Components
- **`wuzzkang-dashboard`**:
  - `/src/components/v2-editor/V2SectionStandardForms.jsx`: Upgraded `V2SectionPricingForm` with dual mode selector (Tabel/Paket Harga vs CTA Tanpa Harga), Title/Subtitle inputs, Plans Cards Manager with price, period, popular badge, line-by-line feature textarea, and quick target section dropdown selector (`🎯 Ke Section...`).
  - `/src/components/v2-editor/V2SectionFormDispatcher.jsx`: Passed `v2Sections` prop to `V2SectionPricingForm`.

---

## 🛠️ Validation & Invariants
- Pricing section supports both `plans` array mode and `cta_only` mode seamlessly.
- Cards manager supports custom plan names, prices, billing periods, popular tags, multi-line feature lists, and per-card CTA button section targeting.
