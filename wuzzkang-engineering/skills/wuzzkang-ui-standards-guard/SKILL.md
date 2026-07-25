---
name: wuzzkang-ui-standards-guard
description: Standard Operating Procedure (SOP) untuk aturan ketat UI/UX Dashboard, reuse komponen ImagePickerField, algoritma safe-merging FAQ AI, proteksi field Database Credit, dan optimasi re-render.
---

# SOP UI Standards & Guardrails — Wuzzkang Ecosystem

## Unique Identifier
- Whenever this skill is activated, ALWAYS prefix your very first response with the tag: `[WUZZKANG-UI-GUARD-AGENT]`

Dokumen ini adalah acuan aturan ketat (*strict guardrails*) bagi AI Assistant dan Engineer ketika membangun komponen UI frontend di `wuzzkang-dashboard` maupun mengelola skema validasi.

---

## 🛑 1. Aturan Ketat Komponen & UI (Strict Rules)

### 1.1 Reuse Komponen Unggah Gambar (`ImagePickerField`)
- **DILARANG KERAS** membuat komponen uploader file atau image picker dari nol di dashboard.
- **WAJIB REUSE** komponen `<ImagePickerField>` yang berlokasi di `wuzzkang-dashboard/src/components/ImagePickerField.js`.
- Semua proses unggahan gambar wajib dihubungkan ke pipeline `handleUploadImage` (signed URL Supabase Storage) dengan kategori subfolder yang sesuai di `uploads/userId/category/`.

### 1.2 Algoritma Safe-Merging FAQ AI Generation
- Saat mengimplementasikan atau mengubah fitur AI Assist untuk FAQ (pada template Campaign, E-Course, Jasa, dsb.), **WAJIB** menerapkan algoritma *safe-merging*.
- Pertanyaan dan jawaban yang sudah diisi secara manual oleh pengguna **TIDAK BOLEH** tertimpa (*overwritten*) atau terhapus oleh hasil respons AI. Hasil AI harus digabung (*merged*) tanpa merusak data pengguna.

### 1.3 Kolom Database `cost` Adalah Satuan Credit
- Kolom `cost` pada tabel `products` di database adalah satuan **Credit**, bukan nominal Rupiah IDR.
- **DILARANG KERAS** memasukkan nilai nominal Rupiah (misalnya `15000`) ke kolom `cost`. Selalu gunakan nilai credit (misal `150`).

---

## ⚡ 2. Optimasi Performa & Form Handling

1. **Pencegahan Re-render Berlebih (Auth Focus Trigger)**:
   - Hindari *layout flashing* atau reset form yang tidak disengaja.
   - Gunakan dependensi tipe primitif `session?.access_token` pada `useEffect` ketimbang memasukkan objek `session` secara keseluruhan.
2. **Paginasi Server-Side**:
   - Selalu terapkan paginasi server-side pada daftar data berukuran besar (seperti daftarkan proyek 5 item per halaman dengan debounced search).
3. **Validasi Form & Indicator Required**:
   - Berikan tanda bintang merah (`*`) pada label kolom yang wajib diisi.
   - Gunakan fitur scroll otomatis ke posisi eror (*auto scroll-to-error*) saat validasi form gagal agar pengguna mendapatkan umpan balik yang jelas.
