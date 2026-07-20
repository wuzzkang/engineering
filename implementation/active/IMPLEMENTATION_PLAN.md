# Technical Implementation Plan: V2 Modular Section Builder

This plan guides the Wuzzkang monorepo transition to the **V2 (Modular Section Builder)** architecture using **Strategy 1 (Dual-Editor Mode)**. This ensures that legacy projects continue to use their respective forms, while V2 projects utilize the new side-by-side split layout and dynamic section manager.

---

## User Review Required

> [!IMPORTANT]
> - **Dual-Editor Coexistence**: Legacy templates (e.g. `jasa`, `wedding`) remain monolithic. The new V2 mode utilizes `template_type: 'dynamic-builder'`.
> - **Responsive Desktop Split-Layout**: Left column is dedicated to the input form editor (scrollable independently with sticky save buttons). Right column is dedicated to the live preview iframe sandbox.
> - **Real-time Synchronization**: Input modifications, visibility toggles, section reordering (▲▼), and global theme modifications are synced instantly via `postMessage`.
> - **AI Copywriting Assist**: Adds `✨ AI Generate` buttons next to individual V2 inputs, querying the Express API copywriting queue with the global Brief AI (`jasaBrandDesc`) as context.

---

## Open Questions

> [!NOTE]
> - Are there any drag-and-drop npm packages desired for dashboard panel ordering, or is native arrow-based reordering (▲▼) preferred to keep dependencies minimal? *(We recommend arrow buttons for maximum lightweight performance).*

---

## Proposed Changes

The implementation is structured into 4 milestones:

### Milestone 1: Backend API Schema Setup

#### [MODIFY] [schema.js](file:///home/bms-del112/BMS/personal-project/wuzzkang/wuzzkang-api/src/utils/schema.js)
*   Add `DynamicBuilderPageSchema` Zod validation structure:
    *   `meta`: Title and theme settings (`primary_color`, `accent_color`, `font_family`, `border_radius`).
    *   `sections`: Array of sections containing `id`, `type`, `component_key`, `visible` (boolean), and type-specific `data` object.
*   Register it inside the master `PageSchema` union export.

#### [MODIFY] [supabase.service.js](file:///home/bms-del112/BMS/personal-project/wuzzkang/wuzzkang-api/src/services/supabase.service.js)
*   Include `dynamic-builder` in draft and active projects queries.

---

### Milestone 2: Landing Page Engine & Templates

#### [MODIFY] [script.js](file:///home/bms-del112/BMS/personal-project/wuzzkang/wuzzkang-lp/script.js)
*   Implement `dynamic-builder` routing path block.
*   Bind CSS variables (`--primary-color`, `--accent-color`, `--border-radius`) dynamically.
*   Inject the requested Google Font family.
*   Sequentially import modular section modules (`await import()`) from `./templates/components/sections/{type}/{component_key}.js` and compile.

#### [NEW] Modular Templates
Deconstruct the monolithic `professional-navy.js` template into isolated components inside `wuzzkang-lp/templates/components/sections/`:
*   `[NEW] wuzzkang-lp/templates/components/sections/hero/hero-split-navy.js`
*   `[NEW] wuzzkang-lp/templates/components/sections/about/about-simple-navy.js`
*   `[NEW] wuzzkang-lp/templates/components/sections/services/services-grid-navy.js`
*   `[NEW] wuzzkang-lp/templates/components/sections/pricing/pricing-grid-navy.js`
*   `[NEW] wuzzkang-lp/templates/components/sections/faq/faq-accordion-navy.js`
*   `[NEW] wuzzkang-lp/templates/components/sections/contact/contact-footer-navy.js`

---

### Milestone 3: Dashboard Layout Refactoring

#### [MODIFY] [page.js](file:///home/bms-del112/BMS/personal-project/wuzzkang/wuzzkang-dashboard/src/app/generate/page.js)
*   Refactor layout to use a full-width 12-column responsive split grid (`lg:grid lg:grid-cols-12`).
*   Put the edit panel inside `lg:col-span-4` and set wrapper limits (`max-h-[calc(100vh-340px)] overflow-y-auto`).
*   Put preview sandbox frame inside `lg:col-span-8` at the top of the right column, rendering a dashed card placeholder when `!pageData`.
*   Hide mobile-specific action bars on desktop screens using `md:hidden` / `md:flex`.
*   Insert sticky submit actions at the bottom of the left editor panel.

---

### Milestone 4: V2 State Management & Iframe Sync

#### [MODIFY] [page.js](file:///home/bms-del112/BMS/personal-project/wuzzkang/wuzzkang-dashboard/src/app/generate/page.js)
*   Declare state hooks for `sections`, `globalTheme`, and `previewDevice`.
*   Map default layout sections with correct file references (`hero-split-navy`, `about-simple-navy`, etc.).
*   Add a dedicated **Detail Bisnis & Acuan AI (Brief)** panel for `jasaBrandName` and `jasaBrandDesc`.
*   Add a dropdown selection input `+ Tambah Section` to insert V2 components dynamically.
*   Inject `✨ AI Generate` buttons next to inputs, connecting to `handleAISectionAssist` copywriting status checker.
*   Hook up `dynamic-builder` template compilation in `handleGenerate()` and `useEffect()` auto-update loop.
*   Add Desktop viewport toggles (Mobile vs Desktop) and a desktop-only publish button.

#### [MODIFY] [index.html](file:///home/bms-del112/BMS/personal-project/wuzzkang/wuzzkang-dashboard/public/preview/index.html)
*   Map `templateType === 'dynamic-builder'` in the postMessage handler, receiving page data and loading dynamic modules.

---

## Verification Plan

### Automated Tests
*   `npm run build` inside `wuzzkang-dashboard` to verify compilation.
*   `npm test` inside `wuzzkang-api` to ensure no service tests are broken.

### Manual Verification
1.  Navigate to `/generate`.
2.  Choose **Modular Section Builder (V2)** and verify layout split.
3.  Add/remove sections, customize colors, and verify real-time iframe synchronization.
4.  Input Brand name and Brief AI, click `✨ AI Generate` on a section, and verify copywriting output.
5.  Check display rendering toggles (Mobile and Desktop widths).
6.  Save draft, publish page, and verify the backend database schema insertion.
