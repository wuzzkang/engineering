# Decision Log: Self-healing Orphaned Uploads

### DEC-001: Client-Side localStorage Tracking for Orphaned Storage Deletion
*   **Date:** 2026-07-16T04:58:00Z
*   **Context:** If a browser is closed or killed, Next.js page unmount hooks do not run, leaving newly uploaded images orphaned in Supabase Storage. A reliable, scalable way to find and clean these up without setting up backend cron jobs was needed.
*   **Options Considered:**
    *   *Option A: Set up a backend daily cron script that checks all files in Supabase storage against DB tables.*
        *   *Pros:* Cleans up everything regardless of user session.
        *   *Cons:* Very slow, database intensive, complex to configure, and can incur API costs/rate limits for listing storage recursively.
    *   *Option B: Track unsaved public URLs in browser localStorage and clean them up on layout initialization/next session.*
        *   *Pros:* Simple, instant, zero database impact, works automatically as soon as the user logs in/opens the app, and is fully secure using the active session token.
        *   *Cons:* Depends on browser local storage persistence.
*   **Decision:** Option B. It is lightweight, performs self-healing immediately on next visit, and integrates perfectly with the existing `DELETE /api/media` backend route.
*   **Impact:**
    *   `src/app/generate/page.js`
    *   `src/context/AuthContext.js`
