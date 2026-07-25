# AI Context — SOP Update: 2-Phase Implementation Protocol & User Completion Confirmation

---

## 🎯 Target Repositories & Components
- **`root`**:
  - `/.cursorrules`: Updated Rule #8 to mandate 2-Phase Implementation Protocol (Phase 1 Active Tracking + Ask User Completion, Phase 2 User-Approved Archiving).
  - `/.clinerules`: Updated Rule #8 to mandate 2-Phase Implementation Protocol.
  - `/wuzzkang-engineering/docs/98_IMPLEMENTATION_PROTOCOL.md`: Bumped version to 3.1.0 and detailed Phase 1 vs Phase 2 lifecycle rules.
  - `/wuzzkang-engineering/skills/wuzzkang-implementation-protocol/SKILL.md`: Updated SOP skill definition.
- **`~/.gemini/config/skills/wuzzkang-implementation-protocol/SKILL.md`**: Updated global skill definition.

---

## 🛠️ Validation & Invariants
- AI must run `implementation/active/` tracking first.
- AI must NOT move `active/` to `archive/` until asking the user and receiving explicit completion confirmation.
