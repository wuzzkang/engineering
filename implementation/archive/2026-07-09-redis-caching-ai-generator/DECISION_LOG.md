# Decision Log

### DEC-001: Caching Layer Placement
*   **Date:** 2026-07-09T08:55:00Z
*   **Context:** Determine where to inject the Redis caching check. The route `/api/generate/field` handles billing and returns a 202 Accepted status, adding the task to BullMQ. The frontend polls for task status using the `jobId`.
*   **Options Considered:**
    *   *Option A: Caching in Route Handler (Controller)*
        *   *Pros:* Bypasses wallet billing deduction and queuing completely if cached.
        *   *Cons:* Breaks the frontend polling flow because the frontend expects a `jobId` from a `202 Accepted` response. Changing this would require massive refactoring of the async polling system in both backend and dashboard UI.
    *   *Option B: Caching inside AI Service (`generateFieldContent`)*
        *   *Pros:* Zero changes needed on the frontend. The worker gets the job, checks the cache, completes instantly in 1ms, and the frontend polling works exactly the same way.
        *   *Cons:* Wallet deduction happens before the job starts. However, since it is a background task, this is safer, simpler, and less prone to concurrency bugs.
*   **Decision:** Option B. It isolates the optimization to the AI service layer, guaranteeing compatibility and preventing regressions in billing and frontend code.
*   **Impact:**
    *   `wuzzkang-api/src/services/ai.service.js`
