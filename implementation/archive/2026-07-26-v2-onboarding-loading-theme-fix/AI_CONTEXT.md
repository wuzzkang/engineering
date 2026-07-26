# AI Context

## Active Task
Fix hardcoded dark theme styling on V2 Starter Kit Onboarding Modal in `/generate/v2` so that it respects theme variables (`bg-theme-card`, `bg-theme-bg`, `text-theme-text`, `text-theme-text-sec`, `border-theme-border`, `text-theme-accent`, etc.) when the active theme is clean/light mode.

## Target Repositories & Files
- `wuzzkang-dashboard`: `src/app/generate/v2/page.js`

## Key Context
- Currently, the V2 Starter Kit Onboarding Modal in `src/app/generate/v2/page.js` uses hardcoded Tailwind classes like `bg-slate-900`, `bg-slate-950`, `border-slate-800`, `text-white`, `text-slate-400`, `text-purple-400`, etc.
- In contrast, other V2 modals (e.g. `V2VisualSectionPickerModal.jsx`) properly use theme CSS tokens (`bg-theme-card`, `bg-theme-bg`, `border-theme-border`, `text-theme-text`, `text-theme-text-sec`, `text-theme-accent`).
- Refactoring the onboarding modal to use theme CSS variables ensures consistent visual presentation regardless of light/clean or dark theme settings.
