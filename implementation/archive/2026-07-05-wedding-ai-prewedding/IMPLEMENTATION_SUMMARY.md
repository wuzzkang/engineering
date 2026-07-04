# Implementation Summary — Wedding AI Prewedding Photo Generation

| Field | Value |
|---|---|
| Project | Wuzzkang |
| Feature | AI Prewedding Photo Generation for Wedding Product |
| Status | **Planning — Awaiting User Approval** |
| Current Milestone | Pre-implementation (Design Phase) |
| Last Updated | 2026-07-05 |

## Feature Summary

Adds an optional checkbox "Generate Foto Prewedding dengan AI" to the Wedding product
generation form in the dashboard. When checked, the system triggers a two-step AI pipeline:

1. Gemini 2.5 Flash analyzes the uploaded groom & bride photos and produces an
   artistic scene description prompt.
2. Gemini Imagen 3 generates a new prewedding-style composite photo from that prompt.

The generated photo is stored in Supabase and made available as `prewedding_photo_url`
in the landing page data.

## Progress

- [ ] Milestone 1: GeminiImageProvider — new provider for Imagen 3 image output
- [ ] Milestone 2: Backend route — new endpoint `POST /api/media/prewedding`
- [ ] Milestone 3: Frontend checkbox + integration in dashboard `page.js`

## Architecture Overview

```
User checks "Generate Prewedding Photo" checkbox
         │
         ▼
Frontend calls POST /api/media/prewedding { groomImageUrl, brideImageUrl }
         │
         ▼
Backend: GeminiProvider (2.5-flash) analyzes both photos → returns artistic prompt
         │
         ▼
Backend: GeminiImageProvider (Imagen 3) generates new image from prompt
         │
         ▼
Backend: Upload generated image to Supabase Storage
         │
         ▼
Backend: Return { preweddingPhotoUrl } to frontend
         │
         ▼
Frontend: Sets preweddingPhotoUrl in pageData.content.prewedding_photo_url
```

## Key Files

- [NEW] `src/services/ai-platform/providers/GeminiImageProvider.js`
- [NEW] `src/routes/prewedding.route.js`
- [MODIFY] `src/config/index.js` — no new keys needed
- [MODIFY] `server.js` — register new route
- [MODIFY] `wuzzkang-dashboard/src/app/generate/page.js` — add checkbox + handler

## Known Constraints

- Gemini Imagen 3 is TEXT-TO-IMAGE only (no image input)
- Two-step pipeline required: text model for scene description → image model for generation
- Imagen 3 requires same `GEMINI_API_KEY` — no new API key needed
