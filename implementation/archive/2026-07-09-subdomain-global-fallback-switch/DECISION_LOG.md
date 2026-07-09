# Decision Log - Dynamic Subdomains & Global Fallback Switch

## [2026-07-09] Global Fallback Switch for Subdomain Routing
- **Decision**: Introduce a global switch in the dashboard UI (`subdomainActive`) that evaluates the `is_active` status of subdomain pricing settings from the backend `/profile` API dynamically. When `false`, all card links, view targets, and sharing links instantly revert to the original `live_url` query parameters format.
- **Rationale**: Gives administrators the power to disable subdomain routing instantly (e.g. if Cloudflare free limits are exhausted or DNS issues arise) without needing any frontend redeployments or changing individual user data. Reverting to the fallback parameters allows continuous access to landing pages without server disruption.

## [2026-07-09] Subdomain Claim Limit per User
- **Decision**: Restrict user profiles to a maximum of 5 active subdomains by default, configurable dynamically via `system_settings.subdomain_pricing.max_per_user`.
- **Rationale**: Prevents users from abusing the platform by locking up thousands of subdomains, which could spam the routing tables.

## [2026-07-09] Route Matching Order in Express
- **Decision**: Move `/domains/check` and `/domains/pricing` above `:projectId` parameter routes in `domain.route.js`.
- **Rationale**: Prevents Express route matching collision.

## [2026-07-09] Pricing Schema Shift: products -> system_settings
- **Decision**: Move the custom subdomain pricing and feature status configuration from the `products` table to the `system_settings` table under the key `subdomain_pricing`.
- **Rationale**: Prevents leakage of the subdomain configuration catalog entry into the landing page templates generator route list.
