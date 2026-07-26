# Implementation Plan — V2 Generate Page Desktop Layout Ratio Adjustment

Adjust the desktop/laptop layout grid of `/generate/v2` page so that the section editor takes 1/3 (4 columns) and the live sandbox preview takes 2/3 (8 columns) of the viewport width.

## User Review Required

> [!NOTE]
> The desktop layout split ratio will be changed from 5:7 (41.67% : 58.33%) to 4:8 / 1:2 (33.33% : 66.67%). This gives maximum screen real estate to the live preview while keeping all editor form controls accessible.

## Open Questions

None.

## Proposed Changes

### Wuzzkang Dashboard

#### [MODIFY] [page.js](file:///home/bms-del112/BMS/personal-project/wuzzkang/wuzzkang-dashboard/src/app/generate/v2/page.js)
- Update left column container class from `lg:col-span-5` to `lg:col-span-4`.
- Update right column container class from `lg:col-span-7` to `lg:col-span-8`.
- Replace hardcoded `bg-slate-950` on root layout container (Line 847) and preview canvas wrapper (Line 1258) with `bg-theme-bg text-theme-text transition-theme` to ensure live preview background respects active global themes (`Clean`, `Retro`, `Classic Dark`).
- Replace `border-slate-800` on iframe device frame with `border-theme-border transition-theme`.
- Hide preview iframe container on mobile view when in default/collapsed split mode (`mobileSplitRatio > 50`) so that only the `LIVE SANDBOX PREVIEW V2` header bar is displayed.
- Increase mobile bottom padding on `mainGridRef` from `pb-16` to `pb-24 lg:pb-0` (96px clearance) to eliminate vertical overlap between the central round `+` FAB button on the mobile bottom navigation bar and the `👁️ Preview` button.

## Verification Plan

### Automated Tests
- Syntax check via `node --check src/app/generate/v2/page.js`.

### Manual Verification
- Visual verification in browser:
  1. Desktop: Switch themes (`Clean`, `Retro`, `Classic Dark`) in top-right header and confirm the live preview container background updates instantly to match selected theme.
  2. Mobile viewport (< 1024px): Confirm that on default load in Split view, the `LIVE SANDBOX PREVIEW V2` header bar sits cleanly above the central `+` FAB button with 0px overlap, leaving the `👁️ Preview` button 100% visible and accessible.
