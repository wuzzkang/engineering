# AI Context — V2 Section Accordion (Collapsed by Default + One-At-A-Time)

---

## 🎯 Workspace Target
- Active Task: V2 Editor Section Accordion Behavior
- Target Files:
  - `wuzzkang-dashboard/src/components/v2-editor/V2SectionFormDispatcher.jsx`
  - `wuzzkang-dashboard/src/app/generate/v2/page.js`
- Status: Phase 1 Active Completed & Verified

---

## 🛠️ Codebase Invariants & Guidelines
- Follow `98_IMPLEMENTATION_PROTOCOL.md` (v3.1.0), `.cursorrules`, dan `.clinerules`.
- Accordion dikelola dari parent (`expandedSectionId` di `v2/page.js`). `V2SectionFormDispatcher` mendukung **controlled mode** via `isExpanded` + `onToggle` props.
- Default: semua section tertutup (`expandedSectionId = null`). Toggle: jika section yang sama diklik lagi → tutup kembali (null).
