# AI Context — V2 Editor Auto-Redirect Router & Meta Versioning Fix

## Problem Summary
When a user creates and saves a V2 Builder project (`/generate/v2/[projectId]`), the project document saved in Supabase `projects.page_data` uses the AST structure (`nodes`, `formatVersion: 1`). However:
1. `DEFAULT_PAGE_DOCUMENT.meta` in the V2 Builder was missing `template_version: 2` and `template_type: 'dynamic-builder'`.
2. `generate/page.js` (the `/generate` auto-redirect router) checked for `pageData.content.sections` or `template_version === 2`. Since AST V2 uses `pageData.nodes`, `generate/page.js` misidentified V2 AST projects as legacy V1 projects and redirected them to `/generate/v1?id=...`.
3. `generate/page.js` constructed the V2 redirect URL as `/generate/v2?id=...` instead of `/generate/v2/${draftId}`.

## Fix Strategy
1. **Update `wuzzkang-dashboard/src/app/generate/page.js`**:
   - Enhance V2 detection logic to inspect AST indicators (`Array.isArray(pageData.nodes)`, `pageData.formatVersion === 1`, `$schema` containing `page-document`).
   - Fix V2 redirect route to `/generate/v2/${draftId}${editMode ? '?editMode=true' : ''}`.
2. **Update `wuzzkang-dashboard/src/app/generate/v2/[projectId]/page.jsx`**:
   - Explicitly add `template_version: 2` and `template_type: 'dynamic-builder'` to `DEFAULT_PAGE_DOCUMENT.meta`.
3. **Update `wuzzkang-api/src/services/type-registry.service.js`**:
   - Ensure `saveProjectDraft` injects `template_version: 2` and `template_type: 'dynamic-builder'` into `documentJson.meta` when syncing with the main `projects` table.
