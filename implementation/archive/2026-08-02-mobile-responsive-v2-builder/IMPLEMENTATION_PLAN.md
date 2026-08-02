# Implementation Plan — Mobile Responsive Layout for V2 Builder

- **Status**: `Approved for Implementation` ✅
- **Target Feature**: V2 Builder Mobile UI/UX Optimization (`/generate/v2/[projectId]`)
- **Target Viewports**: Mobile (<768px), Tablet (768px - 1024px), Desktop (>1024px)

---

## 🎯 Background & Problem Statement

Saat ini, tampilan **V2 Builder** (`/generate/v2/[projectId]`) dirancang dengan layout 3-kolom horizontal desktop (`Left Panel 280px` + `Center Canvas Flex` + `Right Property Panel 320px`). 
Ketika dibuka di perangkat Mobile/HP (<768px):
1. **Header Bar Overlap**: Elemen header (Tombol Dashboard, Judul Proyek, Indicator Save, Viewport Switcher, Undo/Redo, Save Draft, Publish) bertumpukan dan membuat teks terputus/tidak terbaca.
2. **Panel Collision**: Total lebar fixed panel kiri & kanan (`280px + 320px = 600px`) melebihi lebar layar HP (375px–414px), sehingga canvas tengah terdorong/hilang dan panel saling menimpa secara tidak teratur.
3. **Unusable UX**: Pengguna tidak dapat melihat preview landing page maupun mengedit komponen dengan nyaman dari HP.

---

## 💡 Rekomendasi Solusi & Desain UX Mobile

Kami merekomendasikan **Option A: Bottom Navigation Bar + Single Panel View Mode** (Standar Industri Builder Mobile seperti Canva/Framer/Webflow):

```
+-----------------------------------+
| ← Dashboard  [Project Name]  🚀   |  <- Compact Mobile Header (50px)
+-----------------------------------+
|                                   |
|   LIVE CANVAS PREVIEW (Full 100%) |  <- Canvas Utama Terlihat Jelas
|   (Interactive Live Render)       |
|                                   |
+-----------------------------------+
| [📱 Canvas]  [🗂️ Sections]  [⚙️ Props] | <- Bottom Navigation Bar (Fixed 56px)
+-----------------------------------+
```

### Key UX Features:
1. **Compact Mobile Header (<768px)**:
   - Menyederhanakan header mobile hanya menampilkan tombol `←`, Nama Proyek (truncated), dan Tombol `🚀 Publish`.
   - Mengelompokkan aksi sekunder (Save Draft, Undo/Redo, Discard) ke dalam Popup/Dropdown Menu "⋮ Actions" agar tidak memenuhi header.
2. **Bottom Navigation Bar (Fixed Bottom Bar di Mobile)**:
   - **📱 Preview (Canvas)**: Menampilkan Canvas Live Preview secara full-width & full-height.
   - **🗂️ Sections (Tree)**: Membuka Bottom Sheet / Full Panel daftar Seksi & Design Tokens. Saat seksi dipilih, otomatis memberi opsi edit.
   - **⚙️ Properties (Editor)**: Membuka Panel Property Editor untuk seksi yang sedang aktif dengan tombol "✓ Selesai" untuk kembali ke Canvas.
3. **Adaptive Breakpoints**:
   - `Desktop (>= 1024px)`: Tetap 3-kolom berdampingan (Layout asli utuh).
   - `Tablet (768px - 1023px)`: Toggle Sidebar / Collapsible Drawer.
   - `Mobile (< 768px)`: Single-panel active view dengan Bottom Navigation Bar.

---

## 📋 Proposed Changes

### `wuzzkang-dashboard`

#### [MODIFY] [page.jsx](file:///home/bms-del112/BMS/personal-project/wuzzkang/wuzzkang-dashboard/src/app/generate/v2/[projectId]/page.jsx)
- Tambahkan CSS Media Queries / Hooks breakpoint (`isMobile`, `isTablet`).
- Tambahkan state `mobileActiveTab`: `'canvas' | 'tree' | 'properties'`.
- Restrukturisasi Header agar responsive (Compact Header di Mobile, Full Header di Desktop).
- Modifikasi 3-panel container agar berubah menjadi Single Panel Active View pada Mobile Viewport dengan Bottom Navigation Bar di posisi fixed bottom.

---

## 🧪 Verification Plan

### Automated & Manual Verification
1. Run local dev server: `npm run dev` pada `wuzzkang-dashboard`.
2. Buka Builder di browser (`http://localhost:3000/generate/v2/demo-project`).
3. Uji responsivitas menggunakan Browser DevTools / Mobile Simulator pada ukuran:
   - Mobile: 375px (iPhone SE/13 Mini), 414px (iPhone XR/Pro Max)
   - Tablet: 768px (iPad)
   - Desktop: 1280px+
4. Pastikan:
   - Header tidak bertumpukan di Mobile.
   - Canvas terlihat 100% full height & width saat Tab `📱 Preview` aktif.
   - Seksi dapat ditambah/diurutkan dengan mudah di Tab `🗂️ Sections`.
   - Property (teks, tombol, gambar) dapat diedit dengan mudah di Tab `⚙️ Properties`.
   - Tampilan Desktop tetap 100% normal tanpa ada efek samping.
