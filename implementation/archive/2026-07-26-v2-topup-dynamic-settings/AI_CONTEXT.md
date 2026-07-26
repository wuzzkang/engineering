# AI Context — V2 Top Up & Fee Schedule Redesign

## Target Tasks & Scope
- Modernisasi dan penyesuaian Halaman Top Up (`wuzzkang-dashboard/src/app/topup/page.js`) dan backend list produk (`products` / fee structure).
- Mengubah tampilan "Informasi Biaya & Tarif Layanan" dari list produk legacy V1 (banyak produk per template) menjadi V2 Unified Fee Schedule (1 Produk Utama Landing Page + Tarif Layanan Ekosistem V2 seperti Subdomain, Edit Kuota, AI Draf, Hosting).

## File Targets
- `wuzzkang-dashboard/src/app/topup/page.js` — Redesign card & list "Informasi Biaya & Tarif Layanan" di Dashboard Topup.
- `wuzzkang-api/src/routes/product.route.js` / `wuzzkang-api/src/services/supabase.service.js` — Penyesuaian response produk jika diperlukan agar selaras dengan V2.
- `wuzzkang-engineering/docs/02_CURRENT_STATE.md` — Sinkronisasi dokumentasi state V2 TopUp.

## Session Context
- V1: Setiap tipe template (wedding, birthday, toko-online, campaign, cv, e-course, jasa) merupakan produk terpisah di DB dengan harga berbeda.
- V2: Sistem telah bersatu menggunakan V2 Modular Section Builder. Publikasi landing page dihitung secara terpadu (Unified Rate), disertai tarif fitur ekosistem V2 (AI Copywriting, Hosting, Subdomain, Kuota Edit).
