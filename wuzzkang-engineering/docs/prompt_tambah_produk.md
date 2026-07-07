# Prompt Referensi: Menambah Produk / Template Baru ke Wuzzkang AI Platform

Dokumen ini berisi contoh prompt siap pakai untuk diberikan ke AI coding assistant
ketika ingin menambah produk baru atau template baru ke sistem wuzzkang.

> [!NOTE]
> Dokumen ini terakhir diperbarui: 2026-07-05 (refactor ImagePickerField + verifikasi fungsi).
> Semua nama model, endpoint, dan pola implementasi mengikuti kondisi sistem terkini.

---

## Skenario 1: Menambah PRODUK BARU dari Nol

> Gunakan prompt ini ketika ingin menambahkan jenis undangan/halaman yang belum pernah ada,
> misalnya: "Undangan Khitanan", "Undangan Reuni", "Landing Page Event", dsb.

### ✅ Contoh Prompt

```
Tambahkan produk baru ke sistem AI Platform wuzzkang dengan spesifikasi berikut:

**Nama produk:** Undangan Khitanan
**Task type key:** `khitanan`
**Deskripsi:** Generate konten teks untuk undangan khitanan/sunatan secara otomatis menggunakan Gemini.

**Field input yang diisi user:**
- `childName` (string) — nama anak yang dikhitan
- `childNickname` (string) — nama panggilan
- `fatherName` (string) — nama ayah
- `motherName` (string) — nama ibu
- `eventDate` (string) — tanggal acara
- `eventTime` (string) — waktu acara
- `eventLocation` (string) — lokasi acara
- `theme` (string, opsional) — preferensi tema (misal: "islami", "modern", "tradisional")

**Output yang diharapkan dari AI (JSON):**
- `banner_tagline` — tagline utama undangan
- `invitation_intro` — paragraf pembuka undangan
- `closing_message` — kalimat penutup

**Langkah yang harus dikerjakan:**
1. Buat file `KhitananTaskCompiler.js` di `src/services/ai-platform/compilers/` mengikuti pola yang sama dengan `WeddingTaskCompiler.js`.
2. Daftarkan compiler baru di `src/services/ai-platform/register.js` dengan key `'khitanan'`.
3. Pastikan tidak mengubah file lain selain kedua file di atas.
4. Tidak perlu membuat endpoint baru — endpoint `POST /api/v1/ai/execute` sudah tersedia dan akan dipakai otomatis.

**Referensi pola yang harus diikuti:**
- Lihat `WeddingTaskCompiler.js` sebagai contoh implementasi yang benar.
- Ikuti kontrak `TaskCompiler.js` di folder `contracts/`.
- Gunakan `targetModel: 'gemini-2.5-flash'` di dalam `compile()`.
```

---

## Skenario 2: Menambah TEMPLATE BARU untuk Produk yang Sudah Ada

> Gunakan prompt ini ketika produk sudah ada (misalnya wedding sudah ada),
> tapi ingin tambah pilihan template/style baru, misalnya: style "Javanese Traditional",
> "Islami Modern", dsb. ke dalam undangan pernikahan.

### ✅ Contoh Prompt

```
Tambahkan template/style baru ke produk Wedding yang sudah ada di wuzzkang.

**Nama style baru:** Javanese Traditional
**Style key:** `javanese-traditional`
**Deskripsi style:** Nuansa adat Jawa — batik, blangkon, gamelan. Bahasa formal campuran Jawa-Indonesia.

**Yang harus ditambahkan:**
1. Di file `WeddingTaskCompiler.js` (path: `src/services/ai-platform/compilers/WeddingTaskCompiler.js`):
   - Tambahkan entry baru di objek `STYLE_DESCRIPTORS` dengan key `'javanese-traditional'`.
   - Isi descriptor meliputi: `name`, `tone`, `language_style`, `visual_elements`, dan `example_quote`.
   - Pastikan `DEFAULT_STYLE_DESCRIPTOR` tidak berubah.

2. Tidak perlu mengubah file lain — compiler akan otomatis pick up style baru dari STYLE_DESCRIPTORS.

**Referensi:**
- Lihat style yang sudah ada di `STYLE_DESCRIPTORS` sebagai panduan format.
- Tone harus konsisten dengan nuansa adat Jawa yang anggun dan formal.
- `example_quote` diisi dengan kalimat pembuka khas adat Jawa (boleh campuran Jawa-Indonesia).
```

---

## Skenario 3: Migrasi Produk Lama ke Sistem AI Platform Baru

> Gunakan prompt ini ketika ingin memigrasikan produk yang masih pakai sistem lama
> (`ai.service.js`) ke sistem AI Platform baru (Gemini + AIOrchestrationService).
> Misalnya: Birthday, Toko Online.

### ✅ Contoh Prompt

```
Migrasikan produk "Toko Online" dari sistem AI lama ke sistem AI Platform baru wuzzkang.

**Konteks sistem:**
- Sistem lama: `ai.service.js` + `generator.route.js` — synchronous, tidak ada tracking, pakai OpenAI/Groq.
- Sistem baru: `AIOrchestrationService` + `aiTaskWorker.js` + `GeminiProvider` — async queue,
  ada tracking di tabel `ai_tasks`, pakai Gemini (`gemini-2.5-flash`).

**Yang harus dikerjakan:**
1. Buat `TokoOnlineTaskCompiler.js` di `src/services/ai-platform/compilers/`.
   - Input context yang tersedia: `storeName`, `storeDescription`, `products`.
   - Output JSON dari AI: `store_tagline`, `store_description`, `products` (updated with AI-generated descriptions and names).
   - Gunakan `targetModel: 'gemini-2.5-flash'` di dalam `compile()`.

2. Daftarkan di `register.js` dengan key `'toko-online'`.

3. Di frontend dashboard (`wuzzkang-dashboard/src/app/generate/page.js`), tambahkan
   `templateType === 'toko-online'` ke dalam kondisi yang sudah ada:
   `if (templateType === 'wedding' || templateType === 'campaign' || templateType === 'toko-online')`
   Susun payload `executePayload` dan kompilasi `compiledPageData` mengikuti pola Campaign yang sudah ada.

4. Update `assembledContent` dan dependency array `useEffect` di `page.js` mengikuti pola Campaign.

**Referensi pola:** Ikuti `CampaignTaskCompiler.js` dan pola Wedding di `page.js` sepenuhnya.
```

---

## Skenario 4: Menambah Generate AI per Field (Tombol AI Assist per Kolom Input)

> Gunakan prompt ini ketika ingin menambahkan tombol "AI Assist" (generate eceran per kolom input)
> pada produk baru, tanpa harus generate seluruh halaman sekaligus.
> Pola ini disebut **Skenario B.1** — memanggil Gemini langsung dari `generateFieldContent`
> di `ai.service.js`, tanpa perlu endpoint atau queue baru.

### ✅ Contoh Prompt

```
Tambahkan fitur "AI Assist" per field untuk produk baru "Khitanan" di wuzzkang.

**Konteks sistem:**
- Fitur generate per field (eceran) berjalan melalui endpoint `POST /api/generate/field`.
- Di backend, fungsi `generateFieldContent` di `ai.service.js` menangani semua field assist.
- Sejak migrasi Campaign (2026-07-05), fungsi ini sudah menggunakan `GeminiProvider` dengan
  model `gemini-2.5-flash` — tidak ada konfigurasi provider tambahan yang diperlukan.

**Yang harus dikerjakan di Backend:**
1. Buka `src/routes/generator.route.js`.
   Tambahkan nama field baru ke dalam `GenerateFieldRequestSchema.fieldType` enum:
   - `'khitanan_slogan'`
   - `'khitanan_intro'`

2. Buka `src/services/ai.service.js`, tambahkan blok kondisi baru di dalam
   fungsi `generateFieldContent` untuk setiap field baru:
   ```javascript
   } else if (fieldType === 'khitanan_slogan') {
     userPrompt = `Buatkan slogan undangan khitanan untuk anak bernama ${context.childName},
     ayah: ${context.fatherName}. Nuansa islami, singkat, dan menyentuh hati.`;
   } else if (fieldType === 'khitanan_intro') {
     isJson = false;
     userPrompt = `Tulis paragraf pembuka undangan khitanan untuk ${context.childName}.
     Gunakan bahasa Indonesia formal yang hangat dan bernuansa islami.`;
   }
   ```

**Yang harus dikerjakan di Frontend:**
3. Di `wuzzkang-dashboard/src/app/generate/page.js`, tambahkan handler generate per field
   mengikuti pola yang sudah ada di fungsi `handleAICampaignAssist` (sekitar baris 1134-1246):
   ```javascript
   const handleAIKhitananAssist = async (fieldType) => {
     const context = { childName, fatherName, motherName };
     const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/generate/field`, {
       method: 'POST',
       headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session.access_token}` },
       body: JSON.stringify({ fieldType, context }),
     });
     const result = await response.json();
     const jobId = result.jobId;
     // ... polling via GET /jobs/:jobId/status lalu set state variable
   };
   ```

**Catatan penting:**
- TIDAK perlu membuat file compiler baru.
- TIDAK perlu membuat endpoint baru.
- Provider Gemini sudah dipakai otomatis — tidak perlu konfigurasi apa pun.
- Cukup daftarkan field name di enum dan tulis prompt-nya saja.
```

---

## Catatan Penting

> [!IMPORTANT]
> **DILARANG KERAS MELAKUKAN BYPASS AI PLATFORM!**
> Jangan pernah membypass mekanisme AI Platform dengan melakukan kompilasi / perakitan data halaman kustom secara langsung di dalam file `wuzzkang-api/src/services/ai.service.js` atau endpoint `/generate`. Semua produk/template baru **WAJIB** menggunakan `TaskCompiler` di dalam folder `src/services/ai-platform/compilers/` dan diproses secara asinkron via `POST /api/v1/ai/execute`.

> [!IMPORTANT]
> Selalu sertakan instruksi berikut di setiap prompt untuk menjaga konsistensi:
> - "Ikuti pola `WeddingTaskCompiler.js` atau `CampaignTaskCompiler.js` sepenuhnya"
> - "Ikuti kontrak `TaskCompiler.js` di folder `contracts/`"
> - "Daftarkan di `register.js` setelah selesai"
> - "Tidak perlu membuat endpoint baru"
> - Gunakan `targetModel: 'gemini-2.5-flash'` (bukan `gemini-2.0-flash-exp`)

> [!TIP]
> **Ringkasan Kapan Pakai Skenario Mana:**
>
> | Kebutuhan | Skenario |
> |-----------|----------|
> | Produk baru (generate full halaman) | Skenario 1 |
> | Tambah style/template ke produk yang sudah ada | Skenario 2 |
> | Migrasikan produk lama (Birthday, Toko) | Skenario 3 |
> | Tombol AI Assist per kolom input | Skenario 4 (B.1) |
> | Field pilih gambar background/cover | Skenario 5 / Lihat `14_COMPONENT_LIBRARY.md` |
> | Fitur galeri slider atau Buku Tamu di template | Skenario 6 / Lihat `14_COMPONENT_LIBRARY.md` |

> [!NOTE]
> **Endpoint yang sudah tersedia dan tidak perlu dibuat ulang:**
> - `POST /api/v1/ai/execute` — submit task AI platform baru (async, BullMQ)
> - `GET /api/v1/ai/task/:id` — cek status task (polling)
> - `POST /api/generate/field` — generate per field eceran (sync melalui Gemini)
> - `GET /api/jobs/:jobId/status` — cek status job dari text-queue (untuk field assist polling)
> - `POST /api/media/prewedding` — ambil foto acak dari Unsplash (dipakai oleh `ImagePickerField`)

---

## Skenario 5: Menambah Field Pilih Gambar (Background / Cover) ke Produk Baru

> Gunakan ini ketika produk baru butuh field untuk memilih foto background atau cover section,
> baik dari Unsplash (acak) maupun upload sendiri.
>
> **Gunakan komponen reusable `<ImagePickerField>` — jangan tulis ulang JSX dari nol.**

### ✅ Contoh Prompt

```
Tambahkan field gambar background hero section ke produk baru "Khitanan" di wuzzkang.

Gunakan komponen reusable `ImagePickerField` yang sudah ada di:
`wuzzkang-dashboard/src/components/ImagePickerField.js`

**Panduan implementasi ada di: `docs/14_COMPONENT_LIBRARY.md` — Panduan: Menambahkan Field Gambar ke Template Baru**

Secara ringkas yang harus dikerjakan:
1. Tambah 3 state di `page.js`: `generateKhitananImage`, `khitananImageUrl`, `khitananImageSource`
2. Di load edit mode, set state dari DB jika `image_url` ada
3. Di `assembledContent`, gunakan: `image_url: generateKhitananImage ? (khitananImageUrl || null) : null`
4. Tambahkan kedua state ke dependency array `useEffect`
5. Di JSX, render: `<ImagePickerField checkboxId="generateKhitananImage" ... />`
6. Di `wuzzkang-api/src/utils/schema.js`, pastikan `image_url` diizinkan di schema Zod
7. Tambahkan handler `uploadType` baru di `handleUploadImage()` di `page.js`

**Referensi:** Lihat implementasi Campaign hero (`generateCampaignHero`) dan Wedding prewedding
(`generatePrewedding`) di `page.js` sebagai contoh pola yang sudah benar.
```

---

## Skenario 6: Menambahkan Fitur Slider Gambar (Carousel) atau Buku Tamu (WishesBoard) ke Template Baru

> Gunakan ini ketika template baru membutuhkan galeri foto slider (carousel) atau section Buku Tamu / RSVP.
>
> **Gunakan komponen template reusable `ImageSlider` atau `WishesBoard` — jangan tulis ulang HTML dan JS dari nol.**

### ✅ Contoh Prompt

```
Tambahkan fitur galeri foto slider dan Buku Tamu (WishesBoard) ke template baru "Islamic Modern" di wuzzkang.

Gunakan komponen template reusable yang sudah ada di:
- `templates/components/ImageSlider.js`
- `templates/components/WishesBoard.js`

**Panduan implementasi:**
1. Untuk Galeri Slider (ImageSlider):
   - Impor komponen: `import { ImageSlider } from '../components/ImageSlider.js';`
   - Siapkan kontainer HTML di template: `<div class="slider-container" id="gallery-slider"></div>`
   - Inisialisasi setelah render:
     ```javascript
     const slider = new ImageSlider('gallery-slider', pageConfig.content.gallery_images);
     slider.setup();
     ```

2. Untuk Buku Tamu & RSVP (WishesBoard):
   - Siapkan kontainer HTML di template: `<div id="wishes-board-root"></div>`
   - Inisialisasi setelah render menggunakan impor dinamis:
     ```javascript
     const wishesRoot = document.getElementById('wishes-board-root');
     if (wishesRoot) {
         const { initWishesBoard } = await import('../components/WishesBoard.js');
         initWishesBoard(wishesRoot, pageConfig, guestName, {
             primaryColor: '#5A7C64',      // Sesuaikan warna tema
             bgLight: '#F8FAF9',
             borderColor: '#EAF0EC',
             buttonClass: 'btn-sage-primary'
         });
     }
     ```

**Referensi:** Lihat implementasi galeri slider dan wishes board di template `wedding/sage-green.js` atau `wedding/javanese-traditional.js` sebagai contoh yang benar.
```
