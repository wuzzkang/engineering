# Decision Log — Hero Secondary CTA Hardcoded Fallback Cleanup

---

### DEC-006: Elimination of Hardcoded Fallback String for Secondary Hero CTA
* **Date:** 2026-07-25T23:37:00+07:00
* **Context:** The secondary hero CTA button rendered automatically with text "Pelajari Lebih Lanjut" even when not requested, due to a hardcoded fallback string inside component render function.
* **Decision:** Replace hardcoded string fallback with empty string default (`data.cta_secondary_text || ''`), requiring explicit user entry to render secondary button.
* **Impact:** `hero-split-navy.js` (both `lp` and `preview`).
