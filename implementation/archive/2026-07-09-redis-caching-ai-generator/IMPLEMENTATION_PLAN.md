# Implementation Plan - Redis Caching for AI Generator

**Status:** Approved for Implementation

## Goal Description
Implement Redis caching for the AI field copywriting generator (`generateFieldContent`) to save API tokens and speed up generation time for identical inputs.

When a user requests copywriting (e.g., store description, product description) with the exact same field type and context parameters, the system will bypass the Gemini API and return the cached text result from Redis.

## User Review Required
> [!NOTE]
> **Tempat Peletakan Cache (Cache Layer)**:
> Caching akan diimplementasikan di dalam fungsi `generateFieldContent` pada [ai.service.js](file:///home/bms-del112/BMS/personal-project/wuzzkang/wuzzkang-api/src/services/ai.service.js).
> * **Kenapa di sini?** Karena generator dipanggil secara asinkron lewat BullMQ worker (`textWorker.js`). Dengan menaruh cache di sini, backend worker akan selesai memproses dalam hitungan milidetik (Cache Hit) tanpa mengubah alur polling frontend (`GET /api/jobs/:id/status`), sehingga sangat aman dari bug/breaking changes di sisi frontend.

---

## Proposed Changes

### wuzzkang-api

#### [MODIFY] [ai.service.js](file:///home/bms-del112/BMS/personal-project/wuzzkang/wuzzkang-api/src/services/ai.service.js)
* Import `getRedisClient` dari `../utils/redis.js`.
* Buat helper `generateCacheKey(fieldType, context)` untuk membuat key unik dari stringify/hash context.
* Di dalam `generateFieldContent`:
  1. Cek keberadaan data di Redis dengan cache key.
  2. Jika ada, parse dan kembalikan datanya langsung.
  3. Jika tidak ada, jalankan pemanggilan Gemini API seperti biasa.
  4. Simpan hasil sukses ke Redis dengan TTL (Time To Live) tertentu (default: 24 jam / 86400 detik).

---

## Verification Plan

### Automated Tests
* Menjalankan unit test/testing script di lokal untuk memverifikasi pencocokan cache.

### Manual Verification
1. Lakukan generate deskripsi produk/toko melalui dashboard untuk pertama kali. Amati logs di terminal backend (`textWorker` memanggil Gemini API).
2. Lakukan generate kembali dengan input yang persis sama. Amati logs di terminal backend (`textWorker` mengambil dari cache Redis instan).
