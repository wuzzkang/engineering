# Decision Log: Admin Dashboard

This document logs key architectural or design decisions.

## Decision 1: Hybrid Search Lookup
* **Context:** PostgreSQL/PostgREST does not support direct `ILIKE` wildcard queries on UUID primary keys (like matching `dead93e3`).
* **Decision:** We implemented a hybrid lookup in `admin.service.js`'s `listTransactions`: normal queries use fast PostgreSQL paginated `.range()`, while searches fetch matching status/type records (up to 2000 rows) and filter by UUID, order ID, or description in Node.js before slicing and joining profile details. This preserves scalability and database performance without complex schemas.

## Decision 2: Auto-Logout Global Interceptor
* **Context:** Deactivated users (profiles.is_active === false) must be prevented from accessing the dashboard.
* **Decision:** Instead of polling, we check `is_active` in `auth.middleware.js` on every API call. If the API returns `403 Account Suspended`, the frontend `AuthContext`'s global `fetch` interceptor automatically clears the local authentication state, signs them out of Supabase, and redirects the browser to `/login?error=suspended` to prevent session flashing.
