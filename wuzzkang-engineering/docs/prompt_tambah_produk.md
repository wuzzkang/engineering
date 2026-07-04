# Prompt Referensi: Menambah Produk / Template Baru ke Wuzzkang AI Platform

Dokumen ini berisi contoh prompt siap pakai untuk diberikan ke AI coding assistant
ketika ingin menambah produk baru atau template baru ke sistem wuzzkang.

> [!NOTE]
> Dokumen ini terakhir diperbarui setelah migrasi Campaign selesai (2026-07-05).
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
Migrasikan produk "Birthday" dari sistem AI lama ke sistem AI Platform baru wuzzkang.

**Konteks sistem:**
- Sistem lama: `ai.service.js` + `generator.route.js` — synchronous, tidak ada tracking, pakai OpenAI/Groq.
- Sistem baru: `AIOrchestrationService` + `aiTaskWorker.js` + `GeminiProvider` — async queue,
  ada tracking di tabel `ai_tasks`, pakai Gemini (`gemini-2.5-flash`).

**Yang harus dikerjakan:**
1. Buat `BirthdayTaskCompiler.js` di `src/services/ai-platform/compilers/`.
   - Input context yang tersedia: `celebrantName`, `celebrantAge`, `eventDate`, `eventLocation`, `theme`.
   - Output JSON dari AI: `banner_tagline`, `invitation_intro`, `closing_message`.
   - Gunakan `targetModel: 'gemini-2.5-flash'` di dalam `compile()`.

2. Daftarkan di `register.js` dengan key `'birthday'`.

3. Di frontend dashboard (`wuzzkang-dashboard/src/app/generate/page.js`), tambahkan
   `templateType === 'birthday'` ke dalam kondisi yang sudah ada:
   `if (templateType === 'wedding' || templateType === 'campaign' || templateType === 'birthday')`
   Susun payload `executePayload` dan kompilasi `compiledPageData` mengikuti pola Campaign yang sudah ada.

4. Jangan hapus kode lama di `ai.service.js` and `generator.route.js` dulu —
   jalankan keduanya secara paralel sampai frontend siap diupdate.

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
   mengikuti pola yang sudah ada di fungsi `handleGenerateCampaignField` (sekitar baris 1083-1160):
   ```javascript
   const handleGenerateKhitananField = async (fieldType) => {
     const context = { childName, fatherName, motherName };
     const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/generate/field`, {
       method: 'POST',
       headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session.access_token}` },
       body: JSON.stringify({ fieldType, context }),
     });
     // ... polling via getTextQueue job status dan set state variable
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

> [!NOTE]
> **Endpoint yang sudah tersedia dan tidak perlu dibuat ulang:**
> - `POST /api/v1/ai/execute` — submit task AI platform baru (async, BullMQ)
> - `GET /api/v1/ai/task/:id` — cek status task (polling)
> - `POST /api/generate/field` — generate per field eceran (sync melalui Gemini)
> - `GET /api/jobs/:jobId/status` — cek status job dari text-queue (untuk field assist polling)
