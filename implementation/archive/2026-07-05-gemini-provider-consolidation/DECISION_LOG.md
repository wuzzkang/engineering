# Decision Log — Consolidate Gemini Providers & Dynamic Models

This file tracks major technical decisions, architectural shifts, and changes in direction.

---

### DEC-2: Consolidate Gemini Providers & Dynamic Model Config
*   **Date:** 2026-07-05T02:14:00+07:00
*   **Context:** The user wants to avoid hardcoding Gemini model IDs and requested to make them flexible (so models can be swapped without changing source code). Furthermore, both text and image capabilities should be unified inside a single `GeminiProvider` rather than maintaining two different classes (`GeminiProvider` and `GeminiImageProvider`).
*   **Options Considered:**
    *   *Option A (Separate Classes + Config):* Keep `GeminiProvider` and `GeminiImageProvider` separate, but add environment variables to configure both models.
    *   *Option B (Single Consolidated Class + Config):* Merge `generateImage` method directly into `GeminiProvider`, delete `GeminiImageProvider`, and introduce env config keys for both text and image models.
*   **Decision:** Option B (Single Consolidated Class + Config).
*   **Impact:** Cleaner directory structure (deleted `GeminiImageProvider.js`), unified SDK instance, and fully configurable models via `.env`.
