# AI Context — Wedding Prewedding Photo Generation

## Feature
Add an optional "Generate AI Prewedding Photo" checkbox to the Wedding product.
When checked during generation, the system combines the groom and bride's uploaded photos
into a single AI-generated prewedding-style composite photo using Gemini Imagen 3.

## Repository Boundaries

| Repo | Path | Role |
|---|---|---|
| wuzzkang-api | `/home/bms-del112/BMS/personal-project/wuzzkang/wuzzkang-api` | Backend API + Queue Workers |
| wuzzkang-dashboard | `/home/bms-del112/BMS/personal-project/wuzzkang/wuzzkang-dashboard` | Frontend Next.js Dashboard |

## Key Existing Infrastructure

- `GeminiProvider` — `src/services/ai-platform/providers/GeminiProvider.js` — handles text+image input via `@google/genai` SDK
- `aiTaskWorker.js` — `src/queues/aiTaskWorker.js` — BullMQ worker that processes `ai-task-queue` jobs
- `WeddingTaskCompiler` — `src/services/ai-platform/compilers/WeddingTaskCompiler.js` — compiles wedding copywriting prompts
- `image.route.js` — `src/routes/image.route.js` — has existing `merge_couple` mode (currently Replicate fallback)
- `imageWorker.js` — `src/queues/imageWorker.js` — processes `image-queue` jobs using OpenAI DALL-E
- `AIOrchestrationService` — `src/services/ai-platform/AIOrchestrationService.js` — orchestrates new AI platform tasks
- `SupabaseStorageProvider` — `src/services/storage/SupabaseStorageProvider.js` — uploads files to Supabase

## Critical Technical Constraint

Gemini 2.5 Flash is TEXT OUTPUT ONLY — it can accept images as input but cannot generate images as output.
To generate a new image, we must use Gemini Imagen 3 (`imagen-3.0-generate-002`) via a SEPARATE API call.

Gemini Imagen 3 capabilities:
- Can generate images from text prompts
- Does NOT support image input (purely text-to-image)
- Uses `client.models.generateImages()` API (different from `generateContent`)

## Architecture Decision

Strategy: TWO-STEP AI pipeline
1. Step 1 (Gemini 2.5 Flash): Analyze both uploaded photos and generate an artistic description prompt
   for the prewedding photo scene.
2. Step 2 (Gemini Imagen 3): Use the generated description to produce a new prewedding photo.

This avoids the Gemini text model limitation while producing high-quality, contextually-relevant output.

## Environment Variables Needed

- `GEMINI_API_KEY` — already configured (used by GeminiProvider)
- No new API keys required

## Tech Stack
- Node.js v22 + ESM
- Express.js
- BullMQ + Redis (for async job processing)
- Supabase Storage (for storing generated images)
- Next.js 16 (frontend dashboard)
