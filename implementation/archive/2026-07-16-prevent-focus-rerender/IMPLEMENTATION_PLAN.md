# Implementation Plan: Prevent Redundant Re-renders & Form Resets on Window Focus

**Status: Approved for Implementation**

This plan resolves the issue where `wuzzkang-dashboard` re-renders and resets state (losing typed form inputs) when the user minimizes the browser or switches tabs.

## Goal
Prevent redundant authentication state updates and network fetches when the browser tab/window is focused, ensuring form inputs and page states are preserved.

## Proposed Changes

### Dashboard Authentication Provider

#### [MODIFY] [AuthContext.js](file:///home/bms-del112/BMS/personal-project/wuzzkang/wuzzkang-dashboard/src/context/AuthContext.js)
- Maintain a local `currentToken` tracking variable inside the auth listener effect.
- Only update `session`, `user` states and call `fetchProfile` when the access token changes, or when the `USER_UPDATED` event is explicitly fired by Supabase.
- This stops the redundant state updates and network queries to `/profile` on every single window focus.

### Dashboard Pages (Dependency Array Optimization)

#### [MODIFY] [page.js](file:///home/bms-del112/BMS/personal-project/wuzzkang/wuzzkang-dashboard/src/app/page.js)
- Change dependency from `session` to `session?.access_token` in `useEffect` hooks at lines 81, 140, 167, and 203.

#### [MODIFY] [page.js](file:///home/bms-del112/BMS/personal-project/wuzzkang/wuzzkang-dashboard/src/app/generate/page.js)
- Change dependency from `session` to `session?.access_token` in `useEffect` hooks at lines 519, 812, and 1293.

#### [MODIFY] [page.js](file:///home/bms-del112/BMS/personal-project/wuzzkang/wuzzkang-dashboard/src/app/topup/page.js)
- Change dependency from `session` to `session?.access_token` in `useEffect` hooks at lines 67, 104, 131, and 191.

#### [MODIFY] [page.js](file:///home/bms-del112/BMS/personal-project/wuzzkang/wuzzkang-dashboard/src/app/profile/page.js)
- Change dependency from `session` to `session?.access_token` in `useEffect` hook at line 142.

#### [MODIFY] [page.js](file:///home/bms-del112/BMS/personal-project/wuzzkang/wuzzkang-dashboard/src/app/payments/history/page.js)
- Change dependency from `session` to `session?.access_token` in `useEffect` hook at line 130.

## Verification

- Run development server and verify focus behavior.
- Ensure form data is retained.
