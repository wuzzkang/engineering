# AI Context: V2 Modular Section Builder Migration

This document lists the system context, repositories, stack boundaries, and file pointers for the active implementation of the V2 Modular Section Builder.

## 🗂️ Target Repositories & Directories

The Wuzzkang workspace is a monorepo consisting of:
1.  **wuzzkang-dashboard**: Next.js (App Router) client-facing panel.
    *   *Path:* `/home/bms-del112/BMS/personal-project/wuzzkang/wuzzkang-dashboard`
2.  **wuzzkang-api**: Express.js server interacting with Supabase and BullMQ.
    *   *Path:* `/home/bms-del112/BMS/personal-project/wuzzkang/wuzzkang-api`
3.  **wuzzkang-lp**: Live client runtime render engine loaded from GitHub Pages.
    *   *Path:* `/home/bms-del112/BMS/personal-project/wuzzkang/wuzzkang-lp`

---

## 🎯 Key File Pointers

### wuzzkang-dashboard
*   `src/app/generate/page.js` - Main Landing Page generator form panel and preview sync.
*   `public/preview/index.html` - Live Preview sandbox iframe messenger and runner.
*   `public/preview/templates/` - Synced target folder of section templates.

### wuzzkang-lp
*   `script.js` - Live client entry-point router and HTML assembler.
*   `templates/components/sections/` - Modular ES Module section components.

### wuzzkang-api
*   `src/utils/schema.js` - Central Zod validation schemas for all templates.
*   `src/services/supabase.service.js` - Supabase database queries and CRUD mapping.
*   `src/routes/deploy.route.js` - Deploy queue and job status handler.

---

## ⚙️ Stack & Architectural Boundaries

*   **Database:** Supabase PostgreSQL. Project structure is stored in `projects.page_data` JSONB column.
*   **AI Copywriter:** OpenAI / Gemini APIs processing copywriting queues.
*   **CSS System:** Tailwind CSS CDN loaded by `/preview/index.html` (dashboard) and `script.js` (LP runtime).
*   **Versioning Constraint:** Any structural change to layout templates requires updating `LP_VERSION` in `wuzzkang-lp/script.js` and `PREVIEW_VERSION` in `wuzzkang-dashboard/public/preview/index.html` to invalidate cached JS modules.
