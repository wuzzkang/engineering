# Implementation Plan: Dual-Mode Shared Pricing Component

## Goal
Modify the reusable Pricing component and dashboard editor to support two distinct layouts (modes):
1. **Multi-Card Plans (Default)**: Displays pricing cards with badges, prices, features, and individual buttons.
2. **Single CTA Button Only**: Replaces card layouts with a single centered call-to-action button, reducing the configuration fields in the editor to just: Title, Subheading, and Button text.

## Proposed Changes

### Backend API
#### [MODIFY] [schema.js](file:///home/bms-del112/BMS/personal-project/wuzzkang/wuzzkang-api/src/utils/schema.js)
- Update `JasaPageSchema.content.pricing`:
  - Add optional `subtitle` field (`z.string().max(500).optional().nullable()`).
  - Add optional `cta_only` boolean field (`z.boolean().default(false).optional().nullable()`).
  - Add optional `cta_text` field (`z.string().max(100).optional().nullable()`).
  - Update `plans` array: change `.min(1)` requirement to `.optional().nullable()`, allowing save payloads without plans in CTA-only mode.

### Reusable Shared Components
#### [MODIFY] [Pricing.js](file:///home/bms-del112/BMS/personal-project/wuzzkang/wuzzkang-lp/templates/components/Pricing.js)
- Update `initPricing(containerEl, plans, options)`:
  - Read `options.ctaOnly` and `options.ctaText`.
  - If `ctaOnly` is true, render a beautiful centered CTA button aligned with the selected theme (`professional-navy` or default `clean-trust`).
  - Otherwise, render the standard cards layout.

### Landing Page Template
#### [MODIFY] [professional-navy.js](file:///home/bms-del112/BMS/personal-project/wuzzkang/wuzzkang-lp/templates/jasa/professional-navy.js)
- Change Jasa template pricing rendering condition from `plans.length > 0` to checking if `pricing` object exists.
- Bind `pricing.subtitle` dynamically into the subheading element.
- Pass `ctaOnly: !!pricing.cta_only` and `ctaText: pricing.cta_text` into `initPricing` options block.

#### [MODIFY] [script.js](file:///home/bms-del112/BMS/personal-project/wuzzkang/wuzzkang-lp/script.js)
- Bump `LP_VERSION` to `1.2.6` to refresh cache.

### Frontend Dashboard
#### [MODIFY] [index.html](file:///home/bms-del112/BMS/personal-project/wuzzkang/wuzzkang-dashboard/public/preview/index.html)
- Bump `PREVIEW_VERSION` to `1.2.6` to align preview cache.

#### [MODIFY] [page.js](file:///home/bms-del112/BMS/personal-project/wuzzkang/wuzzkang-dashboard/src/app/generate/page.js)
- Add new React states for Jasa pricing customization:
  - `const [jasaPricingSubtitle, setJasaPricingSubtitle] = useState('Harga transparan tanpa biaya tersembunyi');`
  - `const [jasaPricingCtaOnly, setJasaPricingCtaOnly] = useState(false);`
  - `const [jasaPricingCtaText, setJasaPricingCtaText] = useState('Konsultasi Sekarang');`
- Update Edit Mode load logic to map `pricing.subtitle`, `pricing.cta_only`, and `pricing.cta_text` appropriately.
- Update payload assembly (`assembledContent` on save/preview/draft callbacks):
  - Pass `subtitle`, `cta_only`, and `cta_text`.
  - If `cta_only` is true, map `plans` to empty array/null.
- Refactor Jasa Pricing form section JSX:
  - Add a toggle switch/checkbox: **"Hanya Tombol CTA (Tanpa Paket)"**.
  - If checked:
    - Hide plans list form completely.
    - Render input fields for: **Judul Bagian**, **Sub Judul (Subheading)**, and **Teks Tombol Aksi**.
  - If unchecked:
    - Render standard card fields form.

---

## Verification Plan

### Manual Verification
1. Open Jasa template editor.
2. In the pricing section:
   - Check the **"Hanya Tombol CTA (Tanpa Paket)"** box.
   - Verify that all plan cards inputs disappear.
   - Type `"Daftar Sekarang"` in the button text input.
   - Type custom Heading & Subheading.
3. Save/preview.
4. Verify that:
   - The landing page renders a single centered button with label `"Daftar Sekarang"`.
5. Uncheck the box, add plan cards, save/preview, and verify that the layout reverts to card grids correctly.
