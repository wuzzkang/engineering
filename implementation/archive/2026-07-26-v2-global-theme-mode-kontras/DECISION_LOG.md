# Decision Log — V2 Global Theme Palette Card & Mode Kontras Unification

---

### DEC-001: Centralized Global Color Palette Card & Simplified Mode Kontras Controls
- **Date**: 2026-07-26
- **Context**: The V2 Builder previously lacked a prominent, dedicated card in the Left Column Editor Manager for global color theme selection, making global palette switching hard to locate.
- **Decision**: Added a dedicated **🎨 Tema Warna Landing Page (Global)** card in the Left Column Editor Manager (`v2/page.js`) directly above the Brief AI card, while keeping the top header bar theme switcher always visible. Form dispatcher per-section controls are dedicated exclusively to Mode Kontras Warna (`bg_brightness`: default/light/dark).
- **Consequence**: Users can easily find and switch the global landing page theme palette at any time while maintaining full contrast flexibility per section.
