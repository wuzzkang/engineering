# Decision Log — Fix: Dashboard Stats & Category Count Bug

## Decision 1: Fetch Global Stats Paralel di Frontend (bukan perubahan backend)
- **Context:** Stats header harus selalu menampilkan total semua halaman
- **Decision:** Fetch 3 endpoint paralel di frontend (`filter=all`, `filter=undangan`, `filter=bisnis`) saat session ready, simpan di state terpisah
- **Rationale:** Tidak perlu perubahan backend. Cepat diimplementasi, backend sudah mendukung filter query param. Jumlah project per user relatif kecil sehingga fetch limit=9999 aman.
- **Trade-off:** 3 extra HTTP request saat pertama kali load (hanya sekali per session, tidak berulang)
