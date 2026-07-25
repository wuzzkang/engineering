# Implementation Plan — Multi-Version Route Isolation & Refactoring

## Overview
Currently, `wuzzkang-dashboard/src/app/generate/page.js` is a monolithic file of 9,841 lines containing all V1 legacy forms (Wedding, Birthday, Toko Online, Campaign, CV, E-Course, Jasa) and the V2 Modular Section Builder. 

This implementation plan refactors the dashboard generator by isolating V1 and V2 into separate App Router routes (`/generate/v1` and `/generate/v2`), replacing `generate/page.js` with an Auto-Redirect Router based on `template_version`. This achieves clean code-splitting, zero interference between versions, and sets up a scalable pattern for future V3+ versions.

---

## User Review Required

> [!IMPORTANT]
> **Zero Breaking Changes Guarantee**:
> - All published live sites and existing drafts for both V1 and V2 remain 100% functional.
> - The root route `/generate` will automatically inspect the `draftId` and `template_version` from Supabase/URL and seamlessly redirect users to `/generate/v1` (for V1 projects) or `/generate/v2` (for V2 projects/new creations).

---

## Proposed Changes

### Component 1: Next.js App Router Isolation (`wuzzkang-dashboard`)

#### [NEW] [v1/page.js](file:///home/bms-del112/BMS/personal-project/wuzzkang/wuzzkang-dashboard/src/app/generate/v1/page.js)
- Contains the V1 Legacy Editor Form supporting legacy `wedding`, `birthday`, `toko-online`, `campaign`, `cv`, `e-course`, and `jasa` form inputs.
- Handles edit mode loading for `template_version: 1` projects.

#### [NEW] [v2/page.js](file:///home/bms-del112/BMS/personal-project/wuzzkang/wuzzkang-dashboard/src/app/generate/v2/page.js)
- Contains the clean V2 Modular Section Builder (`template_type: dynamic-builder`).
- Handles new project creation (defaulting to V2) and editing for `template_version: 2` projects.
- Integrates `<V2SectionFormDispatcher />`, `v2Presets.js`, `V2VisualSectionPickerModal.jsx`, and global theme switcher.

#### [MODIFY] [page.js](file:///home/bms-del112/BMS/personal-project/wuzzkang/wuzzkang-dashboard/src/app/generate/page.js)
- Refactored into a lightweight Auto-Redirect Router (~80 lines).
- Reads `draftId` and query params; fetches project `template_version` from Supabase.
- Redirects to `/generate/v1` if `template_version === 1`.
- Redirects to `/generate/v2` if `template_version === 2` or when creating a brand new project.

---

## Milestones & Execution Checklist

### Milestone 1: Setup V1 Legacy Route & V2 Route Structure
- [ ] Create `wuzzkang-dashboard/src/app/generate/v1/page.js` (Isolate V1 form editor).
- [ ] Create `wuzzkang-dashboard/src/app/generate/v2/page.js` (Isolate V2 modular section builder editor).
- [ ] Verify build compilation (`npm run build`).

### Milestone 2: Implement Auto-Redirect Router at `/generate/page.js`
- [ ] Refactor `wuzzkang-dashboard/src/app/generate/page.js` into version redirect router.
- [ ] Test redirection logic for V1 edit mode (`/generate?id=xxx&editMode=true` $\rightarrow$ `/generate/v1`).
- [ ] Test redirection logic for V2 edit mode & new project creation ($\rightarrow$ `/generate/v2`).

### Milestone 3: Verification, Performance & Safety Testing
- [ ] Run Next.js production build (`npm run build`).
- [ ] Perform Performance (memory/rendering speed), Security (no exposed keys), and Scalability evaluation.
- [ ] Clean up any test/debug server processes.

### Milestone 4: Documentation Synchronization & DoD Audit
- [ ] Synchronize `wuzzkang-engineering/docs/08_REPOSITORY_MAP.md` and `02_CURRENT_STATE.md`.
- [ ] Update `DECISION_LOG.md` and compile `HANDOVER.md`.
- [ ] Archive active implementation to `implementation/archive/`.

---

## Verification Plan

### Automated Tests
- Production Next.js build: `npm --prefix wuzzkang-dashboard run build` (Ensures zero compilation errors, broken imports, or missing dependencies).

### Manual Verification
- Test V1 Edit Mode navigation.
- Test V2 New Project Creation & V2 Edit Mode navigation.
- Verify Live Preview iframe rendering in both routes.
