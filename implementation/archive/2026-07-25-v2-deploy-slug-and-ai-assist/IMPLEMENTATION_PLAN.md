# Implementation Plan — V2 Deploy, Slug Validation & AI Assist Integration

---

## 🎯 Target Goals
1. Perbaiki error HTTP 400 saat klik **🚀 Publikasikan / Deploy** pada V2 Builder dengan menyertakan payload `slug`.
2. Tambahkan input field URL Slug interaktif dan fungsi auto-suggestion berbasis sanitasi regex.
3. Tambahkan input card Brief Bisnis AI (`v2BrandBrief`) di Left Column Editor V2.
4. Hubungkan tombol `✨ AI Assist` ke backend `/api/generate/field` dengan proteksi disable jika Brief AI belum diisi.

---

## 🏗️ Proposed File Changes
- `wuzzkang-dashboard/src/app/generate/v2/page.js`: Add `buildSlugSuggestion`, `handleGenerateAIV2Section`, `renderAIV2Button`, and UI elements.
- `wuzzkang-dashboard/src/components/v2-editor/V2SectionFormDispatcher.jsx`: Pass `renderAIV2Button` prop to all section forms.
