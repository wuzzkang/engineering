# Decision Log

### DEC-001: Mobile Split Screen Default Ratio & Interactive Toggle Mechanism
* **Date:** 2026-07-26
* **Context:** The default mobile split screen ratio (50/50) caused the form component list to be truncated. The user requested defaulting to 85% form / 15% preview bar (Image 2) and adding a clickable "Preview" element to expand the preview to 15% form / 85% preview (Image 3).
* **Options Considered:**
  * Option A: Switch to full tab mode instead of split mode. (Cons: Breaks split screen feature).
  * Option B: Update default `mobileSplitRatio` to 85 and provide an interactive dual-state toggle on the preview bar between 85% and 15%. (Pros: Exactly fulfills user request, seamless UX, retains drag resizer).
* **Decision:** Selected Option B. Set default ratio to 85% and implement dual-state toggle function on the preview header bar.
* **Impact:** `wuzzkang-dashboard/src/app/generate/v2/page.js`

### DEC-002: Removal of Resizer Bar & Mobile Bottom Padding Offset Adjustment
* **Date:** 2026-07-26
* **Context:** User requested removing the "Seret Atas / Bawah" handle bar block completely and adjusting the preview block so it is not covered by the mobile floating `+` navigation button.
* **Options Considered:**
  * Option A: Keep resizer bar and move floating `+` button. (Cons: Violates layout isolation of Sidebar).
  * Option B: Remove resizer bar element completely and add `pb-16 lg:pb-0` bottom padding to `mainGridRef`, making the `LIVE SANDBOX PREVIEW V2` header bar fully clickable. (Pros: Perfectly addresses user feedback, raises preview block above fixed mobile bottom navbar and `+` FAB).
* **Decision:** Selected Option B.
* **Impact:** `wuzzkang-dashboard/src/app/generate/v2/page.js`

### DEC-003: Compact Header Padding & Expanded Preview Ratio Adjustment
* **Date:** 2026-07-26
* **Context:** User reported that during expanded preview, the bottom edge of `LIVE SANDBOX PREVIEW V2` slightly covered/clipped the "Tema Warna Landing Page (Global)" buttons.
* **Options Considered:**
  * Option A: Hide Tema Warna card when preview is expanded. (Cons: User cannot see global theme status).
  * Option B: Compact paddings across top bars and set expanded preview split ratio to precise height. (Pros: Preserves full visibility of Tema Warna buttons with 0% clipping while keeping preview expanded).
* **Decision:** Selected Option B.
* **Impact:** `wuzzkang-dashboard/src/app/generate/v2/page.js`

### DEC-004: Precise Preview Header Alignment Under Color Selection Buttons (17%)
* **Date:** 2026-07-26
* **Context:** User requested aligning the `LIVE SANDBOX PREVIEW V2` header bar EXACTLY directly underneath the color selection box (`Navy`, `Emerald`, `Amber`, `Purple`, `Rose`, `Slate`), completely covering the `Deskripsi / Brief Bisnis (Konteks AI)` card.
* **Options Considered:**
  * Option A: Set expanded ratio to 17%. (Pros: Positions preview header precisely below color selection box, completely covering the brief card).
* **Decision:** Selected Option A. Updated `toggleMobilePreviewRatio` expanded ratio to 17%.
* **Impact:** `wuzzkang-dashboard/src/app/generate/v2/page.js`

### DEC-005: 15.5% Precise Ratio Adjustment (Zero Leakage of AI Ready Badge)
* **Date:** 2026-07-26
* **Context:** User pointed out a tiny leakage of the `✓ AI Ready` badge poking out right above `LIVE SANDBOX PREVIEW V2`.
* **Options Considered:**
  * Option A: Shift expanded ratio slightly higher from 17% to 15.5%. (Pros: Perfectly hides the top edge of Deskripsi Brief card, eliminating 100% of leaked elements).
* **Decision:** Selected Option A. Updated `toggleMobilePreviewRatio` expanded ratio to 15.5%.
* **Impact:** `wuzzkang-dashboard/src/app/generate/v2/page.js`

### DEC-006: Dual-State Handler for Tutup Preview in Full Preview Mode
* **Date:** 2026-07-26
* **Context:** User reported that clicking "Tutup Preview" while in Full Preview mode (`mobileViewMode === 'preview'`) did not switch back to split screen.
* **Options Considered:**
  * Option A: Update `toggleMobilePreviewRatio` handler to evaluate `mobileViewMode === 'preview'`, resetting `mobileViewMode` to `'split'` and `mobileSplitRatio` to `85`. (Pros: Ensures clicking "Tutup Preview" works 100% reliably in both Full Preview and Split mode).
* **Decision:** Selected Option A.
* **Impact:** `wuzzkang-dashboard/src/app/generate/v2/page.js`
