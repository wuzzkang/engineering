# Decision Log — Theme-Aware Contrast & Success Colors

## Decision 1: Penambahan Variable CSS Semantik untuk Status Success
- **Context**: Pada Clean Light Theme (background `#ffffff` / `#fcfbf9`), warna `text-emerald-400` (`#34d399`) terlihat silau dan kurang kontras sehingga menyakitkan mata penglihatan pengguna.
- **Decision**: Menambahkan variabel CSS `--theme-success`, `--theme-success-bg`, dan `--theme-success-border` ke skema tema global `globals.css`.
- **Rationale**: Clean Light Mode akan menggunakan `#047857` (Emerald-700) dengan latar belakang `#ecfdf5` yang nyaman di mata, sedangkan Dark/Retro theme tetap menggunakan warna hijau emerald terang yang kontras tinggi pada background gelap.
