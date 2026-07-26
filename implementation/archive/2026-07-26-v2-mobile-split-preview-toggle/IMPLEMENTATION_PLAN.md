# Implementation Plan — V2 Editor Mobile Split View & Preview Toggle

## Status
Approved for Implementation

## Target Goals
1. Change initial `mobileSplitRatio` state default from `50` to `85` in `page.js`.
2. Enhance the live sandbox preview header bar in mobile split mode to feature an explicit, clickable "Preview" button/icon with dual-state toggle functionality:
   - When ratio is 85%, clicking "Preview" sets ratio to 15% (Expanded Preview - Image 3).
   - When ratio is 15%, clicking "Preview" or "Form" toggles ratio back to 85% (Form Focused - Image 2).
   - Make the entire `LIVE SANDBOX PREVIEW V2` bar clickable to toggle between 85% and 15% ratios smoothly.
3. Ensure touch drag behavior (`handleTouchMoveMobile`) still works for fine-tuning ratio.
4. Verify responsive layout on mobile (<1024px) and desktop (>=1024px).

## Proposed Changes

### `wuzzkang-dashboard`

#### [MODIFY] [page.js](file:///home/bms-del112/BMS/personal-project/wuzzkang/wuzzkang-dashboard/src/app/generate/v2/page.js)
- Update `useState(50)` for `mobileSplitRatio` to `useState(85)`.
- Update `LIVE SANDBOX PREVIEW V2` header bar in preview column:
  - Add an interactive badge/button `👁️ Preview` / `Full Preview` with icon & hover/active states.
  - Implement toggle function `toggleMobilePreviewRatio()` that switches `mobileSplitRatio` between 85 and 15.
  - Add visual ratio indicator and toggle button in `LIVE SANDBOX PREVIEW V2` header bar.

## Verification Plan

### Automated Tests / Lint
- Run build/test check in `wuzzkang-dashboard` to verify zero syntax errors.

### Manual Verification
- Check preview in browser on mobile screen width (<1024px).
- Verify default layout shows form sections (85%) and preview bar (15%) as in Image 2.
- Click "Preview" button/bar and verify layout transitions to expanded preview (15% form / 85% preview) as in Image 3.
- Click "Preview" again and verify it returns to 85% / 15%.
