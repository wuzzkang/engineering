# AI Context — Consolidate Gemini Providers & Dynamic Models

## Feature
Merge `GeminiImageProvider` into `GeminiProvider` to have a unified wrapper for all Google Gemini API interactions (both text generation and image generation). Ensure that both the text model and the image model are dynamic (configurable via environment variables/options) rather than hardcoded.

## Repository Boundaries

| Repo | Path | Role |
|---|---|---|
| wuzzkang-api | `/home/bms-del112/BMS/personal-project/wuzzkang/wuzzkang-api` | Backend API |

## Key Files to Modify/Remove

- [MODIFY] `src/services/ai-platform/providers/GeminiProvider.js` — Merge image generation logic here and make models dynamic.
- [MODIFY] `src/routes/prewedding.route.js` — Update imports and usage to use the consolidated `GeminiProvider`.
- [MODIFY] `src/config/index.js` — Add configuration keys for dynamic Gemini models.
- [DELETE] `src/services/ai-platform/providers/GeminiImageProvider.js` — Remove obsolete class.
