# AI Context & State Handover

## Project State
- Workspace: Wuzzkang Monorepo
- Active Task: Hero Section Options Evolution (3 Options)
- Completed Options:
  1. `hero_split` (Modern Split Hero)
  2. `hero_centered` (Centered Impact Hero)
- Next Task to Resume Tomorrow:
  3. `hero_video` (Conversion & Video Hero)

## Key File Locations & Imports
- Section Components: `wuzzkang-sections/sections/hero-centered/`
- Canvas Preview App: `wuzzkang-sections/apps/preview-app/src/main.jsx`
- Landing Page Router: `wuzzkang-lp/script.js`
- V2 Builder App: `wuzzkang-dashboard/src/app/generate/v2/[projectId]/page.jsx`
- Image Picker: `wuzzkang-dashboard/src/components/v2/V2ImagePickerWidget.jsx` (Import from sections: `../../../wuzzkang-dashboard/src/components/v2/V2ImagePickerWidget.jsx`)

## Verification Command
- Run tests: `node tests/v2-e2e-regression.test.mjs`
- Sync templates: `npm run sync:templates`
