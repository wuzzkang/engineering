# Implementation Plan — V2 AI Assist JSON Parsing & Worker Output Fix

---

## 🎯 Target Goals
1. Perbaiki tampilan raw JSON string pada input field editor V2 saat `✨ AI Assist` diklik.
2. Daftarkan `v2_` ke dalam flag `isJson` di `ai.service.js` backend.
3. Tambahkan fallback parser `JSON.parse` di `v2/page.js` frontend.

---

## 🏗️ Proposed File Changes
- `wuzzkang-api/src/services/ai.service.js`: Update `isJson` check and cache key version.
- `wuzzkang-dashboard/src/app/generate/v2/page.js`: Add JSON string parsing shield.
