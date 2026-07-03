# AI Prompt Library

Purpose

Cara menggunakan prompt yang tersedia.

---

## Documentation Workflow

| Step | Prompt File |
|------|-------------|
| Generate Structure | prompt/001_GENERATE_STRUCTURE.md |
| Review Structure | prompt/002_REVIEW_STRUCTURE.md |
| Populate Batch | prompt/003_POPULATE_BATCH.md |
| Review Batch | prompt/004_REVIEW_BATCH.md |
| Apply Review | prompt/005_APPLY_REVIEW.md |
| Final Review | prompt/006_FINAL_REVIEW.md |
| Apply Final Review | prompt/007_APPLY_FINAL_REVIEW.md |
| Documentation QA | prompt/008_DOCUMENTATION_QA.md |

---

## Product & Template Expansion Prompts

Berikut adalah template perintah (prompts) yang siap disalin dan dikirimkan ke AI Coding Assistant ketika Anda ingin memperluas template atau menambah produk baru di platform Wuzzkang.

### 📋 1. Prompt untuk Menambah Desain/Tema Baru (Produk Sudah Ada)
```markdown
Tolong tambahkan desain template baru ke sistem Wuzzkang dengan detail berikut:
- Tipe Produk (template_type): [isi: wedding / birthday / toko-online / campaign]
- Key Desain (design_key): [isi: contoh-kebab-case]
- Nama Tampilan Desain: [isi: Contoh Desain Cantik 🌸]
- Gaya visual & warna: [isi deskripsi singkat: bernuansa pantai romantis, dominasi warna biru pastel & putih, font elegan, dsb]

Sebelum memulai, silakan baca terlebih dahulu panduan lengkap pembuatan template baru di file:
/wuzzkang-engineering/docs/07_RENDER_ENGINE.md bagian "Prosedur Menambahkan Desain Baru".

Ikuti seluruh checklist dari Langkah 1 sampai Langkah 6, termasuk sinkronisasi template (sync:templates), registrasi key di generate/page.js dashboard, registrasi Zod schema di API, bump versi cache-busting, serta melakukan pengetesan lokal.
```

### 🚀 2. Prompt untuk Menambah Produk Baru (Tipe Benar-benar Baru)
```markdown
Tolong tambahkan produk/tipe template baru ke sistem Wuzzkang dengan spesifikasi berikut:
- Nama Produk: [isi: Company Profile / Undangan Webinar / dll]
- Tipe Template (template_type): [isi: nama-kebab-case, misal company-profile]
- Desain Pertama (design_key): [isi: nama-kebab-case, misal clean-corporate]
- Form field data terstruktur yang dibutuhkan:
  * [isi daftar field yang perlu diinput user, misal: Nama Perusahaan, Logo, Headline, Sejarah Singkat, Layanan (array), Kontak Whatsapp, Alamat]
- Harga Aktivasi Produk: [isi nominal, misal: Rp 150.000]

Sebelum memulai, mohon baca instruksi lengkap penambahan produk baru dari hulu ke hilir pada file:
/wuzzkang-engineering/docs/07_RENDER_ENGINE.md bagian "Prosedur Menambahkan Produk Baru".

Pastikan Anda mengeksekusi semua langkah tambahan:
- Menambahkan routing render di wuzzkang-lp/script.js.
- Membuat Zod schema baru di wuzzkang-api/src/utils/schema.js & mendaftarkannya ke union PageSchema.
- Menangani parsing request payload baru di wuzzkang-api/src/routes/generator.route.js.
- Membuat state form, validasi isFormInvalid(), UI form builder, dan preview modal handler di wuzzkang-dashboard/src/app/generate/page.js.
- Mendaftarkan tab filter & filter logic baru di dashboard home page (wuzzkang-dashboard/src/app/page.js).
- Menyediakan query SQL INSERT produk baru untuk tabel `products` di database Supabase.
```