# Decision Log — Add Unique Identifier Tags to All Wuzzkang Skills

### DEC-001: Skema Penamaan Prefix Agent Tag
- **Date:** 2026-07-26
- **Context:** Setiap skill memerlukan Unique Identifier berupa prefix tag respon awal agar pengguna tahu agen mana yang sedang aktif merespon.
- **Decision:** Gunakan format `[WUZZKANG-<NAME>-AGENT]` yang konsisten dengan standar global di `~/.gemini/config/skills/`.
- **Impact:** 11 file `SKILL.md` under `wuzzkang-engineering/skills/` dan `~/.gemini/config/skills/`.
