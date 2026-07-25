# Implementation Plan — Fix: Dashboard Stats & Category Count Bug

## Objective
Perbaiki bug stats header dashboard yang ikut berubah saat filter tab kategori diganti.

## Plan
1. Identifikasi root cause: `totalCount` dari API yang sudah difilter dipakai untuk semua stats
2. Tambah state terpisah untuk global stats: `grandTotalCount`, `globalDeployedCount`, `globalDraftCount`, `undanganCount`, `bisnisCount`
3. Implementasi `fetchGlobalStats()` — 3 parallel fetch
4. Update rendering stats header dan tab badge count

## Completed
✅ Semua langkah selesai dan diconfirm user.
