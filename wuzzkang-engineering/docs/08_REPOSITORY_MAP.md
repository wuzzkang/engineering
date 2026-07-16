# 🗂️ Peta Repositori (Repository Map) — Wuzzkang

Dokumen ini memetakan struktur file dan direktori utama pada monorepo Wuzzkang. Dokumentasi ini membantu developer dan AI Coding Assistant menemukan file kode yang relevan dengan cepat.

---

## 📐 Ringkasan Monorepo

Wuzzkang menggunakan pola monorepo yang memisahkan area aplikasi menjadi tiga repositori utama dan satu direktori dokumentasi rekayasa:

```text
wuzzkang/
├── wuzzkang-api/          # Backend API (Express.js + Node.js)
├── wuzzkang-dashboard/    # Frontend User Dashboard (Next.js App Router)
├── wuzzkang-lp/          # Perender Landing Page (Vanilla JS Runtime & Templates)
└── wuzzkang-engineering/ # Dokumentasi Sistem & Audit Database
```

---

## 1. Backend API (`wuzzkang-api`)

Backend bertugas mengelola validasi, logika bisnis, pemotongan saldo wallet, kuota AI, integrasi payment gateway, dan persistensi data.

```text
wuzzkang-api/
├── src/
│   ├── config/
│   │   └── index.js              # Schema variabel lingkungan & konfigurasi global (.env)
│   ├── middleware/
│   │   ├── auth.middleware.js    # Interseptor otentikasi JWT token dari Supabase
│   │   └── errorMiddleware.js    # Penangangan Exception & Error terpusat
│   ├── routes/
│   │   ├── admin.route.js        # Endpoint statistik & daftar transaksi admin
│   │   ├── coupon.route.js       # Endpoint validasi & pengelolaan kupon
│   │   ├── generator.route.js    # Endpoint asisten AI teks (/api/generate/field)
│   │   ├── image.route.js        # Endpoint pemrosesan media terpadu & upload biner
│   │   ├── payment.route.js      # Endpoint invoice VA & notifikasi callback Winpay
│   │   ├── product.route.js      # Endpoint daftar harga produk template
│   │   ├── profile.route.js      # Endpoint informasi wallet & limit profil user
│   │   └── project.route.js      # Endpoint deployment & penyuntingan proyek
│   ├── services/
│   │   ├── admin.service.js      # Layanan kueri statistik & log transaksi admin
│   │   ├── ai.service.js         # Layanan integrasi LLM & chat copywriting
│   │   ├── coupon.service.js     # Logika kalkulasi diskon & verifikasi kupon
│   │   ├── project.service.js    # Alur deploy, edit, & refund proyek landing page
│   │   ├── supabase.service.js   # Wrapper query database PostgreSQL Supabase
│   │   └── wallet.service.js     # Layanan mutasi kredit saldo wallet
│   └── utils/
│       ├── redis.js              # Setup koneksi Redis client (untuk limit kuota AI)
│       └── schema.js             # Skema validasi PageSchema Zod global
├── tests/
│   └── unit/                     # Unit testing (project, wallet, & coupon services)
├── docker-compose.yml            # Konfigurasi container Redis lokal
├── .env                          # Konfigurasi kunci API, model AI, dan port lokal
├── server.js                     # Berkas inisialisasi & entrypoint utama HTTP server
└── package.json                  # Dependencies backend
```

---

## 2. User Dashboard (`wuzzkang-dashboard`)

Dashboard digunakan oleh pengguna untuk melakukan otentikasi, merancang isi halaman lewat form terstruktur, melihat pratinjau live, melakukan top-up wallet, dan memublikasikan landing page.

```text
wuzzkang-dashboard/
├── public/
│   └── preview/                  # Sandbox Iframe untuk Live Preview Editor
│       ├── templates/            # Hasil sinkronisasi template wuzzkang-lp
│       └── index.html            # Runtime render pratinjau lokal
├── src/
│   ├── app/                      # Direktori halaman Next.js (App Router)
│   │   ├── admin/
│   │   │   └── page.js           # Halaman Admin Panel (overview statistik & manual complete)
│   │   ├── generate/
│   │   │   └── page.js           # Formulir editor terstruktur lengkap & asisten AI
│   │   ├── login/
│   │   │   └── page.js           # Halaman masuk akun
│   │   ├── register/
│   │   │   └── page.js           # Halaman pembuatan akun baru
│   │   ├── topup/
│   │   │   └── page.js           # Halaman pembayaran & riwayat VA top-up
│   │   ├── layout.js             # Layout dasar (Navbar, Sidebar container)
│   │   └── page.js               # Berkas utama daftar landing page & filter produk
│   ├── components/
│   │   └── Sidebar.js            # Navigasi sidebar terpadu (Mobile/Desktop)
│   ├── hooks/
│   │   └── useRequireAdmin.js    # Hook pelindung rute halaman khusus admin
│   ├── lib/
│   │   └── adminApi.js           # Abstraksi panggilan API khusus admin (scalable)
│   └── context/
│       └── AuthContext.js        # Provider state otentikasi user & token Supabase
├── .env.local                    # Konfigurasi URL API & pengaturan kompresi gambar
├── tailwind.config.js            # Konfigurasi styling Tailwind CSS
└── package.json                  # Dependencies Next.js dashboard
```

---

## 3. Landing Page Runtime (`wuzzkang-lp`)

Situs static-runtime yang di-deploy ke GitHub Pages. Runtime ini bertugas memuat `pageConfig` secara dinamis sesuai URL slug dan merendernya ke browser.

```text
wuzzkang-lp/
├── templates/                    # File module template per-desain
│   ├── wedding/
│   │   ├── sage-green.js         # Tema sage-green undangan pernikahan
│   │   └── floral-pink.js        # Tema floral-pink undangan pernikahan
│   ├── birthday/
│   │   ├── cute-balloon.js       # Tema balon lucu undangan ultah
│   │   └── elegant-gold.js       # Tema emas elegan undangan ultah
│   ├── toko-online/
│   │   ├── modern-clean.js       # Varian minimalis bersih toko online
│   │   └── midnight-dark.js      # Varian gelap malam toko online
│   └── campaign/
│       ├── neon-conversion.js    # Varian neon konversi tinggi campaign
│       └── clean-trust.js        # Varian minimalis terpercaya campaign
├── index.html                    # Halaman perender tunggal dengan ID #app
└── script.js                     # Router klien utama & import dynamic template loader
```

---

## 4. Engineering Docs (`wuzzkang-engineering`)

Direktori dokumentasi teknis sistem dan rekaman audit database.

```text
wuzzkang-engineering/
├── audit/
│   └── DATABASE_AUDIT_2026_07_01.md  # Hasil audit skema tabel & kebijakan RLS
└── docs/
    ├── 00_FOUNDATION.md          # Filosofi, mental model, & konstitusi rekayasa
    ├── 02_CURRENT_STATE.md       # Status fitur terimplementasi & technical debt
    ├── 03_ARCHITECTURE.md        # Arsitektur sistem & boundary antar-layer
    ├── 04_DOMAIN_MODEL.md        # Model data bisnis, entity, & state machine
    ├── 08_REPOSITORY_MAP.md      # Peta file & direktori kode monorepo (Dokumen ini)
    ├── 06_FLOW_MAP.md            # Diagram sequence & alur proses runtime
    ├── 07_RENDER_ENGINE.md       # Panduan render engine & checklist template baru
    ├── 09_DATABASE_ARCHITECTURE.md # Struktur tabel SQL, RLS, & relasi ERD
    ├── 10_AI_GUIDE.md            # Mekanisme model AI & integrasi billing kuota
    ├── 13_ROADMAP.md             # Peta jalan pengembangan fitur masa depan
    └── 92_AI_PROMPT_LIBRARY.md   # Pustaka instruksi (prompts) developer AI
```
