# 🚀 Panduan Deployment — Wuzzkang

Dokumen ini merinci arsitektur deployment fisik, variabel lingkungan (environment variables), serta langkah-langkah untuk mendeploy ketiga repositori Wuzzkang (`wuzzkang-api`, `wuzzkang-dashboard`, dan `wuzzkang-lp`) ke lingkungan produksi.

---

## 1. Topologi Deployment Produksi

Wuzzkang berjalan di atas infrastruktur terdistribusi cloud untuk performa optimal dan efisiensi biaya:

*   **`wuzzkang-dashboard`**: Dideploy ke **Vercel** atau **Amplify** (Next.js serverless runtime).
*   **`wuzzkang-api`**: Dideploy ke **Railway** atau **Render** (Node.js VPS/PaaS container, terhubung ke Redis).
*   **`wuzzkang-lp`**: Dideploy ke **GitHub Pages** (Hosting HTML/JS statis, performa cepat dengan CDN global gratis).
*   **Database & Storage**: Di-host di **Supabase Cloud** (PostgreSQL + GoTrue Auth + Storage Bucket).

---

## 2. Spesifikasi Konfigurasi (.env)

Setiap lingkungan memerlukan variabel lingkungan spesifik yang harus dikonfigurasi sebelum deployment.

### 2.1 Backend API (`wuzzkang-api`)
Konfigurasi file `.env` di server produksi:

```bash
# Server Port
PORT=3026
NODE_ENV=production

# Supabase Credentials
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsIn...  # anon key (digunakan untuk verifikasi JWT user)
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsIn... # service role key (bypass RLS — hanya untuk operasi server)

# Admin Security — WAJIB diisi, tidak boleh menggunakan nilai default
ADMIN_SECRET_KEY=<random-uuid-atau-string-minimal-32-karakter>

# Redis Connection
REDIS_URL=redis://default:password@host:port

# AI Text Configuration
AI_PROVIDER=sumopod # groq | sumopod
AI_TEXT_MODEL=meta-llama/llama-4-maverick:free
GROQ_API_KEY=gsk_...
SUMOPOD_API_KEY=sp_...

# AI Image Configuration
IMAGE_AI_PROVIDER=openai # openai | sumopod
IMAGE_AI_MODEL=gpt-image-1
OPENAI_API_KEY=sk-proj-...

# External Image Processing
REMOVE_BG_API_KEY=your-remove-bg-key
REPLICATE_API_TOKEN=r8_...

# Payment Gateway (Winpay)
WINPAY_PARTNER_ID=your-partner-id
WINPAY_BASE_URL=https://api.winpay.id/snap
```

### 2.2 Dashboard UI (`wuzzkang-dashboard`)
Konfigurasi file `.env.production` untuk build build-time:

```bash
# Target API URL
NEXT_PUBLIC_API_URL=https://api.wuzzkang.com/api

# Supabase Public Client Credentials (Subject to RLS)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5...

# Image Upload Configuration (Client Compression)
NEXT_PUBLIC_IMAGE_MAX_WIDTH=800
NEXT_PUBLIC_IMAGE_MAX_HEIGHT=800
NEXT_PUBLIC_IMAGE_QUALITY=0.8
NEXT_PUBLIC_MAX_IMAGE_SIZE_KB=300
```

### 2.3 Landing Page (`wuzzkang-lp`)
Tidak menggunakan file `.env` karena berupa static HTML. Kredensial dimasukkan langsung pada konfigurasi script.js atau file aset publik:
*   **Supabase URL & Anon Key**: Dikonfigurasi langsung di dalam `wuzzkang-lp/script.js` pada inisialisasi client:
    ```javascript
    const supabaseUrl = 'https://your-project.supabase.co';
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5c...';
    ```

---

## 3. Langkah-Langkah Deployment

### 3.1 Langkah 1: Migrasi Database (Supabase)
Sebelum mendeploy backend, pastikan database Supabase sudah diinisialisasi:
1. Buka dashboard Supabase Anda.
2. Jalankan berkas SQL migrasi schema (dari `wuzzkang-api` atau backup remote schema) di SQL Editor Supabase.
3. Pastikan RPC function `deduct_user_balance` dan trigger `on_auth_user_created` sudah terdaftar dan aktif.
4. Buat bucket penyimpanan publik baru bernama `wuzzkang-bucket` di menu Storage.

### 3.2 Langkah 2: Deploy Backend API (`wuzzkang-api`)

#### Opsi A: Deploy ke Railway / PaaS Cloud
1. Hubungkan akun GitHub Anda ke Railway.
2. Buat project baru dan pilih repositori `wuzzkang-api`.
3. Masukkan seluruh variabel lingkungan dari Bagian 2.1 ke tab **Variables**.
4. Railway akan mendeteksi `start` script di `package.json` secara otomatis dan menjalankan server di port yang diberikan (`PORT`).

#### Opsi B: Deploy ke VPS Mandiri (Self-Hosted via PM2 & Docker)
Jika Anda menggunakan server VPS berbasis Linux (Ubuntu/Debian), gunakan metode **Semi-Dockerized** dengan **PM2** untuk efisiensi RAM dan skalabilitas optimal:

1. **Persiapan Perangkat Lunak di VPS:**
   * Pasang **Docker & Docker Compose** (untuk menjalankan container Redis).
   * Pasang **Node.js (versi 22)** & **Nginx** (sebagai Reverse Proxy & SSL).
   * Pasang PM2 secara global: `npm install -g pm2`

2. **Kloning Proyek & Pasang Dependensi:**
   ```bash
   git clone <URL_REPOSITORI_WUZZKANG_API> wuzzkang-api
   cd wuzzkang-api
   npm install --omit=dev
   ```

3. **Konfigurasi Variabel Lingkungan (.env):**
   Buat file `.env` di root folder proyek: `nano .env`
   Masukkan konfigurasi produksi, pastikan diisi dengan:
   ```env
   PORT=3026
   REDIS_URL=redis://localhost:6379
   ENABLE_BG_WORKER=true
   ```

4. **Nyalakan Layanan Redis lokal (Docker):**
   ```bash
   docker compose up -d
   ```
   *Perintah ini akan menyalakan container Redis 7 secara latar belakang menggunakan berkas [docker-compose.yml](file:///home/bms-del112/BMS/personal-project/wuzzkang/wuzzkang-api/docker-compose.yml).*

5. **Jalankan Backend Server API (PM2):**
   ```bash
   pm2 start server.js --name "wuzzkang-api"
   ```
   *Express API sekarang aktif dan dipantau oleh PM2. Untuk melihat log aktivitas: `pm2 logs`.*

6. **Konfigurasi Reverse Proxy Nginx & SSL:**
   Konfigurasi Nginx proxy_pass di `/etc/nginx/sites-available/default` untuk memetakan port `3026` ke domain HTTPS Anda (menggunakan Let's Encrypt / Certbot).

### 3.3 Langkah 3: Deploy Runtime Renderer (`wuzzkang-lp`)
Mendeploy ke **GitHub Pages**:
1. Buat repositori baru di GitHub khusus untuk `wuzzkang-lp` (atau gunakan fitur custom domain / branch).
2. Pastikan file `wuzzkang-lp/script.js` sudah menggunakan URL Supabase produksi.
3. Masuk ke setelan repositori GitHub -> **Pages**.
4. Di bagian Build and deployment, pilih source: **Deploy from a branch** (pilih branch `main` / root).
5. Simpan. Halaman runtime akan aktif di alamat `https://username.github.io/wuzzkang-lp` atau custom domain `https://siluet.web.id`.

### 3.4 Langkah 4: Deploy Dashboard (`wuzzkang-dashboard`)
Mendeploy ke **Vercel**:
1. Pastikan Anda sudah menjalankan perintah `npm run sync:templates` untuk menyalin aset template terbaru ke Next.js.
2. Hubungkan repositori GitHub `wuzzkang-dashboard` ke Vercel.
3. Masukkan seluruh variabel lingkungan Next.js dari Bagian 2.2 ke tab **Environment Variables** di Vercel.
4. Klik **Deploy**. Vercel akan mem-build halaman Next.js dan meluncurkannya ke URL publik produksi (e.g., `https://dashboard.wuzzkang.com`).

---

## 4. Verifikasi Pasca-Deployment

Setelah semua komponen aktif, lakukan pengecekan berikut:
1.  Buka dashboard Next.js, buat akun baru, dan pastikan baris profil baru otomatis terbuat di tabel `profiles` Supabase (wallet balance awal Rp 0).
2.  Lakukan simulasi pembuatan landing page di editor dashboard, panggil fitur "Generate AI", dan pastikan kuota gratis berkurang secara real-time.
3.  Simpan proyek sebagai draft, kemudian publikasikan halaman. Pastikan live URL terbentuk (e.g. `https://siluet.web.id/?slug=nama-slug-anda`) dan halaman tersebut menampilkan template pilihan secara akurat di browser.

---

## 5. Catatan Keamanan Wajib (Security Notes)

> ⚠️ **Jangan pernah commit file `.env` ke repository Git.** Pastikan `.env` selalu ada di `.gitignore`.

### 5.1 Penggunaan Supabase Key

| Key | Digunakan Oleh | Fungsi |
|-----|---------------|--------|
| `SUPABASE_ANON_KEY` | `auth.middleware.js` | Verifikasi JWT token user biasa |
| `SUPABASE_SERVICE_KEY` | `supabase.service.js`, `admin.service.js`, dll. | Operasi database server-side (bypass RLS) |

> ⚠️ **`SUPABASE_SERVICE_KEY` bersifat super-admin** — jika bocor, orang lain dapat membaca/mengubah seluruh data. Segera rotate jika ada indikasi kebocoran.

### 5.2 `ADMIN_SECRET_KEY`

- Nilai ini wajib diisi dan tidak boleh menggunakan nilai default.
- Gunakan UUID acak atau string panjang minimal 32 karakter.
- Digunakan sebagai fallback verifikasi manual pembayaran di endpoint `/api/admin/payments/:id/complete`.

### 5.3 Rate Limiting

API sudah dilengkapi rate limiter berbasis Redis:
- **Global**: 500 request per 15 menit per IP/User untuk semua endpoint `/api`.
- **AI Routes**: 10 request per menit untuk `/api/generate`, `/api/generate-image`, dan `/api/ai-platform`.

Limit ini dapat disesuaikan di [`server.js`](file:///home/bms-del112/BMS/personal-project/wuzzkang/wuzzkang-api/server.js) bagian Rate Limiters.

### 5.4 CORS

API menggunakan strict CORS allowlist. Tambahkan domain baru ke array `allowedOrigins` di [`server.js`](file:///home/bms-del112/BMS/personal-project/wuzzkang/wuzzkang-api/server.js) jika ada domain frontend baru yang perlu diizinkan akses API.
