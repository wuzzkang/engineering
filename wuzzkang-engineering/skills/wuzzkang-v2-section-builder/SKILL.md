---
name: wuzzkang-v2-section-builder
description: Standard Operating Procedure (SOP) untuk membuat dan mengelola seksi komponen modular V2 (dynamic-builder), integrasi Centralized Styling Engine (getSectionStyle), 12-column grid, smart starter kits (v2Presets.js), dan skema Zod.
---

# SOP V2 Modular Section Builder (`dynamic-builder`) — Wuzzkang Ecosystem

## Unique Identifier
- Whenever this skill is activated, ALWAYS prefix your very first response with the tag: `[WUZZKANG-V2-BUILDER-AGENT]`

Dokumen ini adalah acuan standar bagi AI Assistant dan Engineer ketika membuat seksi komponen baru, menambahkan palet warna tema baru, atau memodifikasi komponen dalam sistem **V2 Modular Section Builder**.

---

## 🎯 1. Arsitektur Komponen Section V2

Setiap seksi V2 dalam `dynamic-builder` terdiri dari 4 bagian yang saling terhubung:
1. **ES Module Renderer (`wuzzkang-lp`)**: File perenderan HTML di `wuzzkang-lp/templates/components/sections/[section_type]/[file_name].js`.
2. **Synced Preview Component (`wuzzkang-dashboard`)**: Duplikat file perenderan untuk sandbox live preview di `wuzzkang-dashboard/public/preview/templates/components/sections/[section_type]/[file_name].js`.
3. **Editor Form UI (`page.js`)**: Pengisian konten di `wuzzkang-dashboard/src/app/generate/page.js` (wajib memuat `{renderSectionStylePicker(section)}` dan `{renderAIV2Button(...)}`).
4. **Zod Validation Schema (`wuzzkang-api`)**: Validasi payload di `wuzzkang-api/src/utils/schema.js`.

---

## 🛑 2. Invariansi & Aturan Penting V2

1. **WAJIB Menggunakan `getSectionStyle` & Dynamic Theme Variables**:
   Semua komponen seksi V2 **DILARANG KERAS** menggunakan hardcoded class background (`bg-slate-900`, `bg-rose-950`, `bg-amber-950`, dll), border, atau warna teks (`text-white`, `text-slate-400`, `text-amber-400`, `text-rose-300`, `text-emerald-300`, dll) pada kontainer card, elemen form, judul, deskripsi, badge, atau label. **WAJIB** menggunakan variabel warna dinamis dari `getSectionStyle` sesuai dengan **semantik elemen** berikut:

   | Elemen | Key yang Benar | Contoh Output |
   |--------|---------------|---------------|
   | Judul section (h2) | `${theme.heading}` | `text-white` / `text-slate-900` |
   | Subtitle / deskripsi section | `${theme.subtitle}` | `text-slate-400` / `text-stone-600` |
   | Judul di dalam card | `${theme.cardTitle}` | `text-white` / `text-slate-900` |
   | Deskripsi / teks muted di dalam card | `${theme.cardDesc}` | `text-slate-400` / `text-emerald-200/70` |
   | Background container card / border card | `${theme.cardBg}` | `bg-slate-900/60 border-slate-800 ...` |
   | Pill badge (bg + teks + border sekaligus) | `${theme.badge}` | `bg-rose-500/10 text-rose-400 border-rose-500/20` |
   | Tombol CTA utama | `${theme.btnPrimary}` | `bg-orange-500 hover:bg-orange-600 text-white ...` |
   | Tombol sekunder / outline | `${theme.btnSecondary}` | `bg-slate-900 hover:bg-slate-800 ...` |
   | **Teks accent tanpa background** (label, tanggal, caption, dekoratif) | `${theme.topLine.replace('bg-', 'text-')}` | `text-emerald-500` / `text-rose-500` |
   | Lingkaran nomor berbg accent (numbered circles) | `${theme.cardNum}` | `bg-emerald-500 text-white shadow-...` |

   > ⚠️ **CRITICAL RULE**: `${theme.cardNum}` mengandung class GABUNGAN (`bg-{color} text-white shadow-{color}`) — **HANYA** dipakai pada elemen lingkaran nomor (`div` bulat). **JANGAN** dipakai pada `<span>` teks biasa, label, atau caption karena akan memunculkan background yang tidak diinginkan.
   >
   > ⚠️ **CRITICAL RULE**: `${theme.badge}` mengandung class GABUNGAN (`bg-{color}/10 text-{color} border border-{color}/20`) — cocok untuk pill badge section header. Jika elemen HANYA butuh warna teks saja (tanpa bg+border), gunakan `${theme.topLine.replace('bg-', 'text-')}`.

   Agar responsif 100% saat pengguna mengganti `Tema Warna Landing Page (Global)` (`bg_style`: navy, emerald, amber, purple, rose, slate, light, white, cream, obsidian).
2. **WAJIB Sync Dual Directory (`wuzzkang-lp` & `wuzzkang-dashboard`)**:
   Setiap pembuatan, perbaikan bug, atau perubahan pada komponen perenderan di `wuzzkang-lp/templates/components/sections/` **WAJIB SINKRON 100%** secara identik ke `wuzzkang-dashboard/public/preview/templates/components/sections/` agar tampilan Live Sandbox Preview di Dashboard `/generate/v2` selalu presisi dengan hasil akhir terdeploy.
3. **Solid Background pada Varian Light**:
   Varian background `light` harus berupa warna solid (`bg-white` / `bg-emerald-50`) tanpa opacity (`/40`) agar tidak membaur dengan latar body gelap (`#020617`).
4. **100% Dynamic Theme CSS Variable Reactivity**:
   Semua form pengisian seksi V2 (`V2SectionWeddingForms`, `V2SectionStandardForms`, `ImagePickerField`, `V2SectionFormDispatcher`) **WAJIB** menggunakan variabel tema CSS (`bg-theme-bg`, `bg-theme-surface`, `bg-theme-card`, `border-theme-border`, `text-theme-text`, `bg-theme-accent`) agar responsif terhadap 3 Tema Dashboard Global (`Clean`, `Retro`, `Classic Dark`).
5. **Mobile Touch Split Resizer & Sticky Action Bar**:
   Editor V2 pada layar HP wajib mendukung bilah resizer interaktif yang dapat diseret (`↕️ Seret Atas / Bawah`), switcher tab mobile (`Form`, `Split`, `Preview`), dan sticky action bar untuk tombol `🚀 Publikasikan / Deploy`.

---

## 🛠️ 3. Skenario Pengembangan V2

### Skenario A: Menambah Section V2 Baru (contoh: `testimonial_slider`)
1. **ES Module Component**: Buat perenderan di `wuzzkang-lp/templates/components/sections/[section_type]/[file].js` menggunakan `getSectionStyle(data.bg_style || 'navy', data.bg_shade || 'solid', data.bg_brightness || 'default')`.
2. **Sync Preview**: Salin file perenderan secara identik ke `wuzzkang-dashboard/public/preview/templates/components/sections/[section_type]/[file].js`.
3. **Dropdown Option**: Tambahkan opsi tipe baru ke array dropdown `+ Tambah Section` di `page.js`.
4. **Form Editor UI**: Tambahkan blok `{section.type === '[section_type]' && (...)}` di `page.js` yang memuat picker gaya visual dan tombol AI assist.
5. **Schema Zod**: Daftarkan schema validasi baru di `wuzzkang-api/src/utils/schema.js`.

### Skenario B: Menambah Tema Warna / Preset Style Baru
1. Update `themes` di `sectionStyle.js` pada **KEDUA** path (`wuzzkang-lp/templates/utils/sectionStyle.js` & `wuzzkang-dashboard/public/preview/templates/utils/sectionStyle.js`).
2. Pasang override `bg_brightness === 'light'` untuk palet baru tersebut.
3. Daftarkan opsi warna baru di picker UI `renderSectionStylePicker` di `page.js`.

### Skenario C: Menambah Starter Kit Preset V2 Baru (`v2Presets.js`)
1. Buka file `wuzzkang-dashboard/src/app/generate/v2Presets.js`.
2. Jika memerlukan kategori baru, daftarkan di array `V2_STARTER_CATEGORIES` (misal: `{ id: 'fotografi', name: 'Web Fotografi', icon: '📸' }`).
3. Tambahkan objek preset baru ke dalam array `V2_STARTER_PRESETS` dengan struktur **WAJIB**:
   - `id`: identifier unik preset (misal: `'photo-portfolio-dark'`)
   - `category`: id kategori terdaftar di `V2_STARTER_CATEGORIES`
   - `name`: nama judul preset (misal: `'Dark Elegance Photography'`)
   - `icon`: emoji visual ikon (misal: `'📸'`)
   - `badge`: badge singkat (misal: `'High Impact'`)
   - `description`: ringkasan visual & gaya layout
   - `suitableFor`: tag rekomendasi peruntukan (misal: `'Fotografer, wedding studio, & videografer'`)
   - `keywords`: **[WAJIB]** array sinonim & kata kunci pencarian (misal: `['fotografi', 'photo', 'camera', 'lensa', 'studio', 'portfolio', 'gallery']`)
   - `defaultBrandName` & `defaultBrief`: nilai awal deskripsi bisnis
   - `sections`: array tumpukan seksi awal
4. Mesin pencari Tokenized Smart Search Engine (`wuzzkang-dashboard/src/app/generate/v2/page.js`) akan **otomatis mencocokkan, memfilter, dan mengurutkan** preset baru tersebut secara presisi tanpa perlu mengubah kode UI.
5. Utilitas mesin pencari terisolasi di `wuzzkang-dashboard/src/utils/v2PresetSearch.js` dan komponen modal onboarding terenkapsulasi di `wuzzkang-dashboard/src/components/v2-editor/V2PresetOnboardingModal.js` dengan optimasi `useMemo`.

