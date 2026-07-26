# AI Context — Mobile Horizontal Scroll Fix (< 460px)

## Session Scope
- **Task**: Fix horizontal scroll on mobile screens narrower than 460px on the Dashboard/project list page.
- **Target Files**:
  - `wuzzkang-dashboard/src/app/globals.css` (add `overflow-x: hidden` to `html` and `body`)
  - `wuzzkang-dashboard/src/app/page.js` (fix `min-w-[240px]` search input that forces overflow on < 460px)
  - `wuzzkang-dashboard/src/components/PageLayout.js` (review `max-w-md` behavior)
  - `wuzzkang-dashboard/src/components/Sidebar.js` (review bottom nav max-w-md with px-2)

## Root Cause Analysis
1. `globals.css` body/html lacks `overflow-x: hidden` — any overflowing element shows horizontal scroll.
2. `page.js` line 600: search input has `min-w-[240px]` forcing minimum width even on <460px screens.
3. `page.js` line 563: sticky filter bar uses `-mx-4 px-4` negative margin pulling content to full-viewport width. On screens < 460px (vs max-w-md=448px + p-3 side padding), this can cause subtle overflow.
4. `Sidebar.js` line 270: bottom nav uses `max-w-md mx-auto px-2` which is safe, but the FAB button extends via position absolute which is safe.
5. `PageLayout.js` line 17: uses `w-full` with `max-w-md` but `p-3` side padding on mobile means inner width is `(viewport - 24px)`, which should be fine — however `w-full` with no `overflow-x: hidden` on parent div means any child overflowing causes scroll.

## Fix Plan
1. `globals.css`: Add `overflow-x: hidden` to `html` and `body`.
2. `page.js`: Change `min-w-[240px] sm:w-72` to `w-full sm:w-72` on search input wrapper.
3. `page.js`: Also verify sticky filter bar uses `overflow-x: auto` on filter pill row (already has `overflow-x-auto`), this is fine.
