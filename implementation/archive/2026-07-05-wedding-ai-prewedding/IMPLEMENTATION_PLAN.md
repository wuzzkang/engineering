# Implementation Plan: AI Prewedding Photo Generation (Wedding Product)

## Status: Approved for Implementation

Menambahkan fitur opsional "Generate Foto Prewedding dengan AI" pada produk Wedding.
User mencentang checkbox, dan sistem akan otomatis menghasilkan foto prewedding artistik
baru dengan menggabungkan konteks dua foto yang sudah diupload (foto mempelai pria & wanita).

---

## Technical Architecture

Gemini 2.5 Flash adalah model **text output only**. Dia bisa menerima gambar sebagai input, tapi tidak bisa menghasilkan gambar.
Oleh karena itu, kita menggunakan **Two-Step AI Pipeline**:
1. **Step 1 (Gemini 2.5 Flash):** Menganalisis visual kedua foto mempelai yang diupload, lalu menghasilkan prompt teks deskripsi scene prewedding yang detail dan artistik.
2. **Step 2 (Gemini Imagen 3):** Menggunakan prompt tersebut untuk menggenerate gambar prewedding baru via model `imagen-3.0-generate-002`.

---

## Proposed Changes

### Milestone 1 — Backend: GeminiImageProvider

#### [NEW] `src/services/ai-platform/providers/GeminiImageProvider.js`
- Mengintegrasikan model `imagen-3.0-generate-002` menggunakan SDK `@google/genai`.
- Menyediakan fungsi `generateImage(prompt)` yang me-return `Buffer` gambar.

### Milestone 2 — Backend: Endpoint Prewedding

#### [NEW] `src/routes/prewedding.route.js`
- Router Express untuk endpoint `POST /api/media/prewedding`.
- Alur:
  1. Download foto pria & wanita, konversi ke base64/inlineData.
  2. Panggil Gemini 2.5 Flash untuk generate prompt prewedding artistik.
  3. Panggil Gemini Imagen 3 untuk generate image buffer.
  4. Upload buffer ke Supabase Storage via `supabaseService.uploadWeddingAsset`.
  5. Kembalikan URL publik hasil upload.

#### [MODIFY] `src/server.js`
- Daftarkan `prewedding.route.js` di server backend.

### Milestone 3 — Frontend: Checkbox + Integrasi Dashboard

#### [MODIFY] `wuzzkang-dashboard/src/app/generate/page.js`
- Tambahkan checkbox "Generate Foto Prewedding AI" di bagian upload foto Wedding.
- Integrasikan pemanggilan API prewedding sebelum workflow generate landing page berjalan.
- Set hasil generate URL ke field `prewedding_photo_url` di content.

---

## Verification Plan

### Automated Checks
- Verifikasi backend server running tanpa crash.

### Manual Verification
- Panggil `POST /api/media/prewedding` via cURL / test script.
- Test end-to-end melalui UI Dashboard: isi foto, centang checkbox, jalankan generate, verifikasi foto prewedding terisi otomatis di preview.
