# Decision Log

### DEC-01: CV Product Integration with new AI Platform Queue vs. Synchronous Fallback Bypass
*   **Date:** 2026-07-07T11:25:00+07:00
*   **Context:** The initial implementation bypassed the new BullMQ-based registry task compiler architecture and compiled CV pageData synchronously client-side, which violates the unified AI Platform design rules outlined in prompt_tambah_produk.md.
*   **Options Considered:**
    *   *Option A:* Keep the client-side/synchronous bypass.
        *   *Pros:* Bypasses Gemini API credit checks and queue latencies.
        *   *Cons:* Fails to utilize AI to optimize/polish profiles and experiences for ATS compatibility. Breaks architecture consistency.
    *   *Option B:* Implement CvTaskCompiler and route execution through `POST /api/v1/ai/execute` with BullMQ worker.
        *   *Pros:* Uses Gemini to rewrite summaries and experiences into ATS-compliant bullet points with action verbs. Follows the standard AI Platform architecture.
        *   *Cons:* Adds queue delay during initial page creation.
*   **Decision:** Option B. Adhering to the registry-based asynchronous task compiler architecture is critical to maintain clean architecture, consistency, and leverage Gemini AI to enhance CV quality.
*   **Impact:** Created `CvTaskCompiler.js`, registered in `register.js`, and refactored `generate/page.js` to dispatch through execute task queue and process polled results. Removed legacy bypass code.
