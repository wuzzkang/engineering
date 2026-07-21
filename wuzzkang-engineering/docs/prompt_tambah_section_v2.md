# Prompt Referensi: Menambah Section V2 Baru ke Modular Section Builder (`dynamic-builder`)

Dokumen ini berisi panduan dan contoh prompt siap pakai untuk diberikan ke AI coding assistant (seperti Cursor / Antigravity) ketika ingin **menambahkan Section V2 Baru** atau **menambahkan preset gaya desain baru** ke dalam sistem Wuzzkang V2 Modular Section Builder.

> [!NOTE]
> Dokumen ini dibuat: 2026-07-21 pasca migrasi V2 Modular Section Builder (`dynamic-builder`).
> Seluruh pola implementasi mengikuti standar `getSectionStyle` terpusat dan arsitektur komponen ES Module.

---

## 📐 Ringkasan Arsitektur V2 Section Builder

Dalam sistem V2, halaman landing page tidak lagi menggunakan template monolitik kaku, melainkan menggunakan `template_type: dynamic-builder` yang menyusun array dari section modular dinamis.

Setiap section terdiri dari 4 bagian:
1. **ES Module Component (`wuzzkang-lp`)**: File perenderan HTML di `templates/components/sections/[section_type]/[file_name].js`.
2. **Synced Component (`wuzzkang-dashboard`)**: Duplikat file perenderan untuk live preview sandbox di `public/preview/templates/components/sections/[section_type]/[file_name].js`.
3. **Editor Form UI (`page.js`)**: Form pengisian konten di `wuzzkang-dashboard/src/app/generate/page.js` (dilengkapi `renderSectionStylePicker(section)` dan `renderAIV2Button(section.id, sectionType)`).
4. **Zod Validation Schema (`wuzzkang-api`)**: Skema validasi payload di `wuzzkang-api/src/utils/schema.js`.

---

## Skenario 1: Menambah SECTION V2 BARU (Contoh: Testimonial Carousel / Video Hero)

> Gunakan prompt ini ketika ingin menambahkan tipe section baru ke dalam Modular Section Builder.

### ✅ Contoh Prompt

```markdown
Tolong baca .cursorrules dan ikuti panduan di wuzzkang-engineering/docs/07_RENDER_ENGINE.md & 10_AI_GUIDE.md.

Saya ingin menambahkan Section V2 baru ke dalam Modular Section Builder (dynamic-builder):

**Nama Section:** Testimonial Carousel
**Section Type Key:** `testimonial_slider`
**File Name:** `testimonial_slider-navy.js`

**Field Input Data:**
- `title` (string) — Judul section testimoni
- `subtitle` (string) — Sub-judul penjelas
- `testimonials` (array of objects) — List kartu testimoni:
  - `name` (string) — Nama klien
  - `role` (string) — Jabatan / asal kota
  - `content` (string) — Isi ulasan / testimoni
  - `rating` (number/string) — Rating bintang (1-5)
  - `avatar_url` (string, opsional) — URL foto profil klien

**Langkah-langkah Implementasi yang Wajib Dikerjakan:**

1. **Buat Komponen ES Module di `wuzzkang-lp`**:
   Path: `wuzzkang-lp/templates/components/sections/testimonial_slider/testimonial_slider-navy.js`
   - Gunakan `import { getSectionStyle } from '../../../utils/sectionStyle.js';`
   - Panggil `getSectionStyle(data.bg_style || 'navy', data.bg_shade || 'solid', data.bg_brightness || 'default')` di awal `render()`.
   - Ekspor fungsi `render(data = {}, pageConfig = {}, brandConfig = {})` yang mengembalikan HTML string.

2. **Sync Komponen ke Preview Dashboard**:
   Copy atau buat file identik di: `wuzzkang-dashboard/public/preview/templates/components/sections/testimonial_slider/testimonial_slider-navy.js`.

3. **Daftarkan Opsi Section di Dropdown Editor**:
   Buka `wuzzkang-dashboard/src/app/generate/page.js`.
   Tambahkan `{ type: 'testimonial_slider', label: '💬 Testimonial Slider' }` ke dalam array opsi dropdown `+ Tambah Section`.

4. **Buat Block Editor Form di `page.js`**:
   Tambahkan blok `{section.type === 'testimonial_slider' && (...)}` di dalam render loop section editor:
   - Pasang `{renderSectionStylePicker(section)}`.
   - Pasang `{renderAIV2Button(section.id, 'testimonial_slider')}` di samping label judul.
   - Sediakan input text untuk `title`, `subtitle`, dan repeater form untuk array `testimonials`.

5. **Daftarkan Schema Zod di API**:
   Buka `wuzzkang-api/src/utils/schema.js`.
   Daftarkan `TestimonialSliderSectionSchema` dan tambahkan ke union schema section V2.

6. **Verifikasi**: Pastikan build frontend dan backend berjalan tanpa syntax error.
```

---

## Skenario 2: Menambah TEMA WARNA / PRESET STYLE BARU ke Engine `getSectionStyle`

> Gunakan prompt ini ketika ingin menambahkan palet warna brand baru (misalnya: "Royal Purple" atau "Sunset Rose") yang dapat digunakan oleh SEMUA section V2 secara terpusat.

### ✅ Contoh Prompt

```markdown
Tolong tambahkan preset Tema Warna Brand baru ke dalam Centralized Styling Engine V2 (`getSectionStyle`).

**Nama Warna Baru:** Royal Purple
**Key Style:** `purple`
**Warna Dasar:** Background slate-950 / purple-950, aksen warna purple-500 / violet-500.

**Langkah Implementasi:**

1. **Update `sectionStyle.js` di `wuzzkang-lp` & `wuzzkang-dashboard/public/preview`**:
   Path 1: `wuzzkang-lp/templates/utils/sectionStyle.js`
   Path 2: `wuzzkang-dashboard/public/preview/templates/utils/sectionStyle.js`

   Tambahkan key `purple` ke dalam objek `themes`:
   ```javascript
   purple: {
       solid: 'bg-slate-950 text-white border-b border-purple-950/60',
       soft: 'bg-purple-950/60 text-white border-b border-purple-900/60',
       gradient: 'bg-gradient-to-b from-slate-950 via-purple-950/50 to-slate-950 text-white border-b border-purple-900/50',
       pattern: 'bg-slate-950 text-white border-b border-purple-950/60',
       topLine: 'bg-purple-500',
       badge: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
       heading: 'text-white',
       subtitle: 'text-purple-100/70',
       cardBg: 'bg-purple-950/40 border-purple-900/50 hover:border-purple-500/40',
       cardNum: 'bg-purple-500 text-white shadow-purple-500/20',
       cardTitle: 'text-white',
       cardDesc: 'text-purple-200/70',
       imgBorder: 'border-purple-900/60 shadow-xl',
       btnPrimary: 'bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-500/25',
       btnSecondary: 'bg-purple-950/80 hover:bg-purple-900/80 text-white border border-purple-800',
       faqBg: 'bg-purple-950/40 border-purple-900/60',
       footerBg: 'bg-slate-950 text-purple-100/70 border-t border-purple-950/60'
   }
   ```
   Pastikan logika override `bg_brightness === 'light'` juga mengenali `purple` untuk memberikan tinted background light (`bg-purple-50`).

2. **Daftarkan di Picker UI `page.js`**:
   Buka `wuzzkang-dashboard/src/app/generate/page.js`.
   Tambahkan `{ key: 'purple', label: '🔮 Royal Purple', bg: 'bg-purple-950 text-white border-purple-800' }` ke dalam array `renderSectionStylePicker`.
```

---

## Skenario 3: Menambah Mode Khusus / Toggle Fitur pada Section V2 (Contoh: Mode CTA Saja)

> Gunakan prompt ini ketika ingin menambahkan toggle mode khusus pada suatu section V2 (seperti toggle CTA Saja pada section Pricing atau toggle Video/Image pada Hero).

### ✅ Contoh Prompt

```markdown
Tolong tambahkan toggle mode "Video Only" ke dalam Hero Section V2 (`hero_split`).

**Fungsionalitas:**
- Menambahkan toggle `video_mode` (boolean) pada editor form Hero Section di `page.js`.
- Jika `video_mode` diaktifkan (true), tampilkan input text `video_url` (misal YouTube Embed URL).
- Di komponen `hero-split-navy.js`, jika `data.video_mode` true, ganti kolom gambar hero dengan iframe video player yang responsif.

**Langkah Implementasi:**
1. Update editor form Hero section di `wuzzkang-dashboard/src/app/generate/page.js` untuk menambahkan toggle switch `video_mode` dan input `video_url`.
2. Update komponen perenderan di `wuzzkang-lp/templates/components/sections/hero/hero-split-navy.js` dan duplikatnya di preview dashboard.
3. Update Zod schema `HeroSectionSchema` di `wuzzkang-api/src/utils/schema.js` untuk mengizinkan field `video_mode` dan `video_url`.
```

---

## 🛑 Invariansi & Aturan Penting V2

1. **WAJIB Menggunakan `getSectionStyle`**:
   Setiap komponen section V2 **DILARANG KERAS** menggunakan hardcoded class background/text internal yang tidak melewati `getSectionStyle`. Selalu teruskan `(bg_style, bg_shade, bg_brightness)`.

2. **WAJIB Sync Template**:
   Setiap membuat atau merubah komponen di `wuzzkang-lp/templates/components/sections/`, pastikan file di `wuzzkang-dashboard/public/preview/templates/components/sections/` disinkronkan.

3. **Solid Background pada Varian Light**:
   Varian background `light` harus berupa warna solid pekat (`bg-white` / `bg-emerald-50`) tanpa sufiks opacity (`/40`) agar tidak membaur dengan latar body gelap (`#020617`).
