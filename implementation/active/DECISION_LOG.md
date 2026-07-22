# Decision Log - V2 Generator & Editor UI/UX Upgrade

### DEC-001: Hybrid Approach for V2 Goal Onboarding & Starter Kits
* **Date:** 2026-07-22
* **Decision:** Hybrid Approach (Local deterministic starter kits via `v2Presets.js` + optional field-level AI assist).

---

### DEC-002: Domain-Specific Starter Kits & Editor Title Labels
* **Date:** 2026-07-22
* **Decision:** Enriched `v2Presets.js` with 8 domain starter kits and rendered real section headlines/icons in the editor list (`getSectionDisplayTitle` & `getSectionTypeIcon`).

---

### DEC-003: Empty Default Initialization & Auto Onboarding Trigger
* **Date:** 2026-07-22
* **Decision:** Initialize `v2Sections` as `[]`, auto-trigger `isV2OnboardingOpen` modal wizard, and render an empty state card if closed.

---

### DEC-004: Global Theme Switcher Fix & Per-Section Style Picker Streamlining
* **Date:** 2026-07-22
* **Decision:**
  1. Fix `handleApplyGlobalTheme` to set `content.bg_style = themeKey` without modifying component `variant` filenames. Added full theme palette classes in `sectionStyle.js`.
  2. Streamline `renderSectionStylePicker(section)` to focus purely on **Variasi Shading** (`solid`, `soft`, `gradient`, `pattern`) and **Mode Kontras / Brightness** (`default`, `light`, `dark`).

---

### DEC-005: Real-Time Live Preview Sync for New V2 Projects (Kondisi Baru)
* **Date:** 2026-07-22
* **Decision:** Update auto-sync condition to `const isV2Mode = templateType === 'dynamic-builder'; if (!isV2Mode && (!editMode || !projectId)) return;` and include `v2GlobalTheme`, `v2BrandName`, `v2BrandBrief`, `v2Sections` in dependency array.

---

### DEC-006: Transisi Batas Section (Soft Dividers & Blend Transitions)
* **Date:** 2026-07-22
* **Decision:** Added **Transisi Batas Section (Soft Divider)** controls with 6 options (`none`, `gradient`, `wave`, `curve`, `slant`, `glow`) in `renderSectionStylePicker(section)` and `sectionStyle.js`.

---

### DEC-007: Phase 2 Native Section Expansion (Wedding, Toko Online, E-Course)
* **Date:** 2026-07-22
* **Decision:** Built 7 dedicated native V2 section components (`wedding_couple`, `wedding_events`, `digital_gift`, `product_grid`, `store_guarantee`, `course_curriculum`, `course_mentor`).

---

### DEC-008: ES Module Variant Path Resolution Fix
* **Date:** 2026-07-22
* **Decision:** Update `variant: 'navy'` in `v2Presets.js` and `handleAddSection` in `page.js` for all new native components so path correctly resolves to `[sectionType]-navy.js`.

---

### DEC-009: Form Editor Input Blocks Integration for Domain Components
* **Date:** 2026-07-22
* **Context:** The editor panel was only showing `TAMPILAN SECTION` without input fields when editing cards for `wedding_couple`, `wedding_events`, `digital_gift`, `product_grid`, `store_guarantee`, `course_curriculum`, and `course_mentor`.
* **Decision:** Added rich form editor JSX blocks in `page.js` for all 7 native components:
  - `wedding_couple`: Groom & Bride names, nicknames, parent details, Instagram handles, and bismillah quote textarea.
  - `wedding_events`: Akad & Resepsi dates, times, venue names, addresses, and Google Maps URL fields.
  - `digital_gift`: RSVP WA and Bank Account repeater (Bank name, account number, account holder).
  - `product_grid`: WA order number and product repeater (Name, sale price, original price, description).
  - `store_guarantee`: Store guarantee headline.
  - `course_curriculum`: Course syllabus headline.
  - `course_mentor`: Mentor name, role title, and bio textarea.
* **Impact:** 100% editable input fields in the left editor panel with real-time live preview update.
