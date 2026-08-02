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

## Phase 3: Conversion & Video Hero (`hero_video` / `hero-video`) [COMPLETED]
- [x] Create `wuzzkang-sections/sections/hero-video` component files (`section.json`, `Renderer.jsx`, `EditorForm.jsx`)
- [x] Create `hero_video` ES Module renderer in `wuzzkang-lp`
- [x] Register in `wuzzkang-lp/script.js` & `preview-app/src/main.jsx`
- [x] Register in catalog modals (`V2VisualSectionPickerModal.jsx`, `SectionPickerModal.jsx`) & V2 Editor
- [x] Sync templates & run E2E regression tests (100% PASS, 1.65ms benchmark)

## Phase 4: V2ImagePickerWidget Hardening & Redis/BullMQ Refactor [COMPLETED]
- [x] Fix delete-from-Supabase bug — tombol hapus kini memanggil `DELETE /api/media` dengan `storagePath`
- [x] Implement `_deleteOldStorageFile()` — auto-delete file lama sebelum upload/Unsplash/URL replace
- [x] Add prop `storagePath` ke `V2ImagePickerWidget` API untuk lifecycle delete tracking
- [x] Implement 4-layer file security validation (size limit → MIME allowlist → Magic bytes → Canvas decode test)
- [x] Implement Canvas auto-resize untuk file > 500KB (quality iteration + dimension scale fallback)
- [x] Turunkan hard limit upload dari 10MB → 3MB
- [x] Fix Unsplash tab UI — tombol generate disusun vertikal full-width (tidak terpotong di panel sempit)
- [x] Refactor `hero-split/EditorForm.jsx` — ~150 baris custom upload diganti `<V2ImagePickerWidget>`
- [x] Integrate `storagePath` tracking di `hero-centered/EditorForm.jsx`
- [x] Update `.cursorrules` & `.clinerules` — mandate V2ImagePickerWidget untuk semua kebutuhan upload
- [x] Ekstrak Lua quota logic ke `src/utils/aiQuota.js` (single source of truth)
- [x] Refactor `image.route.js` — hapus 2x blok Lua duplikat, ganti dengan `checkAndIncrementDailyQuota()`
- [x] Tambah dokumentasi ⚠️ WARNING di `utils/redis.js` & `queues/queue.js` menjelaskan alasan 2 koneksi Redis terpisah
- [x] Update `02_CURRENT_STATE.md`, `08_REPOSITORY_MAP.md`, `DECISION_LOG.md` (sesi ini)

