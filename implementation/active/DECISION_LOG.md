# Decision Log - V2 Generator & Editor UI/UX Upgrade

### DEC-001: Hybrid Approach for V2 Goal Onboarding & Starter Kits
* **Date:** 2026-07-22
* **Decision:** Hybrid Approach (Local deterministic starter kits via `v2Presets.js` + optional field-level AI assist).
* **Impact:** Created `v2Presets.js` and initialized onboarding modal wizard in `page.js`.

---

### DEC-002: Domain-Specific Starter Kits & Editor Title Labels
* **Date:** 2026-07-22
* **Decision:** Enriched `v2Presets.js` with 8 domain starter kits and rendered real section headlines/icons in the editor list (`getSectionDisplayTitle` & `getSectionTypeIcon`).
* **Impact:** Updated `v2Presets.js` and `page.js`.

---

### DEC-003: Empty Default Initialization & Auto Onboarding Trigger
* **Date:** 2026-07-22
* **Decision:** Initialize `v2Sections` as `[]`, auto-trigger `isV2OnboardingOpen` modal wizard, and render an empty state card if closed.
* **Impact:** Updated `page.js`. New V2 projects start 100% clean.

---

### DEC-004: Global Theme Switcher Fix & Per-Section Style Picker Streamlining
* **Date:** 2026-07-22
* **Decision:**
  1. Fix `handleApplyGlobalTheme` to set `content.bg_style = themeKey` without modifying component `variant` filenames. Added full theme palette classes in `sectionStyle.js`.
  2. Streamline `renderSectionStylePicker(section)` to focus purely on **Variasi Shading** (`solid`, `soft`, `gradient`, `pattern`) and **Mode Kontras / Brightness** (`default`, `light`, `dark`).
* **Impact:** Fixed dynamic import build errors and simplified section styling controls.

---

### DEC-005: Real-Time Live Preview Sync for New V2 Projects (Kondisi Baru)
* **Date:** 2026-07-22
* **Decision:** Update auto-sync condition to `const isV2Mode = templateType === 'dynamic-builder'; if (!isV2Mode && (!editMode || !projectId)) return;` and include `v2GlobalTheme`, `v2BrandName`, `v2BrandBrief`, `v2Sections` in the dependency array.
* **Impact:** New V2 projects now update the Live Sandbox Preview in real-time instantly on every section change.

---

### DEC-006: Transisi Batas Section (Soft Dividers & Blend Transitions)
* **Date:** 2026-07-22
* **Context:** When two adjacent sections have contrasting background modes (e.g. Dark Hero followed by Light Custom Cards), a sharp horizontal edge border appears between them.
* **Decision:**
  1. Added **Transisi Batas Section (Soft Divider)** controls in `renderSectionStylePicker(section)` with 6 options:
     - `none` (Datar Lurus)
     - `gradient` (Gradasi Soft Fade)
     - `wave` (Gelombang Wave SVG)
     - `curve` (Lengkungan Curve SVG)
     - `slant` (Potongan Miring Slant SVG)
     - `glow` (Glow Ambient Blend)
  2. Updated `getSectionStyle` in `sectionStyle.js` to return dynamic `dividerHtml` based on target fill colors and section contrast.
* **Impact:** Eliminates harsh color boundary cuts and provides organic, modern section transitions.
