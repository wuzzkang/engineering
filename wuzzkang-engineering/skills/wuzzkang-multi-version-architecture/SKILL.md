---
name: wuzzkang-multi-version-architecture
description: Standard Operating Procedure (SOP) untuk arsitektur multi-versi dinamis, pemisahan rute terisolasi (/generate/v1, /generate/v2, /generate/v3), strategi refactoring tanpa breaking changes, dan transformer migrasi data.
---

# SOP Multi-Version Architecture & Refactoring Guard — Wuzzkang Ecosystem

## Unique Identifier
- Whenever this skill is activated, ALWAYS prefix your very first response with the tag: `[WUZZKANG-MULTI-VERSION-AGENT]`

Dokumen ini adalah acuan standar bagi AI Assistant dan Engineer dalam merancang, memisahkan, dan mengelola arsitektur multi-versi dinamis di seluruh repositori Wuzzkang (`wuzzkang-dashboard`, `wuzzkang-api`, dan `wuzzkang-lp`).

---

## 🎯 1. Prinsip Utama Isolasi Versi (Version Isolation Principles)

1. **Zero Interference Between Versions**: Pembuatan atau modifikasi pada versi baru (V3, V4, dst.) **DILARANG KERAS** mengubah atau merusak kode versi lama (V1, V2). Setiap versi wajib berdiri sendiri secara terisolasi (*isolated modules*).
2. **Dynamic Strategy Pattern Over Spaghetti Logic**: Dilarang membuat percabangan `if/else` raksasa dalam 1 file tunggal. Gunakan *Dynamic Version Strategy Router* atau pemisahan rute Next.js App Router secara eksplisit.
3. **Ledger & Data Safety**: Proyek pengguna berversi lama yang sudah live wajib bisa ter-render sempurna (*backward compatibility*) tanpa terganggu oleh refactoring.

---

## 🏗️ 2. Struktur Standar Pemisahan Versi Monorepo

### 2.1 Monorepo Packages (`wuzzkang/`)
```text
wuzzkang/
├── wuzzkang-api/          ← Backend REST API (Express.js + Supabase)
├── wuzzkang-dashboard/    ← Frontend User Dashboard (Next.js App Router)
├── wuzzkang-lp/          ← Perender Landing Page Live Runtime (Vanilla JS)
├── wuzzkang-sections/    ← V2 Modular Section Component Library & AST Core (@wuzzkang/renderer-core)
└── wuzzkang-engineering/ # Dokumentasi Sistem & Skill Rules
```

### 2.2 Dashboard App Router (`wuzzkang-dashboard/src/app/generate/`)
```text
src/app/generate/
├── page.js          ← Auto-redirect router berbasis `template_version`
├── v1/
│   └── page.js      ← Editor Form V1 Legacy (Monolithic Form)
├── v2/
│   ├── [projectId]/
│   │   └── page.jsx ← Editor V2 First Principles Builder & AST Node Inspector
│   └── page.js      ← Router Inisialisasi & Generate Valid UUID V2 Project
└── v3/
    └── page.js      ← Editor V3 Future Engine
```

### 2.3 API Schema & Isolated V2 Endpoints (`wuzzkang-api/src/`)
* **Validasi Skema**: Skema Zod dipisahkan per versi (`V1PageSchema`, `V2PageSchema`, `V3PageSchema`).
* **Isolated V2 API Endpoints**: Rute REST V2 diisolasi di bawah `/api/v2/` (`v2.route.js`, `type-registry.controller.js`, `type-registry.service.js`):
  - `GET /api/v2/type-registry` & `GET /api/v2/design-systems/:id`
  - `GET /api/projects/:id/v2/draft` & `PUT /api/projects/:id/v2/draft`
  - `POST /api/projects/:id/v2/publish`
* **Isolated V2 Database Tables**: `public.project_documents_v2`, `public.section_types_v2`, `public.design_systems_v2`.
* **Transformer Migrasi**: Modul transformasi data berlokasi di `src/services/migrations/` (misal: `V1ToV2Transformer.js`) untuk memfasilitasi *one-click upgrade*.

---

## 🛠️ 3. SOP Refactoring & Pemisahan Rute (Zero Breaking Changes)

Saat melakukan refactoring pemisahan file besar (seperti `generate/page.js`):

1. **Isolasi Terlebih Dahulu**: Pindahkan form V1 ke rute `src/app/generate/v1/page.js` secara lengkap tanpa menghapus fungsinya.
2. **Verifikasi Jalur Legacy**: Pastikan situs V1 lama dapat dibuka dan di-edit melalui rute `/generate/v1?id=xxx`.
3. **Bersihkan Rute Utama (V2)**: Buat rute `src/app/generate/v2/page.js` khusus untuk V2 Modular Builder murni yang bebas dari kode spageti V1.
4. **Pasang Auto-Redirect**: Di `src/app/generate/page.js` root, baca `template_version` proyek:
   - Jika `template_version === 1` $\rightarrow$ `router.replace('/generate/v1?id=' + draftId)`
   - Jika `template_version === 2` / baru $\rightarrow$ `router.replace('/generate/v2')`
