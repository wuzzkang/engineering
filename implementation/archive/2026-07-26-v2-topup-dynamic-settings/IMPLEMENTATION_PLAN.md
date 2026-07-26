# Implementation Plan — Penyesuaian & Redesign Halaman Top Up V2 (100% Dynamic DB System Settings)

## Status: Approved for Implementation

## Summary Proposal & Analysis
Sesuai instruksi pengguna, seluruh informasi biaya dan pengaturan sistem (System Settings) pada halaman Top Up (`/topup`) **100% Wajib diambil dari Database (Dynamic)** dan **TIDAK BUKAN HARDCODED**.

Variabel yang diambil secara dinamis dari DB meliputi:
1. **Harga Publikasi Landing Page / Website**: Diambil dari tabel `products` (`cost` & `unit`).
2. **Kuota Edit Gratis**: Diambil dari `system_settings` (`max_project_edits`).
3. **Biaya Edit Berbayar (Setelah Kuota Habis)**: Diambil dari `system_settings` (`project_edit_cost`).
4. **Biaya Klaim Subdomain Kustom**: Diambil dari `system_settings` (`subdomain_pricing`).
5. **Penyusunan & Penulisan AI**: Diambil dari `system_settings` (`ai_generate_cost`).
6. **Rate Konversi Kredit (IDR)**: Diambil dari profil user (`credit_price_idr`).

---

## Technical Recommendations & Changes

### 1. Backend (`wuzzkang-api`):
- Menambahkan endpoint `GET /api/system-settings` pada [wuzzkang-api/src/routes/product.route.js](file:///home/bms-del112/BMS/personal-project/wuzzkang/wuzzkang-api/src/routes/product.route.js) (atau route terdedikasi) untuk mengembalikan seluruh nilai key-value dari tabel `system_settings` kepada user terautentikasi.

### 2. Frontend (`wuzzkang-dashboard`):
- Pada [wuzzkang-dashboard/src/app/topup/page.js](file:///home/bms-del112/BMS/personal-project/wuzzkang/wuzzkang-dashboard/src/app/topup/page.js):
  - Memanggil `GET /api/system-settings` bersamaan dengan `GET /api/products`.
  - Menggantikan seluruh teks/angka hardcoded pada accordion "Informasi Biaya & Tarif Layanan" dengan state dinamis yang didapatkan dari API (`systemSettings` & `products`).
  - Menampilkan loading skeleton / state jika data sistem sedang dimuat.

---

## Target File Modifications

### Backend API:
- `wuzzkang-api/src/routes/product.route.js` — Menambahkan endpoint `GET /api/system-settings`.

### Dashboard Frontend:
- `wuzzkang-dashboard/src/app/topup/page.js` — Mengintegrasikan fetch `system-settings`, menghilangkan seluruh angka hardcoded, dan meredesign card Informasi Biaya V2 secara dinamis.

### Documentation:
- `wuzzkang-engineering/docs/02_CURRENT_STATE.md` & `docs/05_API_SPECIFICATION.md` — Menyamakan dokumentasi API dan state TopUp.

---

## Verification Plan

### Automated Verification:
- Run `npm run build` di `wuzzkang-dashboard` & `wuzzkang-api` untuk memastikan zero lint error.

### Manual UI & API Verification:
- Memverifikasi endpoint `GET /api/system-settings` via cURL / browser.
- Membuka rute `/topup` di dashboard, memverifikasi nilai biaya berubah secara dinamis jika record di `system_settings` / `products` diubah.
