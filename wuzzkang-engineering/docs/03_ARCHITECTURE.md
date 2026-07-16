# Architecture

## Document Information

| Field       | Value                                                                                          |
|-------------|------------------------------------------------------------------------------------------------|
| Document    | 03_ARCHITECTURE.md                                                                             |
| Version     | 1.0.0                                                                                          |
| Status      | Draft                                                                                          |
| Owner       | Muhammad Arif Setiawan                                                                         |
| Purpose     | Document the current architecture of the Wuzzkang platform — boundaries, responsibilities, dependencies, and interaction patterns between repositories |
| Audience    | Engineers, AI Assistants, Technical Reviewers                                                  |
| Based On    | Direct codebase reading, June–July 2026                                                        |

---

## Purpose of This Document

This document describes the structural architecture of Wuzzkang as implemented in the current codebase.

Its purpose is to define:

- System boundaries
- Repository responsibilities
- Internal layering
- Communication patterns
- Data contracts
- Dependency relationships

This document intentionally does **not** describe implementation quality, runtime findings, known issues, or future improvements. Those belong to `02_CURRENT_STATE.md` and `WUZZKANG_AUDIT.md`.

---

## Part 1 — System Architecture Overview

### 1.0 System Context

The following diagram shows Wuzzkang in the context of external actors and systems.

```
                        Internet
                           │
              ┌──────────┤ User ├──────────┐
              │           └──────────┘           │
              │                                │
              ▼                                ▼
         Dashboard                        Landing Page
     (Authenticated)                    (Public / Anonymous)
              │                                │
              │                                ▼
              │                           Supabase
              ▼                         (Read Only)
             API
              │
    ┌────────┤ Infrastructure
    │         │
    ▼         ▼
Supabase   External Providers
            (AI, Payment, GitHub)
```

Actors:

| Actor              | Type     | Interaction                                             |
|--------------------|----------|---------------------------------------------------------|
| User               | Human    | Interacts with Dashboard (authenticated) and Landing Page (anonymous) |
| Dashboard          | System   | Sends authenticated HTTP requests to the API            |
| Landing Page       | System   | Reads deployed project data from Supabase (anon)        |
| API                | System   | Orchestrates business logic, writes to Supabase, calls providers |
| Supabase           | External | Persists data, issues JWT tokens, enforces RLS          |
| AI Provider        | External | Generates text and image content                        |
| Payment Provider   | External | Processes payments and sends webhook notifications      |
| GitHub             | External | Hosts template repositories (queue-based flow)          |

---

### 1.1 Partitioning Model

Wuzzkang is partitioned into three active repositories. Each repository owns one primary concern.

```
┌───────────────────────────────────────────────────────────────────────┐
│                         User (Browser)                                │
└──────────────────────────────┬────────────────────────────────────────┘
                               │
                               ▼
┌───────────────────────────────────────────────────────────────────────┐
│                      wuzzkang-dashboard                               │
│                                                                       │
│  Concern: User interaction                                            │
│  Runtime: Next.js (App Router) — Server-Side Rendered + Client       │
│                                                                       │
│  Communicates with: wuzzkang-api (over HTTP)                         │
│  Communicates with: Supabase (direct, for authentication only)       │
└──────────────────────────────┬────────────────────────────────────────┘
                               │ HTTP + Bearer JWT
                               ▼
┌───────────────────────────────────────────────────────────────────────┐
│                       wuzzkang-api                                    │
│                                                                       │
│  Concern: Business logic, validation, orchestration                   │
│  Runtime: Node.js (Express.js v5)                                     │
│                                                                       │
│  Communicates with: Supabase (service role key)                      │
│  Communicates with: AI Providers (via provider abstraction)          │
│  Communicates with: Payment Gateway (via provider abstraction)       │
│  Communicates with: Redis (usage quota tracking)                     │
│  Communicates with: GitHub (repository management)                   │
└──────────────────────────────┬────────────────────────────────────────┘
                               │ Supabase JS SDK (service role)
                               ▼
┌───────────────────────────────────────────────────────────────────────┐
│                          Supabase                                     │
│                                                                       │
│  PostgreSQL database, Auth (GoTrue), Object Storage                  │
│                                                                       │
│  Shared by: API (write + read, service role)                         │
│  Shared by: Dashboard (read, anon/user JWT, auth only)               │
│  Shared by: LP (read, anon key, deployed projects only)              │
└──────────────────────────────┬────────────────────────────────────────┘
                               │ Supabase JS SDK (anon key)
                               ▼
┌───────────────────────────────────────────────────────────────────────┐
│                       wuzzkang-lp                                     │
│                                                                       │
│  Concern: Public-facing rendering                                     │
│  Runtime: Vanilla HTML + JavaScript (ES Modules) — static site       │
│                                                                       │
│  Communicates with: Supabase (direct, anonymous read only)           │
│  Does NOT communicate with: wuzzkang-api                             │
│  Does NOT communicate with: wuzzkang-dashboard                       │
└───────────────────────────────────────────────────────────────────────┘
```

### 1.2 Communication Boundaries

| From             | To               | Protocol        | Auth Method          | Direction          |
|------------------|------------------|-----------------|----------------------|--------------------|
| Dashboard        | API              | HTTP REST       | Bearer JWT           | Dashboard → API    |
| Dashboard        | Supabase         | Supabase JS SDK | Anonymous / User JWT | Auth only          |
| API              | Supabase         | Supabase JS SDK | Service Role Key     | Read + Write       |
| API              | AI Provider      | HTTPS           | API Key              | API → Provider     |
| API              | Payment Provider | HTTPS           | Provider credentials | API ↔ Provider    |
| Payment Provider | API              | HTTPS Webhook   | Signature-based      | Provider → API     |
| API              | Redis            | TCP             | None (local)         | Read + Write       |
| API              | GitHub           | HTTPS           | Access Token         | API → GitHub       |
| LP               | Supabase         | Supabase JS SDK | Anon Key             | Read only          |

**Architectural boundary rules:**

- The Landing Page has zero HTTP calls to the API. All data is read directly from Supabase.
- The Dashboard contains no business logic. All billing, validation, and orchestration happens inside the API.
- The API is the only component that writes to Supabase using the service role key.
- All inter-repository communication occurs through explicit public interfaces. Repositories never communicate through shared source code.

### 1.3 Architectural Boundary Rules

The following rules define ownership boundaries between system components.

#### Dashboard

The Dashboard is responsible only for user interaction.

It MUST:

- Handle authentication UI
- Collect user input
- Display project previews
- Call API endpoints

It MUST NOT:

- Implement business rules
- Access the database directly (except Supabase Auth)
- Calculate billing
- Validate coupons
- Generate AI content directly

---

#### API

The API is the single owner of business logic.

It MUST:

- Validate requests
- Enforce business rules
- Manage wallet operations
- Orchestrate AI content generation
- Persist project data
- Communicate with external providers

It MUST NOT:

- Render HTML
- Contain presentation logic

---

#### Landing Page

The Landing Page is responsible only for rendering deployed projects.

It MUST:

- Resolve project identity from the URL
- Read deployed project data
- Load templates dynamically
- Render pageConfig

It MUST NOT:

- Modify database records
- Call the API
- Perform authentication
- Execute business logic

---

#### Supabase

Supabase is the shared data persistence layer.

It MUST:

- Persist application data
- Enforce Row Level Security
- Store pageConfig as JSONB
- Issue and verify authentication tokens

It MUST NOT:

- Contain business rules
- Generate presentation
- Drive UI decisions

---

#### AI Provider

AI Providers generate content on behalf of the API.

They MUST:

- Generate structured text content from prompts
- Generate images from prompts

They MUST NOT:

- Persist project data
- Make billing decisions
- Access the database directly

---

#### Payment Provider

Payment Providers handle transaction creation and verification.

They MUST:

- Create payment transactions
- Verify webhook callback authenticity

They MUST NOT:

- Update wallet balances
- Read or write project data
- Contain business rules

---

### 1.4 Architectural Ownership Matrix

The following matrix summarizes which component owns each platform capability.

| Capability              | Dashboard     | API           | Landing Page  | Supabase      |
|-------------------------|---------------|---------------|---------------|---------------|
| Authentication UI       | ✅ Owns        | ❌             | ❌             | ❌             |
| JWT Verification        | ❌             | ✅ Owns        | ❌             | ❌             |
| Business Rule Enforcement | ❌           | ✅ Owns        | ❌             | ❌             |
| AI Content Generation   | ❌             | ✅ Owns        | ❌             | ❌             |
| Wallet Management       | ❌             | ✅ Owns        | ❌             | Storage Only  |
| Project Data Write      | ❌             | ✅ Owns        | ❌             | Executes      |
| Project Data Read       | Limited (auth)| ✅ Full Access | Deployed Only | Executes      |
| Coupon Validation       | ❌             | ✅ Owns        | ❌             | ❌             |
| Payment Orchestration   | ❌             | ✅ Owns        | ❌             | ❌             |
| Template Rendering      | Preview Only  | ❌             | ✅ Production  | ❌             |
| HTML Output             | Preview Only  | ❌             | ✅ Production  | ❌             |
| Row Level Security      | ❌             | ❌             | ❌             | ✅ Owns        |
| Asset Storage           | ❌             | Writes        | Reads via URL | ✅ Owns        |
| pageConfig Schema       | ❌             | ✅ Owns        | Consumer      | Storage        |

---

### 1.5 Dependency Direction

Dependencies within the platform must follow strict directionality. No component may depend on a component that is above it in the hierarchy.

```
Dashboard
    │
    ▼
   API
    │
    ▼
Infrastructure
(Supabase, AI Provider, Payment Provider, Redis, GitHub)
```

```
Landing Page
    │
    ▼
 Supabase
```

Dependency rules:

- The Dashboard may depend on the API.
- The Dashboard must never depend on the Landing Page.
- The Landing Page must never depend on the API.
- The API may depend on infrastructure services.
- Infrastructure services never depend on application code.
- Shared contracts (pageConfig) are owned and versioned by the API.

---

## Architectural Goals

The architecture of Wuzzkang is designed to achieve the following qualities.

| Goal                             | How It Is Achieved |
|----------------------------------|--------------------|
| Separation of Concerns           | Each repository owns exactly one responsibility |
| Clear Ownership Boundaries       | Every capability has exactly one owning component |
| Replaceable External Providers   | AI, Payment, and Storage are accessed through provider abstractions |
| Deterministic Rendering          | The same pageConfig always produces the same output |
| Contract-Driven Communication    | Repositories communicate through HTTP contracts and pageConfig |
| Stateless API                    | The API holds no session state; all state is in Supabase |
| Independent Repository Deployment| Each repository can be deployed and updated independently |

---

## Architectural Decisions

The current architecture intentionally adopts the following structural decisions.

| Decision                        | Rationale                                                                 |
|---------------------------------|---------------------------------------------------------------------------|
| Repository-per-responsibility   | Each repository has a single, clearly bounded concern. Avoids coupling between UI, logic, and rendering. |
| Backend-for-business-logic      | All rules live in the API. Dashboard and Landing Page contain no logic. Ensures consistency and single enforcement point. |
| Database as shared persistence  | A single Supabase project is shared via different access levels. Eliminates data sync overhead. |
| Static rendering for public pages | The Landing Page is a static site with no server runtime. Reduces cost, eliminates state bugs, and simplifies deployment. |
| Provider abstraction for external services | AI, Payment, and Storage providers are accessed through interfaces, not directly. Enables provider replacement without code changes to consumers. |
| pageConfig as the system contract | All three repositories share a single JSON schema. Decouples form input, business logic, and rendering. |
| Supabase RLS as the access boundary | Row Level Security policies enforce data visibility rules at the database level, independent of application code. |

---

## Part 2 — Repository Architecture

### 2.1 wuzzkang-api

#### High-Level Folder Structure

```
src/
├── routes/
├── middleware/
├── services/
├── providers/
├── queue/
├── schemas/
├── config/
├── utils/
└── server.js
```

The API follows a layered organization where routes receive requests, middleware performs cross-cutting concerns, services implement business logic, and providers encapsulate external integrations.

#### 2.1.1 Responsibility

The API owns business logic and system orchestration. It owns:

- Request validation (all inputs validated with Zod before any processing)
- Business rule enforcement (balance checks, edit limits, coupon validation)
- AI content generation orchestration
- Project lifecycle management (create, deploy, edit)
- Wallet and billing operations
- Payment processing and webhook handling
- Database reads and writes via service role

#### 2.1.2 Internal Layer Organization

The API follows a layered pattern:

```
Request
    │
    ▼
Route Handler (routes/)
    │  Validates input using Zod
    │  Extracts authenticated user from req.user
    ▼
Service Layer (services/)
    │  Executes business logic
    │  Calls other services
    │  Calls Supabase, AI provider, GitHub, Redis
    ▼
Supabase / External Providers
    │
    ▼
Response
```

Layer descriptions:

**Routes** — Define HTTP endpoints. Validate incoming request bodies. Extract the authenticated user identity (set by auth middleware). Delegate to service methods. Return JSON responses. Do not contain business logic.

**Services** — Contain all business rules, orchestration, and external calls. Services compose each other directly. All business decisions reside here.

**Middleware** — Auth middleware verifies incoming JWTs using Supabase Auth before allowing access to protected endpoints. Error middleware provides centralized error formatting.

**Config** — A single validated configuration object built at startup. If required environment variables are missing, the process exits immediately.

**Queues** — Encapsulate asynchronous processing. The API includes a background queue subsystem for deployment jobs. Current runtime usage is documented in `02_CURRENT_STATE.md`.

**Utils** — Shared utilities: Redis client, signature verification helpers, schema definitions.

#### 2.1.3 Service Dependencies

```
projectService
    ├── supabaseService
    ├── walletService
    │       └── supabaseService
    ├── couponService
    │       └── supabaseService
    ├── githubService
    └── deploymentQueue

generator.route
    ├── ai.service
    ├── supabaseService
    └── walletService

webhookController
    ├── PaymentProvider (via factory)
    └── walletService

transactionService
    ├── supabaseService
    └── PaymentProvider (via factory)
```

#### Internal Dependency Graph

```
HTTP
 │
 ▼
Routes
 │
 ▼
Middleware
 │
 ▼
Services
 │
 ├──────────────┐
 ▼              ▼
Supabase     External Providers
 │              │
 └──────┬───────┘
        ▼
    HTTP Response
```

#### 2.1.2a Internal Layering Rules

The following rules govern which layers may depend on which.

| Layer      | May Depend On                          | Must Never Depend On         |
|------------|----------------------------------------|------------------------------|
| Routes     | Services, Middleware (via req.user)    | Other Routes                 |
| Services   | Other Services, Providers, Config      | Routes, Middleware           |
| Providers  | Config                                 | Routes, Services             |
| Middleware | Config                                 | Routes, Services             |
| Schemas    | Nothing                                | Any application layer        |
| Config     | Environment variables only             | Any application layer        |
| Utils      | Config (where needed)                  | Services, Routes             |

---

#### 2.1.4 API Endpoints

| Method | Path                          | Auth Required | Handler                         |
|--------|-------------------------------|---------------|---------------------------------|
| POST   | /api/generate                 | Yes           | generator.route                 |
| POST   | /api/generate/field           | Yes           | generator.route                 |
| POST   | /api/generate-image           | Yes           | image.route                     |
| POST   | /api/media/process            | Yes           | image.route                     |
| POST   | /api/media/upload-url         | Yes           | image.route                     |
| POST   | /api/media/upload (deprecated)| Yes           | image.route                     |
| GET    | /api/profile                  | Yes           | profile.route                   |
| GET    | /api/products                 | Yes           | product.route                   |
| POST   | /api/coupons/validate         | Yes           | coupon.route                    |
| GET    | /api/projects                 | Yes           | project.route                   |
| GET    | /api/projects/:id             | Yes           | project.route                   |
| POST   | /api/projects/:id/deploy      | Yes           | project.route                   |
| POST   | /api/projects/:id/retry-pages | Yes           | project.route                   |
| POST   | /api/projects/:id/edit-deployed | Yes         | project.route                   |
| POST   | /api/deploy                   | Yes           | deploy.route                    |
| POST   | /api/payments/create          | Yes           | payment.route / payment.controller |
| POST   | /api/payments/webhook/*       | No (signature)| payment.route / webhook.controller |
| GET    | /api/admin/stats              | Yes           | admin.route                     |
| GET    | /api/admin/transactions       | Yes           | admin.route                     |
| GET    | /api/admin/users              | Yes           | admin.route                     |
| PATCH  | /api/admin/users/:id/status   | Yes           | admin.route                     |
| DELETE | /api/admin/users/:id          | Yes           | admin.route                     |
| POST   | /api/admin/payments/:id/complete | Yes         | payment.route                   |

#### 2.1.5 External Dependencies

| Dependency       | Purpose                              | Configurable Via     |
|------------------|--------------------------------------|----------------------|
| Supabase         | Database, Auth, Storage              | `SUPABASE_URL`, `SUPABASE_SERVICE_KEY` |
| AI Provider      | LLM text generation                  | `AI_PROVIDER`, provider-specific API keys |
| Image Provider   | AI image generation                  | `OPENAI_API_KEY`     |
| Payment Gateway  | Payment transactions and webhooks    | Provider-specific keys and URLs |
| Redis            | AI quota usage tracking              | `REDIS_URL`          |
| GitHub           | Repository management                | `GITHUB_TOKEN`, `GITHUB_ORG_NAME`, `GITHUB_TEMPLATE_REPO` |

---

### 2.2 wuzzkang-dashboard

#### High-Level Folder Structure

```
src/
├── app/
├── components/
├── context/
├── hooks/
├── lib/
├── styles/
└── public/
```

The Dashboard follows the Next.js App Router convention.

#### 2.2.1 Responsibility

The Dashboard owns the user interface of the platform. It owns:

- Authentication flow (login, session management, logout)
- Project creation form interface (per domain type)
- AI-assisted field generation interaction
- Project preview rendering (using synced LP templates)
- Project listing, filtering, search
- Deployment initiation UI (slug input, coupon code, publish button)
- Post-deploy project editing UI (up to 3 edits)
- Guest URL generation and WhatsApp sharing modal
- Wallet top-up UI
- API communication (all business operations delegated to API)

#### 2.2.2 Internal Organization

The Dashboard follows the Next.js App Router convention:

```
src/
├── app/              — Route pages (page.js per route)
│   ├── page.js       — Project listing (Dashboard home)
│   ├── generate/     — Project creation and editing
│   ├── login/        — Authentication page
│   └── topup/        — Wallet top-up page
├── components/       — Shared UI components
│   └── Sidebar.js    — Navigation
├── context/          — React context providers
│   └── AuthContext.js — Session, user, profile state
└── lib/
    └── supabase.js   — Supabase client (auth only)
```

#### 2.2.3 Authentication Architecture

The Dashboard uses Supabase Auth directly (client-to-Supabase), not through the API.

Flow:
1. User logs in via Supabase client SDK (email/password).
2. Supabase returns a session with an `access_token` (JWT).
3. `AuthContext` stores the session, user, and profile state.
4. Every API request from the Dashboard includes `Authorization: Bearer <access_token>`.
5. Profile data (balance, AI quota) is fetched from `GET /api/profile` using this token.

The Dashboard does not verify JWTs itself. It relies on the API to validate them.

#### 2.2.4 Preview Mechanism Architecture

The Dashboard renders project previews using the same template JavaScript modules used by the LP in production.

Template files are physically copied from `wuzzkang-lp/templates/` into `wuzzkang-dashboard/public/preview/templates/` using a local sync script (`npm run sync:templates`). This sync must be run manually whenever LP templates are updated.

The preview is rendered in the browser using these copied templates, not in an iframe pointing to the LP. This allows the Dashboard preview to use the same template source files as the Landing Page.

#### 2.2.5 External Dependencies

| Dependency         | Purpose                              | Access Method        |
|--------------------|--------------------------------------|----------------------|
| wuzzkang-api       | All business operations              | HTTP + Bearer JWT    |
| Supabase           | Authentication only                  | Supabase JS SDK      |

The Dashboard has no direct database access for project data, billing, or AI generation.

#### 2.2.6 Admin Dashboard Decoupling & Migration Path

The Admin Dashboard is currently integrated inside `wuzzkang-dashboard` under the `/admin` route. All admin-specific API calls are isolated in `src/lib/adminApi.js` to make the module completely plug-and-play.

If a separate repository (e.g., `wuzzkang-admin`) is required in the future, the migration path is as follows:

1. **Backend API**: No changes required. The API endpoints (`/api/admin/*` and manual verification complete endpoint) are fully decoupled and use token-based JWT authentication context.
2. **Frontend Extraction**:
   - Initialize a new Next.js App Router project: `npx -y create-next-app@latest wuzzkang-admin`
   - Copy `src/lib/adminApi.js` (update `NEXT_PUBLIC_API_URL` to point to the shared API server).
   - Copy `src/hooks/useRequireAdmin.js`.
   - Copy the authentication infrastructure: `src/context/AuthContext.js` and `src/lib/supabase.js` for session context.
   - Copy the page template `src/app/admin/page.js` to `app/page.js` or `app/admin/page.js` in the new project.
   - Copy standard CSS variable mappings from `globals.css` to maintain cohesive theming styles.

---

### 2.3 wuzzkang-lp

#### High-Level Folder Structure

```
/
├── index.html
├── script.js
├── templates/
├── assets/
└── styles/
```

The Landing Page intentionally maintains a flat structure without a build step.

#### 2.3.1 Responsibility

The Landing Page repository owns rendering of deployed projects. It owns:

- URL parsing (slug from query param, slug from URL path, or custom domain from hostname)
- Project lookup from Supabase (read-only, deployed projects only)
- Template routing based on `pageConfig.meta.template_type` and `pageConfig.meta.design_key`
- Dynamic template module loading (browser-native `import()`)
- Rendering delegation to the selected template module
- Guest name extraction from URL query parameters (`?to=Name`)

The LP contains no business logic. It does not write to the database. It does not make API calls.

#### 2.3.2 Internal Architecture

The LP is a single-page static site. There is one HTML shell and one JavaScript entry point.

```
index.html      — Shell: loading spinner, #app container, font preloads, Tailwind CDN
script.js       — Entry: URL parsing → Supabase query → template routing → render call
templates/
    wedding/    — One JS module per design key
    birthday/   — One JS module per design key
    toko-online/— One JS module per design key
    campaign/   — One JS module per design key
```

The architecture is intentionally flat. No bundler. No build step. No framework.

#### 2.3.3 Template Loading Pattern

When `script.js` determines the `template_type` and `design_key`, it performs a browser-native dynamic import:

```
import(`./templates/${template_type}/${design_key}.js`)
    → module.render(pageConfig, guestName)
```

If the import fails (module not found), the LP falls back to a default design key for that domain type. If the fallback also fails, it renders an error message.

For the legacy `store` template type, no dynamic import is performed. The rendering functions (`renderHeader`, `renderHero`, `renderFeatures`, `renderFooter`) are defined directly in `script.js` and called inline.

#### 2.3.4 URL Resolution Logic

```
Visitor opens URL
    │
    ├─ Has ?slug= param?       → queryField = 'slug', queryValue = slug param value
    │
    ├─ Hostname includes 'github.io'?
    │      → Parse slug from URL path segments
    │
    └─ Otherwise?
           → queryField = 'custom_domain', queryValue = window.location.hostname

Supabase query:
    SELECT * FROM projects
    WHERE {queryField} = '{queryValue}'
    AND status = 'deployed'
    LIMIT 1
```

#### 2.3.5 External Dependencies

| Dependency   | Purpose                              | Access Method         |
|--------------|--------------------------------------|-----------------------|
| Supabase     | Project data read (anon key)         | Supabase JS SDK (CDN) |
| Google Fonts | Typography loading                   | CDN (per template)    |
| Tailwind CSS | Utility styling                      | CDN                   |

The LP has no dependency on the API or the Dashboard.

---

## Part 3 — Data Architecture

### 3.1 The pageConfig Contract

`pageConfig` is the central data contract. It is produced by the API, stored in the database, and consumed by the LP renderer.

Every `pageConfig` is a JSON object with the following top-level structure:

```json
{
  "meta": {
    "title": "string",
    "theme": "string",
    "template_type": "wedding | birthday | toko-online | campaign | store",
    "design_key": "string"
  },
  "content": { ... }
}
```

The `content` object structure varies by `template_type`. Each domain type has its own Zod schema in the API that defines exactly what fields are required and allowed. These schemas are validated by the API before any `pageConfig` is saved to the database.

`meta.template_type` controls which template module the LP loads.

`meta.design_key` controls which design variant within that template is used.

`meta.theme` is used only by the legacy `store` renderer to select a color palette.

#### 3.1.1 Domain Content Structures

| template_type | Content Key Fields |
|---------------|--------------------|
| `wedding`     | `groom`, `bride`, `akad`, `resepsi`, `story[]`, `gift`, `quote` |
| `birthday`    | `celebrant`, `event`, `gift`, `quote` |
| `toko-online` | `store`, `products[]`, `contact`, `quote` |
| `campaign`    | `hero`, `problems`, `solutions`, `social_proof`, `closing`, `contact` |
| `store`       | `hero`, `features[]` |

#### 3.1.2 Validation Chain

```
Dashboard form input
    │
    ▼
API: Zod input schema (GenerateRequestSchema)
    │  Validates per-domain detail objects
    ▼
API: ai.service assembles pageConfig
    │
    ▼
API: PageSchema (Zod union)
    │  Validates the assembled pageConfig against domain schema
    │  Raises an error if the structure is invalid
    ▼
API: supabaseService.saveProject (stores validated pageConfig as JSONB)
    │
    ▼
Supabase: page_data column (JSONB)
    │
    ▼
LP: reads page_data, parses, passes to render()
    (no validation at LP level — trusts the stored data)
```

### 3.2 Database Schema Overview

| Table            | Primary Key  | Purpose                                            |
|------------------|--------------|----------------------------------------------------|
| `projects`       | UUID         | Stores all user projects (page_data, slug, status) |
| `profiles`       | UUID (→ auth)| User wallet, AI quota, billing overrides           |
| `transactions`   | UUID         | Financial transaction records (topup, deployment)  |
| `products`       | TEXT (id)    | Template type registry with cost and active flag   |
| `coupons`        | UUID         | Discount coupon definitions                        |
| `coupon_usages`  | UUID         | Per-user coupon usage tracking                     |
| `system_settings`| TEXT (key)   | Global configuration values (JSONB value)          |
| `user_domains`   | UUID         | Domain ownership records (schema exists, no API)   |

#### 3.2.1 Key Database Functions (RPCs)

| Function                | Purpose                                                      |
|-------------------------|--------------------------------------------------------------|
| `deduct_user_balance`   | Atomic deduction: row-locks profile, deducts balance, logs transaction, returns `{new_balance, transaction_id}` |
| `get_or_create_profile` | Returns existing profile or creates one with balance=0       |
| `handle_new_user`       | DB trigger: creates a profile row when a new auth user is created |

#### 3.2.2 Project State Machine

Projects transition through the following states:

```
[draft]
    │
    └─ POST /api/projects/:id/deploy
          │
          ├─ Success → [deployed]
          │                │
          │                └─ POST /api/projects/:id/edit-deployed (up to 3x)
          │                        → remains [deployed]
          │
          └─ Failure → [failed]
                           │
                           └─ POST /api/projects/:id/deploy (retry allowed)
```

### 3.3 Data Ownership

The following table defines which component is the authoritative owner of each data artifact.

| Data Artifact     | Owner     | Consumers                | Notes                                               |
|-------------------|-----------|--------------------------|-----------------------------------------------------|
| pageConfig        | API       | Dashboard, Landing Page  | API defines schema; LP and Dashboard only consume   |
| Project records   | API       | Dashboard, Landing Page  | Only API writes; LP reads deployed-only via RLS     |
| Wallet / Balance  | API       | Dashboard (display only) | All mutations go through API service layer          |
| Transaction records| API      | Dashboard (display only) | Payment provider notifies API; API writes to DB     |
| JWT tokens        | Supabase  | Dashboard, API           | Issued by Supabase Auth; verified by API middleware |
| User profile      | Supabase  | API, Dashboard           | Row created by DB trigger on auth user creation     |
| Template JS files | LP        | Dashboard (preview copy) | LP owns source; Dashboard holds a synced copy       |
| Preview templates | Dashboard | Dashboard only           | Synchronized from LP source; not authoritative      |
| RLS policies      | Supabase  | All repositories         | Enforced at DB level; no application code involved  |
| System settings   | Supabase  | API                      | API reads at runtime; no repository caches it       |

---

## Part 4 — Subsystem Architecture

### 4.1 AI Content Generation Subsystem

The AI subsystem is managed entirely within the API. It has two modes of operation:

**Mode 1: Full Generation (with prompt)**

```
POST /api/generate { prompt, template_type, ...details }
    │
    ▼
AI Service
    │
    ├─ Selects generation strategy based on template_type
    │
    ├─ Calls AI Provider (via provider abstraction)
    │
    ├─ Parses structured response
    │
    ├─ Merges AI output with structured user input
    │
    └─ Validates assembled pageConfig against schema
```

**Mode 2: Direct Assembly (no prompt or structured domains)**

For `toko-online`, `campaign`, and invitation domains with no prompt, the LLM call is skipped entirely:

```
POST /api/generate { template_type, ...details }
    │
    ▼
AI Service
    │
    └─ Assembles pageConfig directly from structured input
       (no AI Provider call made)
    │
    └─ Validates assembled pageConfig against schema
```

**Provider Selection (Config-Driven)**

The AI provider is selected at startup via configuration. A provider abstraction isolates the rest of the service layer from provider-specific details. Provider-specific configuration is documented in `02_CURRENT_STATE.md`.

**Field Generation (`/api/generate/field`)**

A separate endpoint handles per-field AI generation for specific form inputs. This path:
1. Checks daily free quota via a Redis counter per user per day.
2. If under quota: generates for free and increments the counter.
3. If over quota: checks wallet balance, deducts, then generates.

**Image Generation (`/api/generate-image`)**

Delegates to the configured image generation provider. Generated images are stored in Supabase Storage. Returns the public URL of the stored image. Uses the same Redis-based free quota system as field generation.

---

### 4.2 Payment and Billing Subsystem

#### 4.2.1 Provider Pattern

Payment providers implement a common interface (`PaymentGatewayInterface`). The interface defines five methods: `createTransaction`, `verifyWebhook`, `verifyCallback`, `processWebhook`, `getSuccessResponse`.

`PaymentFactory` selects a provider implementing `PaymentGatewayInterface` at runtime based on the `PAYMENT_PROVIDER` environment variable. The factory caches the instance after first creation. Provider-specific details are documented in `02_CURRENT_STATE.md`.

#### 4.2.2 Top-Up Flow

```
POST /api/payments/create (Dashboard → API)
    │
    ▼
Transaction Service
    ├─ Insert PENDING transaction record
    ├─ Delegate to Payment Provider
    └─ Update transaction with payment method details

User completes payment

Payment Provider → POST /api/payments/webhook/* (Provider → API)
    │
    ▼
Webhook Handler
    ├─ Verify webhook signature
    ├─ Lookup transaction by order reference
    ├─ Check idempotency
    ├─ Determine payment outcome from payload
    └─ If successful: credit user balance and mark transaction as complete
```

#### 4.2.3 Deployment Billing Flow

```
POST /api/projects/:id/deploy
    │
    ▼
Project Service
    ├─ Fetch product cost from database (dynamic per template type)
    ├─ Validate and apply coupon discount (if provided)
    ├─ Deduct user balance (atomic database operation)
    ├─ Mark project as deployed (set slug, live_url, status)
    ├─ Record billing transaction as complete
    └─ Record coupon usage (if coupon applied)

    On failure after deduction:
    └─ Refund deducted amount to user balance
```

#### 4.2.4 Wallet Methods

| Method               | Mechanism                                          |
|----------------------|----------------------------------------------------|
| `deductBalance`      | PostgreSQL RPC (`deduct_user_balance`) — row-locked |
| `addTransaction`     | Sequential: UPDATE profiles + INSERT transactions   |
| `completeTransaction`| Sequential: UPDATE profiles + UPDATE transactions   |

---

### 4.3 Queue Subsystem

The API includes a background queue subsystem for asynchronous deployment processing.

**Queue design:**
- A named deployment queue handles background deployment jobs.
- Configured with retry support and exponential backoff.
- Jobs are removed on completion and retained on failure for inspection.

**Worker design:**
- Processes deployment jobs asynchronously.
- Handles GitHub repository provisioning, template content writes, Pages activation, and project status persistence.
- Includes rollback logic on unrecoverable failures.

**Activation:**
The worker is activated via an environment flag. When not active, the queue infrastructure is initialized but no jobs are consumed.

Current activation status is documented in `02_CURRENT_STATE.md`.

---

### 4.4 Authentication Subsystem

Authentication is handled by Supabase Auth.

**Token issuance:** Supabase Auth issues a signed JWT upon successful login. The Dashboard stores this token in session state.

**Token verification (API):** The authentication middleware verifies incoming JWTs using Supabase Auth before allowing access to protected endpoints. The verified user identity is attached to the request and used as the authoritative identity for all downstream operations within that request.

**Token usage (Landing Page):** The Landing Page does not require user authentication. It reads project data using the anonymous key, which is restricted by Supabase RLS to deployed projects only.

---

### 4.5 Failure Boundaries

The following table defines the failure scope when each external dependency is unavailable.

| Failing Component   | Affected Operations                              | Unaffected Operations                            |
|---------------------|--------------------------------------------------|--------------------------------------------------|
| AI Provider         | Content generation, field generation, image gen  | Project deployment, wallet, authentication, rendering |
| Payment Provider    | Top-up transaction creation                      | All other operations; existing balance remains valid |
| Redis               | AI field generation quota enforcement            | All other operations; generation may proceed without quota check |
| GitHub              | Repository-based deployment (queue flow)         | Direct deployment flow, generation, wallet, rendering |
| Supabase            | All operations (database, auth, storage)         | None — Supabase is a critical shared dependency  |
| API                 | All Dashboard operations requiring business logic| Landing Page rendering (reads Supabase directly) |

Failure behavior for each component is determined by the application error handling, not by this architecture document. This table defines **blast radius**, not recovery strategy.

---

## Part 5 — Cross-Repository Interactions

### 5.1 Template Synchronization (Dashboard ↔ LP)

The Dashboard preview uses LP templates. These are synchronized by a local script.

```
wuzzkang-lp/templates/
    │
    │ (manual: npm run sync:templates)
    ▼
wuzzkang-dashboard/public/preview/templates/
```

This is a static file copy, not a live link. If LP templates are updated, the sync script must be re-run before the Dashboard preview reflects the changes.

This sync mechanism means the Dashboard and LP share template code structurally, but the sharing is managed through file copies, not through a shared package or module.

### 5.2 Shared Supabase Project

All three repositories connect to the same Supabase project. The Supabase project URL and keys are the primary coupling point between repositories.

- API uses the service role key — bypasses RLS.
- Dashboard uses the anon/user JWT key — subject to RLS.
- LP uses the anon key — subject to RLS. Can only read `deployed` projects.

The RLS policy effectively enforces that the LP can never read draft or failed projects, without any application-level code change required in the LP.

### 5.3 pageConfig as the Integration Contract


The API owns the `pageConfig` schema and is responsible for its backward compatibility. The Landing Page and Dashboard consume `pageConfig` but do not define it.

- The **Dashboard** assembles pageConfig via structured forms and passes it to the API.
- The **API** validates, enriches (with AI if applicable), stores, and returns it.
- The **Landing Page** reads it from the database and renders it.

Any change to the `pageConfig` structure requires coordinated changes across all three repositories. This is the expected cross-repository change surface for new domain features.


---

## Part 6 — Technology Constraints


The following constraints are intentional architectural decisions that MUST NOT be changed without explicit architectural review.

| Component      | Constraint                                                              | Reason                                              |
|----------------|-------------------------------------------------------------------------|-----------------------------------------------------|
| Landing Page   | No build step. No bundler. No server runtime.                           | Simplicity, cost, zero infrastructure for rendering |
| Landing Page   | Must read data using the anon key only.                                 | Public access; service key must never be exposed    |
| Dashboard      | Must never write directly to the database (except Supabase Auth).       | Business logic belongs exclusively in the API       |
| Dashboard      | Must never use the service role key.                                    | Service key grants unrestricted DB access           |
| API            | Must remain stateless between requests.                                 | Enables horizontal scaling; session state in DB     |
| pageConfig     | Must remain fully JSON serializable.                                    | Stored as JSONB; consumed by a static renderer      |
| External providers | Must be replaceable via configuration without code changes in consumers. | Provider abstraction is a core architectural goal  |
| Supabase RLS   | Must be the final access boundary for LP and Dashboard DB reads.        | Defense in depth; no reliance on application logic alone |

---

## Part 7 — Architecture Compliance

The following principles from `00_FOUNDATION.md` are directly reflected in the current architecture.

| Principle                             | How It Manifests                                                          |
|---------------------------------------|---------------------------------------------------------------------------|
| Information over presentation         | `pageConfig` stores semantic data, not HTML                               |
| pageConfig is the only source of truth| All three repositories interact with the same JSON structure              |
| Business logic belongs inside the API | Dashboard delegates all decisions to the API; LP contains no logic        |
| Rendering is deterministic            | Same `pageConfig` + same `design_key` → same HTML output                 |
| Every repository has one responsibility | Clear separation: UI / Logic / Rendering                                |
| Stable core, flexible edges           | `pageConfig` structure is stable; templates are independent JS modules    |
| Repositories communicate through contracts | HTTP + JWT (Dashboard→API), pageConfig JSONB (API→LP via DB)        |

---

## Part 8 — Architecture Constraints

The following constraints define what future contributors MUST NOT do.

Violating these constraints changes the architecture, not just the implementation. Any violation requires explicit architectural review and documentation update.

**Repository Boundaries**

- MUST NOT implement business logic in the Dashboard.
- MUST NOT implement business logic in the Landing Page.
- MUST NOT render HTML inside the API.
- MUST NOT communicate between repositories through shared source code.
- MUST NOT let the Landing Page call the API.
- MUST NOT let the Dashboard use the Supabase service role key.

**Data Access**

- MUST NOT read draft or failed projects from the Landing Page.
- MUST NOT write project data from the Dashboard directly.
- MUST NOT bypass pageConfig schema validation in the API before saving.
- MUST NOT let any component other than the API write wallet or transaction data.

**External Providers**

- MUST NOT hardcode provider-specific logic into service or route layers.
- MUST NOT expose payment provider credentials to the Dashboard or Landing Page.
- MUST NOT expose the AI provider API key to any client-side code.

**Contracts**

- MUST NOT break the `pageConfig` schema without a coordinated update to the API schema, Dashboard form, and LP template.
- MUST NOT make the Landing Page responsible for data validation.
- MUST NOT make the Dashboard responsible for determining template cost or coupon validity.

---

## Part 9 — Deployment Architecture

The following describes the deployment topology of the platform. Each component runs in an isolated runtime environment.

```
User (Browser)
    │
    ├──────────────────────────┐
    │                          │
    ▼                          ▼
Dashboard                 Landing Page
(Next.js — Vercel)        (Static HTML — GitHub Pages)
    │                          │
    │                          ▼
    │                     Supabase Cloud
    ▼                     (PostgreSQL, Auth, Storage)
   API
(Node.js — Railway)
    │
    ├── Supabase Cloud
    ├── AI Provider (external)
    ├── Payment Provider (external)
    ├── Redis
    └── GitHub
```

Deployment rules:

- Each repository is deployed independently.
- No repository shares a runtime process with another.
- The Landing Page has no server-side runtime. It is purely static.
- The Dashboard depends on the API being reachable at its configured URL.
- The Landing Page depends on Supabase being reachable with the configured anon key.
- External providers (AI, Payment) are accessed exclusively by the API.

Current deployment targets for each component are documented in `02_CURRENT_STATE.md`.

---

## Document Status

| Field            | Value                                                      |
|------------------|------------------------------------------------------------|
| Version          | 1.2.0                                                      |
| Status           | Draft                                                      |
| Based on         | Direct codebase reading, June–July 2026                    |
| Verified against | wuzzkang-api, wuzzkang-dashboard, wuzzkang-lp              |
| Next review      | When a new repository, protocol, or data contract is added |

---

## Related Documents

- `00_FOUNDATION.md` — Engineering philosophy and principles
- `02_CURRENT_STATE.md` — Current implementation status
- `05_API_SPECIFICATION.md` — Core API Specification
- `08_REPOSITORY_MAP.md` — Monorepo folders map
- `06_FLOW_MAP.md` — Runtime workflow diagrams
- `07_RENDER_ENGINE.md` — Template & Render Engine Guide
- `10_AI_GUIDE.md` — AI & billing details
- `audit/DATABASE_AUDIT_2026_07_01.md` — Database security & audit findings
