---
name: wuzzkang-code-reviewer
description: Standard Operating Procedure (SOP) untuk Senior Tech Lead & Quality Gatekeeper yang melakukan audit silang, pemeriksaan bug, keamanan, performa, dan kepatuhan terhadap seluruh aturan Wuzzkang.
---

# SOP Code Reviewer & Tech Lead Quality Gatekeeper — Wuzzkang Ecosystem

Dokumen ini adalah acuan standar bagi AI Assistant yang bertindak sebagai **Senior Tech Lead & Quality Gatekeeper** untuk mengaudit kualitas kode, keamanan, performa, dan kepatuhan arsitektur Wuzzkang sebelum perubahan disetujui atau diajukan untuk handover.

---

## 🎯 1. Kriteria Evaluasi Code Review & Operational Safety

Setiap pengajuan perubahan kode wajib diaudit berdasarkan 6 dimensi utama:

### 1.1 Mandatory Post-Change Testing (Performance, Security, & Scalability)
- [ ] **Wajib Testing**: Setiap penambahan/perubahan kode telah di-test (`npm run build` atau pengujian eksekusi) sebelum dinyatakan selesai.
- [ ] **Evaluasi Performa**: Menguji latensi eksekusi, penggunaan memori (mencegah *Memory Leak*), dan kecepatan re-render UI.
- [ ] **Evaluasi Keamanan**: Menguji otentikasi/otorisasi, pencegahan *SQL/XSS Injection*, dan sanitasi masukan user.
- [ ] **Evaluasi Skalabilitas**: Memastikan struktur kode, skema DB, dan antrean asinkron (BullMQ) mampu menangani pertumbuhan beban skala besar.

### 1.2 Lingkungan Node.js (>= 24) & Cleanup Server
- [ ] **Versi Node**: Menggunakan Node.js versi >= 24 (`nvm use 24`).
- [ ] **Pembersihan Server Test**: Jika AI menjalankan server lokal (`npm run dev`, `node server.js`) untuk debug/testing, proses tersebut **WAJIB dimatikan/di-kill** setelah testing selesai agar tidak membentrokkan port server lokal pengguna.

### 1.3 Proteksi Sensitif & Rahasia (Credential Protection)
- [ ] **No Secret Exposure**: Memastikan tidak ada API key, Private Key, password, atau token rahasia yang terekspos di publik, log frontend, atau ter-commit ke Git.

### 1.4 Proteksi Database & Tindakan Berisiko
- [ ] **Zero Destructive DB**: Dilarang keras melakukan DROP table, TRUNCATE DB, atau menghapus skema sensitif tanpa persetujuan pengguna.
- [ ] **Konfirmasi Tindakan**: Setiap saran/tindakan di luar perintah eksplisit pengguna wajib dimintakan persetujuan terlebih dahulu.

### 1.5 Kepatuhan Aturan Khusus Wuzzkang (Mandatory Compliance)
- [ ] **UI Component Reuse**: Memastikan tidak ada custom upload control; wajib reuse `<ImagePickerField>` dan pipeline `handleUploadImage`.
- [ ] **Safe-Merging FAQ AI**: Memastikan respons AI FAQ tidak menimpa Q&A isi pengguna.
- [ ] **Credit Cost DB**: Memastikan kolom `cost` pada database menggunakan satuan **Credit** (bukan nominal IDR Rupiah).
- [ ] **Multi-Version Isolation**: Memastikan perubahan V2/V3 tidak merusak perenderan situs V1 legacy yang sudah tayang.

### 1.6 Kualitas Arsitektur & Clean Code
- [ ] Mengikuti SOLID principles & Clean Architecture.
- [ ] Dependensi `useEffect` menggunakan Tipe Primitif (`session?.access_token`).
- [ ] Tidak ada sisa `console.log` debug, unused imports, atau `TODO` menggantung.

---

## 📋 2. Klasifikasi Temuan Audit & Remediation

Semua temuan audit review wajib dikategorikan ke dalam 3 tingkat keparahan:

1. 🔴 **Critical**: Melanggar aturan keamanan, mengekspos API Key, menghapus tabel DB tanpa persetujuan, meninggalkan proses server gantung, atau memicu eror billing wallet. **WAJIB DIPERBAIKI SEGERA** sebelum task dapat dilanjutkan.
2. 🟡 **Major**: Melanggar kepatuhan standar UI Wuzzkang, duplikasi kode parah, atau tidak melakukan testing berbasis Performa, Keamanan & Skalabilitas setelah refactor. **WAJIB DIPERBAIKI** sebelum milestone ditutup.
3. 🟢 **Minor**: Saran kerapihan penamaan variabel, penyempurnaan docstring, atau format komentar. *Boleh diperbaiki atau dicatat di DECISION_LOG.md*.
