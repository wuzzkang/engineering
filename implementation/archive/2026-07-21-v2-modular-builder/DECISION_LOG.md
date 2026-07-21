# Decision Log: V2 Modular Section Builder Migration

## Decision 1: Centralized Section Styling Engine (`getSectionStyle`)
* **Date:** 2026-07-21
* **Context:** Modular ES Module section components originally declared inline style maps, resulting in code duplication across templates and maintenance overhead.
* **Decision:** Extract a central utility function `getSectionStyle(bgStyle, bgShade, bgBrightness)` in `wuzzkang-lp/templates/utils/sectionStyle.js` and `wuzzkang-dashboard/public/preview/templates/utils/sectionStyle.js`. All 9 section ES Module templates delegate class resolution to this function.
* **Impact:** Single point of control for theme colors, shading variants, border styling, card backgrounds, and button styles.

---

## Decision 2: Independent Contrast Control (`bg_brightness`)
* **Date:** 2026-07-21
* **Context:** Users wanted section backgrounds to be light/white while keeping their primary brand accent colors (e.g. Deep Emerald buttons/badges). Creating separate light palettes lost the user's selected brand theme color.
* **Decision:** Introduced a separate `bg_brightness` parameter (`default`, `light`, `dark`) in addition to `bg_style` (brand color) and `bg_shade` (shading style).
* **Impact:** Users can make any section background pure white (`light`) while retaining the primary brand accent (Emerald, Indigo, Obsidian, Slate) on buttons, badges, and highlights. Heading and subtitle text automatically flip to dark high-contrast colors (`text-slate-900`/`text-emerald-950`).

---

## Decision 3: Solid Opaque Backgrounds for Light Variants
* **Date:** 2026-07-21
* **Context:** Light background variants initially used translucency (e.g., `bg-emerald-50/40`), causing them to blend with the dark body background (`#020617` / `bg-slate-950`) and appear muddy gray.
* **Decision:** Enforce 100% solid/opaque background classes (`bg-white`, `bg-emerald-50`, `bg-indigo-50`, `bg-zinc-50`) when rendering light contrast variants.
* **Impact:** Prevents background color bleed and ensures clean white/light sections with high contrast on all screen devices.

---

## Decision 4: Preview Iframe and Live Runtime Body Equalization
* **Date:** 2026-07-21
* **Context:** The editor sandbox preview iframe (`public/preview/index.html`) used a transparent body background inside a dark editor container, whereas live published pages (`wuzzkang-lp/script.js`) defaulted to a light body background (`#f8fafc`).
* **Decision:** Dynamically force the body background to `#020617` (`bg-slate-950`) for all `dynamic-builder` templates in both `wuzzkang-dashboard/public/preview/index.html` and `wuzzkang-lp/script.js`.
* **Impact:** 100% visual color and layout parity between the editor live preview sandbox and the published live landing page.
