# Decision Log - Dynamic Subdomains & User Limit Safeguard

## [2026-07-09] Subdomain Claim Limit per User
- **Decision**: Restrict user profiles to a maximum of 5 active subdomains by default, configurable dynamically via `system_settings.subdomain_pricing.max_per_user`.
- **Rationale**: Prevents users from abusing the platform by locking up thousands of subdomains, which could spam the routing tables and exhaust database indexing capacity. This also acts as a business check to encourage users to manage their subdomains efficiently.

## [2026-07-09] Route Matching Order in Express
- **Decision**: Move `/domains/check` and `/domains/pricing` above `:projectId` parameter routes in `domain.route.js`.
- **Rationale**: Prevents Express from intercepting static routes and misinterpreting them as dynamic projectId params, ensuring check/pricing queries return 200 OK.

## [2026-07-09] Pricing Schema Shift: products -> system_settings
- **Decision**: Move the custom subdomain pricing and feature status configuration from the `products` table to the `system_settings` table under the key `subdomain_pricing`.
- **Rationale**: Prevents subdomain pricing configuration details from leaking into landing page template generator list endpoints.
