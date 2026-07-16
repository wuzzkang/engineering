# Implementation Progress: Admin Dashboard

- [x] Milestone 1: Database & Backend API Setup
  - [x] Create database permission SQL migration
  - [x] Implement `admin.service.js` in backend API (with manual batch joins)
  - [x] Implement `admin.route.js` in backend API
  - [x] Register routes in `server.js` and modify bypass check in `payment.route.js`
  - [x] Document APIs in `docs/05_API_SPECIFICATION.md`

- [x] Milestone 2: Frontend Dashboard & Pages
  - [x] Implement `useRequireAdmin.js` hook in dashboard app
  - [x] Implement admin page at `/admin` (Sleek cards, transactions view, confirmation dialogues)
  - [x] Update `Sidebar.js` with dynamic admin panel link
  - [x] Update project state in `docs/02_CURRENT_STATE.md` and repository map in `docs/08_REPOSITORY_MAP.md`

- [x] Milestone 3: Enhancements & User Management Controls
  - [x] Conditional "Akses Admin" shortcut card in Profile page for mobile access
  - [x] Hybrid wildcard search query support (order_id, description, partial UUID search)
  - [x] Users list tab (name, email, role, balance, active status indicator)
  - [x] Toggles to suspend/reactivate accounts (`PATCH /api/admin/users/:id/status`)
  - [x] Permanent user deletion endpoint (`DELETE /api/admin/users/:id`)
  - [x] Global fetch interceptor auto-logout & LoginPage pre-redirect guard checks
  - [x] Database migrations for `profiles.is_active` status flag
