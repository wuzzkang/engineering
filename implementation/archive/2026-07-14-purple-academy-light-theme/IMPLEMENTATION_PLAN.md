# Implementation Plan: E-Course Purple Academy Light Theme Overhaul

This plan details the design, color scheme adjustments, and styling refinements to convert the E-Course `'purple-academy'` template from a dark mode layout to a premium, high-converting light mode layout.

## User Review Required

> [!IMPORTANT]
> - The background will change from dark blue (`#0c0817`) to a premium soft off-white/light-purple tint (`#faf9ff`).
> - Text colors will be updated to deep indigo and charcoal (e.g. `#1e1b4b` and `#475569`) to maintain optimal legibility and high contrast.
> - The FAQ section theme inside the template will transition from the dark `'neon-conversion'` layout to the light and clean `'clean-trust'` layout.

## Proposed Changes

### Landing Page Template (`wuzzkang-lp`)

#### [MODIFY] [purple-academy.js](file:///home/bms-del112/BMS/personal-project/wuzzkang/wuzzkang-lp/templates/e-course/purple-academy.js)
* **Global App Style**: Update `#app` to use a light-purple/off-white background (`#faf9ff`) and dark text (`#1e1b4b`).
* **Navigation Bar**: Update classes from `bg-gray-950/80` and `border-purple-950` to `bg-white/80` and `border-purple-100` with dark text.
* **Hero Section**:
  * Set light background radial-gradient as fallback and light overlay gradients for custom header background images.
  * Adjust typography contrast (heading to `#1e1b4b`, description to `#475569`).
  * Refactor special offer badge styling to light colors (`bg-purple-50 border-purple-200 text-purple-700`).
* **Countdown Timer**: Update container to a clean, border-shaded light card (`bg-white border-purple-100 shadow-md`) and adjust digit/label colors.
* **Problems Section**: Update target section background and card styles (`bg-red-50/50 border-red-150` with `text-slate-700` descriptions).
* **Solutions Section**: Update list item layout to light backgrounds and indigo/purple markers.
* **Target Audience Section**: Update card styling to clean white blocks (`bg-white border-purple-100/80 shadow-sm`).
* **Mentor Profile Section**: Overhaul container (`bg-purple-50/30`) and inner card profile styling to light-purple gradients and cards.
* **Curriculum Accordion Section**: Update accordion parent cards, headers (`bg-purple-50/30`), active item backgrounds, and expand animations to play beautifully on a light canvas.
* **Benefits & Bonuses Section**: Adapt cards to dashed/solid white borders, lighter shadow profiles, and clear textual descriptions.
* **Pricing & Checkout Card**: Convert pricing cards from dark theme (`bg-gray-950/90`) to dynamic white card layouts (`bg-white border-2 border-purple-500 shadow-2xl`) and adjust pricing/guarantee labels.
* **FAQ Section**: Change options passed to `initFaq()` to use the `'clean-trust'` theme instead of `'neon-conversion'`.
* **Footer**: Overhaul to a light, minimalist layout (`bg-white border-t border-purple-100 text-slate-500`).

---

### Dashboard Preview (`wuzzkang-dashboard`)

#### [MODIFY] [purple-academy.js](file:///home/bms-del112/BMS/personal-project/wuzzkang/wuzzkang-dashboard/public/preview/templates/e-course/purple-academy.js)
* Keep in-sync with the changes made in the `wuzzkang-lp` template file (automated via `npm run sync:templates`).

#### [MODIFY] [index.html](file:///home/bms-del112/BMS/personal-project/wuzzkang/wuzzkang-dashboard/public/preview/index.html)
* Bump `PREVIEW_VERSION` to match `LP_VERSION` to bust preview iframe assets caches.

#### [MODIFY] [script.js](file:///home/bms-del112/BMS/personal-project/wuzzkang/wuzzkang-lp/script.js)
* Bump `LP_VERSION` to trigger cache busting.

---

## Verification Plan

### Automated Tests
* Verify frontend production compile via `npm run build` inside `wuzzkang-dashboard`.

### Manual Verification
* Deploy/verify E-Course template preview inside the dashboard editor.
* Ensure all elements (headings, body text, lists, accordions, price tags, countdown digits, guarantee tags, and FAQ cards) are clearly readable and display premium typography contrast.
