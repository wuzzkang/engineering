# Implementation Plan — Project Deletion Feature

## Goal
Implement a secure, clean project deletion mechanism.

## Proposed Changes
1. **wuzzkang-api**:
   * Add a DELETE route `DELETE /api/projects/:id` in `project.route.js`.
   * Add method `deleteProject(userId, projectId)` in `project.service.js` which validates owner authority, releases active custom subdomains, deletes project uploaded images from Supabase Storage (excluding `/defaults/`), and deletes the project row.
   * Add database deletion method `deleteProject(projectId, userId)` in `supabase.service.js`.
2. **wuzzkang-dashboard**:
   * Add state and deletion handlers in `page.js`.
   * Add deletion Trash icon and ConfirmDialog modal to double-check project deletion.

## Verification
* Run integration tests using Node 22 to confirm successful database deletion, unauthorized protection, and physical asset deletion from storage.
