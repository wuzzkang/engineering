---
name: wuzzkang-implementation-protocol
description: Standard Operating Procedure (SOP) untuk siklus implementasi aktif (implementation/active/), pelacak milestone, log keputusan teknis, self-review mandatory, dan pengarsipan otomatis (implementation/archive/) pada ekosistem Wuzzkang.
---

# SOP Implementation Protocol & Workspace Lifecycle — Wuzzkang Ecosystem

Dokumen ini adalah acuan standar bagi AI Assistant dan Engineer dalam mengelola siklus pengerjaan fitur, refactoring, perbaikan bug, serta sinkronisasi dokumentasi pada monorepo Wuzzkang.

---

## 🎯 1. Struktur Workspace Implementasi

Seluruh aktivitas teknis wajib dikelola di bawah folder:
`[workspace-root]/implementation/`

### 1.1 `implementation/active/` (Hanya 1 Pengerjaan Aktif)
Tempat melacak implementasi yang sedang berlangsung. File yang wajib dipelihara:
* `AI_CONTEXT.md`: Batasan codebase, repositori target, dan dependensi lingkungan.
* `IMPLEMENTATION_SUMMARY.md`: Ringkasan snapshot status, milestone aktif, progres, dan keputusan utama.
* `IMPLEMENTATION_PLAN.md`: Target tujuan, daftar file yang diubah/dibuat, dan strategi verifikasi.
* `IMPLEMENTATION_PROGRESS.md`: Checklist detail task atomik dengan tag status (`[ ]`, `[/]`, `[x]`).
* `DECISION_LOG.md`: Catatan kronologis *why* dan pertimbangan keputusan teknis (format `DEC-[ID]`).
* `HANDOVER.md`: Bukti verifikasi, log eksekusi, screenshot, dan instruksi penyerahan tugas.

### 1.2 `implementation/archive/` (Catatan Histori Permanen)
Folder arsip berbasis tanggal dan nama fitur. Contoh: `implementation/archive/2026-07-04-ai-platform/`.
* Tidak boleh diubah atau dihapus setelah dipindahkan.
* Menjadi *source of truth* histori teknis proyek.

---

## 🛠️ 2. Milestone Lifecycle Protocol

Setiap *Milestone* wajib melewati tahapan berikut tanpa ada yang dilewati:

```text
Prepare -> Implement -> Self Review -> Automatic Remediation -> Sync Docs -> Close Milestone -> Next Milestone Plan -> WAIT FOR USER APPROVAL
```

1. **Prepare & Implement**: Operasikan task satu per satu dari `IMPLEMENTATION_PROGRESS.md`.
2. **Mandatory Self Review**: Lakukan audit internal mencakup arsitektur, *Clean Architecture*, SOLID, keamanan, performa, dan konsistensi dokumentasi. Klasifikasikan temuan (*Critical*, *Major*, *Minor*).
3. **Automatic Remediation**: Perbaiki temuan *Critical* dan *Major* secara otomatis sebelum menutup milestone.
4. **Documentation Synchronization**: Wajib memperbarui dokumen terkait di `wuzzkang-engineering/docs/` (`02_CURRENT_STATE.md`, `05_API_SPECIFICATION.md`, `09_DATABASE_ARCHITECTURE.md`, `07_RENDER_ENGINE.md`, `08_REPOSITORY_MAP.md`).
5. **Next Milestone Planning & Stop**: Siapkan rencana milestone berikutnya, lalu **STOP** dan minta persetujuan (*approval*) pengguna sebelum mengeksekusi.

---

## 📋 3. 2-Phase Implementation Lifecycle & Archive Procedure

Implementasi dikelola dalam **2 Fase Terpisah**:

### 🔄 Fase 1: Pengerjaan Aktif & Verifikasi (Active Phase - Tanpa Git Commit)
1. **Active Tracking Execution**: Saat mengerjakan fitur atau bugfix, AI **wajib mengupdate 6 dokumen pelacak di `implementation/active/` duluan**.
2. **Docs Sync**: AI wajib mensinkronkan `docs/02_CURRENT_STATE.md`.
3. **STRICT NO GIT COMMIT & NO ARCHIVING**: AI **DILARANG MENGESEKUSI `git commit` ATAU MENGARSIPKAN** pada fase ini.
4. **MANDATORY USER COMPLETION QUESTION**: AI **WAJIB BERTANYA** kepada pengguna:
   > *"Apakah pekerjaan ini sudah dianggap selesai dan sesuai dengan keinginan Anda?"*
5. **Active Session Continuity Rule**: Selama pengguna **belum menjawab selesai**, seluruh perintah/request lanjutan masih dianggap satu sesi implementasi aktif di `implementation/active/`. AI terus memperbarui artefak aktif tanpa melakukan arsip atau git commit.

### 📦 Fase 2: Pengarsipan & Git Commit (Archive & Commit Phase)
HANYA setelah pengguna mengonfirmasi bahwa pengerjaan **"selesai"** / **"sudah sesuai"**:
- [ ] Pindahkan/salin isi `implementation/active/` ke `implementation/archive/YYYY-MM-DD-feature-name/`.
- [ ] Inisialisasi ulang file template di `implementation/active/` untuk pengerjaan berikutnya.
- [ ] **Eksekusi local `git commit`** di seluruh repositori yang terdampak termasuk `root`.
