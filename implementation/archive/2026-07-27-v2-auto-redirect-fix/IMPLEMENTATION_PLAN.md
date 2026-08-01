# Implementation Plan — Fix V2 Editor Auto-Redirect Router & Meta Versioning

Status: `Approved for Implementation`

## Overview
Fix the auto-redirect router at `/generate` so that clicking "Publikasikan Halaman" on any V2 project on the Home Dashboard correctly opens the modern V2 First Principles Builder (`/generate/v2/[projectId]`) instead of falling back to the legacy V1 form (`/generate/v1`).

---

## Proposed Changes

### 1. Auto-Redirect Router (`wuzzkang-dashboard/src/app/generate/page.js`)
- Update `isV2Project` detection logic to include V2 AST document indicators:
  - `pageData.meta?.template_version === 2`
  - `pageData.meta?.template_type === 'dynamic-builder'`
  - `Array.isArray(pageData.nodes)` (AST Node tree)
  - `pageData.formatVersion === 1`
  - `pageData.$schema?.includes('page-document')`
- Change V2 redirect URL from `/generate/v2?id=${draftId}` to the correct V2 route:
  `/generate/v2/${draftId}${editMode ? '?editMode=true' : ''}`

### 2. V2 Builder Page (`wuzzkang-dashboard/src/app/generate/v2/[projectId]/page.jsx`)
- Add `template_version: 2` and `template_type: 'dynamic-builder'` to `DEFAULT_PAGE_DOCUMENT.meta`.

### 3. Backend TypeRegistryService (`wuzzkang-api/src/services/type-registry.service.js`)
- In `saveProjectDraft`, ensure `documentJson.meta` has `template_version: 2` and `template_type: 'dynamic-builder'` explicitly set before syncing to the main `projects` table.

---

## Verification Plan

### Automated Verification
- Run a test script via Node.js querying project `016456e7-7e9d-4293-a629-bf3442fb995e` from Supabase to verify that `isV2Project` evaluates to `true` and generates `/generate/v2/016456e7-7e9d-4293-a629-bf3442fb995e`.

### Manual Verification
- Open Home Dashboard (`http://localhost:3000`), click "Publikasikan Halaman" on `test ui kelima` (or any V2 draft), and verify that it opens the V2 Builder (`/generate/v2/016456e7-7e9d-4293-a629-bf3442fb995e`) instead of V1.
