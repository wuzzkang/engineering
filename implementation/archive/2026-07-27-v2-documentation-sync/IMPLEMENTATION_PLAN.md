# Implementation Plan — Documentation Synchronization & DoD Audit for V2 Engine

**Status**: `Approved for Implementation`  
**Date**: 2026-07-27  
**Goal**: Perform a comprehensive technical documentation update across `wuzzkang-engineering/docs/` to reflect all V2 Dynamic Builder architecture, database schemas, API specs, render engine, and repository maps.

---

## Proposed Milestones

### Milestone 1: API Specification Update (`docs/05_API_SPECIFICATION.md`)
- [ ] Document all V2 endpoints:
  - `GET /api/v2/type-registry` (List registered section types)
  - `GET /api/v2/type-registry/:typeId` (Get single section type schema)
  - `GET /api/v2/design-systems/:id` (Get design system definition)
  - `GET /api/projects/:id/v2/draft` (Fetch V2 PageDocument draft)
  - `PUT /api/projects/:id/v2/draft` (Save V2 PageDocument draft & sync to main projects table)
  - `POST /api/projects/:id/v2/nodes/:nodeId/generate` (Generate node content via SchemaToPromptCompiler)
  - `POST /api/projects/:id/v2/publish` (Publish V2 project document)
- [ ] Document Zod schemas and HTTP response contracts (`200 OK`, `401 Unauthorized`, `404 Not Found`).

### Milestone 2: Database Architecture Update (`docs/09_DATABASE_ARCHITECTURE.md`)
- [ ] Document `project_documents_v2` DDL and indexes (`project_id`, `document_version`, `design_system_id`, `document_json`, `status`).
- [ ] Document `section_types_v2` DDL and `design_systems_v2` DDL.
- [ ] Document the synchronization contract between `project_documents_v2` and `projects` main table.
- [ ] Note optional migration `20260727_add_template_type_to_projects.sql`.

### Milestone 3: Render Engine & Component Architecture (`docs/07_RENDER_ENGINE.md`)
- [ ] Document V2 First Principles Render Architecture:
  - `DocumentInterpreter` (resolves PageDocument nodes into ResolvedRenderTree in ~1.37ms).
  - `TokenResolver` (translates design tokens e.g. `{primitives.color.blue.600}`).
  - Preview Bridge (`postMessage` communication protocol between Builder UI and Vite iframe).
  - Component Section Library (12 built-in modular section renderers).

### Milestone 4: Repository Map & Current State (`docs/08_REPOSITORY_MAP.md` & `docs/02_CURRENT_STATE.md`)
- [ ] Update `docs/08_REPOSITORY_MAP.md` with V2 package locations (`wuzzkang-sections/`, `wuzzkang-dashboard/src/components/v2/`, `wuzzkang-dashboard/src/app/generate/v2/`).
- [ ] Update `docs/02_CURRENT_STATE.md` marking Milestones M0 through M7 as `COMPLETED` and production-ready.

---

## Verification Plan
- [ ] Verify markdown syntax and formatting across all modified docs in `wuzzkang-engineering/docs/`.
- [ ] Audit docs compliance against `.cursorrules` Definition of Done (DoD).
