### DEC-001: Desktop Grid Split Ratio Adjustment for V2 Editor
* **Date**: 2026-07-26
* **Context**: User reported that on desktop/laptop view, the V2 editor panel was slightly too wide while the live preview panel was not wide enough.
* **Options Considered**:
    * *Option A (1/3 Editor & 2/3 Preview)*: Set editor to 4 cols (`lg:col-span-4`) and preview to 8 cols (`lg:col-span-8`). Provides a wider, realistic desktop view for the landing page preview while keeping form controls compact.
    * *Option B (Keep 5:7 ratio)*: Retain current ratio (41.67% editor / 58.33% preview). Preview feels constrained on standard laptops.
* **Decision**: Option A (1/3 and 2/3 ratio).
* **Impact**: `wuzzkang-dashboard/src/app/generate/v2/page.js`

### DEC-002: Unify Live Preview Outer Canvas Background with Global Dashboard Theme
* **Date**: 2026-07-26
* **Context**: User reported that the live preview background container remained pitch dark (`bg-slate-950`) when using `Clean` or `Retro` light/amber dashboard themes.
* **Options Considered**:
    * *Option A (Use CSS theme tokens)*: Replace hardcoded `bg-slate-950` with `bg-theme-bg text-theme-text transition-theme` and `border-theme-border`. The preview outer container now seamlessly reflects the active dashboard theme (`Clean`, `Retro`, `Classic Dark`).
* **Decision**: Option A.
* **Impact**: `wuzzkang-dashboard/src/app/generate/v2/page.js`

### DEC-003: Mobile Split Screen Header-Only Preview Collapse
* **Date**: 2026-07-26
* **Context**: On mobile view, the default 15% preview container height caused a ~40px cut-off slice of the iframe header to peek awkwardly above the mobile bottom navigation bar (as seen in user's Gambar 1).
* **Options Considered**:
    * *Option A (Header-only collapse when mobileSplitRatio > 50)*: Hide the iframe wrapper on mobile when in default split mode (`mobileSplitRatio > 50`), setting container height to `auto` so only the `LIVE SANDBOX PREVIEW V2` header bar is shown flush above the bottom navigation bar (matching Gambar 2). Clicking `👁️ Preview` expands the iframe cleanly into view.
* **Decision**: Option A.
* **Impact**: `wuzzkang-dashboard/src/app/generate/v2/page.js`

### DEC-004: Increase Mobile Bottom Clearance to Prevent FAB Button Overlap
* **Date**: 2026-07-26
* **Context**: On mobile screen view, the central round `+` FAB button on the bottom navbar protrudes 20px above the navbar (`-top-5`), partially covering/overlapping the `👁️ Preview` button on the `LIVE SANDBOX PREVIEW V2` bar when using standard `pb-16` (64px) padding.
* **Options Considered**:
    * *Option A (Increase bottom padding to pb-24 lg:pb-0)*: Setting `pb-24` (96px) on `mainGridRef` lifts the `LIVE SANDBOX PREVIEW V2` header bar to 96px above screen bottom, leaving a clean 12px vertical gap above the top edge of the `+` FAB button (84px).
* **Decision**: Option A.
* **Impact**: `wuzzkang-dashboard/src/app/generate/v2/page.js`
