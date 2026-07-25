---
name: wuzzkang-token-optimization-guard
description: Standard Operating Procedure (SOP) untuk memaksimalkan efisiensi token context window pada proyek Wuzzkang (pembacaan file berbasis range line, diff-chunk editing, filter output terminal) serta efisiensi token runtime API (Redis MD5 Cache & Granular Prompt).
---

# SOP Token Optimization & Efficiency Guard — Wuzzkang Ecosystem

## Unique Identifier
- Whenever this skill is activated, ALWAYS prefix your very first response with the tag: `[WUZZKANG-TOKEN-GUARD-AGENT]`

Dokumen ini adalah acuan standar bagi AI Assistant untuk menghemat konsumsi token *context window* saat koding maupun mengoptimalkan efisiensi token pada API runtime Wuzzkang.

---

## 🎯 1. Aturan Penghematan Token Context Window (AI Coding Assistant)

Untuk mencegah kehabisan kuota token saat berinteraksi dan koding:

### 1.1 Pembacaan File Spesifik (Line Range Reading)
- **DILARANG KERAS** membaca seluruh isi file raksasa (seperti `generate/page.js` 9.841 baris) sekaligus jika hanya membutuhkan bagian fungsi tertentu.
- Gunakan batasan `StartLine` dan `EndLine` (maksimal 100–300 baris) atau gunakan `grep_search` untuk menemukan lokasi fungsi secara spesifik.

### 1.2 Pengeditan Berbasis Diff-Chunk
- Gunakan pembaruan kode berbasis blok kecil (*diff replacement chunks*).
- Dilarang mengganti seluruh isi file jika hanya mengubah 10-20 baris kode.

### 1.3 Pembatasan Output Terminal & Logs
- Batasi output perintah terminal agar tidak membanjiri context window (misal: gunakan `git log -n 5` atau `head -n 20`).
- Saat mengekstrak log eror, ambil hanya baris *stack trace* yang paling relevan.

### 1.4 Respon Singkat & Padat
- Berikan ringkasan progres secara padat dan langsung ke poin utama (*concise summaries*).
- Dilarang mengulang kembali isi dokumentasi atau file yang sudah dibaca jika tidak diminta.

---

## 💰 2. Aturan Penghematan Token API Runtime (Wuzzkang System)

Untuk menghemat biaya token LLM pada backend Wuzzkang (`wuzzkang-api`):

1. **Wajib Redis MD5 Context Caching**: Setiap panggilan `generateFieldContent` wajib mengecek cache Redis berbasis hash MD5 konteks (TTL 24 jam) sebelum memanggil API Gemini.
2. **Granular Per-Section Prompt Over Full-Page**: Utamakan penggunaan *Smart Starter Kits* (`v2Presets.js`) dan *per-section AI assist* ketimbang melakukan generasi satu halaman penuh secara sekaligus.
3. **Model Efisien**: Gunakan `gemini-2.5-flash` sebagai model standar yang cepat, hemat biaya, dan responsif.
