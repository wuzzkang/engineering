# Implementation Plan - Dynamic Custom Subdomain Feature & Route Fix

## Objective
Implement custom subdomain provisioning (`{name}.siluet.web.id`) for landing pages in the Wuzzkang monorepo.
1. Manage subdomain pricing dynamically via `system_settings` table (JSONB format: `{"cost": 10, "is_active": true}`).
2. Integrate domain checking, claiming, and releasing routes on the backend.
3. Fix Express route collision where dynamic `:projectId` matched static `/domains/check` and `/domains/pricing` endpoints.
4. Build a gorgeous responsive dashboard UI modal for claiming/releasing subdomains with live debounced availability checking.
