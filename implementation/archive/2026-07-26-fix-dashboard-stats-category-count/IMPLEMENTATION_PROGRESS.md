# Implementation Progress — Fix: Dashboard Stats & Category Count Bug

## Task
Bug: Di halaman home/dashboard, stats header (Total Halaman, Aktif Deploy, Draft/Proses) dan badge count tab filter berubah mengikuti filter kategori yang aktif. Seharusnya stats selalu menampilkan data keseluruhan semua halaman, bukan bergantung filter aktif.

## Root Cause
`totalCount` state berasal dari API response yang sudah difilter (bergantung `filterType`). Ketika user klik tab "Undangan", API hanya mengembalikan 2 project → `totalCount = 2` → semua stats ikut berubah.

Selain itu tab "Undangan" dan "Toko/Bisnis" tidak punya `count` badge sehingga tampil kosong.

## Changes

### `wuzzkang-dashboard/src/app/page.js`
- [x] Tambah 5 state baru: `grandTotalCount`, `globalDeployedCount`, `globalDraftCount`, `undanganCount`, `bisnisCount`
- [x] Tambah function `fetchGlobalStats()` — fetch 3 endpoint paralel (`filter=all`, `filter=undangan`, `filter=bisnis`) untuk mendapatkan jumlah global
- [x] Tambah `useEffect` untuk memanggil `fetchGlobalStats()` sekali saat session siap
- [x] Stats header "Total Halaman" → pakai `grandTotalCount` (bukan `totalCount`)
- [x] Stats header "Aktif Deploy" → pakai `globalDeployedCount` (bukan `projects.filter(...)`)
- [x] Stats header "Draft / Proses" → pakai `globalDraftCount`
- [x] Tab "Semua" → badge count pakai `grandTotalCount`
- [x] Tab "Undangan" → badge count pakai `undanganCount`
- [x] Tab "Toko / Bisnis" → badge count pakai `bisnisCount`

## Status
- [x] Code implemented
- [ ] User confirmation (pending)
