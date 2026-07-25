---
name: wuzzkang-doc-sync-auditor
description: Standard Operating Procedure (SOP) untuk memverifikasi dan memperbarui dokumentasi teknik Wuzzkang (API Spec, Database Architecture, Render Engine, Current State, Repository Map) sesuai aturan Definition of Done (DoD) pada .cursorrules dan 98_IMPLEMENTATION_PROTOCOL.md.
---

# SOP Documentation Synchronization & DoD Audit — Wuzzkang Ecosystem

Dokumen ini adalah acuan standar bagi AI Assistant dan Engineer dalam melakukan audit *Definition of Done* (DoD) serta menjaga sinkronisasi dokumentasi teknik di folder `wuzzkang-engineering/docs/` setiap kali perubahan kode selesai dilakukan.

---

## 🎯 1. Aturan Sinkronisasi Dokumentasi (Documentation Invariant)

Sesuai instruksi `.cursorrules` dan `98_IMPLEMENTATION_PROTOCOL.md` (Seksi 8 & 8.1), dokumentasi teknik **TIDAK BOLEH** tertinggal dari implementasi kode. 

Sebelum sesi pengerjaan ditutup atau milestone ditandai selesai (*completed*), AI wajib mengidentifikasi dan memperbarui dokumen-dokumen terkait di bawah ini:

---

## 📋 2. Checklist Audit Dokumen Wuzzkang

### 2.1 `docs/05_API_SPECIFICATION.md`
- [ ] Diperbarui jika ada pembuatan rute/endpoint API baru.
- [ ] Diperbarui jika ada penambahan/perubahan skema validasi Zod payload request atau response.
- [ ] Diperbarui jika ada status kode HTTP baru (misal `402 Payment Required`).

### 2.2 `docs/09_DATABASE_ARCHITECTURE.md`
- [ ] Diperbarui jika ada file migrasi SQL baru (`supabase/migrations/`).
- [ ] Diperbarui jika ada kolom, tabel, tipe data, indeks, atau fungsi RPC database baru.
- [ ] Pastikan penjelasan kolom `cost` selalu mencantumkan satuan **Credit** (bukan Rupiah).

### 2.3 `docs/07_RENDER_ENGINE.md`
- [ ] Diperbarui jika ada penambahan template landing page baru atau varian style baru.
- [ ] Diperbarui jika ada seksi komponen V2 (`dynamic-builder`) baru.
- [ ] Diperbarui jika ada key tema warna baru yang ditambahkan ke `getSectionStyle`.

### 2.4 `docs/02_CURRENT_STATE.md`
- [ ] Diperbarui jika ada milestone atau fitur baru yang selesai dikerjakan (`COMPLETED`).
- [ ] Diperbarui jika ada perubahan repositori aktif, infrastruktur, atau perbaikan *technical debt*.

### 2.5 `docs/08_REPOSITORY_MAP.md`
- [ ] Diperbarui jika ada struktur folder atau file arsitektur baru di monorepo (`wuzzkang-api`, `wuzzkang-dashboard`, `wuzzkang-lp`).

---

## 🛑 3. Kriteria Penutupan Task (Definition of Done)

Sebuah task atau milestone dianggap **Done** secara sah jika:
- [ ] Perubahan kode telah lolos linting/build tanpa warning sintaks.
- [ ] Seluruh dokumen terpengaruh di `wuzzkang-engineering/docs/` telah diperbarui.
- [ ] Dokumen `HANDOVER.md` di folder `implementation/active/` memuat bukti audit dokumentasi ini.
