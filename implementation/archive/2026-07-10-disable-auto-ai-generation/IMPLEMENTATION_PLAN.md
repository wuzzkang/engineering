# Implementation Plan - Disable Auto AI Page Gen & Allow Project Renaming

## Goal
Disable automatic full-page AI generation on the main submit button to give users complete control over AI usage (utilizing on-demand, per-field AI generation). Additionally, allow users to edit and update project names when editing deployed landing pages, and prevent automatic content-based name overrides from the backend.

## Proposed Changes

### Dashboard Frontend
- **[page.js](file:///home/bms-del112/BMS/personal-project/wuzzkang/wuzzkang-dashboard/src/app/generate/page.js)**
  - Modify `handleGenerate` to always compile the form state directly into `compiledPageData` and save it to the database for all templates. Remove the asynchronous queue polling / full-page generation workflow.
  - Modify `handleSaveDeployed` to pass the updated `name` parameter in the request payload.

### Backend API
- **[project.route.js](file:///home/bms-del112/BMS/personal-project/wuzzkang/wuzzkang-api/src/routes/project.route.js)**
  - Update `EditDeployedProjectSchema` validation schema to accept an optional `name` parameter.
  - Pass the parsed `name` from validation data down to `projectService.editDeployedProject`.
- **[project.service.js](file:///home/bms-del112/BMS/personal-project/wuzzkang/wuzzkang-api/src/services/project.service.js)**
  - Update `editDeployedProject` signature to accept `name = null`.
  - Assign `newProjectName = name || project.name` to prevent auto-renaming, and discard backend automatic name overrides.

## Verification Plan
- Run existing unit tests inside `wuzzkang-api` using Jest.
- Perform visual inspections of the git diff to ensure no syntax errors.
