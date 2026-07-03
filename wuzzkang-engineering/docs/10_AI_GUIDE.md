# 🤖 Panduan Integrasi & Mekanisme AI Wuzzkang

Dokumen ini merinci seluruh integrasi kecerdasan buatan (AI) di platform Wuzzkang, mencakup konfigurasi sistem, asisten copywriting teks, pemrosesan media/gambar terpadu, mekanisme billing kuota/saldo, serta alur penanganan kegagalan (*graceful fallback*).

---

## 1. Arsitektur Layanan AI

Wuzzkang mengintegrasikan beberapa penyedia layanan AI pihak ketiga yang dikelola secara terpusat di backend:

```
                  ┌──────────────────────────────┐
                  │       Wuzzkang Backend       │
                  └──────────────┬───────────────┘
                                 │
         ┌───────────────────────┼───────────────────────┐
         ▼                       ▼                       ▼
   [ AI Text ]              [ AI Image ]         [ Image Processing ]
   - Groq API               - OpenAI DALL-E      - Remove.bg API
   - Sumopod API            - Sumopod Image      - Replicate AI prediction
```

---

## 2. Konfigurasi AI Dinamis (.env)

Seluruh setelan model dan provider AI dapat dikonfigurasi secara independen melalui variabel lingkungan (`.env`):

### A. Konfigurasi Teks (Copywriting & Page Builder)
*   `AI_PROVIDER`: Menentukan provider teks aktif. Pilihan: `groq` atau `sumopod` (default: `sumopod`).
*   `AI_TEXT_MODEL`: Menentukan model teks chat completion kustom (opsional).
    *   *Default Fallback Groq*: `llama-3.3-70b-versatile`
    *   *Default Fallback Sumopod*: `meta-llama/llama-4-maverick:free`

### B. Konfigurasi Gambar (Avatar AI)
*   `IMAGE_AI_PROVIDER`: Menentukan provider gambar aktif. Pilihan: `openai` atau `sumopod` (default: `openai`).
*   `IMAGE_AI_MODEL`: Menentukan model gambar generator kustom (default: `gpt-image-1`).

---

## 3. Fitur & Endpoint AI

### 3.1 Pembuatan Halaman Lengkap (`POST /api/generate`)
Menyusun seluruh struktur halaman dan konten JSON secara otomatis berdasarkan prompt deskripsi global pengguna.
*   **Model**: Diatur oleh setelan `AI_TEXT_MODEL` dan `AI_PROVIDER`.
*   **Sifat**: Memeriksa limit harian sebelum mengeksekusi (gratis/berbayar).

### 3.2 Asisten Copywriting Kolom (`POST /api/generate/field`)
Menghasilkan konten copywriting khusus untuk satu bidang input formulir (misalnya deskripsi produk toko online atau urgensi campaign).
*   **Model**: Menggunakan model teks terpilih.
*   **Sifat**: Memeriksa limit harian.

### 3.3 Pemrosesan Media Terpadu (`POST /api/media/process`)
Endpoint satu pintu untuk memproses gambar dengan dukungan fallback mandiri (tidak melempar eror status 500 ke klien jika API Key/kredensial gagal):

1.  **`generate_avatar`** (Avatar AI):
    *   *Teknologi*: DALL-E / Sumopod Image.
    *   *Fallback*: Jika kunci API kosong/eror, sistem otomatis beralih menggunakan API provider cadangan yang terkonfigurasi sebelum mengembalikan avatar bawaan statis.
2.  **`search_unsplash`** (Stock Photo):
    *   *Teknologi*: Unsplash API.
    *   *Fallback*: Jika gagal/tanpa kunci, otomatis mengembalikan array kumpulan URL gambar preset berkualitas tinggi sesuai dengan kategori pencarian (`wedding`, `birthday`, `toko-online`, `campaign`).
3.  **`merge_couple`** (AI Face Swap):
    *   *Teknologi*: Replicate AI (`swap_image`).
    *   *Fallback*: Jika token kosong/gagal, mengembalikan URL gambar pertama asli.
4.  **`change_background`** (Hapus/Ganti Background):
    *   *Teknologi*: Remove.bg API / Replicate.
    *   *Fallback*: Jika API key kosong/gagal, mengembalikan URL gambar asli tanpa memotong proses pengisian form.

---

## 4. Mekanisme Billing, Kuota, & Transaksi

Platform menerapkan sistem kuota gratis harian dengan skema pemotongan saldo wallet otomatis untuk mencegah penyalahgunaan API.

### 4.1 Kuota & Tarif Default
*   **Kuota Harian (`daily_ai_limit`)**: Ditentukan secara global di JSON `system_settings` (default: `15` kali generate per hari). Kolom `daily_ai_limit` di tabel `profiles` bertindak sebagai override khusus ( VIP / developer).
*   **Biaya per Generate (`ai_generate_cost`)**: Ditentukan secara global (default: `100` rupiah).

### 4.2 Logika Pemrosesan Transaksi (Billing Flow)
Setiap panggilan ke `/api/generate/field` atau `/api/media/process` (`generate_avatar`):

1.  **Dapatkan Status Kuota Harian**:
    Sistem memeriksa sisa kuota hari ini menggunakan counter di Redis dengan format key:
    `wuzzkang:user:${userId}:ai_field_limit:${today}`
2.  **Jika Penggunaan < Limit Kuota Harian**:
    *   Request dijalankan secara **GRATIS**.
    *   Counter Redis ditambahkan (`INCR`) dan masa kedaluwarsa key diset ke 48 jam (untuk *cleanup* otomatis).
3.  **Jika Penggunaan ≥ Limit Kuota Harian (Kuota Habis)**:
    *   Sistem memeriksa saldo pengguna di tabel `profiles.balance`.
    *   Jika `balance < ai_generate_cost`, request ditolak dengan respons **`402 Payment Required`**.
    *   Jika saldo cukup, sistem memotong saldo secara langsung lewat `walletService.deductBalance` dengan deskripsi audit mutasi transaksi (e.g. `AI Image Generate: [Prompt...]`), kemudian request dijalankan secara **BERBAYAR**.
