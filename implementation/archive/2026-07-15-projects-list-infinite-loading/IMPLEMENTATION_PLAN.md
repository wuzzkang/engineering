# Implementation Plan - Infinite Loading for Project Lists

- **Status:** Awaiting Review
- **Feature:** Project List Pagination, Search, and Filtering
- **Target:** `wuzzkang-api` and `wuzzkang-dashboard`

## Proposed Changes

### 1. wuzzkang-api
- **[MODIFY]** `src/services/supabase.service.js`
  - Update `listProjects` to support `limit`, `offset`, `search`, and `filter`.
  - Perform range queries and query-level filtering.
- **[MODIFY]** `src/routes/project.route.js`
  - Update `GET /projects` controller to extract query parameters and pass them to the service.

### 2. wuzzkang-dashboard
- **[MODIFY]** `src/app/page.js`
  - Implement infinite loading states (`page`, `hasMore`, `loadingMore`).
  - Integrate backend search and filtering on change.
  - Render pagination control button "Tampilkan Lebih Banyak" at list footer.

## Verification Strategy
- Run Next.js Turbopack build checks.
- Verify filtering and infinite scrolling interactively.
