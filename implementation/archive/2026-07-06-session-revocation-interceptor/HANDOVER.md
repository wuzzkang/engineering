# Handover - Session Revocation Interceptor (401 Redirect)

This document outlines the handover specifications for the global session revocation interceptor implemented in the Next.js frontend dashboard.

## Completed Tasks
- Wrapped `window.fetch` inside `AuthContext.js` to inspect response HTTP status codes.
- Added automatic Supabase local session clearance when any backend API call yields a 401 Unauthorized status while an active local session exists.
- Ensured seamless redirection to `/login` when the session state is set to null.

## Key Source Files
- Next.js Auth Context: [AuthContext.js](file:///home/bms-del112/BMS/personal-project/wuzzkang/wuzzkang-dashboard/src/context/AuthContext.js)

## Verification Steps
1. Log in to the dashboard on two different browser sessions or windows.
2. In session A, log out.
3. In session B, click any button that initiates an API call (e.g. reload the page, view profile, click top-up package, etc.).
4. Verify that session B intercepts the backend's 401 response, automatically signs the user out of the client-side session, and redirects cleanly to `/login`.
