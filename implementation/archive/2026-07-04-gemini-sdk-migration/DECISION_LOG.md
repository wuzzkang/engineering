# Decision Log — Gemini SDK Migration

This log records significant architectural and design decisions made during the migration of the Gemini SDK.

## Dec-009: SDK Transition
*   **Context:** `@google/generative-ai` is deprecated and marked legacy. Google recommends moving to the new `@google/genai` library.
*   **Decision:** Completely replace the legacy SDK package with the new unified `@google/genai` library. Maintain the public signature of `GeminiProvider` unchanged to ensure zero downstream code changes in orchestrators or worker queues.
*   **Consequence:** Cleaner codebase, compatibility with future models (e.g. Gemini 2.5), and access to the latest unified API client functionality.
