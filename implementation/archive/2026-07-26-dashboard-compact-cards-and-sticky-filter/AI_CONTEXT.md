# AI Context — Dashboard Landing Page Card & Filter Redesign (Compact UI)

## Task Scope
Redesign landing page cards, search bar, and filter tabs on the main dashboard (`/src/app/page.js`) to make them significantly more compact, modern, and eliminate unnecessary empty vertical space.

## Target Repository
- `wuzzkang-dashboard`

## Target File
- `src/app/page.js`

## Key Observations & Pain Points from Screenshot
1. **Empty Card Padding & Spacing**:
   - `rounded-3xl p-5 md:p-6` card has excessive inner vertical padding.
   - Title "test ui baru" has empty space above and below it (`mb-2`, `mt-3`, `mb-3`).
   - Huge gap before date and action buttons (`mt-5 pt-4 border-t`).
2. **Filter & Search Controls**:
   - Sticky bar has large vertical padding (`pb-4 pt-2 -mx-4 px-4 border-b`).
   - Filter buttons have large padding (`py-2 px-4 rounded-xl`).
   - Search bar input is tall (`py-2`) with extra margins.
3. **Card Buttons**:
   - `Publikasikan Halaman` button is tall (`py-2.5`) with large top margin (`mt-5 pt-4`).

## Session Started
2026-07-26
