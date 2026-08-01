# Technical Decision Log — V2 Documentation Synchronization

### Decision 1: Single Source of Truth Alignment
- **Context**: V2 implementation introduced new database tables (`project_documents_v2`), API routes (`/api/v2/*`, `/api/projects/:id/v2/*`), and Preview Bridge architecture.
- **Decision**: Update all 5 core technical documents under `wuzzkang-engineering/docs/` (`02_CURRENT_STATE.md`, `05_API_SPECIFICATION.md`, `07_RENDER_ENGINE.md`, `08_REPOSITORY_MAP.md`, `09_DATABASE_ARCHITECTURE.md`) to guarantee strict synchronization between code and docs as required by `.cursorrules`.
