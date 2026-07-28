# Implementation Plan — End-to-End V2 Draft & Publication Flow Verification

- **Status**: `Approved for Implementation` ✅
- **Target Feature**: V2 First Principles Builder & Publisher Flow Validation

---

## 🎯 Task Goal
Verifikasi menyeluruh alur kerja V2 First Principles:
1. Pembuatan draf baru V2 pada router `/generate` (`V2SectionFormDispatcher.js`).
2. Redireksi otomatis ke V2 Editor `/generate/v2/[projectId]`.
3. Inisialisasi 3-Panel Builder V2 (Canvas, Tree/Layers, Property Inspector).
4. Pengujian sinkronisasi auto-save draf V2 ke Supabase (`template_version: 2`).
5. Pengujian publikasi dokumen V2 ke tabel `project_documents_v2` & verifikasi live perender.

---

## 📌 Planned Milestones

### Milestone 1: Pre-flight Verification & Dev Server Start
- Jalankan `npm run dev` di root untuk memastikan 4 layanan (`wuzzkang-api`, `wuzzkang-dashboard`, `wuzzkang-lp`, `wuzzkang-sections`) menyala tanpa crash.
- Verifikasi koneksi REST API antarsistem.

### Milestone 2: Draf V2 Creation & Dispatcher Test
- Uji buat draf baru V2.
- Verifikasi penyisipan `template_version: 2` & `template_type: 'dynamic-builder'` oleh `TypeRegistryService.saveProjectDraft`.

### Milestone 3: 3-Panel Builder V2 Property Edit & Auto-Save Sync
- Uji manipulasi properti seksi pada canvas/inspector di `/generate/v2/[projectId]`.
- Pastikan perubahan AST Node terisi dan tersimpan otomatis tanpa error.

### Milestone 4: Publication & Live Renderer Test
- Lakukan aksi Publikasi (Publish) dokumen V2.
- Pastikan dokumen tersimpan di tabel `project_documents_v2` dan dapat diakses publik.

### Milestone 5: Cleanup & Documentation Sync
- Terminasi dev server (`kill process`).
- Synchronize dokumentasi di `wuzzkang-engineering/docs/` jika ada penyesuaian API/Flow.
