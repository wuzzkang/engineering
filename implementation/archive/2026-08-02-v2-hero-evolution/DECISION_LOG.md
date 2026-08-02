# Technical Decision Log — Hero Section Options Evolution

## Decision 1: Strict User Data Rendering (0% Forced Fallbacks)
- **Context**: `wuzzkang-lp/script.js` had hardcoded text strings (e.g. `|| '🚀 Garansi 100% Puas...'` or `|| '⭐️ 4.9/5 dari 1,200+ Klien Puas'`) that rendered mock values even when fields were cleared in the Editor.
- **Decision**: All V2 section renderers in `wuzzkang-lp/script.js` must strictly check `if (field)` and render nothing when empty, mirroring the V2 Editor Canvas behavior.

## Decision 2: Centralized Image Picker Integration
- **Context**: V2 section forms needed Unsplash stock image search, file upload, and direct URL input.
- **Decision**: Standardized all image fields to use `V2ImagePickerWidget.jsx` with Bearer token authentication headers attached to `/api/media/process` and `/api/media/upload-url`.

## Decision 3: Single Canvas Iframe Registry (`main.jsx`)
- **Context**: Adding a new section type requires registering its React renderer in `wuzzkang-sections/apps/preview-app/src/main.jsx` under `RENDERER_REGISTRY`.
- **Decision**: Ensure every new section type ID (e.g., `hero-centered`) is imported and mapped in `main.jsx` to prevent "does not have a registered renderer" warnings on the V2 Builder Canvas.

## Decision 4: V2ImagePickerWidget sebagai Universal Upload Standard
- **Date**: 2026-08-02
- **Context**: `hero-split/EditorForm.jsx` menggunakan ~150 baris custom DIY image upload code. `hero-centered` sudah pakai `V2ImagePickerWidget`. Terdapat inkonsistensi dan duplikasi logika upload di seluruh section.
- **Decision**: `V2ImagePickerWidget` ditetapkan sebagai **satu-satunya** komponen upload gambar untuk semua kebutuhan apapun di V2. Tidak boleh ada section baru atau existing section yang mengimplementasikan upload logika sendiri. Berlaku retroaktif — semua section lama yang masih custom wajib di-refactor.
- **Impacted files**: `hero-split/EditorForm.jsx` (refactored), `.cursorrules` (rule ditambahkan), `.clinerules` (mirrored).

## Decision 5: V2ImagePickerWidget Delete Harus Hapus File di Supabase
- **Date**: 2026-08-02
- **Context**: Ditemukan bug kritis — tombol "✕ Hapus Foto" hanya clear UI state lokal, tidak memanggil `DELETE /api/media`. File di Supabase Storage tidak terhapus (storage leak).
- **Decision**: Tombol hapus dan setiap penggantian gambar (upload baru, pilih Unsplash, paste URL) WAJIB memanggil `DELETE /api/media` dengan `storagePath` terlebih dahulu. Prop `storagePath` ditambahkan ke API `V2ImagePickerWidget`. Panggilan delete bersifat non-blocking (UI tetap dibersihkan meski API gagal).
- **Pattern**: `_deleteOldStorageFile()` dipanggil sebelum: (1) upload file baru, (2) fetch Unsplash, (3) paste URL baru (onBlur).

## Decision 6: aiQuota — Single Source of Truth untuk Lua Quota Logic
- **Date**: 2026-08-02
- **Context**: `image.route.js` memiliki Lua atomic quota script yang terduplikasi di 2 lokasi (endpoint `/generate-image` dan mode `generate_avatar` di `/media/process`). Duplikasi ini rawan tidak sinkron saat ada perubahan logika quota.
- **Decision**: Semua logika daily AI quota enforcement dipusatkan ke `src/utils/aiQuota.js` dengan fungsi `checkAndIncrementDailyQuota(userId, dailyLimit)`. Tidak boleh ada route atau service lain yang mengimplementasikan Lua quota check sendiri.

## Decision 7: 2 Redis Connection Terpisah (BullMQ Isolation)
- **Date**: 2026-08-02
- **Context**: Ada 2 singleton Redis di codebase: `getRedisClient()` di `utils/redis.js` dan `getRedisConnection()` di `queues/queue.js`. Ini terlihat seperti duplikasi tapi bukan.
- **Decision**: Kedua koneksi WAJIB terpisah dan tidak boleh digabung. BullMQ menggunakan blocking Redis commands (`BRPOP`, `BLPOP`) yang memonopoli koneksi. Jika BullMQ berbagi koneksi dengan cache/quota, semua operasi Redis lain akan terblokir dan menyebabkan timeout. `utils/redis.js` untuk operasi umum (cache, quota, rate-limiter). `queues/queue.js` khusus BullMQ.

## Decision 8: Fullscreen Video Background Hero (`hero_video` / `hero-video`)
- **Date**: 2026-08-02
- **Context**: Kebutuhan Hero Section ketiga dengan fokus pada presentasi video fullscreen / penawaran tinggi.
- **Decision**: Implementasi `hero_video` / `hero-video` dengan fitur: (1) Auto-convert URL YouTube (watch, shorts, youtu.be) & Vimeo ke URL Embed autoplay/muted/loop/no-controls; (2) Fallback ke `thumbnailUrl` (via `V2ImagePickerWidget`) jika video tidak diisi/tidak load; (3) Kontrol intensitas overlay gelap (opacity 0.00–1.00); (4) Trust badge, headline, subheadline, dan CTA button.

## Decision 9: Global Page Canvas Width Control (Layout.canvas.width)
- **Date**: 2026-08-02
- **Context**: Pengaturan lebar bukan per-section individual, melainkan pembungkus canvas web secara keseluruhan (Page Canvas Width). Semua section di dalam halaman secara alami mengikuti lebar canvas tersebut.
- **Decision**: Menambahkan switcher **📐 Lebar Canvas Web (Page Canvas Width)** di `DesignSystemCustomizer.jsx` (Global Design System Panel) dengan 3 pilihan mode:
  - `Full Width (100%)`: `width: 100%; max-width: 100%; margin: 0 auto; border-radius: 0;` (Canvas penuh layar)
  - `Standard Container (90%)`: `width: 90%; max-width: 1200px; margin: 24px auto; border-radius: 16px; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25);` (Canvas card melayang terpusat)
  - `Compact Boxed (75%)`: `width: 75%; max-width: 960px; margin: 24px auto; border-radius: 24px; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25);` (Canvas boxed rapat terpusat)
- **Implementation**: Mengatur pembungkus utama `.wuzzkang-preview-container > div` di `preview-app/src/main.jsx` dan `.wuzzkang-page-canvas` di `wuzzkang-lp/script.js`. Semua section (hero-video, hero-split, features-grid, dll) 100% mengikuti canvas ini.

## Decision 10: Fix Blank White Page pada `wuzzkang-lp` (Missing Scope Variables & Unhandled Async)
- **Date**: 2026-08-02
- **Context**: `wuzzkang-lp` menampilkan halaman putih polos (blank white) saat memuat halaman dengan section `hero-video`.
- **Root Cause**:
  1. Di dalam `case 'hero-video'` pada `wuzzkang-lp/script.js`, elemen tombol CTA memanggil `${heroBtnAttr}` yang belum dideklarasikan di dalam lexical scope `hero-video`. Hal ini menyebabkan JavaScript melempar `ReferenceError: heroBtnAttr is not defined` secara runtime.
  2. Fungsi `renderPage` dipanggil tanpa keyword `await` (`renderPage(pageConfig)` alih-alih `await renderPage(pageConfig)`), sehingga error tidak tertangkap oleh blok `try...catch`, sementara blok `finally` langsung menyembunyikan loading spinner dan meninggalkan `appEl` kosong.
- **Fix**:
  1. Mendeklarasikan `const heroBtnColor = styles.buttonColor || '#6366F1';` dan `const heroBtnAttr = style="background-color: ${heroBtnColor}; color: #FFFFFF;";` di dalam lexical scope `case 'hero-video'` pada `wuzzkang-lp/script.js`.
  2. Mengubah pemanggilan menjadi `await renderPage(pageConfig);` di dalam event handler `DOMContentLoaded`.
  3. Menjalankan `npm run sync:templates` untuk memperbarui pratinjau landing page di dashboard.



