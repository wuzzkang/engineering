# Decision Log: Prevent Redundant Re-renders on Focus

### DEC-001: Limit Auth Session State Updates to Token/Metadata Changes
*   **Date:** 2026-07-16T04:20:00Z
*   **Context:** On window focus/tab focus, the Supabase Auth listener triggers `onAuthStateChange`. Even when credentials are unchanged, it returns a new session object reference, causing `AuthContext` to update and force app-wide re-renders. Page effects fetching draft or project data run again, wiping out unsaved user inputs.
*   **Options Considered:**
    *   *Option A: Update all page useEffects to compare session fields manually.*
        *   *Pros:* No changes to AuthContext.
        *   *Cons:* Very error-prone, doesn't prevent redundant profile fetches, developers might easily forget to do this on new pages.
    *   *Option B: Filter redundant updates in AuthContext and optimize page dependencies to use primitive tokens.*
        *   *Pros:* Fixes the root cause at the global provider level. Drastically reduces network traffic (stops redundant GET `/profile` requests). Very robust and clean.
        *   *Cons:* Requires modifying the core auth provider.
*   **Decision:** Option B. It is the cleanest, most performant architectural fix and prevents any future regressions.
*   **Impact:**
    *   `src/context/AuthContext.js`
    *   `src/app/page.js`
    *   `src/app/generate/page.js`
    *   `src/app/topup/page.js`
    *   `src/app/profile/page.js`
    *   `src/app/payments/history/page.js`
