# Custom Domain — Implementation Plan

## Document Information

| Field | Value |
|---|---|
| Feature | Custom Domain — Subdomain System (Phase 1) |
| Status | **Approved for Implementation** |
| Author | AI Engineer |
| Date | 2026-07-09 |
| Protocol Version | 3.0.0 |

---

## Confirmed Requirements

| Requirement | Detail |
|---|---|
| LP Hosting | GitHub Pages → custom domain `siluet.web.id` → DNS via Cloudflare |
| Subdomain format | Single-level: `{name}.siluet.web.id` |
| Name constraints | 3–15 chars, lowercase alphanumeric + hyphens, cannot start/end with hyphen |
| Project constraint | One subdomain per project (one-to-one) |
| User constraint | No limit on number of subdomains per user |
| Billing | **10 credits per subdomain claim** (one-time, non-refundable) |
| Transaction type | `'subdomain'` |

---

## 1. Background & Problem Statement

Wuzzkang currently serves landing pages exclusively via slug-based URLs on GitHub Pages:
`siluet.web.id/?slug=andi-wedding`

The goal is to enable users to have a **dedicated URL** that feels personal and professional. Phase 1 delivers this via **subdomains** (`andi.siluet.web.id`), but the architecture is designed so that **Phase 2 (full custom domains like `andi.com`) can be added as a new provider without changing any existing code**.

---

## 2. Core Architectural Principle

> **"The domain type (subdomain vs. full custom) is a provisioning concern, not a routing concern."**

The LP, database column, and Supabase query are **identical** for both domain types. The difference is only in *how* the domain gets provisioned:

```
Phase 1 (Subdomain):
  User picks name "andi"
  → API validates + deducts 10 credits
  → SubdomainProvider generates: andi.siluet.web.id
  → Stores in: projects.custom_domain = "andi.siluet.web.id"
  → No DNS action needed (wildcard Cloudflare record handles it)
  → LP queries: WHERE custom_domain = "andi.siluet.web.id" ✅

Phase 2 (Full Custom, future):
  User brings: andi.com
  → CloudflareProvider registers with Cloudflare for SaaS
  → Stores in: projects.custom_domain = "andi.com"
  → LP queries: WHERE custom_domain = "andi.com" ✅
```

LP script.js NEVER changes between phases.

---

## 3. Domain Provider Abstraction (DomainProvider Pattern)

Following Wuzzkang's existing provider abstraction pattern (AI providers, Payment providers):

```
DomainService (Orchestrator)
    │
    ├── SubdomainProvider          — Phase 1: ACTIVE
    │     Input : "andi"
    │     Output: "andi.siluet.web.id"
    │     Action: Validate + store in DB
    │     Cost  : 10 credits (via walletService.deductBalance)
    │
    └── CloudflareCustomDomainProvider  — Phase 2: STUB (placeholder)
          Input : "andi.com"
          Output: "andi.com" (after DNS verification)
          Action: Cloudflare for SaaS API + BullMQ polling
          Cost  : TBD in Phase 2 planning
```

---

## 4. Billing Flow (Critical)

Billing follows the **exact same pattern** as project deployment:

```
POST /api/v1/domains/claim-subdomain
    │
    ▼
1. Verify project exists + owned by user
2. Verify project status === 'deployed'
3. Verify project has no existing subdomain (one-to-one)
4. Validate subdomain_name format (3-15 chars, regex)
5. Check uniqueness: SELECT WHERE custom_domain = "{name}.siluet.web.id"
    │
    ├─ NOT UNIQUE → 409 SUBDOMAIN_TAKEN (no charge)
    │
    ▼
6. walletService.deductBalance(userId, 10, 'subdomain', projectId, 'Custom subdomain: {name}.siluet.web.id')
    │
    ├─ INSUFFICIENT_FUNDS → 402 (no domain stored)
    │
    ▼
7. supabaseService: UPDATE projects SET
       custom_domain = "{name}.siluet.web.id",
       domain_type   = "subdomain",
       domain_status = "active"
   WHERE id = projectId
    │
    ▼
8. Response 200: { domain, domain_type, domain_status, new_balance }
```

> **Note:** Credits are deducted atomically via the existing `deduct_user_balance` RPC before the domain is stored. If the DB update fails after deduction, a refund transaction (`walletService.addTransaction(userId, 10, 'refund', ...)`) is issued — same pattern as AI Platform.

---

## 5. Subdomain Name Validation Rules

```javascript
const SubdomainNameSchema = z.string()
  .min(3, 'Minimal 3 karakter')
  .max(15, 'Maksimal 15 karakter')
  .regex(
    /^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/,
    'Hanya huruf kecil, angka, dan tanda hubung. Tidak boleh diawali/diakhiri tanda hubung.'
  );
```

**Valid examples:** `andi`, `budi-wedding`, `tok0-baju`, `a1b`
**Invalid examples:** `-andi`, `andi-`, `Andi`, `an`, `thisnameiswaaytoolong`

---

## 6. Database Changes

### Migration: `20260709100000_add_domain_type_and_index.sql`

```sql
-- 1. Add domain_type column to projects table
ALTER TABLE public.projects
  ADD COLUMN IF NOT EXISTS domain_type TEXT NOT NULL DEFAULT 'none';
-- Allowed values: 'none' | 'subdomain' | 'custom'

-- 2. Performance index for LP hostname lookup
CREATE INDEX IF NOT EXISTS idx_projects_custom_domain
  ON public.projects (custom_domain)
  WHERE custom_domain IS NOT NULL;

-- 3. Add Phase 2 readiness columns to user_domains table
ALTER TABLE public.user_domains
  ADD COLUMN IF NOT EXISTS domain_type TEXT DEFAULT 'subdomain',
  ADD COLUMN IF NOT EXISTS cloudflare_hostname_id TEXT,
  ADD COLUMN IF NOT EXISTS cname_target TEXT,
  ADD COLUMN IF NOT EXISTS ssl_status TEXT DEFAULT 'none',
  ADD COLUMN IF NOT EXISTS verified_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();
```

---

## 7. API Endpoints

### 7.1 Claim Subdomain
```
POST /api/v1/domains/claim-subdomain
Auth: Required (Bearer JWT)

Body:
{
  "project_id": "uuid",
  "subdomain_name": "andi"
}

Responses:
  200: { success: true, data: { domain, domain_type, domain_status, new_balance } }
  400: Validation error
  402: INSUFFICIENT_FUNDS
  404: Project not found or not owned by user
  409: SUBDOMAIN_TAKEN
  422: PROJECT_NOT_DEPLOYED | PROJECT_HAS_DOMAIN
```

### 7.2 Get Domain Status
```
GET /api/v1/domains/:projectId
Auth: Required

Response 200:
{
  "success": true,
  "data": {
    "project_id": "uuid",
    "custom_domain": "andi.siluet.web.id",
    "domain_type": "subdomain",
    "domain_status": "active",
    "slug_url": "https://siluet.web.id/?slug=xxx",
    "domain_url": "https://andi.siluet.web.id"
  }
}
```

### 7.3 Release Domain
```
DELETE /api/v1/domains/:projectId
Auth: Required

Behavior:
  - Clears custom_domain, domain_type → 'none', domain_status → 'none'
  - NO refund (10 credits is one-time, non-refundable)
  - (Phase 2) Will call Cloudflare API to delete custom hostname

Response 200: { success: true, message: "Custom domain berhasil dihapus." }
```

### 7.4 Check Availability
```
GET /api/v1/domains/check?name=andi
Auth: Required

Response 200:
{
  "success": true,
  "data": {
    "name": "andi",
    "available": true,
    "full_domain": "andi.siluet.web.id"
  }
}
```

---

## 8. New Files

### wuzzkang-api
```
src/
├── routes/
│   └── domain.route.js                          [NEW]
│
├── services/
│   └── domain/
│       ├── domain.service.js                    [NEW] — Orchestrator + billing
│       └── providers/
│           ├── subdomain.provider.js            [NEW] — Phase 1 logic
│           └── cloudflare.provider.js           [NEW] — Phase 2 stub
│
supabase/migrations/
└── 20260709100000_add_domain_type_and_index.sql [NEW]
```

### Files to Modify

| File | Change |
|------|--------|
| `src/server.js` | Register `/api/v1/domains` router |

---

## 9. Cloudflare Setup (One-Time Manual — Before Go-Live)

Must be done in Cloudflare Dashboard **before Phase 1 is released**:

```
Zone: siluet.web.id

Add DNS Record:
  Type:   CNAME
  Name:   *
  Target: wuzzkang.github.io  (GitHub Pages canonical domain)
  Proxy:  ✅ ON (orange cloud)
```

> Cloudflare's Universal SSL certificate automatically covers `*.siluet.web.id` — no additional cost.

---

## 10. Implementation Milestones

### Milestone 1 — Database Migration
**Objective:** Apply schema changes to Supabase.
- [ ] Create `20260709100000_add_domain_type_and_index.sql`
- [ ] Run migration via Supabase dashboard
- [ ] Verify: `domain_type` column exists in `projects`, index created, `user_domains` has new columns

**Acceptance criteria:** Schema verified in Supabase Table Editor.

---

### Milestone 2 — Domain Service Layer
**Objective:** Build the provider abstraction and core business logic.
- [ ] Create `domain/providers/subdomain.provider.js`
  - `claimSubdomain(userId, projectId, name)` → validates, deducts, stores
  - `releaseSubdomain(userId, projectId)` → clears domain fields
  - `checkAvailability(name)` → returns bool
- [ ] Create `domain/providers/cloudflare.provider.js` (stub)
  - All methods throw `NotImplementedError` with clear message
- [ ] Create `domain/domain.service.js`
  - Routes to correct provider based on request type
  - Contains all validation logic (project ownership, status, one-to-one constraint)
  - Integrates `walletService.deductBalance` for billing

**Acceptance criteria:** Unit-invokable service methods return expected results.

---

### Milestone 3 — API Endpoints
**Objective:** Expose domain management via HTTP.
- [ ] Create `routes/domain.route.js` with all 4 endpoints
- [ ] Zod schemas for all inputs
- [ ] Register router in `server.js` under `/api/v1`
- [ ] Error codes mapped to correct HTTP status codes
- [ ] Test all endpoints with manual HTTP calls (curl / REST client)

**Acceptance criteria:** All 4 endpoints respond correctly for happy path and error cases.

---

### Milestone 4 — End-to-End Verification
**Objective:** Verify the full flow works in a real browser.
- [ ] Cloudflare wildcard CNAME is set (manual step)
- [ ] Claim subdomain via API → `andi.siluet.web.id` stored in DB
- [ ] Open `andi.siluet.web.id` in browser → loads correct project ✅
- [ ] Slug URL still works: `siluet.web.id/?slug=xxx` ✅
- [ ] Access unknown subdomain → LP shows error page (not crash) ✅
- [ ] Verify HTTPS works (Cloudflare SSL) ✅

---

### Milestone 5 — Documentation Sync
**Objective:** Synchronize all engineering documentation.
- [ ] Update `09_DATABASE_ARCHITECTURE.md` — new columns, index
- [ ] Update `05_API_SPECIFICATION.md` — 4 new endpoints
- [ ] Update `02_CURRENT_STATE.md` — feature status
- [ ] Update `IMPLEMENTATION_PROGRESS.md` — all milestones complete
- [ ] Update `HANDOVER.md` — verification evidence
- [ ] Archive implementation to `implementation/archive/2026-07-09-custom-subdomain/`
- [ ] Reinitialize `implementation/active/`

---

## 11. Out of Scope (Phase 1)

- Custom domain purchase (`andi.com`) → Phase 2
- Cloudflare for SaaS integration → Phase 2
- Domain expiry / renewal → Phase 2
- Dashboard UI for domain management → Separate implementation ticket
- Refund policy for released subdomain → Business decision, not in scope
