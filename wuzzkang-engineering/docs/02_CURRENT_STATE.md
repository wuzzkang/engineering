# Current State

## Document Information

| Field | Value |
|------|------|
| Document | 02_CURRENT_STATE.md |
| Version | 2.4 |
| Status | Active |
| Purpose | Describe the current implementation state of Wuzzkang |
| Audience | Engineers, AI Assistants |
| Last Updated | 2026-07-16 (Required field indicators and interactive validation in landing page generator) |

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

1. **Dashboard Input**: Dashboard fills out form inputs for the selected template type (`wedding`, `birthday`, `campaign`, `toko-online`, `cv`).
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
- **Custom Domain / Subdomain System (Phase 1)** (Zod name validation, 10 credits wallet billing with automatic refund rollback logic, claim & release API endpoints, wildcard DNS ready)
- **User-Controlled AI Generation & Manual Editing**: Disabled automatic full-page AI generation on submit across all template types. All copywriting is either manual or per-field on-demand. Allows custom project name updates via `/edit-deployed` endpoint.
- **Template Versioning System (Phase 1)**: Added `template_version` meta configuration schema validation to prevent breaking live published sites. Added dashboard-level registry, dynamic preview/LP version routing, and an interactive upgrade banner for backward compatibility.
- **CV Template Formatting & Footer Removal Toggle**: Experience descriptions support automated list rendering (converting `*` and `-` into bullet-points). Configured `hide_footer` project metadata setting with dashboard toggle button to omit branding footer elements in template layout.
- **Server-Side Project List Pagination & Infinite Scrolling**: Replaced client-side list rendering with dynamic loading (pages of 5, adjustable via `NEXT_PUBLIC_PROJECTS_PER_PAGE`), added debounced search and tab categorization on backend API query range selection, and added "Tampilkan Lebih Banyak" scroll controls.
- **Interactive Form Validation & Required Indicators**: Added visual required indicators (`*` symbols) to all mandatory placeholders and labels across all template types. Modified submit buttons to remain enabled (unless loading) and implemented custom JavaScript error aggregation coupled with native HTML5 tooltips and automatic scroll-to-error behaviors to clarify form validation issues.


## Asynchronous Processing (BullMQ & Redis)

- Asynchronous AI Image Generation (Avatar queue with automatic wallet refunds on failure)
- Asynchronous AI Text Copywriting (Field copywriting queue)
- **Redis Caching for AI Copywriting**: Caching layer on `generateFieldContent` to cache output texts based on a deterministic hash of user's context, reducing duplicate request latency to 1ms and saving token charges.
- Asynchronous Payment Webhook Processing (Winpay webhook instant response offloading)
- **AI Platform — Asynchronous Project Generation** (registry-based architecture, BullMQ worker, Gemini AI, image compilation via Supabase Storage. Templates supported: wedding, campaign, birthday)

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