# Decision Log — Flexible Hero CTA Buttons & Target Section Selector

---

### DEC-005: Interactive Target Section Selector & Secondary CTA Blanking
* **Date:** 2026-07-25T23:34:00+07:00
* **Context:** Hero CTA buttons required full flexibility to jump to any page section (#contact, #pricing, #services, etc.) or external URLs, and users needed the ability to hide the secondary button by clearing its text.
* **Options Considered:**
  - *Option A:* Only provide a plain URL input text field. (Cons: User must manually remember or type `#section-id`).
  - *Option B:* Combine plain URL input text with a quick dropdown selector `🎯 Ke Section...` listing all active sections on the page dynamically, and allow `cta_secondary_text = ""` to hide the button. (Pros: Best UX, 1-click binding, full flexibility).
* **Decision:** Option B.
* **Impact:** `V2SectionStandardForms.jsx`, `V2SectionFormDispatcher.jsx`, `hero-split-navy.js` (both `lp` and `preview`).
