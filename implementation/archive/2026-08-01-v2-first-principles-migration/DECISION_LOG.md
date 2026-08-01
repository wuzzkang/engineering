# Decision Log — Active Session

## DEC-001 — Proyek V2 Produksi Lama = Read-Only
- **Date**: 2026-08-01
- **Decision**: Proyek yang sudah published menggunakan V2 Produksi (dynamic-builder / sections[]) tidak akan bisa diedit setelah migrasi. User konfirmasi: "biarkan saja tidak bisa di edit."
- **Rationale**: Kompleksitas porting format sections[] → nodes[] terlalu tinggi, dan user tidak membutuhkannya.
- **Impact**: Auto-Redirect Router perlu detect proyek lama V2 dan tampilkan pesan "read-only / tidak dapat diedit".

## DEC-002 — Preview App Harus Serve via Next.js (Bukan Standalone :3333)
- **Date**: 2026-08-01
- **Decision**: Preview-app saat ini hardcoded ke localhost:3333 (Vite dev server terpisah). Untuk production-ready, perlu embed preview sebagai Next.js route (/preview-v2/[projectId]) atau serve static build dari public folder.
- **Rationale**: User tidak mau jalankan 2 server terpisah (next dev + vite dev). Solusi: build preview-app → copy ke wuzzkang-dashboard/public/v2-preview/ dan serve via iframe src="/v2-preview/index.html"
- **Status**: PENDING USER CONFIRMATION (apakah mau pakai embedded static build atau tetap dev server terpisah?)
