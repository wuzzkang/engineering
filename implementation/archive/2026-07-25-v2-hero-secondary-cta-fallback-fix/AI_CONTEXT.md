# AI Context — Hero Secondary CTA Hardcoded Fallback Cleanup

---

## 🎯 Target Repositories & Components
- **`wuzzkang-lp`**:
  - `/templates/components/sections/hero/hero-split-navy.js`: Removed hardcoded default `'Pelajari Lebih Lanjut'`, setting default `ctaSecondaryText` to `data.cta_secondary_text || ''`.
- **`wuzzkang-dashboard`**:
  - `/public/preview/templates/components/sections/hero/hero-split-navy.js`: Synced change identically to preview directory.

---

## 🛠️ Validation & Invariants
- Dual Directory Sync maintained between `wuzzkang-lp/` and `wuzzkang-dashboard/public/preview/`.
- Single primary CTA button renders by default unless `cta_secondary_text` is explicitly provided by user.
