# Decision Log: E-Course Product & Template

This log tracks key architectural and design decisions made during the E-Course Product & Template implementation.

## Decisions

### DEC-1: Design Key and Default Styles
*   **Date:** 2026-07-12T12:00:00Z
*   **Context:** The user wants an e-course product with a design matching the purple online class theme.
*   **Options Considered:** 
    *   *Option A:* Re-use existing templates (Wedding/Store) and customize colors. (Pros: Faster to setup. Cons: Doesn't meet curriculum/modules requirement).
    *   *Option B:* Create a custom `purple-academy` design template with a dark theme and purple gradient styling elements. (Pros: Exactly fits specifications. Cons: Requires writing custom HTML layout).
*   **Decision:** Option B.
*   **Impact:** Affects LP template paths and configuration keys.

### DEC-2: Node 22 API Runtime Upgrade for WebSocket Support
*   **Date:** 2026-07-13T09:30:00Z
*   **Context:** Supabase JS SDK realtime library threw fatal WebSocket runtime errors when run under Node 20.
*   **Options Considered:** 
    *   *Option A:* Polyfill `ws` global variable. (Pros: Keeps Node 20. Cons: Prone to memory leaks).
    *   *Option B:* Run API server under Node 22 (allowing native WebSocket support). (Pros: Clean native environment. Cons: Requires system node nvm configuration).
*   **Decision:** Option B.
*   **Impact:** Running `wuzzkang-api` server requires Node 22 setup.

### DEC-3: Dynamic Editor State Initialization Synchronization
*   **Date:** 2026-07-13T19:00:00Z
*   **Context:** On initial load, setting only `templateType` state created a mismatch where the editor attempted to request `e-course/modern-clean.js` because `designKey` was still hardcoded to its initial state `'modern-clean'`.
*   **Options Considered:** 
    *   *Option A:* Do nothing and force the user to toggle selection. (Pros: No code changes. Cons: Broken initial loading state).
    *   *Option B:* Synchronize `templateType`, `designKey` and `designVersion` inside the database loading `useEffect` hook. (Pros: Elegant, seamless default rendering on new project creation. Cons: Minor state management logic extension).
*   **Decision:** Option B.
*   **Impact:** Fixed page loading and rendering state of newly created projects in `src/app/generate/page.js`.

### DEC-4: Sandbox Layout Syntax Correction & Global Error Catchers
*   **Date:** 2026-07-13T19:10:00Z
*   **Context:** A missing catch block inside the sandbox iframe script crashed script parsing, resulting in a blank preview screen.
*   **Options Considered:** 
    *   *Option A:* Fix only the syntax error. (Pros: Easy fix. Cons: Future runtime issues will fail silently to blank screen).
    *   *Option B:* Fix the syntax error AND add global error/rejection catchers. (Pros: Robust error visualization for user and developer. Cons: Adds minor global listeners).
*   **Decision:** Option B.
*   **Impact:** Modified `public/preview/index.html` to recover and display error diagnostics directly inside the preview iframe viewport.
