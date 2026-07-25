---
name: wuzzkang-master-orchestrator
description: Master Orchestrator dan Skill Router untuk ekosistem Wuzzkang. Memetakan prompt pengguna secara otomatis ke kombinasi 10 Skill Wuzzkang yang relevan sebelum mengeksekusi kode.
---

# SOP Master Orchestrator & Skill Routing Guide — Wuzzkang Ecosystem

Dokumen ini adalah acuan pengarah utama (*master router*) bagi AI Assistant untuk secara otomatis mengenali maksud prompt pengguna dan mengaktifkan kombinasi **10 Skill Wuzzkang** yang sesuai.

---

## 🎯 1. Aturan Pengaktifan Skill Otomatis (Automatic Skill Routing)

Sebelum mengeksekusi perintah atau menulis kode, AI Assistant **WAJIB** membaca file `SKILL.md` dari skill-skill yang terikat dengan kategori tugas berikut:

### 🗺️ Matriks Pemetaan Prompt (Prompt-to-Skill Mapping)

```text
┌───────────────────────────────────────────────┬────────────────────────────────────────────────────────┐
│ Maksud / Kata Kunci Prompt Pengguna           │ Skill Wuzzkang yang Wajib Dibaca & Dipatuhi            │
├───────────────────────────────────────────────┼────────────────────────────────────────────────────────┤
│ 1. Penghematan Token, Efisiensi Context       │ • wuzzkang-token-optimization-guard                    │
│    "Hemat token", "File besar", "Grep search",│ • wuzzkang-code-refactor                               │
│    "Optimasi prompt", "Context window"        │                                                        │
├───────────────────────────────────────────────┼────────────────────────────────────────────────────────┤
│ 2. Refactoring, Pemisahan Versi, Multi-Version│ • wuzzkang-code-refactor                               │
│    "Refactor", "Pindahkan ke V2", "Buat V3", │ • wuzzkang-multi-version-architecture                  │
│    "Isolasi rute", "Clean up page.js"         │ • wuzzkang-implementation-protocol                     │
│                                               │ • wuzzkang-doc-sync-auditor                            │
├───────────────────────────────────────────────┼────────────────────────────────────────────────────────┤
│ 3. Audit Kode, Review, Quality Gatekeeper     │ • wuzzkang-code-reviewer                               │
│    "Review kode", "Cek bug", "Audit keamanan",│ • wuzzkang-ui-standards-guard                          │
│    "Self review", "Check DoD"                 │ • wuzzkang-doc-sync-auditor                            │
├───────────────────────────────────────────────┼────────────────────────────────────────────────────────┤
│ 4. Tambah Produk / Template Landing Page      │ • wuzzkang-product-template-generator                  │
│    "Tambah produk", "Template baru",          │ • wuzzkang-ui-standards-guard                          │
│    "Khitanan", "Style baru", "Migrasi produk" │ • wuzzkang-doc-sync-auditor                            │
├───────────────────────────────────────────────┼────────────────────────────────────────────────────────┤
│ 5. Tambah / Edit Seksi V2 (Modular Builder)   │ • wuzzkang-v2-section-builder                          │
│    "Tambah section V2", "Dynamic builder",    │ • wuzzkang-ui-standards-guard                          │
│    "Testimonial slider", "Preset warna baru"  │                                                        │
├───────────────────────────────────────────────┼────────────────────────────────────────────────────────┤
│ 6. Integrasi AI / BullMQ Queue / Worker       │ • wuzzkang-ai-platform-compiler                        │
│    "Task Compiler", "BullMQ worker",          │ • wuzzkang-ai-platform-compiler                        │
│    "Gemini provider", "Redis cache", "Refund" │ • wuzzkang-token-optimization-guard                    │
├───────────────────────────────────────────────┼────────────────────────────────────────────────────────┤
│ 7. UI Dashboard / Form Upload / Credit        │ • wuzzkang-ui-standards-guard                          │
│    "ImagePickerField", "FAQ safe-merge",      │                                                        │
│    "Cost credit", "Fix re-render"             │                                                        │
├───────────────────────────────────────────────┼────────────────────────────────────────────────────────┤
│ 8. Manajemen Alur Kerja & Milestone           │ • wuzzkang-implementation-protocol                     │
│    "Buat plan", "Update progress",            │ • wuzzkang-doc-sync-auditor                            │
│    "Self-review", "Handover", "Archive"       │                                                        │
├───────────────────────────────────────────────┼────────────────────────────────────────────────────────┤
│ 9. Penyelesaian Task / Audit DoD              │ • wuzzkang-doc-sync-auditor                            │
│    "Selesai", "Sync dokumen", "Audit DoD"     │                                                        │
└───────────────────────────────────────────────┴────────────────────────────────────────────────────────┘
```

---

## 🛠️ 2. Alur Eksekusi Mandatory Bagi AI Assistant

Saat pengguna memberikan prompt:

1. **Identifikasi Intent**: Cocokkan kata kunci prompt dengan Matriks Pemetaan di atas.
2. **Load Relevant Skills**: Gunakan `view_file` untuk membaca [wuzzkang-engineering/skills/[nama-skill]/SKILL.md](file:///home/bms-del112/BMS/personal-project/wuzzkang/wuzzkang-engineering/skills/) terkait.
3. **Execute Implementation Protocol**: Operasikan alur kerja di `implementation/active/` sesuai [wuzzkang-implementation-protocol](file:///home/bms-del112/BMS/personal-project/wuzzkang/wuzzkang-engineering/skills/wuzzkang-implementation-protocol/SKILL.md).
4. **Audit DoD & Doc Sync**: Sebelum mengakhiri giliran (*ending turn*), perbarui dokumen di `wuzzkang-engineering/docs/` sesuai [wuzzkang-doc-sync-auditor](file:///home/bms-del112/BMS/personal-project/wuzzkang/wuzzkang-engineering/skills/wuzzkang-doc-sync-auditor/SKILL.md).
