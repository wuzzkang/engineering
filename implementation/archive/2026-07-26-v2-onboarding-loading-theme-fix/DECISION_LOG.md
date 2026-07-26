# Decision Log

### DEC-001: Standardize V2 Onboarding Modal Styling with Theme Tokens
* **Date:** 2026-07-26
* **Context:** User reported that the V2 onboarding popup modal on `/generate/v2` appears dark even when the user is in a clean (light) theme mode. Analysis showed the popup was built using hardcoded Tailwind dark classes (`bg-slate-900`, `text-white`, `border-slate-800`).
* **Options Considered:**
  * *Option A:* Keep hardcoded dark modal with custom dark theme wrapper. (Cons: Inconsistent UX when user switches to clean/light theme).
  * *Option B:* Refactor modal to use standard `theme-*` tokens (`bg-theme-card`, `bg-theme-bg`, `text-theme-text`, `text-theme-text-sec`, `border-theme-border`, `text-theme-accent`), matching `V2VisualSectionPickerModal.jsx`. (Pros: Seamlessly adapts to clean/light and dark themes).
* **Decision:** Option B — Refactor modal to use theme CSS variables.
* **Impact:** `wuzzkang-dashboard/src/app/generate/v2/page.js`

### DEC-002: Refactor Fullscreen & Page Transition Loading Component to Theme Tokens
* **Date:** 2026-07-26
* **Context:** User noticed that during page loading/transitions, the page briefly flashes dark before rendering content. Analysis showed `src/app/loading.js` renders `<Loading fullScreen={true} />`, which had hardcoded `bg-slate-950/95` background.
* **Options Considered:**
  * *Option A:* Hardcode conditional dark/light background logic based on state.
  * *Option B:* Refactor `src/components/Loading.js` container background to use `bg-theme-bg text-theme-text transition-theme`.
* **Decision:** Option B — Uses standard `bg-theme-bg` token so transition loading screen seamlessly matches current theme (Clean/Light or Dark).
* **Impact:** `wuzzkang-dashboard/src/components/Loading.js`
