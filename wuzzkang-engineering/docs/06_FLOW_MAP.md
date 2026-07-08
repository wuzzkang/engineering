# 🗺️ Peta Alur Sistem (Flow Map) — Wuzzkang

Dokumen ini memetakan alur kerja runtime (*runtime flows*) utama di platform Wuzzkang. Peta alur ini berfungsi sebagai acuan bagi developer untuk memahami interaksi antarkomponen (Dashboard, API, Redis, Database, dan LP Runtime).

---

## 1. Alur Asisten AI & Pemeriksaan Kuota (Billing Check)

Alur ini memetakan apa yang terjadi saat user memicu tombol generate teks atau gambar berbasis AI di formulir editor dashboard.

```mermaid
sequenceDiagram
    autonumber
    actor User as Pengguna (Dashboard)
    participant DB as Dashboard (Client)
    participant API as Wuzzkang API (Backend)
    participant RD as Redis Cache
    participant LLM as Provider AI (Groq/OpenAI)
    participant PG as PostgreSQL DB

    User->>DB: Klik "Generate dengan AI"
    DB->>API: POST /api/generate/field ATAU /api/media/process
    Note over API: Verifikasi JWT Auth & Dapatkan userId
    API->>RD: GET wuzzkang:user:{userId}:ai_field_limit:{today}
    
    alt Kuota Gratis Harian Masih Ada (Counter < Limit)
        RD-->>API: Counter valid (gratis)
        API->>RD: INCR Counter (tambah 1)
    else Kuota Gratis Harian Habis (Counter >= Limit)
        RD-->>API: Counter habis
        API->>PG: Cek profiles.balance & cost
        alt Saldo Mencukupi
            PG-->>API: Saldo cukup
            API->>PG: Mutasi Saldo (Deduct Balance)
        else Saldo Kurang
            PG-->>API: Saldo tidak cukup
            API-->>DB: Respon 402 Payment Required
            DB-->>User: Tampilkan popup saldo habis / top-up
        end
    end

    API->>LLM: Kirim Prompt ke Model AI (Groq/OpenAI)
    LLM-->>API: Kembalikan Teks/Gambar hasil generate
    API-->>DB: Respon 200 OK + Data hasil AI + Sisa Kuota
    DB->>DB: Refresh Profil UI (Wallet & Limit Terkini)
    DB-->>User: Tampilkan Copywriting / Foto di form editor
```

---

## 2. Alur Publikasi / Penerbitan Landing Page (Deployment)

Alur mutasi finansial dan publikasi ketika draf halaman diubah statusnya menjadi aktif (*deployed*).

```mermaid
flowchart TD
    A[User klik tombol Publikasikan Halaman] --> B{Apakah project.status == 'draft'?}
    B -- Tidak --> C[Kembalikan error: Sudah dipublikasikan]
    B -- Ya --> D[Verifikasi keunikan custom slug di DB]
    D --> E{Slug sudah dipakai?}
    E -- Ya --> F[Tambahkan suffix acak unik ke slug]
    E -- Tidak --> G[Cek biaya template produk & Kupon]
    G --> H{Ada kupon diskon 100%?}
    H -- Ya --> I[Bypass pemotongan saldo wallet]
    H -- No --> J{Saldo wallet >= Biaya?}
    J -- Tidak --> K[Kembalikan 402 Payment Required]
    J -- Ya --> L[Deduct balance & buat mutasi transaksi PENDING]
    I --> M[Ubah status project ke 'deployed']
    L --> M
    M --> N[Mutasi status transaksi ke SUCCESS / PAID]
    N --> O[Kembalikan URL Live: https://siluet.web.id/?slug=xxx]
```

---

## 3. Alur Unggah Gambar Terproteksi (Direct Upload via Signed URL)

Keamanan penulisan file gambar ke Supabase Storage tanpa membebani memori server backend atau mengekspos kunci admin pada sisi klien.

```mermaid
sequenceDiagram
    autonumber
    actor User as Pengguna
    participant DB as Dashboard (Next.js)
    participant API as Wuzzkang API
    participant SUP as Supabase Storage Bucket

    User->>DB: Pilih file gambar lokal (.png/.jpg)
    Note over DB: Jika non-gambar > limit (env): Tolak langsung.<br/>Jika gambar > limit (env): Auto-resize via canvas.
    DB->>API: POST /api/media/upload-url (fileName, mimeType)
    Note over API: Validasi MIME-type (hanya gambar)<br/>Generate nama file unik acak
    API->>SUP: Buat Signed Upload URL
    SUP-->>API: Kembalikan Signed URL & token
    API-->>DB: Respon 200 OK dengan signedUrl & publicUrl
    DB->>SUP: HTTP PUT binary payload ke signedUrl
    SUP-->>DB: Respon 200 OK (Upload Sukses)
    DB-->>User: Tampilkan pratinjau gambar di form
```

---

## 4. Alur Pratinjau Iframe & Perenderan Landing Page Live

Proses transformatif data JSON dari Supabase menjadi representasi visual HTML menggunakan kode runtime perender terpusat.

```mermaid
flowchart TD
    subgraph Browser User
        A[Akses URL: siluet.web.id/?slug=xyz] --> B[script.js dijalankan]
    end
    subgraph Supabase DB
        B --> C[Fetch pageConfig & template_type & design_key berdasarkan slug]
    end
    C --> D{Data ditemukan?}
    D -- Tidak --> E[Tampilkan halaman 404 Not Found]
    D -- Ya --> F[Baca LP_VERSION & bentuk cacheBust query]
    F --> G[Dynamic import template: templates/type/design_key.js?v=LP_VERSION]
    G --> H[Jalankan fungsi template.render(pageConfig, guestName)]
    H --> I[HTML disuntikkan ke kontainer div #app]
```

---

## 5. Alur Top-Up Wallet (Payment Gateway Callback)

Siklus pengisian saldo akun pengguna menggunakan Virtual Account (VA) secara real-time.

```mermaid
sequenceDiagram
    autonumber
    actor User as Pengguna
    participant DB as Dashboard UI
    participant API as Wuzzkang API
    participant PG as Payment Gateway (Winpay)

    User->>DB: Pilih jumlah top-up (e.g. 500 Credit) & Bank VA
    DB->>API: POST /api/payments/create
    Note over API: Buat baris transaksi baru status PENDING di DB
    API->>PG: Minta VA (API Request)
    PG-->>API: Kembalikan nomor VA & instruksi bayar
    API-->>DB: Respon nomor VA
    DB-->>User: Tampilkan nomor VA & instruksi pembayaran
    
    Note over User: User melakukan transfer via ATM/Mobile Banking
    
    PG->>API: POST /api/payments/callback (Notification Hook)
    Note over API: Verifikasi tanda tangan RSA / MD5 signature callback
    Note over API: Cek keabsahan orderId di database lokal
    alt Validasi Sukses & Status Transaksi PENDING
        API->>API: Update status transaksi -> SUCCESS
        API->>API: Tambahkan nominal top-up ke profiles.balance
        API-->>PG: Respon HTTP 200 OK (Acknowledge)
    else Callback Duplikat / Tidak Valid
        API-->>PG: Respon HTTP 400 Bad Request / 200 (Ignore)
    end
```
