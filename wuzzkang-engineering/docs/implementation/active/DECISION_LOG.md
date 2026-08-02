# Technical Decision Log — Hero Section Options Evolution

## Decision 1: Strict User Data Rendering (0% Forced Fallbacks)
- **Context**: `wuzzkang-lp/script.js` had hardcoded text strings (e.g. `|| '🚀 Garansi 100% Puas...'` or `|| '⭐️ 4.9/5 dari 1,200+ Klien Puas'`) that rendered mock values even when fields were cleared in the Editor.
- **Decision**: All V2 section renderers in `wuzzkang-lp/script.js` must strictly check `if (field)` and render nothing when empty, mirroring the V2 Editor Canvas behavior.

## Decision 2: Centralized Image Picker Integration
- **Context**: V2 section forms needed Unsplash stock image search, file upload, and direct URL input.
- **Decision**: Standardized all image fields to use `V2ImagePickerWidget.jsx` with Bearer token authentication headers attached to `/api/media/process` and `/api/media/upload-url`.

## Decision 3: Single Canvas Iframe Registry (`main.jsx`)
- **Context**: Adding a new section type requires registering its React renderer in `wuzzkang-sections/apps/preview-app/src/main.jsx` under `RENDERER_REGISTRY`.
- **Decision**: Ensure every new section type ID (e.g., `hero-centered`) is imported and mapped in `main.jsx` to prevent "does not have a registered renderer" warnings on the V2 Builder Canvas.
