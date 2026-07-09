# Decision Log - Dynamic Subdomains & Dashboard UI

## [2026-07-09] Dynamic Pricing DB Integration
- **Decision**: Store the subdomain billing price as a product inside the `products` database table (`id = 'subdomain'`) instead of config files or environment variables.
- **Rationale**: Enables administrators to alter pricing instantly from an admin panel or database tool without redeploying the API server. Fallback to 10 credits is retained to prevent fatal server errors if the database query fails.

## [2026-07-09] Modal UI Placement
- **Decision**: Incorporate custom subdomain management directly inside the dashboard card lists of landing pages as a modern, compact, dedicated slide-up/fade-in modal.
- **Rationale**: Keeps dashboard flow compact, mobile-friendly, and accessible directly from the landing page overview card without navigating through complex submenu settings.
