# 🎨 Panduan Membuat Template & Render Engine — Wuzzkang

Dokumen ini adalah instruksi lengkap untuk AI (atau developer) yang ingin menambahkan **desain template baru** atau **tipe template baru** ke sistem Wuzzkang, serta penjelasan mengenai arsitektur perenderan dan media.

---

## 📐 Arsitektur Sistem

Wuzzkang terdiri dari 3 repositori dalam satu monorepo:

```
wuzzkang/
├── wuzzkang-lp/          ← Landing Page renderer (pure HTML/JS/CSS, dihosting sebagai GitHub Pages)
├── wuzzkang-dashboard/   ← Dashboard user (Next.js, di-deploy ke Vercel/Railway)
└── wuzzkang-api/         ← Backend API (Express.js + Supabase, berjalan di port 3026)
```

### Alur Kerja Template

```
User isi form structured (dashboard)
    → POST /api/generate → API simpan pageData ke Supabase (tabel `projects`)
    → Setelah publish: POST /api/projects/:id/deploy → Supabase simpan slug
    → Live URL: https://siluet.web.id/?slug=xxx (wuzzkang-lp)
    → wuzzkang-lp/script.js baca pageConfig dari Supabase berdasarkan slug
    → import template JS dinamis berdasarkan template_type + design_key
    → template.render(pageConfig, guestName) dijalankan → HTML ter-render di #app
```

### Tipe Template yang Ada Saat Ini

| `template_type` | Deskripsi | `design_key` tersedia | Form |
|---|---|---|---|
| `wedding` | Undangan Pernikahan | `sage-green`, `floral-pink`, `classic-love` | Structured form |
| `birthday` | Undangan Ulang Tahun | `cute-balloon`, `elegant-gold` | Structured form |
| `toko-online` | Landing Page Toko Online | `modern-clean`, `midnight-dark` | Structured form + AI assist field |
| `campaign` | Campaign Landing Page | `neon-conversion`, `clean-trust` | Structured form (high conversion) |
| `store` | *(Legacy)* | *(n/a)* | AI prompt (deprecated, jangan pakai) |

> **Catatan**: `store` adalah tipe lama yang menggunakan AI full-prompt. Ke depannya semua tipe baru menggunakan **structured form** seperti `toko-online` dan `campaign`.

---

## 🗂️ Struktur File Template

```
wuzzkang-lp/
└── templates/
    ├── components/             ← Komponen template reusable (shared components)
    │   ├── ImageSlider.js      ← Komponen Slider Gambar
    │   └── WishesBoard.js      ← Komponen Buku Tamu & RSVP
    ├── wedding/
    │   ├── sage-green.js       ← design_key: sage-green
    │   ├── floral-pink.js      ← design_key: floral-pink
    │   ├── classic-love.js     ← design_key: classic-love
    │   └── javanese-traditional.js ← design_key: javanese-traditional
    ├── birthday/
    │   ├── cute-balloon.js     ← design_key: cute-balloon
    │   └── elegant-gold.js     ← design_key: elegant-gold
    ├── toko-online/
    │   ├── modern-clean.js     ← design_key: modern-clean
    │   └── midnight-dark.js    ← design_key: midnight-dark
    └── campaign/
        ├── neon-conversion.js  ← design_key: neon-conversion
        └── clean-trust.js      ← design_key: clean-trust
```

Dan folder yang sama di-sync ke dashboard:
```
wuzzkang-dashboard/
└── public/preview/templates/   ← hasil `npm run sync:templates` (jangan edit manual)
    ├── wedding/
    ├── birthday/
    └── toko-online/
```

---

## ✅ Checklist: Menambah Desain Template Baru (design_key baru, type sudah ada)

Contoh: menambah tema `tropical-vibes` untuk tipe `toko-online`.

---

### LANGKAH 1 — Buat file template di `wuzzkang-lp`

**Tentukan dulu:**
- `template_type`: salah satu dari `wedding`, `birthday`, `toko-online` (atau type baru — lihat bagian bawah)
- `design_key`: nama unik kebab-case, contoh: `tropical-vibes`, `midnight-blue`

**Buat file:**
```
wuzzkang-lp/templates/{template_type}/{design_key}.js
```

**Kontrak wajib** — setiap template HARUS mengekspor fungsi ini:
```javascript
export async function render(pageConfig, guestName = 'Tamu Undangan', brandConfig = { name: 'Siluet', domain: 'siluet.web.id' }) {
    const appEl = document.getElementById('app');
    const content = pageConfig.content || {};
    
    // Gunakan konfigurasi brand modular untuk footer atau hak cipta
    const brandName = brandConfig?.name || 'Siluet';
    const brandDomain = brandConfig?.domain || 'siluet.web.id';
    
    // ... render HTML ke dalam appEl
}
```

**Tips penting saat membuat template:**
- Inject CSS via `document.createElement('style')` dengan ID unik untuk mencegah duplikasi pada re-render
- Bersihkan `appEl.innerHTML` sebelum render (replace total, bukan append)
- Gunakan Tailwind CSS via CDN (sudah di-load oleh `preview/index.html` di dashboard)
- Khusus wedding/birthday: gunakan `guestName` pada bagian cover/envelope untuk personalisasi
- Jika ada overlay/cover: beri ID `invitation-cover` agar preview dashboard bisa otomatis menyembunyikannya
- Jika ada `#main-content` yang hidden: tambahkan class `opacity-0`, dashboard preview akan `remove('opacity-0')` otomatis

---

#### Struktur `pageConfig` per `template_type`

**`toko-online`:**
```json
{
  "meta": {
    "title": "Nama Toko",
    "template_type": "toko-online",
    "design_key": "modern-clean"
  },
  "content": {
    "store": {
      "name": "Nama Toko",
      "tagline": "Tagline singkat",
      "description": "Deskripsi toko (opsional)",
      "logo_url": "https://... (opsional, ditampilkan di navbar)",
      "banner_url": "https://... (opsional, ditampilkan sebagai background hero section)"
    },
    "products": [
      {
        "name": "Nama Produk",
        "price": "150000",
        "description": "Deskripsi produk (opsional)",
        "image_url": "https://... (opsional)"
      }
    ],
    "contact": {
      "whatsapp": "6281234567890",
      "instagram": "@username (opsional)",
      "shopee_url": "https://... (opsional)",
      "tokopedia_url": "https://... (opsional)",
      "address": "Alamat toko (opsional)"
    },
    "quote": "Slogan / sambutan toko (opsional)"
  }
}
```

**`campaign`:**
```json
{
  "meta": {
    "title": "Campaign: Nama Campaign ...",
    "template_type": "campaign",
    "design_key": "neon-conversion"
  },
  "content": {
    "hero": {
      "headline": "Headline konversi tinggi...",
      "subheadline": "Subheadline penjelas...",
      "cta_text": "Teks tombol aksi..."
    },
    "problems": {
      "title": "Judul Bagian Masalah...",
      "list": [
        "Poin masalah 1...",
        "Poin masalah 2..."
      ]
    },
    "solutions": {
      "title": "Judul Bagian Solusi...",
      "intro": "Pengantar solusi...",
      "benefits": [
        { "title": "Nama Manfaat 1...", "desc": "Penjelasan..." }
      ]
    },
    "social_proof": {
      "testimonials": [
        { "name": "Nama...", "role": "Role...", "content": "Isi testimoni..." }
      ],
      "guarantee": "Info garansi kepuasan..."
    },
    "closing": {
      "urgency": "Urgensi penawaran khusus...",
      "cta_text": "Teks tombol closing..."
    },
    "contact": {
      "whatsapp": "628xxx"
    }
  }
}
```

**`birthday`:**
```json
{
  "meta": {
    "title": "Undangan Ultah ...",
    "template_type": "birthday",
    "design_key": "cute-balloon"
  },
  "content": {
    "celebrant": {
      "name": "Nama Lengkap",
      "nickname": "Panggilan",
      "age": "5",
      "parent_name": "Bpk. X & Ibu Y (opsional)",
      "image_url": "https://... (opsional)",
      "gender": "male"
    },
    "event": {
      "date": "2026-08-15",
      "time": "15:00 - 17:30 WIB",
      "location": "Nama Tempat, Kota",
      "maps_url": "https://maps.google.com/..."
    },
    "gift": {
      "bank_name": "BCA",
      "account_number": "1234567890",
      "account_holder": "Nama Pemilik"
    },
    "quote": "Ucapan selamat atau doa..."
  }
}
```

**`wedding`:**
```json
{
  "meta": {
    "title": "Undangan Pernikahan ...",
    "template_type": "wedding",
    "design_key": "sage-green"
  },
  "content": {
    "groom": { "name": "...", "nickname": "...", "father": "...", "mother": "...", "image_url": "..." },
    "bride": { "name": "...", "nickname": "...", "father": "...", "mother": "...", "image_url": "..." },
    "story": [{ "year": "2021", "title": "Pertama Bertemu", "desc": "..." }],
    "akad":    { "date": "...", "time": "...", "location": "...", "maps_url": "..." },
    "resepsi": { "date": "...", "time": "...", "location": "...", "maps_url": "..." },
    "gift":    { "bank_name": "...", "account_number": "...", "account_holder": "..." },
    "quote": "Ayat Al-Quran atau kutipan..."
  }
}
```

---

### LANGKAH 2 — Sync template ke dashboard preview

Template di `wuzzkang-lp` tidak otomatis terbaca oleh preview di dashboard. Harus disync manual.

Dari folder `wuzzkang-dashboard`, jalankan:
```bash
npm run sync:templates
```

Perintah ini akan:
1. Hapus folder lama di `public/preview/templates/{type}/`
2. Copy ulang file dari `wuzzkang-lp/templates/{type}/` ke `public/preview/templates/{type}/`

> ⚠️ Jangan edit file di `public/preview/templates/` secara manual — selalu akan di-overwrite saat sync.
> ⚠️ Jangan pakai symlink — Git tidak bisa push file "beyond a symbolic link".

---

### LANGKAH 3 — Daftarkan `design_key` di Dashboard (generate/page.js)

File: `wuzzkang-dashboard/src/app/generate/page.js`

Ada **3 tempat** yang harus diupdate untuk setiap `design_key` baru:

#### 3a. Tambahkan default value `designKey`

Cari baris awal state `designKey` dan pastikan default-nya sesuai:
```javascript
const [designKey, setDesignKey] = useState('modern-clean'); // atau design_key default untuk tipe ini
```

#### 3b. Tambahkan tombol di Design Picker UI

Cari blok `{templateType === 'toko-online' && (` (atau type yang sesuai), lalu tambahkan card desain baru di dalam scroll row:

```jsx
<div className="flex flex-col gap-1.5 flex-shrink-0 w-36 snap-start">
  <button
    type="button"
    onClick={() => setDesignKey('tropical-vibes')}
    className={`w-full p-3.5 rounded-xl border text-center transition-all flex flex-col items-center gap-1.5 cursor-pointer ${
      designKey === 'tropical-vibes'
        ? 'border-theme-accent bg-theme-accent/10 text-theme-accent'
        : 'border-theme-border bg-theme-bg/50 text-theme-text-sec'
    }`}
  >
    <span className="text-lg">🌺</span>
    <span className="text-[10px] font-bold">Tropical Vibes</span>
  </button>
  <button
    type="button"
    onClick={() => setPreviewDesignKey('tropical-vibes')}
    className="text-[9px] font-semibold text-theme-accent hover:underline text-center"
  >
    Lihat Contoh Desain
  </button>
</div>
```

#### 3c. Tambahkan nama tampilan di preview modal header

Cari ternary chain berikut (sekitar baris `previewDesignKey === 'modern-clean'`):
```jsx
previewDesignKey === 'modern-clean' ? 'Modern Clean 🛍️' : 'Midnight Dark 👑'
```
Ubah menjadi:
```jsx
previewDesignKey === 'modern-clean' ? 'Modern Clean 🛍️' :
previewDesignKey === 'midnight-dark' ? 'Midnight Dark 👑' :
previewDesignKey === 'tropical-vibes' ? 'Tropical Vibes 🌺' : 'Unknown'
```

#### 3d. Tambahkan `design_key` ke array deteksi tipe di preview modal

Cari baris:
```javascript
const isTokoOnline = ['modern-clean', 'midnight-dark'].includes(previewDesignKey);
```
Tambahkan key baru:
```javascript
const isTokoOnline = ['modern-clean', 'midnight-dark', 'tropical-vibes'].includes(previewDesignKey);
```

#### 3e. Tambahkan mock data untuk preview "Lihat Contoh Desain" (jika tipe baru)

Jika type yang sama sudah ada mock data (misal `isMidnight`), cukup tambahkan kondisi variasi data. Jika design baru membutuhkan data yang sama, tidak perlu tambahkan kondisi baru.

---

### LANGKAH 4 — Update Zod Schema di API

File: `wuzzkang-api/src/utils/schema.js`

Tambahkan `design_key` baru ke dalam `.enum([...])` yang sesuai:

**Untuk `toko-online`:**
```javascript
design_key: z.enum(['modern-clean', 'midnight-dark', 'tropical-vibes']).default('modern-clean'),
```

**Untuk `birthday`:**
```javascript
design_key: z.enum(['cute-balloon', 'elegant-gold', 'NAMA_DESIGN_KEY_BARU']).default('cute-balloon'),
```

**Untuk `wedding`:**
```javascript
design_key: z.enum(['sage-green', 'floral-pink', 'NAMA_DESIGN_KEY_BARU']).default('sage-green'),
```

---

### LANGKAH 5 — Bump `LP_VERSION` dan `PREVIEW_VERSION`

Setelah template baru dibuat dan sudah di-commit ke `wuzzkang-lp`, **WAJIB** bump versi cache untuk memaksa semua klien me-reload template terbaru dari GitHub Pages.

**File 1:** `wuzzkang-lp/script.js` — baris paling atas:
```javascript
const LP_VERSION = '1.0.6'; // Bump tiap kali ada template baru/berubah
```

**File 2:** `wuzzkang-dashboard/public/preview/index.html` — dalam blok `<script type="module">`:
```javascript
const PREVIEW_VERSION = '1.0.6'; // Harus sama dengan LP_VERSION
```

> Kedua versi ini **harus selalu sama** agar preview dashboard dan LP live menggunakan cache yang selaras.

---

### LANGKAH 6 — Commit dan Push (urutan penting!)

```bash
# ① Commit wuzzkang-lp terlebih dahulu
cd wuzzkang-lp
git add templates/{type}/{design_key}.js script.js
git commit -m "feat: add {design_key} template for {type}, bump LP_VERSION to x.x.x"
git push origin main

# ② Sync template ke dashboard SETELAH commit LP
cd ../wuzzkang-dashboard
npm run sync:templates   # WAJIB dijalankan setiap kali ada file baru di LP

# ③ Commit wuzzkang-dashboard
git add public/preview/templates/ public/preview/index.html src/app/generate/page.js
git commit -m "feat: register {design_key} design in dashboard, sync LP vx.x.x"
git push origin main

# ④ Commit wuzzkang-api
cd ../wuzzkang-api
git add src/utils/schema.js
git commit -m "feat: add {design_key} to {type} schema enum"
git push origin main
```

---

## 🆕 Menambah `template_type` Baru (Type yang Belum Pernah Ada)

Jika ingin menambahkan type benar-benar baru (contoh: `company-profile`, `webinar`, dll.), lakukan semua langkah di atas **PLUS** langkah-langkah tambahan berikut:

### Langkah Tambahan A — Tambahkan routing di `wuzzkang-lp/script.js`

Tambahkan blok `if` baru **sebelum** blok fallback default (store lama):
```javascript
if (templateType === 'company-profile') {
    const designKey = pageConfig.meta?.design_key || 'default-design';
    try {
        console.log(`[LP Router] Loading company-profile template: ${designKey}...`);
        const module = await import(`./templates/company-profile/${designKey}.js${cacheBustQuery}`);
        await module.render(pageConfig, guestName);
    } catch (e) {
        console.error(`[LP Router] Failed to load template ${designKey}, falling back:`, e);
        try {
            const module = await import(`./templates/company-profile/default-design.js${cacheBustQuery}`);
            await module.render(pageConfig, guestName);
        } catch (err) {
            console.error('[LP Router] Fallback template failed:', err);
            appEl.innerHTML = '<div style="padding:2rem;color:red;font-weight:bold">Gagal memuat template.</div>';
        }
    }
    return;
}
```

> ⚠️ Blok `return;` di akhir tiap `if` sangat penting — jangan dihilangkan.

### Langkah Tambahan B — Tambahkan schema baru di API

File: `wuzzkang-api/src/utils/schema.js`

1. Buat schema Zod baru, contoh `CompanyProfilePageSchema`
2. Daftarkan ke union export di bawah:

```javascript
export const PageSchema = z.union([
    StorePageSchema,
    WeddingPageSchema,
    BirthdayPageSchema,
    TokoOnlinePageSchema,
    CompanyProfilePageSchema,   // ← tambahkan di sini
]);
```

### Langkah Tambahan C — Tambahkan payload handling di API route generator

File: `wuzzkang-api/src/routes/generator.route.js`

Cari blok `if (template_type === 'toko-online')` sebagai contoh referensi, lalu tambahkan blok serupa:
```javascript
if (template_type === 'company-profile') {
    const details = req.body.company_profile_details;
    // Validasi dan assembling pageData
    // ...
}
```

### Langkah Tambahan D — Tambahkan form di Dashboard

File: `wuzzkang-dashboard/src/app/generate/page.js`

1. Tambahkan state baru untuk field-field form tipe baru
2. Tambahkan kondisi `{templateType === 'company-profile' && (...)}` di dalam `<form>` untuk menampilkan field khusus
3. Tambahkan validasi di fungsi `isFormInvalid()`
4. Tambahkan payload assembly di fungsi `handleGenerate()`
5. Tambahkan assembly di `useEffect` auto-update pageData (untuk editMode live preview)
6. Tambahkan mock data di preview modal (onLoad iframe) untuk tombol "Lihat Contoh Desain"
7. Tambahkan pemetaan ikon dan deskripsi template secara dinamis di helper atas:
   - Tambahkan case baru di `getProductIcon`
   - Tambahkan deskripsi default di `getProductDefaultDescription`
8. Tambahkan tombol tab filter category baru di modal JSX jika unit barunya berbeda dengan yang ada.

### Langkah Tambahan E — Tambahkan template type ke preview iframe handler

File: `wuzzkang-dashboard/public/preview/index.html`

Tambahkan blok `else if` baru di dalam event listener `UPDATE_PREVIEW`:
```javascript
} else if (templateType === 'company-profile') {
    try {
        const module = await import(`./templates/company-profile/${designKey}.js${cacheBust}`);
        await module.render(pageData, 'Tamu');
    } catch (err) {
        appEl.innerHTML = `<div ...>Gagal memuat template: ${err.message}</div>`;
    }
}
```

### Langkah Tambahan F — Tambahkan filter tab di halaman utama dashboard

File: `wuzzkang-dashboard/src/app/page.js`

1. Tambahkan tab baru di array filter:
```javascript
{ id: 'bisnis', label: 'Bisnis' }  // jika belum ada
```

2. Tambahkan kondisi di fungsi `filteredProjects`:
```javascript
if (filterType === 'bisnis') {
    return matchesSearch && (templateType === 'toko-online' || templateType === 'company-profile');
}
```

3. Tambahkan juga `|| templateType === 'company-profile'` di kondisi tombol:
   - Tombol **Edit** (yang muncul di kartu proyek)
   - Tombol **Bagikan** (jika tipe baru bisa dibagikan via link undangan)

### Langkah Tambahan G — Daftarkan produk di database Supabase

Tabel `products` di Supabase perlu memiliki entri untuk `template_type` baru:

```sql
INSERT INTO products (id, name, cost, is_active, unit)
VALUES (
    'company-profile',
    'Company Profile',
    19000,
    true,
    'Campaign'
);
```

---

## 🤖 Fitur Asisten AI & Mekanisme Quota/Billing

Sistem Wuzzkang menyediakan asisten berbasis AI untuk copywriting teks dan pembuatan avatar gambar secara dinamis dengan pembatasan kuota dan penagihan biaya berbasis saldo wallet dompet.

### 1. Konfigurasi Global & Override Per-User
- **Tabel `system_settings`**: Menyimpan konfigurasi global sistem dalam format key-value JSONB:
  - `daily_ai_limit` (default: `15`): Batas kuota gratis harian per user untuk seluruh generate AI.
  - `ai_generate_cost` (default: `100`): Biaya berbayar per generate jika kuota gratis harian habis (dalam Rupiah).
- **Tabel `profiles`**: Menyimpan kolom `daily_ai_limit` dan `ai_generate_cost` yang bernilai **nullable (default NULL)**.
  - Jika nilainya `NULL`, sistem otomatis merujuk ke tabel `system_settings`.
  - Jika nilainya diisi (not null), nilai tersebut akan menjadi override khusus (misal untuk akun VIP/developer).

### 2. Mekanisme Quota di Redis
- Setiap kali user melakukan generate AI (baik teks via `/api/generate/field` maupun gambar via `/api/generate-image`), sistem mengecek counter harian di Redis menggunakan key:
  `wuzzkang:user:${userId}:ai_field_limit:${today}`
- Jika counter harian `< daily_ai_limit`:
  - Request dijalankan secara **GRATIS**.
  - Counter harian Redis bertambah (`INCR`).
- Jika counter harian `≥ daily_ai_limit`:
  - Sistem memeriksa apakah saldo wallet user (`profiles.balance`) mencukupi tarif `ai_generate_cost`.
  - Jika cukup, saldo dipotong secara langsung via `walletService.deductBalance` dan request dijalankan secara **BERBAYAR**.
  - Jika saldo kurang, mengembalikan error `402 Payment Required`.

### 3. Integrasi di Dashboard UI (`wuzzkang-dashboard`)
- **Copywriting Teks**:
  - Di-handle oleh helper `renderAITokoButton(...)` (untuk Toko Online) dan `renderAICampaignButton(...)` (untuk Campaign).
  - Melakukan panggilan ke `/api/generate/field`.
- **Avatar Gambar (Undangan)**:
  - Di-handle oleh helper `renderAIAvatarButton(...)` (untuk Wedding/Birthday).
  - Melakukan panggilan ke `/api/generate-image`.
- **Interaksi & Quota Update**:
  - Tombol-tombol AI akan otomatis mendeteksi sisa limit harian: `✨ AI Generate (Gratis: X)` atau `✨ AI Generate (Y Credit)`.
  - Sebelum menagih (jika gratis = 0), dashboard memicu popup dialog `window.confirm` untuk mengonfirmasi pemotongan saldo.
  - Setelah generate sukses, dashboard memanggil `await refreshProfile()` untuk menyelaraskan sisa kuota dan saldo user di UI secara real-time.

---

## 🌐 Integrasi AI Gambar Dinamis & Alur Media Upload

### 1. Endpoint `/api/media/upload` (Unggah Media Melalui Backend)
Untuk menghindari tereksposnya Supabase write API key pada sisi client, dashboard mengunggah seluruh berkas gambar manual pengguna melalui backend.
*   **Headers**:
    *   `Content-Type` (misal `image/jpeg`)
    *   `x-file-name` (nama file asli)
*   **Request Body**: Biner mentah (*octet-stream*).
*   **Operasi Backend**: Membaca binary stream, menamai ulang file dengan format timestamp acak unik, lalu mengunggahnya ke bucket `wuzzkang-bucket/uploads` menggunakan `supabase.storage` admin client, dan mengembalikan URL publik.

### 2. Endpoint `/api/media/process` (Pemrosesan Gambar AI & Fallback)
Endpoint satu pintu untuk memproses media dengan alur penanganan kegagalan (*graceful fallback*):
*   **Mode `generate_avatar`**: Menghasilkan gambar avatar berbasis prompt AI menggunakan model terkonfigurasi.
*   **Model & Provider Dinamis**: Model diatur oleh `IMAGE_AI_PROVIDER` (`openai`/`sumopod`) dan `IMAGE_AI_MODEL` di `.env` backend.
*   **Logika Fallback**: Jika salah satu API key provider yang dipilih bermasalah/habis kuotanya, backend otomatis mendeteksi ketersediaan API key provider cadangan (OpenAI <=> Sumopod) dan melakukan pemrosesan ulang secara diam-mana sebelum akhirnya menggunakan avatar default gender-aware jika seluruhnya gagal.

---

## 🧪 Cara Testing Lokal

```bash
# Pastikan menggunakan Node v22.x
node --version  # harus v22.x

# 1. Jalankan wuzzkang-api
cd wuzzkang-api && node server.js
# API berjalan di port 3026

# 2. Jalankan dashboard dev server
cd wuzzkang-dashboard && npm run dev
# Dashboard berjalan di port 3000

# 3. Sync template setiap kali ada perubahan di wuzzkang-lp
cd wuzzkang-dashboard && npm run sync:templates

# 4. (Opsional) Jalankan LP secara lokal
cd wuzzkang-lp && python3 -m http.server 5000
```

**Cara test preview template:**
1. Buka dashboard `http://localhost:3000/generate`
2. Pilih tipe template
3. Klik tombol desain baru → klik **"Lihat Contoh Desain"**
4. Modal akan membuka iframe dari `/preview/index.html` yang load template dari `/preview/templates/`
5. Pastikan template tampil tanpa error di console

---

## 📡 Tracking Pixel Integration (Phase 5)

### Mekanisme

Wuzzkang mendukung injeksi tracking script secara otomatis ke setiap landing page melalui mekanisme **Profile-Centric Tracking** yang terdiri dari 3 lapisan:

```
User simpan pixel ID → profiles.tracking_config (DB)
                                 ↓
           POST /api/generate (API merge tracking_config ke pageData.meta)
                                 ↓
          projects.page_data.meta.facebook_pixel_id, dll (disimpan di DB)
                                 ↓
      wuzzkang-lp/script.js baca pageConfig.meta → inject <script> tag
```

### Platform yang Didukung

| Pixel/Tag | Field Key | Contoh Nilai | Script Source |
|---|---|---|---|
| Facebook / Meta Pixel | `facebook_pixel_id` | `1234567890` | `connect.facebook.net` |
| Google Analytics 4 | `google_analytics_id` | `G-XXXXXXXXXX` | `googletagmanager.com` |
| Google Ads | `google_ads_id` | `AW-XXXXXXXXXX` | `googletagmanager.com` |
| TikTok Pixel | `tiktok_pixel_id` | `CXXXXXXXXXXXXXXXXX` | `analytics.tiktok.com` |

### Lokasi Kode

- **Database:** `public.profiles.tracking_config` (JSONB, migration: `20260704_add_tracking_config_to_profiles.sql`)
- **API endpoint:** `PATCH /api/profile/tracking` — simpan/update pixel config
- **API merge:** `wuzzkang-api/src/routes/generator.route.js` — merge tracking ke `pageData.meta` sebelum simpan
- **Schema:** `wuzzkang-api/src/utils/schema.js` — semua `meta` schema memiliki field tracking opsional
- **LP Runtime:** `wuzzkang-lp/script.js` — fungsi `injectFacebookPixel()`, `injectGoogleTag()`, `injectTikTokPixel()` dipanggil setelah `renderPage()`
- **Dashboard UI:** `wuzzkang-dashboard/src/app/profile/page.js` — halaman profil dengan form tracking
- **Generate Banner:** `wuzzkang-dashboard/src/app/generate/page.js` — banner read-only status pixel dengan link ke `/profile#tracking`

### Custom Domain Readiness

> **Desain ini sudah custom-domain-ready.**

Injeksi tracking terjadi di `wuzzkang-lp/script.js` (LP runtime), bukan di level template atau routing. Script membaca `pageConfig.meta` yang sudah berisi pixel ID, kemudian menambahkan `<script>` tag ke `document.head`. Karena:
- Tidak ada hardcoded domain assumption di script injector
- Google Tag (`gtag.js`) dan TikTok Pixel menggunakan CDN eksternal yang domain-agnostic
- Facebook Pixel tidak terikat ke origin URL

Maka tracking akan bekerja identik pada:
- GitHub Pages slug (`siluet.web.id/?slug=xxx`)
- Subdomain staging (`xxx.bmstaging.id`)
- Custom domain apapun yang dipasang di masa depan

### Penambahan Platform Baru

Untuk menambahkan platform tracking baru (misal: Snapchat Pixel):
1. Tambah field baru di `profiles.tracking_config` schema — tidak perlu migration baru (JSONB flexible)
2. Tambah field di `TrackingConfigSchema` di `profile.route.js`
3. Tambah field opsional di semua `meta` schema di `schema.js`
4. Tambah merge logic di `generator.route.js`
5. Tambah fungsi `injectSnapchatPixel()` di `script.js` dan panggil di injection block
6. Tambah field di `TRACKING_FIELDS` array di `profile/page.js`
7. Bump `LP_VERSION` di `script.js` dan `PREVIEW_VERSION` di `preview/index.html`
8. Jalankan `npm run sync:templates`

---

## 🧩 Komponen Template Reusable (Shared Components)

Untuk menjaga agar kode template tetap bersih dan modular, fungsionalitas UI yang berulang diimplementasikan sebagai komponen ES Module di dalam direktori `templates/components/`.

### 1. `ImageSlider.js`
Komponen ini digunakan untuk merender galeri foto dengan transisi geser (carousel slider) secara responsif.

*   **Lokasi File**: `templates/components/ImageSlider.js`
*   **Cara Penggunaan**:
    ```javascript
    import { ImageSlider } from '../components/ImageSlider.js';

    // Di dalam HTML template render:
    // <div class="slider-container" id="my-gallery-slider"></div>

    const images = ['url1.jpg', 'url2.jpg'];
    const slider = new ImageSlider('my-gallery-slider', images);
    slider.setup();
    ```

### 2. `WishesBoard.js`
Komponen ini menyatukan rendering UI Buku Tamu (Form RSVP, pilihan stiker, daftar komentar) dan penanganan interaksinya secara terpusat. Komponen ini menyimpan ucapan secara otomatis di `localStorage` dengan key unik berbasis judul undangan.

*   **Lokasi File**: `templates/components/WishesBoard.js`
*   **Cara Penggunaan**:
    ```javascript
    // Di dalam HTML template render, siapkan container:
    // <div id="wishes-board-root"></div>

    // Di dalam fungsi JavaScript template render:
    const wishesRoot = document.getElementById('wishes-board-root');
    if (wishesRoot) {
        const { initWishesBoard } = await import('../components/WishesBoard.js');
        initWishesBoard(wishesRoot, pageConfig, guestName, {
            primaryColor: '#5A7C64',      // Warna primer (teks, outline aktif)
            bgLight: '#F8FAF9',           // Warna background form input & kartu
            borderColor: '#EAF0EC',       // Warna border form input
            buttonClass: 'btn-sage-primary' // Kelas CSS kustom untuk tombol submit
        });
    }
    ```
