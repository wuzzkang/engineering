# AI Context — Gemini SDK Migration

## System Overview
This task migrates the AI Platform implementation in `wuzzkang-api` from the deprecated `@google/generative-ai` SDK to the new unified `@google/genai` SDK.

## Key Boundaries
*   **Target Repository:** `wuzzkang-api`
*   **Target Files:**
    *   [package.json](file:///home/bms-del112/BMS/personal-project/wuzzkang/wuzzkang-api/package.json) (dependency updates)
    *   [GeminiProvider.js](file:///home/bms-del112/BMS/personal-project/wuzzkang/wuzzkang-api/src/services/ai-platform/providers/GeminiProvider.js) (SDK calls and client initialization)
*   **No breaking contract changes:** The `GeminiProvider` class must still satisfy the abstract `AIProvider` base contract, allowing the orchestrator and worker to function without changes.
