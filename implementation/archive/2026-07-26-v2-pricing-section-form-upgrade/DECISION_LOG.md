# Decision Log — V2 Pricing Section Form Upgrade & Mode Selector

---

### DEC-010: Comprehensive Pricing Form Upgrade with Dual Mode & Plans Manager
* **Date:** 2026-07-26T00:09:00+07:00
* **Context:** The V2 Pricing form previously only displayed a title input, lacking controls for prices, features, billing periods, popular badges, and CTA buttons.
* **Decision:** Rebuild `V2SectionPricingForm` with a dual-mode toggle (Table/Plans vs CTA Only) and a rich plan cards manager supporting custom price, period, popular badges, newline-delimited features, and per-card CTA button section targeting.
* **Impact:** `V2SectionStandardForms.jsx`, `V2SectionFormDispatcher.jsx`.
