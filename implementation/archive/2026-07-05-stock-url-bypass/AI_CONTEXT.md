# AI Context — Resilient Stock URL Fallback (Bypass Supabase Upload)

## Feature
Modify `GeminiProvider.js` and `prewedding.route.js` to return and save the Unsplash stock URL directly when fallback occurs, skipping downloading the binary image buffer and uploading to Supabase Storage entirely. Only AI-generated images (Gemini Imagen, OpenAI) should produce a binary buffer and upload to Supabase.

## Repository Boundaries

| Repo | Path | Role |
|---|---|---|
| wuzzkang-api | `/home/bms-del112/BMS/personal-project/wuzzkang/wuzzkang-api` | Backend API |

## Key Files to Modify

- [MODIFY] `src/services/ai-platform/providers/GeminiProvider.js` — Return object with `type` ('buffer' or 'url'). Validate stock photo URL with HEAD request.
- [MODIFY] `src/routes/prewedding.route.js` — Check image result type, bypass Supabase upload for 'url' types.
