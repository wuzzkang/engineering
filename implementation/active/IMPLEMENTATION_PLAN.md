# Implementation Plan - Wuzzkang V2 Generator & Editor UI/UX Upgrade

Transform the V2 `dynamic-builder` generator and editor UI/UX in `wuzzkang-dashboard` to eliminate cold-start friction using **Goal-Based Smart Starter Kits (Hybrid Approach)**, **Visual Section Catalog Picker**, and **Interactive Preview Sync**, while preserving 100% modular flexibility across all section types.

## Status: Approved for Implementation

## Architecture & Design Overview
1. **Hybrid Onboarding Wizard (Zero Token Waste)**:
   - When a user opens `/generate?template=dynamic-builder` or starts a new V2 project, an intuitive Onboarding Wizard pops up asking for their goal (*Jasa & Layanan, Toko Online Katalog, Campaign Single Product, Undangan/Event, Web CV, E-Course, Blank Canvas*).
   - Selecting a goal initializes a deterministic array of V2 section objects via `v2Presets.js` without calling LLMs.
2. **Visual Section Catalog Modal (`V2VisualSectionPickerModal.jsx`)**:
   - Replaces the plain HTML `<select>` dropdown (`+ Tambah Section Baru`).
   - Renders visual cards with icons and descriptions for each available V2 section type.
3. **Global Theme Switcher & Section Styling**:
   - Offers a top-level color palette switcher (*Midnight Navy, Emerald Growth, Royal Purple, Amber Sunset, Rose Bloom, Clean Slate*) applying cohesive styling across all sections at once using `getSectionStyle`.
4. **Interactive Focus Sync**:
   - Auto-scrolls and highlights corresponding sections in the live iframe preview when clicked in the form editor.

## Proposed File Changes

### `wuzzkang-dashboard`
- **[NEW]** `src/app/generate/v2Presets.js`: Starter kit configurations for all supported goals.
- **[NEW]** `src/components/V2VisualSectionPickerModal.jsx`: Visual section picker modal component.
- **[MODIFY]** `src/app/generate/page.js`: Onboarding wizard, preset loader, global theme switcher, visual picker integration, and focus sync.

## Verification Plan
1. Test new V2 project creation flow with various starter kits.
2. Test adding sections cross-domain via Visual Picker Modal.
3. Test Global Palette Switcher.
4. Run `npm run build` in `wuzzkang-dashboard` to verify zero syntax errors or build failures.
