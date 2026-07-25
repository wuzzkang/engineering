---
name: wuzzkang-ai-platform-compiler
description: Standard Operating Procedure (SOP) untuk pengembangan dan pemeliharaan AI Platform Wuzzkang (Task Compilers, BullMQ Worker, Provider Registry, Redis Caching MD5, & Wallet Deduct/Refund).
---

# SOP AI Platform & Task Compiler — Wuzzkang Ecosystem

Dokumen ini adalah acuan teknis bagi AI Assistant dan Engineer saat membuat task compiler AI baru, memodifikasi alur antrean asinkron (BullMQ), mengonfigurasi provider AI, atau mengelola billing kuota/saldo wallet.

---

## 🎯 1. Arsitektur AI Platform (Registry Pattern)

Sistem AI Platform Wuzzkang mengadopsi pola *Adapter & Registry* berbasis eksekusi asinkron:

```text
[ Dashboard / Client ]
        │
        ▼ POST /api/v1/ai/execute
[ AIOrchestrationService ]
        │
        ├── TaskCompilerRegistry ──> [ Domain Compiler ] (e.g. WeddingTaskCompiler)
        ├── ProviderRegistry     ──> [ AI Provider ] (e.g. GeminiProvider / Sumopod)
        └── BullMQQueueAdapter   ──> [ Redis Queue ] ──> [ aiTaskWorker.js ]
                                                               │
                                                               ▼
                                                      [ Supabase Storage ]
```

---

## 🛠️ 2. Komponen Utama & Tanggung Jawab

1. **Task Compiler (`TaskCompilerRegistry`)**:
   - Berlokasi di `wuzzkang-api/src/services/ai-platform/compilers/`.
   - Mengubah input terstruktur dari user menjadi prompt multimodal dan JSON skema yang dikenali AI.
   - Menggunakan model default: `targetModel: 'gemini-2.5-flash'`.
2. **AI Service Provider (`ProviderRegistry`)**:
   - Berlokasi di `wuzzkang-api/src/services/ai-platform/providers/`.
   - `GeminiProvider`: Menggunakan SDK `@google/genai` dengan timeout 60s dan safety filter.
   - `GeminiImageProvider` (Imagen 3): Menangani pengolahan/pembuatan gambar dengan fallback otomatis.
3. **Worker & Storage Adapter**:
   - `aiTaskWorker.js`: Memproses job antrean dari BullMQ.
   - `SupabaseStorageProvider`: Mengunggah hasil gambar olahan AI ke Supabase Storage (MIME validation, max 10MB).

---

## 💰 3. Billing, Caching & Fallback Safeguards

### 3.1 Kuota Harian & Deduct Saldo Wallet
1. Sistem memeriksa sisa kuota harian via Redis key: `wuzzkang:user:${userId}:ai_field_limit:${today}`.
2. Jika kuota harian gratis masih ada, request dijalankan **GRATIS**.
3. Jika kuota harian habis:
   - Cek saldo wallet pengguna (`profiles.balance`).
   - Saldo dipotong via `walletService.deductBalance`. Jika saldo tidak cukup, kembalikan `402 Payment Required`.
   - Jika job di BullMQ worker gagal dieksekusi, sistem **WAJIB** mengeksekusi *automatic refund rollback* ke wallet pengguna.

### 3.2 Redis Text Caching (Optimasi Token)
- Pada service `generateFieldContent`, hasil AI di-cache menggunakan key deterministik:
  `wuzzkang:cache:ai_field:${fieldType}:${hashMD5(sortedContext)}`
- TTL cache diset 24 jam (86400 detik). Latensi cache ~1ms (mencegah konsumsi token berulang).

---

## 📋 4. Checklist Saat Membuat AI Task Compiler Baru

- [ ] Implementasikan file `[NamaDomain]TaskCompiler.js` menginduk ke `TaskCompiler.js` di `contracts/`.
- [ ] Tentukan target model `gemini-2.5-flash`.
- [ ] Daftarkan compiler baru di `src/services/ai-platform/register.js`.
- [ ] Pastikan tidak membuat endpoint API baru (gunakan `POST /api/v1/ai/execute`).
- [ ] Verifikasi penanganan *graceful fallback* jika API key AI atau Storage bermasalah.
