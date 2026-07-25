---
name: wuzzkang-multi-version-architecture
description: Standard Operating Procedure (SOP) untuk arsitektur multi-versi dinamis, pemisahan rute terisolasi (/generate/v1, /generate/v2, /generate/v3), strategi refactoring tanpa breaking changes, dan transformer migrasi data.
---

# SOP Multi-Version Architecture & Refactoring Guard — Wuzzkang Ecosystem

Dokumen ini adalah acuan standar bagi AI Assistant dan Engineer dalam merancang, memisahkan, dan mengelola arsitektur multi-versi dinamis di seluruh repositori Wuzzkang (`wuzzkang-dashboard`, `wuzzkang-api`, dan `wuzzkang-lp`).

---

## 🎯 1. Prinsip Utama Isolasi Versi (Version Isolation Principles)

1. **Zero Interference Between Versions**: Pembuatan atau modifikasi pada versi baru (V3, V4, dst.) **DILARANG KERAS** mengubah atau merusak kode versi lama (V1, V2). Setiap versi wajib berdiri sendiri secara terisolasi (*isolated modules*).
2. **Dynamic Strategy Pattern Over Spaghetti Logic**: Dilarang membuat percabangan `if/else` raksasa dalam 1 file tunggal. Gunakan *Dynamic Version Strategy Router* atau pemisahan rute Next.js App Router secara eksplisit.
3. **Ledger & Data Safety**: Proyek pengguna berversi lama yang sudah live wajib bisa ter-render sempurna (*backward compatibility*) tanpa terganggu oleh refactoring.

---

## 🏗️ 2. Struktur Standar Pemisahan Versi Monorepo

### 2.1 Dashboard App Router (`wuzzkang-dashboard/src/app/generate/`)
```text
src/app/generate/
├── page.js          ← Auto-redirect router berbasis `template_version`
├── v1/
│   └── page.js      ← Editor Form V1 Legacy (Monolithic Form)
├── v2/
│   └── page.js      ← Editor V2 Current Builder (Modular Section Builder)
└── v3/
    └── page.js      ← Editor V3 Future Engine
```

### 2.2 LP Renderer (`wuzzkang-lp/templates/`)
```text
wuzzkang-lp/templates/
├── v1/              ← Perenderan V1 Legacy (sage-green.js, modern-clean.js, dll)
├── v2/              ← Perenderan V2 Modular Section Builder (getSectionStyle)
└── v3/              ← Perenderan V3 Future Engine
```

### 2.3 API Schema & Migration (`wuzzkang-api/src/`)
* **Validasi Skema**: Skema Zod dipisahkan per versi (`V1PageSchema`, `V2PageSchema`, `V3PageSchema`).
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
