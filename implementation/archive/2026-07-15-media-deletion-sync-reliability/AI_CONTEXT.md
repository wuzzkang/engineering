# AI Context: Active Implementation

This file tracks the mapped files and environment variables for the current active implementation task.

## Active Task Details
* **Feature:** Reliable Media Deletion & Synchronization
* **Target Repository:** `wuzzkang-dashboard`
* **Target Files:**
  - `wuzzkang-dashboard/src/app/generate/page.js`

## Context Mapping
* `/api/media` (DELETE) - Handles deletion of media assets from Supabase storage.
* `executeDeleteImage` - Dashboard function to trigger backend media deletion.
* `cleanupOrphanedAssets` - Dashboard function to scan and clean up replaced/removed assets.
* `pendingDeleteImages` - Dashboard state tracking images marked for deletion.
* `uploadedImagesRef` - Dashboard ref tracking newly uploaded images in the current session.
