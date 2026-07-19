# Implementation Plan: Shared Reusable Pricing Component

## Goal
Extract Jasa's pricing plans grid layout and styling, and refactor it into a shared reusable landing page component: `wuzzkang-lp/templates/components/Pricing.js`. Make price fields completely optional (to support non-priced card views) and allow custom CTA button labels (e.g. "Daftar Sekarang").

## Proposed Changes

### Shared Landing Page Components
#### [NEW] [Pricing.js](file:///home/bms-del112/BMS/personal-project/wuzzkang/wuzzkang-lp/templates/components/Pricing.js)
- Create a new component `initPricing(containerEl, plans, options)`:
  - Supports themes: `'professional-navy'` (custom Jasa styling classes) and `'clean-trust'` (Tailwind grid styling).
  - Automatically handles optional prices (hides the price div if blank).
  - Renders custom CTA text per plan card using `plan.cta_text || 'Pesan Paket Ini'`.

### Backend API
#### [MODIFY] [schema.js](file:///home/bms-del112/BMS/personal-project/wuzzkang/wuzzkang-api/src/utils/schema.js)
- Update `JasaPageSchema.content.pricing.plans` schema:
  - Make `original_price` and `sale_price` optional (`z.string().max(50).optional().nullable()`).
  - Add optional `cta_text` field (`z.string().max(100).optional().nullable()`).

### Jasa Landing Page Template
#### [MODIFY] [professional-navy.js](file:///home/bms-del112/BMS/personal-project/wuzzkang/wuzzkang-lp/templates/jasa/professional-navy.js)
- Remove custom `plansHtml` generation block.
- Replace container markup in Jasa HTML with `<div id="jasa-pricing-root"></div>`.
- Import and initialize the shared component:
  ```javascript
  const pricingRoot = document.getElementById('jasa-pricing-root');
  if (pricingRoot && Array.isArray(pricing.plans) && pricing.plans.length > 0) {
      const { initPricing } = await import('../components/Pricing.js');
      await initPricing(pricingRoot, pricing.plans, {
          theme: 'professional-navy',
          ctaHref: ctaHref
      });
  }
  ```

#### [MODIFY] [script.js](file:///home/bms-del112/BMS/personal-project/wuzzkang/wuzzkang-lp/script.js)
- Bump `LP_VERSION` to `1.2.5` to refresh cache.

### Frontend Dashboard
#### [MODIFY] [index.html](file:///home/bms-del112/BMS/personal-project/wuzzkang/wuzzkang-dashboard/public/preview/index.html)
- Bump `PREVIEW_VERSION` to `1.2.5` to align cache version.

#### [MODIFY] [page.js](file:///home/bms-del112/BMS/personal-project/wuzzkang/wuzzkang-dashboard/src/app/generate/page.js)
- Update initial state of `jasaPricingPlans` to support `cta_text: ''`.
- Modify plan filtering on page save/preview payload assembly:
  - Remove mandatory price check: `jasaPricingPlans.filter(p => p.name)` (only check if name is present).
  - Include `cta_text: p.cta_text || ''` in the payload.
- Update the pricing plans editing JSX:
  - Add a text input field for "Teks Tombol Aksi (e.g. Daftar Sekarang)".
  - When "+ Tambah Paket" button is clicked, append `{ name: '', badge: '', original_price: '', sale_price: '', cta_text: '', features: [], highlighted: false }`.

---

## Verification Plan

### Manual Verification
1. Open Jasa template editor.
2. In the pricing section:
   - Edit the price fields to be completely empty for a plan.
   - Edit the "Teks Tombol Aksi" field to say "Daftar Sekarang".
3. Save or preview the landing page.
4. Verify that:
   - The price row is completely hidden.
   - The button shows "Daftar Sekarang".
   - Normal plans with prices still display their prices and default "Pesan Paket Ini" label correctly.
