# AI Context: Self-healing Orphaned Uploads

- **Feature:** Bugfix: Clean up orphaned media assets from crashed/aborted sessions
- **Key Modules:**
  * AuthContext: `src/context/AuthContext.js`
  * Generate Page: `src/app/generate/page.js`
- **Core Rules:**
  * Track newly uploaded unsaved public URLs in `wuzzkang_unsaved_uploads` local storage array.
  * Delete local storage entry upon successful save/publish or normal unmount cleanup.
  * Check and clean up orphaned URLs via `DELETE /api/media` on next session initialization inside `AuthContext.js`.
