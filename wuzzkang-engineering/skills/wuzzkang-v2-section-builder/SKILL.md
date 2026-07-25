---
name: wuzzkang-v2-section-builder
description: Standard Operating Procedure (SOP) untuk membuat dan mengelola seksi komponen modular V2 (dynamic-builder), integrasi Centralized Styling Engine (getSectionStyle), 12-column grid, smart starter kits (v2Presets.js), dan skema Zod.
---

# SOP V2 Modular Section Builder (`dynamic-builder`) — Wuzzkang Ecosystem

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

1. **WAJIB Menggunakan `getSectionStyle`**:
   Semua komponen seksi V2 **DILARANG KERAS** menggunakan hardcoded class background/text internal yang tidak melewati `getSectionStyle`. Selalu teruskan `(data.bg_style, data.bg_shade, data.bg_brightness)`.
2. **WAJIB Sync Dual Directory**:
   Setiap perubahan pada komponen perenderan di `wuzzkang-lp/` wajib disinkronkan secara identik ke `wuzzkang-dashboard/public/preview/`.
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
