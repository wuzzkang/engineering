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

