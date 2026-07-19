# 📦 Komponen UI Reusable — Wuzzkang Dashboard

## Informasi Dokumen

| Field       | Value                                                             |
|-------------|-------------------------------------------------------------------|
| Dokumen     | 14_COMPONENT_LIBRARY.md                                           |
| Versi       | 1.0.0                                                             |
| Status      | Active                                                            |
| Owner       | Muhammad Arif Setiawan                                            |
| Tujuan      | Mendokumentasikan semua komponen React reusable di wuzzkang-dashboard |
| Audience    | Engineers, AI Assistants                                          |

---

## Filosofi

Komponen reusable di Dashboard dibuat hanya ketika:

1. UI yang **identik** dipakai di lebih dari satu tempat/template
2. Komponen **tidak mengandung business logic** — hanya UI dan API call yang sederhana
3. Semua **state tetap dikelola di parent** (`page.js`) agar kompatibel dengan `assembledContent` dan `useEffect` dependency array

Komponen bersifat **controlled** — menerima state dan callback dari parent via props, bukan menyimpan state sendiri (kecuali loading state internal).

---

## Lokasi

Semua komponen reusable disimpan di:

### 1. React Dashboard Components (Next.js)
```
wuzzkang-dashboard/src/components/
├── Sidebar.js            — Navigasi sidebar
└── ImagePickerField.js   — Field gambar dengan checkbox + Unsplash/Upload
```

### 2. Shared Template Components (Vanilla HTML/JS/CSS)
```
wuzzkang-lp/templates/components/  (di-sync ke wuzzkang-dashboard/public/preview/templates/components/)
├── ImageSlider.js        — Komponen Slider/Carousel Gambar
└── WishesBoard.js        — Komponen Buku Tamu & RSVP
```

---

## Komponen: `ImagePickerField`

### Deskripsi

Komponen untuk memilih gambar background/cover. Mendukung dua sumber:
- **Unsplash** — mengambil foto acak dari Unsplash API via backend
- **Upload** — mengunggah file dari perangkat pengguna

Dipakai oleh:
- Template **Wedding** → foto prewedding/cover
- Template **Campaign** → foto background hero section

### Lokasi File

[`src/components/ImagePickerField.js`](file:///home/bms-del112/BMS/personal-project/wuzzkang/wuzzkang-dashboard/src/components/ImagePickerField.js)

### API Endpoint yang Digunakan

```
POST /media/prewedding
Body: { query: "keyword,unsplash" }
Response: { success: true, preweddingPhotoUrl: "https://images.unsplash.com/..." }
```

### Props API

| Prop             | Tipe       | Wajib | Default      | Keterangan                                           |
|------------------|------------|-------|--------------|------------------------------------------------------|
| `checkboxId`     | `string`   | ✅    | —            | ID unik untuk HTML `<input type="checkbox">`         |
| `checkboxLabel`  | `string`   | ✅    | —            | Teks label di sebelah checkbox                       |
| `unsplashQuery`  | `string`   | ✅    | `''`         | Keyword Unsplash, e.g. `"wedding,romantic"`           |
| `imageUrl`       | `string`   | ✅    | `''`         | URL gambar aktif (controlled dari parent)            |
| `onImageChange`  | `Function` | ✅    | —            | Callback saat URL gambar berubah: `(url) => void`    |
| `apiToken`       | `string`   | ✅    | —            | JWT Bearer token untuk API call                      |
| `apiBaseUrl`     | `string`   | ✅    | —            | Base URL API, e.g. `process.env.NEXT_PUBLIC_API_URL` |
| `isEnabled`      | `boolean`  | ❌    | `false`      | State checkbox (controlled dari parent)              |
| `onEnabledChange`| `Function` | ❌    | —            | Callback saat checkbox toggle: `(enabled) => void`   |
| `source`         | `string`   | ❌    | `'unsplash'` | Tab aktif: `'unsplash'` atau `'upload'`              |
| `onSourceChange` | `Function` | ❌    | —            | Callback saat tab berubah: `(source) => void`        |
| `onUpload`       | `Function` | ❌    | —            | Fungsi upload: `(file, uploadType) => void`          |
| `uploadType`     | `string`   | ❌    | `'image'`    | Key type yang diteruskan ke `onUpload`               |

### Contoh Penggunaan — Wedding (Prewedding)

```jsx
<ImagePickerField
  checkboxId="generatePrewedding"
  checkboxLabel="Gunakan Foto Cover / Background Prewedding"
  unsplashQuery=""
  imageUrl={preweddingPhotoUrl}
  onImageChange={setPreweddingPhotoUrl}
  apiToken={session?.access_token}
  apiBaseUrl={process.env.NEXT_PUBLIC_API_URL}
  isEnabled={generatePrewedding}
  onEnabledChange={setGeneratePrewedding}
  source={preweddingSource}
  onSourceChange={setPreweddingSource}
  onUpload={handleUploadImage}
  uploadType="prewedding"
/>
```

### Contoh Penggunaan — Campaign (Hero Section)

```jsx
<ImagePickerField
  checkboxId="generateCampaignHero"
  checkboxLabel="Gunakan Foto Background Hero Section"
  unsplashQuery="business,workspace,marketing,success"
  imageUrl={campaignHeroImage}
  onImageChange={setCampaignHeroImage}
  apiToken={session?.access_token}
  apiBaseUrl={process.env.NEXT_PUBLIC_API_URL}
  isEnabled={generateCampaignHero}
  onEnabledChange={setGenerateCampaignHero}
  source={campaignHeroImageSource}
  onSourceChange={setCampaignHeroImageSource}
  onUpload={handleUploadImage}
  uploadType="campaignHero"
/>
```

---

## Panduan: Menambahkan Field Gambar ke Template Baru

Ikuti 5 langkah berikut setiap kali template baru membutuhkan field gambar.

### Langkah 1 — Tambah State di `page.js`

```js
// Di dalam GenerateContent() function, bagian "// [NamaTemplate] form states"
const [generateXxxImage, setGenerateXxxImage] = useState(false);
const [xxxImageUrl, setXxxImageUrl] = useState('');
const [xxxImageSource, setXxxImageSource] = useState('unsplash');
```

### Langkah 2 — Load dari Database saat Edit Mode

Di dalam block `if (pageConfig?.meta?.template_type === 'xxx')`:

```js
setCampaignHeroImage(content.xxx?.image_url || '');
if (content.xxx?.image_url) {
  setGenerateXxxImage(true);
  if (content.xxx.image_url.includes('images.unsplash.com')) {
    setXxxImageSource('unsplash');
  } else {
    setXxxImageSource('upload');
  }
} else {
  setGenerateXxxImage(false);
  setXxxImageSource('unsplash');
}
```

### Langkah 3 — Tambahkan ke `assembledContent`

Di dalam `useEffect` yang merakit `pageData`, gunakan `generateXxxImage` sebagai gating:

```js
} else if (templateType === 'xxx') {
  assembledContent = {
    section: {
      // ...field lainnya...
      image_url: generateXxxImage ? (xxxImageUrl || null) : null,
    },
  };
}
```

### Langkah 4 — Tambahkan ke Dependency Array

Di array dependency `useEffect` yang merakit `pageData`:

```js
  generateXxxImage,
  xxxImageUrl,
```

### Langkah 5 — Tambahkan Komponen di JSX

Di bagian form template baru di dalam JSX return:

```jsx
<ImagePickerField
  checkboxId="generateXxxImage"
  checkboxLabel="Gunakan Foto Background [Nama Section]"
  unsplashQuery="keyword,relevan,untuk,template"
  imageUrl={xxxImageUrl}
  onImageChange={setXxxImageUrl}
  apiToken={session?.access_token}
  apiBaseUrl={process.env.NEXT_PUBLIC_API_URL}
  isEnabled={generateXxxImage}
  onEnabledChange={setGenerateXxxImage}
  source={xxxImageSource}
  onSourceChange={setXxxImageSource}
  onUpload={handleUploadImage}
  uploadType="xxxImage"
/>
```

### Langkah 6 — Tambahkan ke Zod Schema API

Di `wuzzkang-api/src/utils/schema.js`, pastikan `image_url` diizinkan:

```js
const XxxPageSchema = z.object({
  // ...
  section: z.object({
    // ...
    image_url: z.string().url().nullable().optional(),
  }),
});
```

> **Penting**: Tanpa ini, `image_url` akan di-strip oleh validasi Zod dan tidak tersimpan ke database.

---

## Catatan untuk `handleUploadImage`

Fungsi `handleUploadImage(file, uploadType)` di `page.js` harus sudah menangani `uploadType` baru. Pastikan ada block `else if` di dalam switch/if-else untuk type baru:

```js
const handleUploadImage = async (file, type) => {
  // ...
  if (type === 'prewedding') {
    setIsUploadingPreweddingImage(true);
    // ... upload logic ...
    setPreweddingPhotoUrl(url);
    setIsUploadingPreweddingImage(false);
  } else if (type === 'campaignHero') {
    setIsUploadingCampaignHeroImage(true);
    // ... upload logic ...
    setCampaignHeroImage(url);
    setIsUploadingCampaignHeroImage(false);
  } else if (type === 'xxxImage') {
    // Tambahkan handler baru di sini
  }
};
```

> **Catatan**: `isUploading` state di dalam `ImagePickerField` akan otomatis aktif dan nonaktif via `onUpload` callback karena komponen memanggil `await onUpload(file, uploadType)` dan menunggu selesai.

---

## Komponen Template: `ImageSlider`

### Deskripsi
Komponen JavaScript Vanilla untuk merender galeri gambar responsive berbentuk carousel slider.

### Lokasi File
*   [`wuzzkang-lp/templates/components/ImageSlider.js`](file:///home/bms-del112/BMS/personal-project/wuzzkang/wuzzkang-lp/templates/components/ImageSlider.js) (di-sync ke Dashboard)

### Contoh Penggunaan
```javascript
import { ImageSlider } from '../components/ImageSlider.js';

// Siapkan kontainer HTML: <div class="slider-container" id="my-slider"></div>
const slider = new ImageSlider('my-slider', ['img1.jpg', 'img2.jpg']);
slider.setup();
```

---

## Komponen Template: `WishesBoard`

### Deskripsi
Komponen interaktif Buku Tamu dan Form RSVP yang terintegrasi dengan penyimpanan `localStorage`. Komponen ini secara otomatis mengelompokkan pesan berdasarkan judul undangan di `pageConfig.meta.title`.

### Lokasi File
*   [`wuzzkang-lp/templates/components/WishesBoard.js`](file:///home/bms-del112/BMS/personal-project/wuzzkang/wuzzkang-lp/templates/components/WishesBoard.js) (di-sync ke Dashboard)

### Parameter `designStyles`
| Option | Tipe | Wajib | Keterangan |
|---|---|---|---|
| `primaryColor` | `string` | ❌ | Warna primer teks, tombol aktif, dan badge counter |
| `bgLight` | `string` | ❌ | Warna background form input & kartu ucapan |
| `borderColor` | `string` | ❌ | Warna border form input |
| `buttonClass` | `string` | ❌ | Kelas CSS tombol submit |

### Contoh Penggunaan
```javascript
const wishesRoot = document.getElementById('wishes-board-root');
if (wishesRoot) {
    const { initWishesBoard } = await import('../components/WishesBoard.js');
    initWishesBoard(wishesRoot, pageConfig, guestName, {
        primaryColor: '#5A7C64',
        bgLight: '#F8FAF9',
        borderColor: '#EAF0EC',
        buttonClass: 'btn-sage-primary'
    });
}
```

---

## Komponen Template: `Faq`

### Deskripsi
Komponen accordion interaktif reusable untuk merender FAQ (Frequently Asked Questions). Mendukung transisi animasi penutupan/pembukaan, pengelompokan accordion eksklusif, serta penyesuaian tema visual.

### Lokasi File
*   [`wuzzkang-lp/templates/components/Faq.js`](file:///home/bms-del112/BMS/personal-project/wuzzkang/wuzzkang-lp/templates/components/Faq.js) (di-sync ke Dashboard)

### Parameter `options`
| Option | Tipe | Wajib | Keterangan |
|---|---|---|---|
| `theme` | `string` | ❌ | Tema styling. Mendukung `'clean-trust'` (default), `'neon-conversion'`, dan `'professional-navy'` |
| `title` | `string` | ❌ | Judul section FAQ. Default: `'Pertanyaan yang Sering Diajukan (FAQ)'` |
| `subtitle` | `string` | ❌ | Subjudul section FAQ. Default: `'Temukan jawaban cepat untuk pertanyaan-pertanyaan umum Anda.'` |

### Struktur Data `faqs`
Menerima array objek dengan struktur sebagai berikut:
```json
[
  {
    "question": "Apakah ada biaya bulanan?",
    "answer": "Tidak ada, layanan ini hanya mengenakan biaya sekali bayar di awal."
  }
]
```

### Contoh Penggunaan
```javascript
const faqRoot = document.getElementById('campaign-faq-root');
if (faqRoot && Array.isArray(content.faqs) && content.faqs.length > 0) {
    const { initFaq } = await import('../components/Faq.js');
    await initFaq(faqRoot, content.faqs, { 
        theme: 'neon-conversion',
        title: 'Tanya Jawab Seputar Produk',
        subtitle: 'Berikut jawaban untuk pertanyaan paling populer'
    });
}
```

---

## Komponen Template: `Pricing`

### Deskripsi
Komponen kartu daftar paket harga (Pricing Plans grid) yang reusable, dinamis, dan responsif. Mendukung opsionalitas nominal harga (menghilangkan baris harga jika tidak diisi) serta kustomisasi label tombol aksi (CTA).

### Lokasi File
*   [`wuzzkang-lp/templates/components/Pricing.js`](file:///home/bms-del112/BMS/personal-project/wuzzkang/wuzzkang-lp/templates/components/Pricing.js) (di-sync ke Dashboard)

### Parameter `options`
| Option | Tipe | Wajib | Keterangan |
|---|---|---|---|
| `theme` | `string` | ❌ | Tema visual. Mendukung `'professional-navy'` (navy/orange) dan `'clean-trust'` (default, Tailwind grid) |
| `ctaHref` | `string` | ❌ | URL tujuan tombol CTA (e.g. link WhatsApp) |

### Struktur Data `plans`
Menerima array objek rencana paket:
```json
[
  {
    "name": "Paket Silver",
    "badge": "Terpopuler",
    "original_price": "Rp 1.500.000",
    "sale_price": "Rp 990.000",
    "cta_text": "Daftar Sekarang",
    "features": ["1x Konsultasi", "Revisi 1x"],
    "highlighted": true
  }
]
```

### Contoh Penggunaan
```javascript
const pricingRoot = document.getElementById('jasa-pricing-root');
if (pricingRoot && Array.isArray(pricing.plans) && pricing.plans.length > 0) {
    const { initPricing } = await import('../components/Pricing.js');
    await initPricing(pricingRoot, pricing.plans, {
        theme: 'professional-navy',
        ctaHref: ctaHref
    });
}
```
```

