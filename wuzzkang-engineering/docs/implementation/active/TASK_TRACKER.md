# Task Tracker — Hero Section Options Evolution

## Phase 1: Modern Split Hero (`hero_split` / `hero-split`) [COMPLETED]
- [x] Create `wuzzkang-sections/sections/hero-split` component files (`section.json`, `Renderer.jsx`, `EditorForm.jsx`)
- [x] Create `hero_split` ES Module renderer in `wuzzkang-lp`
- [x] Fix Unsplash 401 Authorization Bearer header in `V2ImagePickerWidget` & `EditorForm`
- [x] Remove forced text fallbacks and set default Dark Navy background in `wuzzkang-lp/script.js`
- [x] Sync `hero_split` templates (`npm run sync:templates`)

## Phase 2: Centered Impact Hero (`hero_centered` / `hero-centered`) [COMPLETED]
- [x] Create `wuzzkang-sections/sections/hero-centered` component files (`section.json`, `Renderer.jsx`, `EditorForm.jsx`)
- [x] Create `hero_centered` ES Module renderer in `wuzzkang-lp`
- [x] Register `hero-centered` / `hero_centered` in `wuzzkang-lp/script.js`
- [x] Fix Canvas iframe error by registering `HeroCenteredRenderer` in `wuzzkang-sections/apps/preview-app/src/main.jsx`
- [x] Register `hero_centered` in `V2VisualSectionPickerModal.jsx` and `SectionPickerModal.jsx`
- [x] Update `V2SectionFormDispatcher.js` with `hero_centered` editor form controls
- [x] Register `hero-centered` in `wuzzkang-dashboard/src/app/generate/v2/[projectId]/page.jsx`
- [x] Fix import path in `hero-centered/EditorForm.jsx` (`../../../wuzzkang-dashboard...`)
- [x] Sync templates & verify E2E test pass (100% PASS, 2.44ms)

## Phase 3: Conversion & Video Hero (`hero_video` / `hero-video`) [NEXT SESSION]
- [ ] Create `wuzzkang-sections/sections/hero-video` component files
- [ ] Create `hero_video` ES Module renderer in `wuzzkang-lp`
- [ ] Register in `wuzzkang-lp/script.js` & `preview-app/src/main.jsx`
- [ ] Register in catalog modals & V2 Editor
- [ ] Sync templates & run E2E regression tests
