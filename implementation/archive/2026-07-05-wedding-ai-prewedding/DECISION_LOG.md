# Decision Log — Wedding AI Prewedding Photo Generation

This file tracks major technical decisions, architectural shifts, and changes in direction.

---

### DEC-1: Two-Step AI Photo Generation Pipeline
*   **Date:** 2026-07-05T01:47:00+07:00
*   **Context:** Gemini 2.5 Flash is text-output-only. To generate a composite image combining context from groom/bride photos, we cannot do it in a single model call.
*   **Options Considered:**
    *   *Option A (Single Step with Replicate):* Re-enable Replicate face-merge. Pros: straightforward face swapping. Cons: Requires Replicate API token which is currently unconfigured/disabled on this workspace.
    *   *Option B (Two-Step Gemini API):* Step 1 analyzes images with Gemini 2.5 Flash to generate an artistic prompt, Step 2 passes it to Gemini Imagen 3 (`imagen-3.0-generate-002`) to generate the output image. Pros: Leverages existing Gemini API ecosystem, no new third-party integrations needed.
*   **Decision:** Option B (Two-Step Gemini API).
*   **Impact:** New `GeminiImageProvider.js` class and `prewedding.route.js` endpoint to orchestrate.
