# Decision Log - Route Collision Fix & Pricing settings

## [2026-07-09] Route Matching Order in Express
- **Decision**: Move `/domains/check` and `/domains/pricing` above `:projectId` parameter routes in `domain.route.js`.
- **Rationale**: Express performs sequential matching. Since `:projectId` is a wildcard string parameter matching any string, placing it above static routes intercepts calls to `/domains/check` and treats "check" as the projectId, causing a 404 database error.

## [2026-07-09] Pricing Schema Shift: products -> system_settings
- **Decision**: Move the custom subdomain pricing and feature status configuration from the `products` table to the `system_settings` table under the key `subdomain_pricing`.
- **Rationale**: Prevents leakage of the subdomain configuration catalog entry into the landing page templates generator route list.
