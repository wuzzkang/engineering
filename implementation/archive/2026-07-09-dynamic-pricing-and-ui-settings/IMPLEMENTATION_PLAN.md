# Implementation Plan - Dynamic Custom Subdomain Feature with Dashboard UI (Updated)

## Objective
Implement custom subdomain provisioning (`{name}.siluet.web.id`) for landing pages in the Wuzzkang monorepo.
1. Manage subdomain pricing dynamically via `system_settings` table (JSONB format: `{"cost": 10, "is_active": true}`).
2. Integrate domain checking, claiming, and releasing routes on the backend.
3. Build a gorgeous responsive dashboard UI modal for claiming/releasing subdomains with live debounced availability checking.

---

## Proposed Changes

### Database Layer
- Remove subdomain product from `products` table.
- Seed `system_settings` table with key `subdomain_pricing` and value `{"cost": 10, "is_active": true}`.

### API Service & Routes
- Update `DomainService` to fetch subdomain claim cost dynamically from `system_settings` under key `subdomain_pricing`.
- Expose `GET /api/v1/domains/pricing` to fetch dynamic pricing from settings.
- Update `GET /api/v1/domains/check` to return availability and the dynamic cost from settings.
- Update `listProjects` in `supabase.service.js` to return project custom domains and types.

### Dashboard UI
- Add subdomain indicator info (e.g., `🟢 andi.siluet.web.id` or `🌐 Subdomain`) on each deployed landing page card.
- Build a beautiful Subdomain Management Modal containing dynamic pricing, live checks, active states, and non-refundable warning.
