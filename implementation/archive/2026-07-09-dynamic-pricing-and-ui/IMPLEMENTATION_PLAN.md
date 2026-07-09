# Implementation Plan - Dynamic Custom Subdomain Feature with Dashboard UI

## Objective
Implement custom subdomain provisioning (`{name}.siluet.web.id`) for landing pages in the Wuzzkang monorepo.
1. Manage subdomain pricing dynamically via the database (`products` table).
2. Integrate domain checking, claiming, and releasing routes on the backend.
3. Build a gorgeous responsive dashboard UI modal for claiming/releasing subdomains with live debounced availability checking.

---

## Proposed Changes

### Database Layer
- Seed the `products` table with `id = 'subdomain'`, `cost = 10`, `is_active = true`.

### API Service & Routes
- Update `DomainService` to fetch subdomain claim cost dynamically from `products` table.
- Expose `GET /api/v1/domains/pricing` to fetch dynamic pricing.
- Update `GET /api/v1/domains/check` to return availability and the dynamic cost.
- Update `listProjects` in `supabase.service.js` to return project custom domains and types.

### Dashboard UI
- Add subdomain indicator info (e.g., `🟢 andi.siluet.web.id` or `🌐 Subdomain`) on each deployed landing page card.
- Build a beautiful Subdomain Management Modal containing:
  - Dynamic pricing display.
  - Subdomain text input with automatic debounced check (`GET /domains/check`).
  - Active subdomain view with copy action and open link.
  - Non-refundable warning and confirmation for releasing domain.

---

## Verification Plan
- Run dynamic E2E script verifying database pricing modification, check availability, project validation (preventing claiming draft projects), atomic credit deduction, and non-refundable release.
- Build test check for React syntax on the dashboard.
