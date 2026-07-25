# Implementation Plan — Automatic Header Navigation Sync on Section Deletion

---

## 🎯 Target Goals
1. Sinkronkan navigasi Header secara otomatis saat salah satu seksi dihapus dari halaman V2.
2. Bersihkan `selected_nav_items` di editor state dan filter tautan seksi mati di renderer component.

---

## 🏗️ Proposed File Changes
- `wuzzkang-dashboard/src/app/generate/v2/page.js`
- `wuzzkang-dashboard/public/preview/templates/components/sections/header/header-navbar-navy.js`
- `wuzzkang-lp/templates/components/sections/header/header-navbar-navy.js`
