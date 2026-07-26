# Implementation Plan — Refactoring V2 Preset Search & Onboarding Modal Component

**Status**: Approved for Implementation

## Overview
1. **Utility `v2PresetSearch.js` [NEW]**:
   - Buat helper `evaluatePresetSearchRelevance(preset, query)` dan `filterAndRankPresets(presets, query, categoryFilter)`.
   - Mengkapsulasi Tokenized Multi-Word Matching & Relevance Scoring.
2. **Modular Component `V2PresetOnboardingModal.js` [NEW]**:
   - Pindahkan UI modal onboarding pembuatan proyek V2 baru ke `src/components/v2-editor/V2PresetOnboardingModal.js`.
   - Gunakan `useMemo` untuk membungkus kalkulasi `filterAndRankPresets` sehingga komputasi pencarian hanya berjalan saat query atau kategori filter berubah.
3. **Clean Up `app/generate/v2/page.js` [MODIFY]**:
   - Impor dan render `<V2PresetOnboardingModal />`.
   - Menghapus ~250 baris kode inline modal dari `page.js`.
4. **Update Skill SOPs**:
   - Perbarui `wuzzkang-v2-section-builder/SKILL.md` (lokal & global) untuk mendokumentasikan utilitas `v2PresetSearch.js` dan komponen `V2PresetOnboardingModal`.

## Affected Files
- `wuzzkang-dashboard/src/utils/v2PresetSearch.js` [NEW]
- `wuzzkang-dashboard/src/components/v2-editor/V2PresetOnboardingModal.js` [NEW]
- `wuzzkang-dashboard/src/app/generate/v2/page.js` [MODIFY]
- `wuzzkang-engineering/skills/wuzzkang-v2-section-builder/SKILL.md` [MODIFY]
- `~/.gemini/config/skills/wuzzkang-v2-section-builder/SKILL.md` [MODIFY]

## Verification Plan
- Uji `npm run build` di `wuzzkang-dashboard` (Node 24).
