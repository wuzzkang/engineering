---
name: wuzzkang-product-template-generator
description: Standard Operating Procedure (SOP) untuk menambah Produk atau Template Landing Page baru ke sistem Wuzzkang (Dashboard, Renderer, AI Task Compiler, ImagePickerField, & Database Credit).
---

# SOP Product & Template Generator — Wuzzkang Ecosystem

Dokumen ini adalah panduan standar bagi AI Assistant dan Engineer ketika menambah produk/template baru atau memigrasikan template ke ekosistem Wuzzkang AI Platform.

---

## 🎯 1. Prinsip Utama Penambahan Produk/Template

1. **Dilarang Bypass AI Platform**: Semua produk/template baru **WAJIB** menggunakan `TaskCompiler` di `wuzzkang-api/src/services/ai-platform/compilers/` dan diproses secara asinkron via `POST /api/v1/ai/execute` (BullMQ queue).
2. **Sistem Credit (Bukan Rupiah IDR)**: Kolom `cost` pada tabel database `products` merepresentasikan **satuan Credit** (misal: `150` Credit), **DILARANG** memasukkan nominal Rupiah langsung (seperti `15000`).
3. **Reuse Komponen UI**:
   - Dilarang membuat custom file uploader baru di dashboard; wajib reuse `<ImagePickerField>` di `wuzzkang-dashboard/src/components/ImagePickerField.js`.
   - Gunakan komponen template reusable di `templates/components/` (`ImageSlider.js`, `WishesBoard.js`).

---

## 🛠️ 2. Skenario Penambahan & Checklist

### Skenario A: Menambah Produk Baru dari Nol
1. **Backend Compiler**:
   - Buat `[NamaProduk]TaskCompiler.js` di `wuzzkang-api/src/services/ai-platform/compilers/`.
   - Implementasikan fungsi `compile()` dengan `targetModel: 'gemini-2.5-flash'`.
   - Daftarkan compiler baru di `src/services/ai-platform/register.js` dengan key task type (misal: `'khitanan'`).
2. **Dashboard Integration**:
   - Tambahkan tipe produk baru ke form generator di `wuzzkang-dashboard/src/app/generate/page.js`.
   - Susun payload `executePayload` dan kompilasi `compiledPageData`.
3. **Database Migration**:
   - Masukkan record produk ke tabel `products` dengan harga `cost` dalam satuan **Credit**.

### Skenario B: Menambah Template/Style Baru ke Produk yang Ada
1. Buka `TaskCompiler` produk terkait (contoh: `WeddingTaskCompiler.js`).
2. Tambahkan entry baru pada objek `STYLE_DESCRIPTORS` dengan key style baru (misal: `'javanese-traditional'`).
3. Isi descriptor meliputi: `name`, `tone`, `language_style`, `visual_elements`, dan `example_quote`.

### Skenario C: Tombol AI Assist per Kolom Input (Per Field)
1. Daftarkan nama `fieldType` baru di `GenerateFieldRequestSchema.fieldType` (`wuzzkang-api/src/routes/generator.route.js`).
2. Tambahkan prompt builder di `generateFieldContent` di `wuzzkang-api/src/services/ai.service.js`.
3. Tambahkan handler `handleAI[Produk]Assist` di dashboard frontend.

---

## 📋 3. Endpoint Terkait (Tersedia / Do Not Re-create)

- `POST /api/v1/ai/execute`: Submit task AI platform baru (async BullMQ).
- `GET /api/v1/ai/task/:id`: Polling status task AI platform.
- `POST /api/generate/field`: Generate per-field eceran (Gemini).
- `GET /api/jobs/:jobId/status`: Polling status text queue.
