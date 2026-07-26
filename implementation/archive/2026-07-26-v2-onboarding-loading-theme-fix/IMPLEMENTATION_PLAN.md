# Implementation Plan — Refactor V2 Onboarding Modal & Page Loading Transition to Theme-Aware CSS Tokens

**Status:** Approved for Implementation

## Summary
1. **Milestone 1 (Completed):** Refactored V2 Starter Kit Onboarding Modal in `/generate/v2` to use theme tokens (`bg-theme-card`, `bg-theme-bg`, `text-theme-text`, `text-theme-text-sec`, `border-theme-border`, `text-theme-accent`).
2. **Milestone 2 (Proposed):** Refactor `src/components/Loading.js` to use theme background & text CSS tokens (`bg-theme-bg`, `text-theme-text`, `text-theme-text-muted`) instead of hardcoded `bg-slate-950/95` dark background, eliminating the dark flashing issue during page loading and transitions when Clean (Light) theme is active.

## Proposed Changes

### `wuzzkang-dashboard`

#### [MODIFY] [Loading.js](file:///home/bms-del112/BMS/personal-project/wuzzkang/wuzzkang-dashboard/src/components/Loading.js)
- Support both `text` and `message` prop names for flexibility across all usage sites.
- Update `containerClasses`:
  - Change `fullScreen` container background from hardcoded `bg-slate-950/95` to `bg-theme-bg text-theme-text transition-theme fixed inset-0 z-50`.
  - Change non-fullScreen container background to `w-full min-h-[50vh] flex flex-col items-center justify-center py-12 bg-theme-bg text-theme-text transition-theme`.
  - Ensure loader icon continues using `var(--theme-accent)` and text uses `text-theme-text-muted`.

## Verification Plan
### Automated & Build Verification
- Run `npm run build` inside `wuzzkang-dashboard` to verify there are no compilation or syntax errors.
- Code inspection to ensure all hardcoded `slate-950` classes in `Loading.js` are eliminated.
