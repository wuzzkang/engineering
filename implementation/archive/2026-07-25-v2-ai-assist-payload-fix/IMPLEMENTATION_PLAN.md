# Implementation Plan — V2 AI Assist Payload & Enum Mapping Fix

---

## 🎯 Target Goals
1. Perbaiki HTTP 400 Zod error saat klik tombol `✨ AI Assist` pada V2 Builder.
2. Tambahkan fungsi helper `mapSectionToFieldType` untuk mengonversi tipe seksi ke Zod enum (`v2_hero`, `v2_about`, `v2_services`, dll.).
3. Ubah format payload `context` dari string ke object JSON `{ brandName, brief, brandDesc }`.

---

## 🏗️ Proposed File Changes
- `wuzzkang-dashboard/src/app/generate/v2/page.js`: Update `handleGenerateAIV2Section` and add `mapSectionToFieldType`.
