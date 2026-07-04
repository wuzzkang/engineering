# Implementation Plan — Gemini SDK Migration (`@google/generative-ai` to `@google/genai`)

This plan covers migrating the `wuzzkang-api` package from the deprecated `@google/generative-ai` library to the new unified `@google/genai` library.

---

## User Review Required

> [!IMPORTANT]
> This migration updates a major dependency package (`@google/generative-ai` is replaced with `@google/genai`).
> While it does not change the public API or behavior of `GeminiProvider` inside the orchestrator/worker context, it is a significant structural shift in library interactions.

---

## Proposed Changes

### Component: Backend wuzzkang-api Dependencies

#### [MODIFY] [package.json](file:///home/bms-del112/BMS/personal-project/wuzzkang/wuzzkang-api/package.json)
- Uninstall `@google/generative-ai`
- Install `@google/genai` (v0.1.1 or latest compatible)

---

### Component: Gemini Provider Implementation

#### [MODIFY] [GeminiProvider.js](file:///home/bms-del112/BMS/personal-project/wuzzkang/wuzzkang-api/src/services/ai-platform/providers/GeminiProvider.js)
- Import `GoogleGenAI` instead of `GoogleGenerativeAI` from the new package `@google/genai`.
- Initialize `_client` in constructor using:
  ```javascript
  this._client = new GoogleGenAI({ apiKey: config.GEMINI_API_KEY });
  ```
- Update `execute()` method:
  - Format call parameters using `ai.models.generateContent` signature.
  - Map safety settings under `config.safetySettings` directly.
  - Map `temperature` and `maxOutputTokens` under the unified `config` object.
  - Retrieve output text from `response.text` or candidate parts.
  - Keep `_withAbortSignal` and `_withTimeout` wrapper helpers to guarantee signal/timeout cancellation works reliably regardless of SDK internal support.

---

## Verification Plan

### Automated Verification
We will run a structural validation test to verify that the provider can be instantiated and initialized without exceptions:
- Run `npm run dev` to ensure no startup compilation or registry autoload issues.
- Create a test script `/home/bms-del112/BMS/personal-project/wuzzkang/wuzzkang-api/test-milestone6-gemini.js` to dry-run and verify the new `GeminiProvider` class.

### Manual Verification
- Verify that a mock generation request works end-to-end with the new SDK setup if a real API key is configured.
