# Current State

## Document Information

| Field | Value |
|------|------|
| Document | 02_CURRENT_STATE.md |
| Version | 2.8 |
| Status | Active |
| Purpose | Describe the current implementation state of Wuzzkang |
| Audience | Engineers, AI Assistants |
| Last Updated | 2026-07-26 (SOP Enforcement Hardening: Pre-flight Checklist & Zero-Exception Rule) |

---

# Purpose

This document describes the current implementation state of Wuzzkang.

It focuses on what exists today, without proposing improvements or future architecture.

Future designs belong to later documents.

---

# Repository Status

## Active Repositories

| Repository | Status | Description |
|------------|--------|-------------|
| wuzzkang-api | Active | Backend API |
| wuzzkang-dashboard | Active | Dashboard |
| wuzzkang-lp | Active | Landing Page Runtime |

---

# Infrastructure

## Runtime

- Node.js
- Next.js
- Vanilla JavaScript

## Database

- Supabase PostgreSQL

## Authentication

- Supabase Auth

## Storage

- Supabase Storage

## Cache

- Redis

---

# Current Runtime Flow

## Project Generation & Editing (All Templates)

1. **Dashboard Input**: Dashboard fills out form inputs for the selected template type (`wedding`, `birthday`, `campaign`, `toko-online`, `cv`, `e-course`, `jasa`).
2. **On-Demand AI Copywriting**: Option to use AI selectively by clicking the small "✨ AI Generate" button next to specific fields (processes asynchronous tasks via BullMQ and saves token bandwidth).
3. **Direct Draft Save**: Clicking "Generate Preview" compiles all current form state variables into a structured `pageData` object directly, bypassing automatic full-page AI generation.
4. **Draft/Deploy Persistence**: Persists the compiled JSON configuration to the database (`PUT /projects/:id/draft` or `POST /projects/:id/edit-deployed`).
5. **Live Preview Rendering**: The live preview instantly reflects the user's manual inputs and selected AI-generated sections.

---

---

## Deployment

1. Deploy request
2. Balance deduction
3. Update project
4. Publish

---

## Landing Page Rendering

1. Read slug/domain
2. Load pageConfig
3. Select template
4. Render

---

## Wallet

1. Create VA
2. Webhook
3. Verify
4. Update Balance

---

# Implemented Features

## Core

- Multi-domain generation
- AI generation
- AI image
- Draft project
- Deployment
- Project editing
- **Project Deletion System**: Added secure, ownership-validated project deletion endpoint (`DELETE /api/projects/:id`) and dashboard confirmation interface that cascade-releases active subdomains, invalidates caches, and physically purges all associated uploaded media file assets from Supabase Storage (while preserving default template placeholder images under `/defaults/`).
- Live preview
- Direct-to-Storage Upload with Folder Categorization (organizes uploads into nested category subfolders under `uploads/userId/category/`)
- Storage Sync Media Deletion (secure, ownership-validated physical file deletion on Supabase Storage via `DELETE /api/media`)
- **Multi-Version Route Isolation**: Isolated the monolithic editor into dedicated Next.js App Router routes (`/generate/v1` for legacy V1 form-based templates, `/generate/v2` for V2 Modular Section Builder), and refactored `/generate/page.js` into a lightweight Auto-Redirect Router that inspects `template_version` and seamlessly routes requests with zero breaking changes for existing live sites or drafts.
- **Focus-Triggered Re-render Prevention**: Prevented redundant re-renders and page resets by optimizing the global `AuthContext` to restrict state updates only when the token actually changes, and changing page-level `useEffect` dependencies from `session` object to primitive `session?.access_token`.
- **Self-Healing Storage Asset Deletion**: Solved the issue where browser crashes/kills left orphaned images in Supabase Storage by tracking newly uploaded unsaved URLs in `localStorage` (`wuzzkang_unsaved_uploads`) and automatically clearing/deleting them via `DELETE /api/media` on next session initialization.
- **Custom Domain / Subdomain System (Phase 1)** (Zod name validation, 10 credits wallet billing with automatic refund rollback logic, claim & release API endpoints, wildcard DNS ready)
- **User-Controlled AI Generation & Manual Editing**: Disabled automatic full-page AI generation on submit across all template types. All copywriting is either manual or per-field on-demand. Allows custom project name updates via `/edit-deployed` endpoint.
- **Template Versioning System (Phase 1)**: Added `template_version` meta configuration schema validation to prevent breaking live published sites. Added dashboard-level registry, dynamic preview/LP version routing, and an interactive upgrade banner for backward compatibility.
- **CV Template Formatting & Footer Removal Toggle**: Experience descriptions support automated list rendering (converting `*` and `-` into bullet-points). Configured `hide_footer` project metadata setting with dashboard toggle button to omit branding footer elements in template layout.
- **Server-Side Project List Pagination & Infinite Scrolling**: Replaced client-side list rendering with dynamic loading (pages of 5, adjustable via `NEXT_PUBLIC_PROJECTS_PER_PAGE`), added debounced search and tab categorization on backend API query range selection, and added "Tampilkan Lebih Banyak" scroll controls.
- **Interactive Form Validation & Required Indicators**: Added visual required indicators (`*` symbols) to all mandatory placeholders and labels across all template types. Modified submit buttons to remain enabled (unless loading) and implemented custom JavaScript error aggregation coupled with native HTML5 tooltips and automatic scroll-to-error behaviors to clarify form validation issues.
- **Admin Dashboard Integration**: Built a secure, role-protected Admin Dashboard under `/admin` in the dashboard frontend. Integrated overview statistics, paginated transactions viewer with profiles database join, and manual verification/completion tool for pending top-up invoices. Calls are isolated in `lib/adminApi.js` to support future migration to a separate repository.




## Asynchronous Processing (BullMQ & Redis)

- Asynchronous AI Image Generation (Avatar queue with automatic wallet refunds on failure)
- Asynchronous AI Text Copywriting (Field copywriting queue)
- **Redis Caching for AI Copywriting**: Caching layer on `generateFieldContent` to cache output texts based on a deterministic hash of user's context, reducing duplicate request latency to 1ms and saving token charges.
- Asynchronous Payment Webhook Processing (Winpay webhook instant response offloading)
- **AI Platform — Asynchronous Project Generation** (registry-based architecture, BullMQ worker, Gemini AI, image compilation via Supabase Storage. Templates supported: wedding, campaign, birthday, e-course, jasa)

## Billing

- Wallet (Credits-based with dynamic Rupiah conversion rate setting)
- Coupon
- Winpay
- Refund
- Transaction (Logs Credit amount and stores IDR raw values in metadata)
- Dynamic Payment Methods (Database-driven toggle and config for QRIS & Virtual Accounts)
- QRIS (Supports Gateway Mode and Image Mode with Admin WhatsApp manual verification button)

## Authentication

- Supabase Auth
- JWT
- Auth loading state management & layout flashing prevention (Fixed auth race condition & layout blink on initial page load)

## Database

- Projects
- Profiles
- Transactions
- Products (with nullable `priority` integer column)
- Coupons
- System Settings
- AI Tasks
- Payment Methods
- Role Access (Dynamic role-permissions mapping table)

## Landing Page Templates

- Wedding: `sage-green`, `floral-pink`, `classic-love` (supports dynamic AI-generated prewedding photo background)
- Birthday: `cute-balloon`, `elegant-gold`
- Toko Online: `modern-clean`, `midnight-dark`
- Campaign: `neon-conversion`, `clean-trust`
- **CV (Curriculum Vitae)**: `professional-dark` — ATS-friendly web CV with Export PDF support via `window.print()`. Uses direct draft save to database (no automatic global AI generation) with optional field-level AI copywriting assistance.
- **E-Course**: `purple-academy` — Dark theme online course landing page with purple gradients, curriculum modules, mentor info, bonus/offerings, testimonials, and countdown timer.
- **Jasa (Jasa Landing Page)**: `professional-navy` — Dark/blue professional service landing page referencing pegxy template design with sections for portfolio stats, how it works, about, services, why us, deliverables, pricing plans, guarantee, testimonials, FAQ, and contact form.
- **V2 Modular Section Builder**: `dynamic-builder` — Flexible section-based builder supporting 9 modular ES Module section types (`header`, `hero`, `about`, `services`, `social_proof`, `pricing`, `faq`, `contact`, `custom`). Features 12-column responsive split-screen UI grid (1/3 Editor [col-span-4] : 2/3 Preview [col-span-8] on desktop/laptop), Goal-Based Smart Starter Kits (`v2Presets.js` for Jasa, Campaign, Toko Online, Wedding, Custom with 0% token waste), Visual Catalog Section Picker Modal (`V2VisualSectionPickerModal.jsx`), Dedicated Global Theme Color Palette Selector Card (`v2/page.js`), Interactive Focus Sync preview, section manager (add, remove, reorder), per-section AI assist, centralized styling engine (`getSectionStyle`), and mode kontras / brightness controls (`default` / `light` / `dark`).
- **V2 Deploy Fix, Interactive Slug Validation & AI Assist Protection**: Resolved HTTP 400 deploy failure on V2 Builder by integrating `{ slug, couponCode: null }` payload into `POST /api/projects/:id/deploy`. Added `buildSlugSuggestion` helper and interactive URL Slug input bar with real-time sanitization (`a-z, 0-9, -`, max 40 chars) displaying live domain preview (`?slug=...`). Added `Deskripsi / Brief Bisnis (Konteks AI)` card UI in V2 Editor and wired per-section `✨ AI Assist` buttons to `/api/generate/field` with automatic UI disable protection when AI Brief is empty. Fixed `fieldType` enum mapping (`v2_hero`, `v2_services`, etc.), registered `v2_` in backend `isJson` check, bumped cache key to `v5`, and added a frontend JSON string parsing shield to eliminate raw JSON text in inputs. Added flexible Hero CTA controls, Header Navbar dynamic navigation, and upgraded Pricing Editor Form with dual-mode toggle (Plans Table vs CTA Only), plan cards manager (price, period, popular tag, feature list), quick target section dropdown selector (`🎯 Ke Section...`), clean zero-item empty menu support, and dual-layer auto-pruning section deletion sync. Guaranteed 100% anti-collision slug uniqueness via backend `${slug}-${uuidSuffix}` UUID prefixing.
- **V2 Section Global Theme & Mode Kontras Unification**: Centralized color palette selection to 1x globally with a dedicated **🎨 Tema Warna Landing Page (Global)** card in the Left Column Editor Manager and an always-visible top header bar (`v2GlobalTheme`). Replaced per-section individual color buttons in `V2SectionFormDispatcher.jsx` with a simplified per-section Mode Kontras Warna (`bg_brightness`: `default` / `light` / `dark`) control bar.
- **V2 Mobile Split View & Interactive Preview Toggle**: Set default mobile split screen ratio on `/generate/v2` so all component section accordions, brief field, URL slug, and action buttons fill the main screen, with the `LIVE SANDBOX PREVIEW V2` header bar sitting cleanly flush right above the mobile bottom navigation bar (with 0% cut-off iframe content peeking through, matching Gambar 2). Added an interactive `👁️ Preview` toggle button on the `LIVE SANDBOX PREVIEW V2` header bar that smoothly expands the live preview iframe to fill 84.5% of the screen height, positioning the preview bar FLUSH directly underneath the global color selection buttons (`Navy`, `Emerald`, `Amber`, `Purple`, `Rose`, `Slate`). Fixed `toggleMobilePreviewRatio` handler so clicking `Tutup Preview` when in Full Preview mode (`mobileViewMode === 'preview'`) seamlessly returns to Split Screen mode. Compacted top header paddings and added `pb-16 lg:pb-0` bottom padding so the preview block sits cleanly above the mobile bottom navbar and central `+` FAB.
- **Dashboard Stats Category Count Fix**: Fixed stats header (Total Halaman, Aktif Deploy, Draft/Proses) incorrectly reflecting the active filter tab. Added `fetchGlobalStats()` fetching 3 parallel endpoints to maintain persistent global counts independent of active category filter. Tab Undangan and Toko/Bisnis now display badge counts.
- **SOP Enforcement Hardening (98_IMPLEMENTATION_PROTOCOL.md v3.2.0)**: Added MANDATORY PRE-FLIGHT CHECKLIST section to `.cursorrules` requiring `implementation/active/` initialization BEFORE writing any code. Added Zero-Exception Rule (#15) and Rules File Synchronization Invariant (#16) to `98_IMPLEMENTATION_PROTOCOL.md` (mandating `.clinerules` 100% mirrors `.cursorrules` whenever `.cursorrules` changes). Bumped protocol version from 3.1.0 → 3.2.0.
- **Wuzzkang Skills Unique Identifier Integration**: Added `## Unique Identifier` sections with dedicated prefix tags (e.g. `[WUZZKANG-ORCHESTRATOR-AGENT]`, `[WUZZKANG-REFACTOR-AGENT]`, `[WUZZKANG-REVIEWER-AGENT]`, `[WUZZKANG-DOC-SYNC-AGENT]`, etc.) across all 11 Wuzzkang skills in `wuzzkang-engineering/skills/` and synchronized to `~/.gemini/config/skills/`.
- **Mobile Horizontal Scroll Fix (< 460px)**: Fixed horizontal scrollbar on mobile viewports narrower than 460px. Added `overflow-x: hidden` to `html` and `body` in `globals.css` to block viewport-level horizontal overflow. Changed `min-w-[240px]` to `w-full` on the search input wrapper in `src/app/page.js` so the search box collapses properly on narrow screens instead of forcing a fixed 240px minimum width.
- **V2 Mobile Editor Section List Space Optimization & Reusable Security Brief Modal**: Recovered ~184px of vertical space for the Section List on mobile view of `/generate/v2` via 3 changes: (1) **Opsi B** — Tema Warna panel hidden on mobile only (`hidden lg:flex`) since it is a functional duplicate of the theme switcher in the Top Header bar; (2) **Opsi A** — `Deskripsi / Brief Bisnis` panel click-to-expand preview opening a full-screen Brief AI editor modal; (3) **Opsi A** — `URL Slug Landing Page` panel is collapsible via a `▾/▴` toggle. Added reusable generic modal [`Modal.jsx`](file:///home/bms-del112/BMS/personal-project/wuzzkang/wuzzkang-dashboard/src/components/Modal.jsx) with **Hardware/Browser Physical Back Button Interception** (`pushState` + `popstate` listener) so pressing the back button on mobile closes the modal without navigating away from `/generate/v2`. Built security utility [`security.js`](file:///home/bms-del112/BMS/personal-project/wuzzkang/wuzzkang-dashboard/src/lib/security.js) with `sanitizeAIBriefInput` preventing XSS, script injection tags (`<script>`, `<iframe>`), `javascript:` pseudo-protocols, and malicious payloads. Abstracted full-screen Brief AI modal into reusable component [`BriefTextareaModal.jsx`](file:///home/bms-del112/BMS/personal-project/wuzzkang/wuzzkang-dashboard/src/components/BriefTextareaModal.jsx).
- **Dashboard Compact UI & Sticky Filter Redesign**: Redesigned main dashboard page ([`src/app/page.js`](file:///home/bms-del112/BMS/personal-project/wuzzkang/wuzzkang-dashboard/src/app/page.js)) into a compact, high-density layout: (1) Fixed sticky search/filter bar position using `sticky top-[64px] z-30 bg-theme-surface/95 backdrop-blur-md shadow-sm` to stay flush beneath top navbar on scroll; (2) Reduced landing page card outer padding (`p-5` → `p-3.5 md:p-4 rounded-2xl`), aligned category badge, status badge, created date, and trash delete button into a single top header row; (3) Combined Live URL and Subdomain Manager into a single compact line; (4) Compacted card action buttons (`py-1.5 px-3 text-xs`); (5) Upgraded desktop card grid layout from 2 columns to 3 columns (`grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5`) for optimal card aspect ratio on laptop/desktop screens (1024px+).



---

# Existing Components

## AI

- Sumopod
- Groq
- **Gemini** (AI Platform — `GeminiProvider`, configured via `GEMINI_API_KEY`)
- **Gemini Imagen 3** (AI Platform — `GeminiImageProvider`, handles image generation and fallbacks)

## AI Platform (Registry-Based)

- `AIOrchestrationService` — central coordinator, routes task types to compilers and providers
- `ProviderRegistry` — runtime registry for AI providers (`gemini`, `sumopod`)
- `TaskCompilerRegistry` — runtime registry for task compilers by type (`wedding`, `e-course`, etc.)
- `WeddingCompiler` — compiles wedding form data + AI content into full `pageData`
- `ECourseTaskCompiler` — compiles e-course details and prompt schema for Gemini task generation
- `BullMQQueueAdapter` — concrete adapter wrapping BullMQ for async job dispatch
- `AITaskRepository` — Supabase-backed persistence layer for `ai_tasks` table
- `SupabaseStorageProvider` — handles image uploading to Supabase Storage for AI-processed assets
- `aiTaskWorker.js` — BullMQ worker process that consumes and executes AI tasks

## Payment

- Winpay
- Dummy Provider

## Queue

- BullMQ (Enabled for AI Image, AI Text, Payment Webhook tasks, and AI Platform jobs)

## Rendering

- Dynamic Template Loader

## Dashboard Pages

- `/generate` — AI landing page generator form (all template types; wedding uses async AI Platform flow)
- `/login` — Authentication
- `/topup` — Wallet top-up via Winpay VA
- `/admin` — Admin Dashboard with system stats, transaction viewer, manual payment verification, and User Management (user list, toggle active/inactive status, and permanent account deletion) (restricted to admin/super_admin users)

---

# Disabled Features

- GitHub Deployment Worker
- Legacy Deploy Endpoint

---

# Partially Implemented Features

- PaymentFactory Refactor
- IP Whitelisting


---

# In-Progress Features

## Profile-Centric Tracking Pixel Integration (Phase 5)

> Status: IN PROGRESS — being implemented by AI engineer session (2026-07-04)

- User Profile page (`/profile`) — account info, security, tracking config
- Tracking config stored in `profiles.tracking_config` (JSONB column) — **migration pending**
- `PATCH /api/profile/tracking` endpoint — saves FB Pixel, GA4, Google Ads, TikTok Pixel IDs
- `GET /api/generate` form shows read-only tracking banner + "Edit di Profil" link
- At generate time, API merges `tracking_config` from profile into `page_data.meta` before saving
- `wuzzkang-lp/script.js` reads `pageConfig.meta` and injects tracking scripts dynamically
- Design is custom-domain-ready: injection happens at LP runtime, not per-template, so it works across GitHub Pages slugs and future custom domains without changes
- LP_VERSION bump required after changes to script.js

## AI Platform — Additional Template Compilers

> Status: COMPLETED — All template types (`wedding`, `campaign`, `birthday`, and `toko-online`) are fully migrated and implemented on the async AI Platform queue flow. No template types use the legacy synchronous `/generate` route anymore.

## V2 Section Builder — UI/UX Redesign & 3-Theme Reactivity System

> Status: COMPLETED — The V2 Section Builder (`/generate/v2`) has been completely redesigned with an ultra-compact, modern UI layout, 100% dynamic CSS theme variable reactivity (`Clean`, `Retro`, `Classic Dark`), sticky bottom action bars, and an interactive touch-draggable mobile split-screen resizer.

- **100% Theme Reactivity**: All V2 section forms (`V2SectionWeddingForms`, `V2SectionStandardForms`, `ImagePickerField`, and `V2SectionFormDispatcher`) seamlessly adapt to the 3 global dashboard themes (`Clean`, `Retro`, `Classic Dark`) using `--theme-bg`, `--theme-surface`, `--theme-card`, `--theme-border`, `--theme-text`, and `--theme-accent`.
- **Compact Field System**: Sleek rounded-lg inputs with compact paddings (`px-2.5 py-1.5`) and micro action buttons replace bulky inputs.
- **Mobile Touch-Draggable Resizer**: Added a touch-drag divider bar (`↕️ Seret Atas / Bawah`) allowing mobile users to dynamically adjust the height ratio between Form Editor and Live Sandbox Preview (15% - 85%).
- **Mobile View Controller Tabs**: Quick-switch tabs on mobile (`📝 Form`, `↕️ Split Screen`, `👁️ Full Preview`).
- **Prominent Sticky Deploy Bar**: Added a fixed bottom action bar containing `🚀 Publikasikan / Deploy` and `💾 Simpan Draft` buttons for instant visibility.

---

# Known Technical Debt

> Technical debt that currently exists in the codebase.

- Payment controller uses body.userId
- Wallet transaction not fully atomic
- Coupon increment not atomic
- Manual LP versioning
- Legacy "Siluet" naming
- Hardcoded customerNo

---

# Unknown Areas

Areas that require manual verification.

- Individual Templates
- Sidebar
- Login
- Topup
- Migration Verification
- Test Coverage
- Production Infrastructure
- AI Platform worker stability at production scale (Redis eviction, BullMQ job TTL)

---

# References

See:

- 00_FOUNDATION.md
- 01_SYSTEM_OVERVIEW.md

---

# Next Reading

03_ARCHITECTURE.md