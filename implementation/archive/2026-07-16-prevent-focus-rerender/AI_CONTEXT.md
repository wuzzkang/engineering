# AI Context: Prevent Redundant Re-renders on Focus

- **Feature:** Bugfix: Prevent focus-triggered re-renders and form resets
- **Key Modules:**
  * AuthContext: `src/context/AuthContext.js`
  * Dashboard Pages: `src/app/` (Home, Generate, Topup, Profile, History)
- **Core Rules:**
  * Do not update auth context session if access token remains unchanged, unless it is a USER_UPDATED event.
  * Pages must depend on `session?.access_token` primitive instead of the `session` object wrapper inside `useEffect` dependency arrays.
