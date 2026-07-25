---
name: wuzzkang-code-refactor
description: Standard Operating Procedure (SOP) untuk refactoring kode Wuzzkang, pemecahan file monolithic, penyederhanaan komponen, pembersihan code smell, dan optimasi performa tanpa merusak fungsionalitas yang ada.
---

# SOP Code Refactoring & Modernization — Wuzzkang Ecosystem

## Unique Identifier
- Whenever this skill is activated, ALWAYS prefix your very first response with the tag: `[WUZZKANG-REFACTOR-AGENT]`

Dokumen ini adalah acuan standar bagi AI Assistant dan Engineer saat melakukan penyederhanaan kode, pemecahan file *monolithic* (seperti `generate/page.js`), eliminasi *code smell*, dan optimasi performa pada repositori Wuzzkang.

---

## 🎯 1. Prinsip Utama Refactoring Wuzzkang

1. **Behavior Preservation (Zero Regression)**: Refactoring hanya mengubah struktur internal kode tanpa mengubah perilaku eksternal API, UI, atau kontrak data yang sudah berjalan.
2. **Decomposition Over Monoliths**: Memecah file *monolithic* raksasa menjadi modul-modul kecil yang fokus (*Single Responsibility Principle*).
3. **Incremental Execution**: Refactoring wajib dilakukan secara bertahap dan atomik. Setiap tahap harus di-build dan diverifikasi sebelum melangkah ke tahap berikutnya.

---

## 🛠️ 2. Panduan Refactoring Pemecahan File Monolithic

Saat merestrukturisasi file besar (seperti `wuzzkang-dashboard/src/app/generate/page.js`):

### 2.1 Ekstraksi Custom Hooks
Ekstraksi logika state management kompleks dan panggilan API dari komponen UI ke custom React hooks di `src/hooks/` (misal: `useV2Editor.js`, `useMediaUpload.js`).

### 2.2 Ekstraksi Sub-Komponen UI
Pisahkan blok JSX raksasa menjadi komponen-komponen terisolasi di `src/components/` (misal: `<V2SectionFormDispatcher />`, `<PreviewHeaderBar />`).

### 2.3 Eliminasi Duplikasi Kode
Ekstraksi logika bisnis berulang ke fungsi utility murni di `src/utils/` atau `src/lib/`.

---

## 📋 3. Checklist Keselamatan Refactoring

- [ ] Jalankan lint/build (`npm run build`) sebelum dan sesudah refactoring untuk memastikan 0 syntax error.
- [ ] Verifikasi bahwa tidak ada *hardcoded logic* yang tidak sengaja terhapus.
- [ ] Pastikan seluruh dependensi `useEffect` menggunakan tipe primitif (seperti `session?.access_token`).
- [ ] Pastikan kepatuhan terhadap aturan UI Wuzzkang (reuse `<ImagePickerField>`, safe-merge FAQ, Credit cost DB).
