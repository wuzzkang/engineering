# Decision Log — V2 Mobile Editor Section List Space Optimization

### DEC-001: Hide Theme Color Panel on Mobile (Opsi B)
- **Date:** 2026-07-26
- **Context:** The "Tema Warna Landing Page (Global)" panel inside the editor column is a full functional duplicate of the theme switcher already rendered in the Top Navigation Header (L874–890). On mobile, both compete for limited vertical real estate.
- **Options Considered:**
  - *Option A:* Remove panel from editor entirely — would break desktop users who prefer the panel's prominent placement.
  - *Option B:* Hide on mobile only (`hidden lg:flex`) — preserves desktop UX, removes redundancy on mobile.
- **Decision:** Option B — `hidden lg:flex` on the panel's outer div. Zero functional loss since Top Header theme switcher is still accessible on mobile.
- **Impact:** `src/app/generate/v2/page.js` L1050–1077.

### DEC-002: Collapse-by-Default for Brief Bisnis & URL Slug Panels on Mobile
- **Date:** 2026-07-26
- **Context:** Brief Bisnis textarea (~110px) and URL Slug input (~68px) are always expanded on mobile, stealing space from the section list. Users who have already filled them don't need them always visible.
- **Options Considered:**
  - *Option A:* Always collapsed on mobile — bad UX for first-time users who haven't filled the fields yet.
  - *Option B:* Collapsed by default on mobile, expanded on desktop. User can toggle anytime. — Best balance of space and accessibility.
- **Decision:** Option B — collapsed by default on mobile (< 1024px), expanded by default on desktop.
- **Impact:** `src/app/generate/v2/page.js` — 2 new useState + 1 useEffect + 2 toggle buttons.

### DEC-003: Reusable Generic Modal with Browser/Hardware Back Button Interceptor
- **Date:** 2026-07-26
- **Context:** When opening full-screen modals on mobile (such as the Brief AI editor modal), users frequently press the physical Android Back button or swipe-to-go-back gesture. Without interception, the browser navigates away from `/generate/v2`, losing unsaved session state.
- **Decision:** Built generic `src/components/Modal.jsx` using `window.history.pushState({ modalOpen: true }, '')` when opened, and listening for `popstate` to close the modal gracefully while staying on `/generate/v2`.
- **Impact:** `src/components/Modal.jsx` reusable across the entire codebase.

### DEC-004: Security Input Sanitization (`sanitizeAIBriefInput`)
- **Date:** 2026-07-26
- **Context:** Brief AI inputs are passed directly to LLM prompt compilers and rendered in frontend previews. Unsanitized user inputs could introduce XSS scripts, HTML tag injection, or prompt injection payloads.
- **Decision:** Implemented `sanitizeAIBriefInput` in `src/lib/security.js` that strips `<script>`, `<iframe>`, HTML tags, `javascript:` pseudo-protocols, `onerror=`/`onload=` handlers, and non-printable control characters.
- **Impact:** `src/lib/security.js`, `src/components/BriefTextareaModal.jsx`.

