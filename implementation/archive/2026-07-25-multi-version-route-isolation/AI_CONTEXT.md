# AI Context — Multi-Version Route Isolation & Refactoring

## Target Workspace & Repositories
- **Monorepo Root**: `/home/bms-del112/BMS/personal-project/wuzzkang`
- **Frontend Dashboard**: `wuzzkang-dashboard` (Next.js 15 App Router)
- **Landing Page Runtime**: `wuzzkang-lp` (Pure HTML/JS/CSS ES Modules)
- **Backend API**: `wuzzkang-api` (Express.js + Supabase PostgreSQL)

## Task Objective
Safely refactor the monolithic generator editor form (`wuzzkang-dashboard/src/app/generate/page.js` — 9,841 lines) into version-isolated App Router routes (`/generate/v1` for legacy V1 forms, `/generate/v2` for V2 Modular Section Builder) and set up an auto-redirect router at `/generate/page.js` based on `template_version`.

## Active Skills Invoked
- `wuzzkang-master-orchestrator`
- `wuzzkang-multi-version-architecture`
- `wuzzkang-code-refactor`
- `wuzzkang-implementation-protocol`
- `wuzzkang-ui-standards-guard`
- `wuzzkang-doc-sync-auditor`
- `wuzzkang-code-reviewer`
- `wuzzkang-token-optimization-guard`
