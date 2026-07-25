# Implementation Summary — Fix: Dashboard Stats & Category Count Bug

## Problem
Stats header di halaman home dashboard (Total Halaman, Aktif Deploy, Draft/Proses) berubah mengikuti filter tab kategori yang aktif (Semua / Undangan / Toko/Bisnis). Ketika klik tab "Undangan", semua angka stats ikut berubah menjadi 2. Tab "Undangan" dan "Toko/Bisnis" juga tidak menampilkan badge count (kosong).

## Root Cause
`totalCount` state berasal dari API response yang sudah difilter. Stats card dan tab count semua membaca state yang sama sehingga ikut berubah saat filter aktif berubah.

## Solution
Tambah `fetchGlobalStats()` yang memanggil 3 endpoint paralel (`filter=all`, `filter=undangan`, `filter=bisnis`) sekali saat session siap. Hasilnya disimpan di state terpisah yang tidak berubah saat user mengganti tab filter.

## Files Changed
- `wuzzkang-dashboard/src/app/page.js` — tambah 5 state global stats + `fetchGlobalStats()` + useEffect + update rendering
