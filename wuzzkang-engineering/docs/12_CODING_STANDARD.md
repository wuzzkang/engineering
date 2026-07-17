# 💻 Standar Pengodean (Coding Standard) — Wuzzkang

Dokumen ini mendefinisikan pedoman, konvensi penulisan kode, dan arsitektur pengodean yang wajib diikuti oleh seluruh developer dan AI Coding Assistant di platform Wuzzkang.

---

## 1. Konvensi Umum JavaScript & ESM

Semua repositori dalam monorepo Wuzzkang menggunakan standar JavaScript modern (ES6+) dengan aturan modul ES Modules (ESM):

### 1.1 Ekstensi Berkas & Path Impor
*   **Wajib Menggunakan Suffix `.js`**: Sesuai dengan aturan ESM node, setiap modul lokal yang diimpor wajib menyertakan ekstensi `.js` secara eksplisit pada path impornya.
    *   *Benar*: `import { config } from '../config/index.js';`
    *   *Salah*: `import { config } from '../config/index';`
*   **Destructuring**: Gunakan destructuring untuk impor variabel/fungsi spesifik guna mengurangi bobot memori.

### 1.2 Pola Asinkronus (Async/Await)
*   Hindari penggunaan Promise `.then()` dan `.catch()` berantai secara mentah. Selalu gunakan struktur **`async / await`** dengan pembungkus **`try / catch`** untuk penanganan eror yang bersih dan mudah dibaca.
    *   *Contoh*:
        ```javascript
        try {
            const profile = await supabaseService.getProfile(userId);
            return profile;
        } catch (err) {
            console.error(`[ProfileService] Gagal memuat profil: ${err.message}`);
            throw err;
        }
        ```

---

## 2. Standar Validasi Input (API Boundary)

Setiap request payload (body, query, params) yang masuk ke router API **wajib divalidasi** menggunakan skema **Zod** di batas router (router boundary) sebelum diteruskan ke service layer.

*   Mencegah data kotor atau tidak lengkap masuk ke logika bisnis atau kueri database.
*   *Contoh implementasi Zod di Router*:
    ```javascript
    const GenerateRequestSchema = z.object({
        name: z.string().min(2),
        template_type: z.enum(['wedding', 'birthday', 'toko-online', 'campaign']),
    });

    router.post('/generate', async (req, res, next) => {
        const validation = GenerateRequestSchema.safeParse(req.body);
        if (!validation.success) {
            return res.status(400).json({
                success: false,
                error: validation.error.flatten().fieldErrors,
            });
        }
        // ...
    });
    ```

---

## 3. Penanganan Eror Terpusat (Error Handling)

API backend menggunakan middleware penanganan eror Express terpusat (`errorMiddleware.js`). 

*   **Jangan Lakukan `res.status(500)` di Controller**: Jika terjadi unhandled error, teruskan eror tersebut ke middleware menggunakan callback `next(error)`.
*   **Respon Eror Standar**: Pastikan payload eror konsisten dengan bentuk:
    ```json
    {
      "success": false,
      "error": "Pesan deskripsi eror untuk pengguna"
    }
    ```

---

## 4. Pemisahan Query Database (Database Isolation)

Kueri database ke Supabase/PostgreSQL **tidak boleh ditulis secara langsung** di dalam router controller (`routes/`).

*   Semua interaksi database wajib diisolasi di dalam file **`src/services/supabase.service.js`**.
*   Router hanya boleh memanggil fungsi service pembungkus (wrapper) seperti `supabaseService.getProject(id)`. Hal ini memudahkan pemeliharaan kueri dan mocking saat unit testing.

---

## 5. Konvensi Logging (Structured Logging)

Semua log di terminal backend harus ditulis secara terstruktur menggunakan prefix penanda komponen agar mempermudah debugging log produksi:

*   **Format**: `[NamaKomponen/NamaService] Deskripsi log | Parameter Tambahan`
*   *Contoh*:
    *   `console.log('[MediaProcess] Incoming request - User ID: 123 | Mode: "generate_avatar"');`
    *   `console.error('[ProjectService] Error during direct deployment: DEPLOY_ERROR');`

---

## 6. Aturan Rendering Statis (wuzzkang-lp)

*   **Vanilla JS**: Kode di `wuzzkang-lp` harus bebas dari library eksternal berbayar atau bundler build-step. Gunakan vanilla DOM API.
*   **CSS Terisolasi**: Setiap template wajib menginjeksi elemen `<style>` dengan ID unik untuk menghindari tabrakan gaya visual (CSS collision) saat berpindah template di preview dashboard:
    ```javascript
    let styleEl = document.getElementById('theme-unique-id');
    if (!styleEl) {
        styleEl = document.createElement('style');
        styleEl.id = 'theme-unique-id';
        styleEl.innerHTML = `...`;
        document.head.appendChild(styleEl);
    }
    ```

---

## 7. Komponen UI Reusable (wuzzkang-dashboard)

Sebelum menulis UI baru di `generate/page.js`, **wajib periksa** apakah ada komponen reusable yang sudah tersedia di:

```
wuzzkang-dashboard/src/components/
```

### Kapan Membuat Komponen Baru

Buat komponen reusable jika:
*   UI yang **identik** digunakan di lebih dari satu template
*   Komponen **tidak mengandung business logic** — hanya rendering dan API call sederhana
*   State utama tetap dikelola di parent (`page.js`)

### Komponen yang Tersedia

Lihat dokumentasi lengkap di [`14_COMPONENT_LIBRARY.md`](file:///home/bms-del112/BMS/personal-project/wuzzkang/wuzzkang-engineering/docs/14_COMPONENT_LIBRARY.md).

| Komponen             | File                    | Deskripsi                                      |
|----------------------|-------------------------|------------------------------------------------|
| `Sidebar`            | `Sidebar.js`            | Navigasi sidebar utama dashboard               |
| `ImagePickerField`   | `ImagePickerField.js`   | Field gambar: checkbox + Unsplash/Upload tabs  |

### Aturan Penggunaan

*   **Jangan duplikat kode**: Jika UI sudah ada sebagai komponen, gunakan komponen tersebut. Jangan copy-paste JSX ke tempat baru.
*   **State di parent**: Komponen UI bersifat controlled. State dan callback dikirim via props dari `page.js`.
*   **Dokumentasikan**: Setiap komponen baru **wajib** ditambahkan ke `14_COMPONENT_LIBRARY.md` beserta props API dan contoh penggunaan.

---

## 8. Konvensi Branding Terpusat & Kustomisasi Merek (White-Labeling)

Untuk menjaga fleksibilitas penjenamaan (branding) di seluruh platform, ikuti aturan ini:

### 8.1 Branding di Dashboard
*   **Dilarang Menulis Nama Brand secara Langsung (*Hardcoded*)**: Semua nama brand (misal `'Siluet'`) di halaman login, layout, sidebar, atau deskripsi transaksi tidak boleh ditulis mentah.
*   **Gunakan Konfigurasi Terpusat**: Selalu impor `BRAND_NAME` atau `BRAND_DOMAIN` dari berkas `@/config/branding.js` (di wuzzkang-dashboard).

### 8.2 Modularitas Template (White-Label Friendly)
*   **Parameter `brandConfig` pada Fungsi Render**: Setiap landing page template (baik di `wuzzkang-lp` maupun pratinjau dashboard) wajib menerima parameter `brandConfig` di fungsi `render`:
    ```javascript
    export async function render(pageConfig, guestName = '', brandConfig = { name: 'Siluet', domain: 'siluet.web.id' }) { ... }
    ```
*   **Bebas Tautan Keras (*No Hardcoded Footer Links*)**: Gunakan properti `brandConfig.name` dan `brandConfig.domain` untuk mencantumkan tautan pembuat website atau hak cipta di footer halaman agar siap di-white-label kapan saja.

### 8.3 Aturan Sistem Credit dan Harga Produk (Database)
Platform Wuzzkang menggunakan **Sistem Credit** di mana nominal pembayaran dan potongan saldo dihitung dalam satuan Credit. Harga per 1 credit (misal Rp100) bersifat fleksibel dan dikonfigurasi secara dinamis melalui sistem/profil pengguna.
*   **Representasi di Database**: Semua kolom `cost` pada tabel `products` di database atau berkas SQL migrasi **wajib diisi dalam satuan Credit**, bukan nominal Rupiah langsung.
*   *Aturan Penghitungan*: Hitung kebutuhan credit berdasarkan harga produk dalam rupiah dibagi dengan rate rupiah per credit saat ini.
    *   *Pernikahan (Rp9.000 / rate Rp100)*: `cost` = `90` (Credit)
    *   *Ulang Tahun (Rp19.000 / rate Rp100)*: `cost` = `190` (Credit)
    *   *Toko Online (Rp49.000 / rate Rp100)*: `cost` = `490` (Credit)
    *   *Curriculum Vitae (Rp15.000 / rate Rp100)*: `cost` = `150` (Credit)
*   **Dilarang Keras** memasukkan nominal langsung Rupiah (seperti `15000` untuk Rp15.000) ke dalam kolom `cost` karena sistem akan menerjemahkannya sebagai 15.000 credit (setara Rp1.500.000).

---

## 9. Kebutuhan Runtime Node.js

*   **Wajib Menggunakan Node.js v22.17.1 atau lebih tinggi**: Semua repositori dalam ekosistem Wuzzkang wajib berjalan di Node.js versi **v22.17.1 atau lebih tinggi**. Hal ini untuk menjamin ketersediaan fitur modern seperti ES Modules (ESM) penuh, watch mode runtime (`node --watch`), serta kompatibilitas API kriptografi terbaru (seperti `subtle` crypto ekspor yang dibutuhkan oleh client octokit/JWT).
*   **Pengelolaan Versi (NVM)**: Pengembang dapat menggunakan **Node Version Manager (NVM)** untuk beralih versi Node secara cepat pada terminal lokal dengan perintah:
    ```bash
    nvm install 22
    nvm use 22
    ```




## 9. Praktik Keamanan Wajib (Security Practices)

Seluruh engineer dan AI Coding Assistant wajib mengikuti aturan keamanan berikut ketika mengerjakan kode di platform Wuzzkang.

### 9.1 Sumber `userId` — Wajib dari Token, Bukan Request Body

`userId` yang digunakan untuk operasi bisnis (transaksi, simpan data, hapus file) **wajib** diambil dari token JWT yang sudah diverifikasi, bukan dari payload body request:

```javascript
// ✅ BENAR: userId dari token terverifikasi
const userId = req.user.id;

// ❌ SALAH: userId dari body request (mudah dimanipulasi/dipalsu)
const { userId } = req.body;
```

### 9.2 Ownership Check Sebelum Operasi Data

Setiap route yang mengakses, mengubah, atau menghapus data milik user tertentu **wajib memverifikasi kepemilikan** sebelum menjalankan operasi:

```javascript
// Contoh: Verifikasi kepemilikan project sebelum deploy
const project = await supabaseService.getProject(projectId);
if (!project) return res.status(404).json({ success: false, error: 'Proyek tidak ditemukan.' });
if (project.user_id !== userId) return res.status(403).json({ success: false, error: 'Akses ditolak.' });
```

### 9.3 `debugInfo` Dilarang di HTTP Response

Informasi internal sistem (stack trace, object detail error, struktur data internal) **dilarang** dikembalikan ke client sebagai response HTTP. Gunakan hanya untuk logging server-side:

```javascript
// ✅ BENAR: Log detail di server, kembalikan pesan umum ke client
console.error('[WebhookController] Signature failed. Details:', JSON.stringify(errorDetails));
return res.status(401).json({ success: false, error: 'Unauthorized' });

// ❌ SALAH: Mengembalikan detail internal ke response
return res.status(401).json({ success: false, error: 'Unauthorized', debugInfo: errorDetails });
```

### 9.4 Verbose Logging Hanya di Non-Production

Log debugging yang berpotensi mengekspos data sensitif (payload request, token, body pembayaran, dsb.) **wajib dibungkus** dengan pengecekan environment:

```javascript
// ✅ BENAR: Hanya print di development
if (config.NODE_ENV !== 'production') {
    console.log('[WebhookController] Raw Body:', rawBody);
}

// ❌ SALAH: Print selalu tanpa kondisi
console.log('[WebhookController] Raw Body:', rawBody);
```

### 9.5 Validasi Input Numerik

Setiap input numerik yang berdampak pada logika bisnis (kredit, jumlah, harga) **wajib divalidasi secara eksplisit**:
- Harus berupa bilangan bulat (`parseInt`)
- Harus positif (> 0)
- Harus punya batas atas yang wajar

```javascript
const parsedAmount = parseInt(amount, 10);
if (isNaN(parsedAmount) || parsedAmount <= 0 || parsedAmount > 100000) {
    return res.status(400).json({ error: 'Jumlah tidak valid.' });
}
```

### 9.6 Path Validasi Sebelum Operasi File Storage

Setiap path file yang dikirim dari client untuk operasi delete/read dari storage **wajib divalidasi** menggunakan regex ketat dan normalisasi path untuk mencegah directory traversal:

```javascript
const normalizedPath = path.normalize(pathInput).replace(/^(\.\.(\/|\\|$))+/, '');
const ownedPathPattern = new RegExp(`^uploads/${userId}_[a-zA-Z0-9_-]+\\.[a-zA-Z0-9]+$`);
if (!ownedPathPattern.test(normalizedPath)) {
    return res.status(403).json({ success: false, error: 'Akses ditolak.' });
}
```
