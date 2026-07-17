# Implementation Plan: Client-side Self-healing of Orphaned Uploads

**Status: Approved for Implementation**

This plan resolves the issue where images uploaded to Supabase Storage during an unsaved `/generate` session remain in storage permanently if the browser is closed or killed before saving.

## Goal
Establish client-side tracking of newly uploaded files using `localStorage` and trigger background deletion of these orphaned files on the next successful session initialization.

## Proposed Changes

### Dashboard Global Auth Provider

#### [MODIFY] [AuthContext.js](file:///home/bms-del112/BMS/personal-project/wuzzkang/wuzzkang-dashboard/src/context/AuthContext.js)
- Implement `cleanupOrphanedSessionImages(token)` which:
  - Checks if `localStorage.getItem('wuzzkang_unsaved_uploads')` exists.
  - If it contains urls, parse them and trigger `DELETE /api/media` calls for each path.
  - Clear the localStorage key.
- Trigger this method inside the `handleSessionChange` helper when a new valid session is established.

### Dashboard Generate Page

#### [MODIFY] [page.js](file:///home/bms-del112/BMS/personal-project/wuzzkang/wuzzkang-dashboard/src/app/generate/page.js)
- When direct upload completes (line 1535), also append the new `publicUrl` to `localStorage.getItem('wuzzkang_unsaved_uploads')`.
- When navigating away normally (line 825 cleanup), clear the `wuzzkang_unsaved_uploads` key after deleting them.
- When saving/publishing drafts successfully (lines 2902, 3207, 3259), clear the `wuzzkang_unsaved_uploads` key.

## Verification
- Run `npm run build` in `wuzzkang-dashboard` to verify successful compilation.
