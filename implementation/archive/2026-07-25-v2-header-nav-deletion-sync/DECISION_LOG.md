# Decision Log — Automatic Header Navigation Sync on Section Deletion

---

### DEC-008: Dual-Layer Synchronization for Section Deletion in Header Navigation
* **Date:** 2026-07-25T23:51:00+07:00
* **Context:** When a section is removed from V2 Builder, header navigation links must automatically update and remove the deleted section's link.
* **Decision:** Implement dual-layer protection: (1) state auto-pruning in `handleRemoveSection` in `v2/page.js`, and (2) runtime filtering in `header-navbar-navy.js` against active `pageConfig.content.sections`.
* **Impact:** `v2/page.js`, `header-navbar-navy.js` (both `lp` and `preview`).
