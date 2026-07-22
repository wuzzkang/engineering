# Fix Mobile Layout issues in Generate/Editor Page

This plan addresses visual layout bugs when viewing the dashboard's generator/editor page on mobile devices:
1. The "+ Tambah Section Baru" select element overflows the right side of its container.
2. The bottom of the edit form content gets covered by the fixed bottom action bar and navigation bar.

## User Review Required

No breaking changes are proposed. The layout adjustments are purely CSS/Tailwind class additions to improve responsiveness.

## Open Questions

None. The user has explicitly requested to focus on fixing the messy layout on the mobile view of the editor page.

## Proposed Changes

### Dashboard Frontend

#### [MODIFY] [page.js](file:///home/bms-del112/BMS/personal-project/wuzzkang/wuzzkang-dashboard/src/app/generate/page.js)
* **Section List Manager:** Change the wrapper container from `flex justify-between items-center` to `flex flex-col sm:flex-row gap-3 sm:gap-2 justify-between items-start sm:items-center`.
* **Add Section Select:** Apply `w-full sm:w-auto` to the select element to make it wrap cleanly and span full width on mobile, which is much more touch-friendly and prevents horizontal overflow.
* **Scroll Padding:** Increase `<main>`'s padding-bottom on mobile from `pb-28` to `pb-48` (`pb-48 md:pb-12`) so that all content can scroll fully above the fixed bottom action bar (which occupies the bottom ~160px of the screen).

## Verification Plan

### Manual Verification
* Run the Next.js development server.
* Open the page in a browser, toggle the device toolbar to simulate mobile viewport widths (e.g. 360px - 400px), and verify:
  * The section manager is stacked vertically on mobile and the select box is full-width without overflow.
  * The scrollable page content can scroll completely above the fixed action buttons.
  * The desktop layout remains unchanged and functions correctly.
