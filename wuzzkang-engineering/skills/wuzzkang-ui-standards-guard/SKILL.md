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

### 1.4 Proteksi Reaktivitas Warna & Dual Template Directory Sync
- **DILARANG KERAS** melakukan hardcoding pada background card, border, maupun warna teks pada komponen perenderan seksi V2. Ini mencakup class seperti `bg-slate-900`, `bg-rose-950`, `text-amber-400`, `text-rose-300`, `text-emerald-300`, `text-amber-100`, `text-rose-100`, dll.
- **WAJIB SINKRON 100%**: Setiap pengeditan perenderan seksi di `wuzzkang-lp/templates/` wajib disinkronkan identik ke `wuzzkang-dashboard/public/preview/templates/`.
- Perubahan pada warna UI dashboard **WAJIB** menggunakan CSS variable tokens (`bg-theme-bg`, `bg-theme-surface`, `bg-theme-card`, `border-theme-border`, `text-theme-text`, `bg-theme-accent`).

**📌 Peta Semantik Key `theme` Object (dari `getSectionStyle`):**

| Elemen | Key Wajib | Output (Compound?) |
|--------|-----------|--------------------|
| Judul section `<h2>` | `${theme.heading}` | Text only ✅ |
| Subtitle / desc section | `${theme.subtitle}` | Text only ✅ |
| Judul dalam card `<h3>` | `${theme.cardTitle}` | Text only ✅ |
| Desc muted dalam card | `${theme.cardDesc}` | Text only ✅ |
| Container/border card | `${theme.cardBg}` | Compound (bg+border) |
| Pill badge (bg+text+border) | `${theme.badge}` | Compound (bg+text+border) |
| Tombol CTA utama | `${theme.btnPrimary}` | Compound |
| Tombol outline/sekunder | `${theme.btnSecondary}` | Compound |
| **Accent text ONLY** (label, tanggal, caption, dekoratif ✦) | `${theme.topLine.replace('bg-', 'text-')}` | Text only ✅ |
| Lingkaran nomor (numbered circle `div` bulat) | `${theme.cardNum}` | Compound (bg+text+shadow) ⛔ jangan pada `<span>` |

> ⚠️ **CRITICAL — Jangan salah gunakan `theme.cardNum` dan `theme.badge`**:
> - `${theme.cardNum}` = `bg-emerald-500 text-white shadow-emerald-500/20` → muncul **background** jika dipakai di `<span>` teks biasa!
> - `${theme.badge}` = `bg-rose-500/10 text-rose-400 border-rose-500/20` → muncul **background+border** jika dipakai di teks polos!

### 1.5 Penggunaan Terpusat File Konfigurasi Branding (`BRAND_NAME`, `BRAND_DOMAIN`)
- **DILARANG KERAS** melakukan hardcoding nama brand (misalnya menuliskan string `"Siluet"`, `"Wuzzkang"`, dll) secara langsung pada komponen UI, halaman dashboard, maupun landing page.
- **WAJIB MENGGUNAKAN CONFIG**: Seluruh elemen visual publik (nama brand, domain publik, email dukungan, copyright footer) wajib mengimpor dan mengonsumsi konstanta konfigurasi terpusat (misal `BRAND_NAME`, `BRAND_DOMAIN` dari `@/config/branding`).
- Hal ini bertujuan agar perubahan nama brand atau domain publik di masa depan dapat dilakukan dengan sangat mudah dan instan dari satu titik pusat tanpa risiko regresi kode.

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
