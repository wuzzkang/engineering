# Current State

## Document Information

| Field | Value |
|------|------|
| Document | 02_CURRENT_STATE.md |
| Version | 2.0 |
| Status | Active |
| Purpose | Describe the current implementation state of Wuzzkang |
| Audience | Engineers, AI Assistants |
| Last Updated | 2026-07-05 (AI Prewedding Photo Integration) |

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

## Project Generation (Legacy — non-wedding templates)

1. Dashboard fills form
2. `POST /api/generate` → AI generates `pageData` synchronously
3. Validate + save draft to Supabase
4. Return `projectId` + `pageData` to dashboard

---

## Project Generation (AI Platform — wedding templates)

1. Dashboard fills wedding form + uploads images
2. `POST /api/v1/ai/execute` → creates `ai_tasks` row + BullMQ job, returns `taskId`
3. Dashboard polls `GET /api/v1/ai/task/:id` every 3 seconds
4. Worker executes: `WeddingCompiler.compile()` → GeminiProvider/SumopodProvider → Supabase Storage uploads
5. Task status transitions: `queued → processing → completed`
6. Dashboard fetches `result_url` → parses compiled `pageData`
7. `POST /api/projects/draft` → persists `pageData` to `projects` table
8. Renders live preview + enables Publish flow

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
- Live preview

## Asynchronous Processing (BullMQ & Redis)

- Asynchronous AI Image Generation (Avatar queue with automatic wallet refunds on failure)
- Asynchronous AI Text Copywriting (Field copywriting queue)
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
- Products
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
- `TaskCompilerRegistry` — runtime registry for task compilers by type (`wedding`)
- `WeddingCompiler` — compiles wedding form data + AI content into full `pageData`
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

- Custom Domain
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