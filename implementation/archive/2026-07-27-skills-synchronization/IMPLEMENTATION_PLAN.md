# Implementation Plan — Comprehensive Skill Synchronization (V2 Architecture Update)

Status: `Approved for Implementation`

## Overview
Synchronize all 10 specialized skills in the Wuzzkang ecosystem to reflect all major recent architectural updates, including:
1. **V2 Dynamic Builder Architecture & First Principles Core**: `@wuzzkang/renderer-core` (`DocumentInterpreter` ~1.37ms, `TokenResolver`), Preview Bridge protocol, AST PageDocument schemas, instant auto-save on mount, and V2 draft sync to main `projects` table.
2. **Database & Schema Updates**: `project_documents_v2`, `section_types_v2`, `design_systems_v2`, and missing column safeguards (`template_type`).
3. **UI/UX & Branding Guardrails**: Centralized branding configuration (`@/config/branding`), 3-Theme Reactivity (`Clean`, `Retro`, `Classic Dark`), `ImagePickerField` reuse, and `getSectionStyle` semantic theme mapping.
4. **Implementation Protocol & Skill Dual-Sync**: 3-Phase SOP enforcement, 4-repo local commit audit (`.`, `wuzzkang-dashboard`, `wuzzkang-api`, `wuzzkang-lp`), and strict dual-sync between `wuzzkang-engineering/skills/` and `~/.gemini/config/skills/`.

---

## Target Skills to Synchronize & Update

### 1. `wuzzkang-v2-section-builder`
- Document `@wuzzkang/renderer-core` integration (`DocumentInterpreter`, `TokenResolver`).
- Add instant auto-save on mount rules for V2 drafts and `TypeRegistryService` main `projects` table sync.
- Document AST `PageDocument` structure (`nodes`, `designSystemId`, `meta`, `formatVersion`, `checksum`).

### 2. `wuzzkang-multi-version-architecture`
- Include `wuzzkang-sections/` monorepo package layout in architecture diagrams.
- Document isolated V2 endpoints (`/api/v2/type-registry`, `/api/projects/:id/v2/draft`, `/api/projects/:id/v2/publish`).
- Document `template_version` routing logic in Next.js App Router (`/generate/v1`, `/generate/v2/[projectId]`).

### 3. `wuzzkang-doc-sync-auditor`
- Add `wuzzkang-sections/` and new engineering docs (`09_DATABASE_ARCHITECTURE.md`, `07_RENDER_ENGINE.md`, `05_API_SPECIFICATION.md`) to the DoD verification matrix.
- Ensure strict dual-sync audit rules between `wuzzkang-engineering/skills/` and `~/.gemini/config/skills/`.

### 4. `wuzzkang-ui-standards-guard`
- Enforce Centralized Branding Configuration rule (no hardcoded brand strings).
- Update CSS variable tokens and contrast ratio guidelines for theme switcher (`Clean`, `Retro`, `Classic Dark`).
- Document SyntheticEvent React event safeguards in V2 action buttons.

### 5. `wuzzkang-code-reviewer`
- Add audit checklist items for V2 AST resolution performance (<10ms SLA), non-blocking event loop, zero hardcoded branding text, and 4-repo git status audit.

### 6. `wuzzkang-code-refactor`
- Add refactoring guidelines for splitting monolithic section builders into modular ES components and AST-driven node transformers.

### 7. `wuzzkang-token-optimization-guard`
- Document Redis MD5 prompt caching and AST document delta updates for saving runtime API tokens and context window usage.

### 8. `wuzzkang-ai-platform-compiler`
- Add V2 section node AI generation compiler specs (`POST /api/projects/:id/v2/nodes/:nodeId/generate`).

### 9. `wuzzkang-implementation-protocol`
- Align with the 3-Phase Implementation Protocol (Planning Gate, Active Phase, Archive & Commit Phase) and 4-repo audit command.

### 10. `wuzzkang-master-orchestrator`
- Update skill routing table to map V2 First Principles Engine, AST documents, and documentation/skill sync requests correctly.

---

## Verification Plan

### Automated Verification
- Verify that every SKILL.md in `wuzzkang-engineering/skills/` matches the corresponding SKILL.md in `~/.gemini/config/skills/` 100% using `diff -r` or hash verification.
- Verify file formatting and line counts.

### Manual Verification
- Present the updated skill matrix to the user for final approval.
