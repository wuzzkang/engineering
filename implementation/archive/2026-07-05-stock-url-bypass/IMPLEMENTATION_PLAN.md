# Implementation Plan: Resilient Stock URL Fallback (Bypass Supabase Upload)

## Status: Approved for Implementation

Mengoptimalkan alur fallback prewedding image. Jika gambar didapatkan dari stock photo Unsplash (bukan hasil generate AI), kita langsung mengembalikan URL Unsplash tersebut ke frontend tanpa melakukan download buffer dan upload ke Supabase Storage.

## Proposed Changes

### Milestone 1 — Provider & Route Updates

#### [MODIFY] `src/services/ai-platform/providers/GeminiProvider.js`
- Update return type `generateImage`: kembalikan objek `{ type: 'buffer'|'url', data: Buffer|string }`.
- Untuk Imagen & OpenAI DALL-E: return `{ type: 'buffer', data: Buffer }`.
- Untuk Unsplash Stock Fallback:
  - Kirim request `HEAD` (ringan, tanpa body) ke Unsplash URL untuk memverifikasi link aktif (200 OK).
  - Jika aktif, return `{ type: 'url', data: url }`.

#### [MODIFY] `src/routes/prewedding.route.js`
- Terima hasil `{ type, data }` dari `generateImage`.
- Jika `type === 'url'`: bypass upload ke Supabase, langsung simpan dan kembalikan URL stock.
- Jika `type === 'buffer'`: upload buffer JPEG ke Supabase Storage seperti biasa.
