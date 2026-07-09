# AI Context - Custom Domain & Subdomain Feature (Phase 1 Routing Fix)

This context covers the settings-based custom subdomain features and route fixes completed on 2026-07-09.

## Overview
- Wildcard DNS `*.siluet.web.id` points to GitHub Pages `wuzzkang.github.io`.
- Subdomain pricing is configured inside the `system_settings` table under the key `subdomain_pricing` (`{"cost": 10, "is_active": true}`).
- Custom subdomain management is exposed to the user via a modal on the main dashboard (`/wuzzkang-dashboard/src/app/page.js`).

## Routing Architecture Rules
- In `domain.route.js`, static routes must always be declared *above* parameter routes (e.g. `/domains/check` above `/domains/:projectId`) to prevent route matching collisions.

## Key API Endpoints
- `GET /api/v1/domains/pricing` -> Get subdomain pricing cost from settings.
- `GET /api/v1/domains/check?name=test` -> Checks name availability + returns cost.
- `POST /api/v1/domains/claim-subdomain` -> Claims `{name}.siluet.web.id` + bills user dynamically.
- `DELETE /api/v1/domains/:projectId` -> Releases subdomain.
