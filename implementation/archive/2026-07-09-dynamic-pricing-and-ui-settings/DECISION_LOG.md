# Decision Log - Dynamic Subdomains & Dashboard UI

## [2026-07-09] Pricing Schema Shift: products -> system_settings
- **Decision**: Move the custom subdomain pricing and feature status configuration from the `products` table to the `system_settings` table under the key `subdomain_pricing`.
- **Rationale**: Storing `subdomain` inside `products` causes it to be returned by `GET /api/products` (polluting the template listing for generator pages). Since subdomain claims are a platform-level feature rather than a landing page template option, storing this configuration inside `system_settings` as a JSONB value keeps concerns clean and resolves frontend leakage.
