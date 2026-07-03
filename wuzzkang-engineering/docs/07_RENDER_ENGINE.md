# 🎨 Render Engine & Template Expansion Guide

Dokumen ini merinci arsitektur **Render Engine** Wuzzkang (`wuzzkang-lp`), cara kerja *template*, serta instruksi langkah-demi-langkah bagi developer untuk menambahkan desain baru (*design_key*) atau produk/tipe template baru (*template_type*) ke dalam ekosistem Wuzzkang.

---

## 1. Arsitektur Rendering Platform

Wuzzkang menggunakan pemisahan penuh antara konfigurasi data (*pageData*) dengan mesin perenderan (*runtime renderer*). Seluruh situs hasil generate di-deploy sebagai halaman statis yang berjalan di satu kode runtime universal (`wuzzkang-lp`).

```
[User Dashboard Form]
     ↓ (Isi data formulir terstruktur)
[API Endpoint POST /api/generate]
     ↓ (Validasi schema & simpan JSON pageData ke Supabase)
[LP Live URL: https://siluet.web.id/?slug=xyz]
     ↓
[wuzzkang-lp/script.js] (Membaca JSON pageData berdasarkan slug)
     ↓ (Dynamic import module template JS)
[wuzzkang-lp/templates/{template_type}/{design_key}.js]
     ↓ (Eksekusi render())
[HTML akhir dirender di #app]
```

### Keuntungan Arsitektur:
*   **Zero Build Step**: Tidak perlu melakukan build (Next.js/React) untuk setiap undangan atau landing page user. Semuanya berupa file static JS/HTML yang diunduh secara *on-demand*.
*   **Centralized Updates**: Perubahan layout atau perbaikan bug pada template akan otomatis diterapkan di seluruh landing page pengguna secara real-time.

---

## 2. Struktur Tipe & Desain yang Didukung

Saat ini, sistem mendukung 4 kategori produk utama:

| `template_type` | Nama Produk | `design_key` Tersedia | Alur Input |
| :--- | :--- | :--- | :--- |
| `wedding` | Undangan Pernikahan | `sage-green`, `floral-pink` | Form terstruktur khusus mempelai & acara |
| `birthday` | Undangan Ulang Tahun | `cute-balloon`, `elegant-gold` | Form terstruktur acara ulang tahun |
| `toko-online` | Landing Page Toko | `modern-clean`, `midnight-dark` | Form produk + asisten AI copywriting |
| `campaign` | Campaign Landing Page | `neon-conversion`, `clean-trust` | Form penawaran konversi tinggi + asisten AI |

---

## 3. Prosedur Menambahkan Desain Baru (design_key Baru, Produk Sudah Ada)

Contoh kasus: Menambahkan desain bertema `tropical-beach` untuk produk `wedding`.

### Langkah 1: Buat File JavaScript Template di `wuzzkang-lp`
Buat file baru di path:
```bash
wuzzkang-lp/templates/wedding/tropical-beach.js
```
Setiap berkas template wajib mengekspor fungsi `render` dengan tanda tangan (signature) berikut:
```javascript
export async function render(pageConfig, guestName = 'Tamu Undangan') {
    const appEl = document.getElementById('app');
    const content = pageConfig.content || {};
    
    // 1. Bersihkan kontainer HTML utama
    appEl.innerHTML = '';
    
    // 2. Buat & injeksi elemen style agar CSS terisolasi (jika tidak menggunakan Tailwind penuh)
    const styleEl = document.createElement('style');
    styleEl.id = 'theme-wedding-tropical-beach';
    styleEl.innerHTML = `
        .tropical-text { color: #0f766e; }
    `;
    document.head.appendChild(styleEl);

    // 3. Render template HTML (Tailwind CSS didukung penuh)
    appEl.innerHTML = `
        <div class="min-h-screen bg-teal-50 flex flex-col items-center justify-center">
            <h1 class="text-3xl font-bold tropical-text">Undangan Pernikahan</h1>
            <p class="mt-2">Dear ${guestName}, Kami mengundang Anda...</p>
        </div>
    `;
}
```

### Langkah 2: Sinkronisasi Template ke Dashboard Preview
Agar halaman pratinjau (preview) di dashboard Next.js dapat memuat desain baru Anda secara lokal:
1. Buka terminal pada repositori `wuzzkang-dashboard`.
2. Jalankan perintah sinkronisasi:
   ```bash
   npm run sync:templates
   ```
   *Perintah ini menyalin seluruh file JavaScript template dari `wuzzkang-lp` ke direktori `public/preview/templates` di Next.js.*

### Langkah 3: Registrasi `design_key` di Dashboard UI
Buka file [page.js](file:///home/bms-del112/BMS/personal-project/wuzzkang/wuzzkang-dashboard/src/app/generate/page.js):
1.  **Daftarkan di Design Picker UI**: Cari komponen pilihan desain untuk tipe produk Anda (misal `templateType === 'wedding'`) dan tambahkan tombol opsi untuk key baru:
    ```jsx
    <button
      type="button"
      onClick={() => setDesignKey('tropical-beach')}
      className={`p-3 rounded-xl border text-center ${designKey === 'tropical-beach' ? 'border-theme-accent bg-theme-accent/10' : 'border-theme-border'}`}
    >
      <span className="text-xs font-bold">Tropical Beach 🏖️</span>
    </button>
    ```
2.  **Daftarkan di Header Modal Preview**: Cari blok nama visual pratinjau dan daftarkan penamaan barunya:
    ```javascript
    previewDesignKey === 'tropical-beach' ? 'Tropical Beach 🏖️' : ...
    ```
3.  **Daftarkan ke Array Deteksi Tipe**: Pastikan key baru dimasukkan ke filter array tipe yang sesuai (contoh: `isWedding = ['sage-green', 'floral-pink', 'tropical-beach'].includes(previewDesignKey)`).

### Langkah 4: Registrasi di Zod Schema API
Buka file [schema.js](file:///home/bms-del112/BMS/personal-project/wuzzkang/wuzzkang-api/src/utils/schema.js) di backend:
Tambahkan nilai `design_key` baru ke dalam skema Zod enums yang bersangkutan:
```javascript
const WeddingPageSchema = z.object({
    meta: z.object({
        theme: z.enum(['sage-green', 'rose-gold', 'elegant-navy', 'classic-gold', 'rustic-brown', 'floral-pink', 'tropical-beach']),
        design_key: z.enum(['sage-green', 'floral-pink', 'tropical-beach']).default('sage-green'),
        template_type: z.literal('wedding'),
    }),
    // ...
});
```

### Langkah 5: Bump Versi Cache Busting
Agar browser klien tidak memuat berkas lama dari cache:
1.  Buka `wuzzkang-lp/script.js`, naikkan nilai versi `LP_VERSION` (misal dari `'1.0.6'` ke `'1.0.7'`).
2.  Buka `wuzzkang-dashboard/public/preview/index.html`, naikkan nilai versi `PREVIEW_VERSION` dengan nilai yang sama.

---

## 4. Prosedur Menambahkan Produk Baru (template_type Baru)

Contoh kasus: Menambahkan produk baru `company-profile`.

1.  **Tambahkan Router di `wuzzkang-lp/script.js`**:
    Buat kondisi `if (templateType === 'company-profile')` untuk memuat berkas dinamis dari direktori baru `templates/company-profile/{design_key}.js`.
2.  **Buat Zod Schema Baru di API ([schema.js](file:///home/bms-del112/BMS/personal-project/wuzzkang/wuzzkang-api/src/utils/schema.js))**:
    Definisikan `CompanyProfilePageSchema` dan gabungkan ke dalam `z.union([...])` pada variabel `PageSchema` yang diekspor.
3.  **Assembling Payload di Endpoint Generator API ([generator.route.js](file:///home/bms-del112/BMS/personal-project/wuzzkang/wuzzkang-api/src/routes/generator.route.js))**:
    Buat logika pengecekan parser body request `if (template_type === 'company-profile')` untuk merangkai struktur data spesifik sebelum divalidasi dan disimpan.
4.  **Implementasikan Form di Dashboard UI ([page.js](file:///home/bms-del112/BMS/personal-project/wuzzkang/wuzzkang-dashboard/src/app/generate/page.js))**:
    *   Buat state form dan render UI field input khusus produk baru.
    *   Daftarkan kondisi cek form kosong pada `isFormInvalid()`.
    *   Tambahkan tombol filter kategori produk di halaman beranda dashboard [page.js](file:///home/bms-del112/BMS/personal-project/wuzzkang/wuzzkang-dashboard/src/app/page.js) agar tombol edit/filter bisnis berfungsi dengan baik.
5.  **Daftarkan Entri Produk di Database Supabase**:
    Lakukan query INSERT data produk baru ke tabel `products` Supabase untuk menetapkan tarif/biaya saldo aktivasi dan status aktifnya:
    ```sql
    INSERT INTO products (id, name, cost, is_active, unit)
    VALUES ('company-profile', 'Company Profile', 150000, true, 'Campaign');
    ```

---

## 5. Konfigurasi Dinamis AI & Pemisahan Model

Sistem Wuzzkang memisahkan model AI teks dan AI gambar secara dinamis melalui environment variables di backend `.env`:

### AI Teks (Copywriting)
*   **Variabel**: `AI_PROVIDER` (`groq` / `sumopod`) dan `AI_TEXT_MODEL` (nama model chat).
*   **Perilaku**: Jika `AI_TEXT_MODEL` kosong, sistem otomatis menggunakan default: `llama-3.3-70b-versatile` (untuk Groq) atau `meta-llama/llama-4-maverick:free` (untuk Sumopod).

### AI Gambar (Avatar)
*   **Variabel**: `IMAGE_AI_PROVIDER` (`openai` / `sumopod`) dan `IMAGE_AI_MODEL` (nama model gambar).
*   **Keamanan & Fallback**: Jika provider utama gagal (misal kunci API kosong/eror), sistem otomatis memeriksa ketersediaan API key provider alternatif. Jika semua gagal, sistem akan secara anggun (*graceful fallback*) mengembalikan preset gambar default tanpa memicu eror server 500.

---

## 6. Alur Media & Unggah File Melalui Perantara Backend

Untuk keamanan tingkat tinggi, frontend dashboard tidak memiliki akses langsung menulis file ke Supabase Storage. Seluruh berkas dilewatkan melalui perantara backend:

### Alur Unggah Manual (`POST /api/media/upload`)
1.  Frontend mengompresi gambar secara adaptif di sisi klien.
2.  Frontend mengirimkan data biner mentah (*raw binary stream*) via HTTP POST ke `/api/media/upload` dengan menyertakan nama file asli di header `x-file-name` dan jenis mime-type di header `Content-Type`.
3.  Backend membaca stream biner ke dalam Buffer, menghasilkan nama file acak yang unik, dan mengunggahnya secara aman menggunakan Supabase admin client (`uploadWeddingAsset`).
4.  Backend mengembalikan respons berisi URL publik gambar.
