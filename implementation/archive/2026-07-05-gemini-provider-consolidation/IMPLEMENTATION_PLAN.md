# Implementation Plan: Consolidate Gemini Providers & Dynamic Models

## Status: Approved for Implementation

Menggabungkan `GeminiImageProvider` ke dalam `GeminiProvider` untuk menghindari duplikasi inisialisasi SDK, serta membuat model text (`gemini-2.5-flash`) dan image (`imagen-3.0-generate-002`) menjadi fleksibel (konfiguratif via `.env` atau parameter options).

## Proposed Changes

### Milestone 1 — Config & Provider Consolidation

#### [MODIFY] `src/config/index.js`
- Tambahkan Zod schema key untuk model default Gemini:
  - `GEMINI_TEXT_MODEL` (default: `'gemini-2.5-flash'`)
  - `GEMINI_IMAGE_MODEL` (default: `'imagen-3.0-generate-002'`)

#### [MODIFY] `src/services/ai-platform/providers/GeminiProvider.js`
- Hapus konstanta hardcoded `DEFAULT_MODEL`. Gunakan `config.GEMINI_TEXT_MODEL` sebagai default.
- Pindahkan method `generateImage(prompt, options = {})` dari `GeminiImageProvider` ke class ini.
- Di dalam `generateImage`, buat nama model Imagen menjadi dinamis:
  ```javascript
  const modelName = options.model || config.GEMINI_IMAGE_MODEL || 'imagen-3.0-generate-002';
  ```

---

### Milestone 2 — Route Update & Cleanup

#### [MODIFY] `src/routes/prewedding.route.js`
- Update import: gunakan `GeminiProvider` untuk melakukan text analysis dan image generation.
- Hapus instansiasi `GeminiImageProvider`, cukup gunakan single instans `GeminiProvider` untuk memanggil `execute` (text) dan `generateImage` (image).

#### [DELETE] `src/services/ai-platform/providers/GeminiImageProvider.js`
- Hapus file ini untuk merapikan codebase.

---

### Milestone 3 — E2E Verification

- Buat script testing standalone untuk memastikan flow backend berjalan normal setelah penggabungan class dan perubahan model dinamis.
- Verifikasi fallback Imagen 3 -> OpenAI/Sumopod/Stock tetap bekerja secara dinamic.
