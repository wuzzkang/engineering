# Implementation Plan — Dashboard Compact Landing Page Card & Filter Redesign

## Status: Awaiting User Approval

## Objective
Make the main dashboard (`src/app/page.js`) look significantly more compact, tight, and professional by reducing wasteful vertical padding, streamlining card elements, and tightening filter/search controls.

## Problem Statement
Based on user feedback and screenshots:
1. **Landing Page Card (`filteredProjects.map`)**: Too much empty vertical space around titles, dates, badges, and action buttons. Padding is overly spacious (`rounded-3xl p-5 md:p-6`), causing cards to look empty.
2. **Filter Tabs & Search Bar (`sticky top-16`)**: Filter tab pills are tall and bulky with high margins (`pb-4 pt-2`).
3. **Hero & Stats Bar**: Quick stats grid icons and text have excess height.

## Proposed Changes

### Milestone 1 — Compact & Guaranteed Sticky Filter Tabs & Search Bar
**File:** `src/app/page.js` (L562–620)
- Fix sticky behavior on scroll: set `sticky top-[64px] z-30` (flushes perfectly beneath the 64px `Sidebar.js` top header bar without scrolling away).
- Reduce sticky wrapper padding from `pb-4 pt-2 -mx-4 px-4` to `py-2 -mx-3 px-3 bg-theme-surface/95 backdrop-blur-md shadow-sm`.
- Tighten filter tab pill padding from `py-2 px-4 rounded-xl` to `py-1.5 px-3 rounded-lg text-xs font-bold`.
- Tighten search input padding from `py-2` to `py-1.5 text-xs`.

---

### Milestone 2 — Compact Landing Page Card Layout & Information Architecture
**File:** `src/app/page.js` (L656–824)
- Reduce card outer container padding from `rounded-3xl p-5 md:p-6` to `rounded-2xl p-3.5 md:p-4 hover:shadow-md`.
- **Top Bar Alignment**: Place category badge, status badge, created date, and trash delete button in a clean, tight header row.
- **Card Title**: Tighten title margins (`my-1 text-sm font-bold`), add line clamp, reduce title empty gap.
- **Domain & Subdomain Row**: Combine Live URL link and Subdomain manager into a compact single-line row.
- **Action Button Bar**: Reduce top margin from `mt-5 pt-4` to `mt-3 pt-2.5`, make buttons compact (`py-1.5 text-xs rounded-lg`).

---

### Milestone 4 — Desktop 3-Column Grid Upgrade & Ratio Optimization
**File:** `src/app/page.js` (L635)
- Change card grid layout from `grid-cols-1 md:grid-cols-2` to `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5`.
- Prevents cards from becoming overly wide on desktop/laptop screens (1024px+).
- Displays 3 cards per row on desktop for a compact, balanced, SaaS dashboard look.

---

### Milestone 3 — Verification & UX Polish
- Next.js lint check (`npx next lint`).
- Empirical visual check via local dev server to ensure cards are tight, compact, and show more items on screen without scrolling.

---

## Files to Modify
- `wuzzkang-dashboard/src/app/page.js`

## Files to Sync (Docs)
- `wuzzkang-engineering/docs/02_CURRENT_STATE.md`

## Verification Plan
1. `npx next lint` check
2. Visual verification on local dev server (`http://localhost:3000`)
3. Mobile & Desktop responsive layout check

## Risk
- Low. Purely UI layout & CSS class optimization; no backend or data contract changes.
