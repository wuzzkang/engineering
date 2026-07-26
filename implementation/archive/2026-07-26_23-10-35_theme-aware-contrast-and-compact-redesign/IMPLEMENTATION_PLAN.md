# Implementation Plan — Theme-Aware Contrast & Success Colors

- **Goal**: Implement dynamic CSS theme variables (`--theme-success`, `--theme-success-bg`, `--theme-success-border`) to ensure text contrast automatically adapts per theme (Clean Light Theme uses `#047857` Emerald-700 for comfortable, non-glare reading, while Dark & Retro themes use vibrant emerald tones).
- **Status**: Approved for Implementation

## User Review Required
> [!IMPORTANT]
> Penyesuaian ini menggantikan hardcoded `text-emerald-400` dengan CSS variable semantik `text-theme-success`, `bg-theme-success-bg`, dan `border-theme-success-border`.
> Di **Clean Light Theme**, warna teks akan otomatis disesuaikan menjadi hijau emerald gelap berpenampilan kontras tinggi (`#047857`) pada latar belakang putih/terang sehingga **sangat nyaman di mata**, sedangkan di **Classic Dark** dan **Retro Theme** akan tetap menggunakan warna neon emerald yang kontras tinggi di latar belakang gelap.

## Proposed Changes

### Dashboard Global CSS (`wuzzkang-dashboard/src/app/globals.css`)
- Tambahkan variabel CSS `--theme-success`, `--theme-success-bg`, dan `--theme-success-border` di bawah `@theme` dan deklarasi `:root`, `[data-theme="retro"]`, serta `[data-theme="classic-dark"]`.

### Dashboard Pages & Components
- Perbarui `wuzzkang-dashboard/src/app/topup/page.js` untuk mengonsumsi `text-theme-success`, `bg-theme-success-bg`, dan `border-theme-success-border`.
- Perbarui komponen terkait pada `admin/page.js`, `payments/history/page.js`, dan `app/page.js`.

## Verification Plan

### Automated Tests
- Jalankan `npm run build` di `wuzzkang-dashboard` (Node.js 24).
