# Implementation Plan: Fix Optional Jasa Button Fallback Overwrites

## Goal
Fix the bug where optional buttons in the Jasa template (specifically the Portfolio button in the About section and the Secondary CTA button in the Hero section) are automatically filled with default values (`'Lihat Portofolio'` and `'Lihat Layanan'`) when reloading the editor, even after the user explicitly cleared and saved them as empty.

## Proposed Changes

### Frontend Dashboard
#### [MODIFY] [page.js](file:///home/bms-del112/BMS/personal-project/wuzzkang/wuzzkang-dashboard/src/app/generate/page.js)
- Update `cta_secondary_text` loader block in Jasa section:
  - Check if `content.hero.cta_secondary_text` is `undefined`.
  - If `undefined` (new project), default to `'Lihat Layanan'`.
  - If it exists but is `null` or empty string (user explicitly cleared it), preserve it as `''`.
  ```javascript
  setJasaHeroCtaSecondaryText(content.hero?.cta_secondary_text === undefined ? 'Lihat Layanan' : (content.hero?.cta_secondary_text || ''));
  ```
- Update `cta_portfolio_text` loader block in Jasa section:
  - Check if `ab.cta_portfolio_text` is `undefined`.
  - If `undefined` (new project), default to `'Lihat Portofolio'`.
  - If it exists but is `null` or empty string, preserve it as `''`.
  ```javascript
  setJasaAboutCtaPortfolioText(ab.cta_portfolio_text === undefined ? 'Lihat Portofolio' : (ab.cta_portfolio_text || ''));
  ```

---

## Verification Plan

### Manual Verification
1. Open a Jasa template in edit mode.
2. In the Hero section:
   - Clear the **Teks Tombol Sekunder** field (leave it completely empty).
3. In the About section:
   - Clear the **Teks Tombol Portofolio** field (leave it completely empty).
4. Save the page.
5. Reload the editor page.
6. Verify that:
   - Both input fields remain completely empty `""` and do not auto-fill back to `'Lihat Layanan'` or `'Lihat Portofolio'`.
   - On the live landing page preview, both buttons are correctly hidden.
