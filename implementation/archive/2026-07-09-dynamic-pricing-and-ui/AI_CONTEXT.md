# AI Context - Custom Domain & Subdomain Feature (Phase 1)

This context covers the dynamic subdomain features completed on 2026-07-09.

## Overview
- Wildcard DNS `*.siluet.web.id` points to GitHub Pages `wuzzkang.github.io`.
- Dynamic pricing is stored in the `products` table where `id = 'subdomain'`.
- Custom subdomain management is exposed to the user via a modal on the main dashboard (`/wuzzkang-dashboard/src/app/page.js`).

## Key API Endpoints
- `GET /api/v1/domains/pricing` -> Get subdomain pricing cost.
- `GET /api/v1/domains/check?name=test` -> Checks name availability + returns cost.
- `POST /api/v1/domains/claim-subdomain` -> Claims `{name}.siluet.web.id` + bills user dynamically.
- `DELETE /api/v1/domains/:projectId` -> Releases subdomain.
