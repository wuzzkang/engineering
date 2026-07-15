# Implementation Plan: Reliable Media Deletion & Synchronization

This document outlines the proposed changes to ensure all uploaded media assets (including CV profile photos) are reliably deleted from Supabase Storage when replaced, explicitly deleted, or discarded (navigated away).

## User Review Required

> [!IMPORTANT]
> To prevent network request cancellation when navigating away or redirects occur (such as `router.push('/')` after saving), we propose:
> 1. Modifying `cleanupOrphanedAssets` and deletion handlers to be asynchronous and returning promises.
> 2. Using `Promise.all` to await all deletion promises before executing redirects.
> 3. Enabling `keepalive: true` in the `fetch` options inside `executeDeleteImage` so that the browser guarantees background completion of storage deletions even if the page unloads or component unmounts.

## Open Questions

None.

## Proposed Changes

---

### Dashboard Components

#### [MODIFY] [page.js](file:///home/bms-del112/BMS/personal-project/wuzzkang/wuzzkang-dashboard/src/app/generate/page.js)

1. **Improve `executeDeleteImage` function**:
   - Add `{ keepalive: true }` to the `fetch` request options to ensure the deletion call persists during page unloads and transitions.
   - Return the fetch promise.

2. **Make `cleanupOrphanedAssets` asynchronous**:
   - Refactor `cleanupOrphanedAssets` to collect all `executeDeleteImage` calls in a promises array.
   - Use `Promise.all` to await all deletions before resolving the function.

3. **Awaited save/publish flows**:
   - In `handleGenerate` (Generate Preview/Draft Save), `handleSaveDeployed` (Save Changes), and `handlePublish` (Deploy), change them to await `cleanupOrphanedAssets` and await all `pendingDeleteImages` deletions.
   - This ensures file deletions are fully executed on the backend before the user navigates away or redirects occur.

4. **Reliable Unmount Hook**:
   - Ensure the unmount hook in `useEffect` executes the cleanup requests safely with `keepalive: true` on the fetch API.

## Verification Plan

### Automated Tests
- Test cases cannot be easily run due to Node version ESM package issues (`node:crypto` direct imports), but the code modifications are local to the Next.js frontend React file and can be verified by building the dashboard.

### Manual Verification
- Upload CV profile photo, click "Hapus" button, and verify in Supabase storage panel that it is deleted upon saving.
- Upload CV profile photo, do not save, and navigate back (unmount page) using Bottom Bar or Sidebar. Verify that it is deleted from Supabase storage.
- Upload CV profile photo, replace it with another file, save draft, and verify that the old file is deleted from storage.
