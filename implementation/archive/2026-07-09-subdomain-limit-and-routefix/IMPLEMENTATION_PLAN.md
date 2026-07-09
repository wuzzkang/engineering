# Implementation Plan - Dynamic Custom Subdomain Feature & User Limit Safeguard

## Objective
Implement custom subdomain provisioning (`{name}.siluet.web.id`) for landing pages in the Wuzzkang monorepo.
1. Manage subdomain pricing and active limits dynamically via `system_settings` table (JSONB format: `{"cost": 10, "is_active": true, "max_per_user": 5}`).
2. Integrate domain checking, claiming, and releasing routes on the backend.
3. Fix Express route collision where dynamic `:projectId` matched static `/domains/check` and `/domains/pricing` endpoints.
4. Prevent any single user from claiming more than 5 subdomains globally to prevent system abuse.
5. Build a gorgeous responsive dashboard UI modal for claiming/releasing subdomains with live debounced availability checking.
