# Handover - Projects list Pagination & Infinite Scroll

## 1. Summary of Work
- **Supabase Service (`wuzzkang-api`)**:
  - Updated `listProjects` to support `limit`, `offset`, `search`, and `filter`.
  - Used PostgreSQL range slicing `.range(start, end)` for dynamic paging.
  - Returns `projects` array along with `totalCount`.
- **API Router (`wuzzkang-api`)**:
  - Updated `GET /api/projects` endpoint to extract `limit`, `offset`, `search`, and `filter` query parameters.
- **Dashboard UI (`wuzzkang-dashboard`)**:
  - Replaced client-side filtering with server-side query filters.
  - Implemented lazy loading states `page`, `hasMore`, `loadingMore`, and `totalCount`.
  - Configured `PROJECTS_LIMIT` dynamically through environment config (`process.env.NEXT_PUBLIC_PROJECTS_PER_PAGE || 5`).
  - Added debounced search dispatching to avoid API spam.
  - Integrated "Tampilkan Lebih Banyak" button at the bottom of the list.

## 2. Verification Proof
- Backend unit tests executed and passed cleanly using Jest under Node 20.
- Dashboard frontend Next.js Turbopack compiled successfully under Node 20.
