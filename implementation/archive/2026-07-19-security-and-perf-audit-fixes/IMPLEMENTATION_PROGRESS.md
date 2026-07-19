# Laporan Audit & Perbaikan API Wuzzkang

- [x] **BUG-01 (Kritis) · Redis Rate Limiter Key Leak**: Memperbaiki pipeline `INCR` + `PEXPIRE` secara atomik untuk mencegah key memori bocor selamanya.
- [x] **BUG-02 (Kritis) · Redis AI Daily Counter**: Mengimplementasikan atomic Lua script check-and-increment untuk mencegah *race condition* gratisan, serta mengatur expire tepat di tengah malam UTC.
- [x] **BUG-03 (Kritis) · Storage Orphan JSON**: Membersihkan file config JSON hasil AI (`ai-results/*.json`) beserta record data `ai_tasks` di database saat proyek dihapus user.
- [x] **BUG-04 (Kritis) · Double Charge Lock**: Menerapkan Redis distributed lock (`wuzzkang:lock:project_deploy:${projectId}`) berdurasi 30 detik untuk memblokir klik ganda deployment yang berpotensi memotong saldo ganda.
- [x] **BUG-07 (Tinggi) · Double Refund Protection**: Enforce unique `orderId` (idempotency key) untuk semua transaksi refund di seluruh background worker (deploy, AI task, image, text) demi mencegah pengisian saldo ganda saat job gagal me-retry.
- [x] **BUG-08 (Tinggi) · Dynamic Cost Refund**: Mengganti hardcoded refund `10000` di `deployWorker` menjadi pencarian dinamis nominal biaya asli menggunakan query helper `getDeploymentTransactionAmount`.
- [x] **BUG-09 (Tinggi) · Winpay unique customerNo**: Membuat generator ID pelanggan SNAP API yang unik dan 100% numerik dari hashing UUID user, merapikan data invoice di gateway.
- [x] **BUG-11 (Sedang) · Signed Upload Size Limit**: Membatasi ukuran file bertanda tangan (*signed upload URL*) maksimal `500 KB` agar sinkron dengan aturan bucket Supabase Storage Anda.
- [x] **BUG-13 (Sedang) · Cache Settings & Products**: Menerapkan in-memory cache 5 menit untuk tabel `system_settings` dan `products` guna memangkas latency backend (~200ms per request) dan menghemat pemanggilan database.
