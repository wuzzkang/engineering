# Implementation Plan - Dynamic Custom Subdomain Feature, User Limit Safeguard & Global Fallback Switch

## Objective
Implement custom subdomain provisioning (`{name}.siluet.web.id`) for landing pages in the Wuzzkang monorepo.
1. Manage subdomain pricing and active limits dynamically via `system_settings` table (JSONB format: `{"cost": 10, "is_active": true, "max_per_user": 5}`).
2. Integrate domain checking, claiming, and releasing routes on the backend.
3. Fix Express route matching order logic.
4. Prevent any single user from claiming more than 5 subdomains globally to prevent system abuse.
5. Implement a **Global Fallback Switch** based on the database `is_active` setting:
   - If the subdomain feature is toggled off (`is_active: false`), all "Lihat" buttons, card links, and "Bagikan Undangan" links on the dashboard dynamically and instantly fallback to the original/default URL structure (`live_url`).
   - If the subdomain feature is active (`is_active: true`), all links automatically point to the custom subdomains.
6. Build a gorgeous responsive dashboard UI modal for claiming/releasing subdomains with live debounced availability checking.
