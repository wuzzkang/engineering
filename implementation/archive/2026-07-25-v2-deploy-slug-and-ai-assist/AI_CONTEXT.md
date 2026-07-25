# AI Context — V2 Deploy, Slug Validation & AI Assist Integration

---

## 🎯 Target Repositories & Environments
- **`wuzzkang-dashboard`**:
  - `/src/app/generate/v2/page.js`: Main V2 Builder page (handles draft creation, auto-save, slug validation, AI assist trigger, and deploy execution).
  - `/src/components/v2-editor/V2SectionFormDispatcher.jsx`: Section form dispatcher component receiving `renderAIV2Button` prop.
- **`wuzzkang-api`**:
  - `/src/routes/project.route.js`: Implements Zod validation `DeployProjectSchema` requiring `slug`.
  - `/src/services/project.service.js`: Appends deterministic UUID suffix (`${slug}-${uuidSuffix}`) and locks execution via Redis Mutex.
  - `/src/routes/generator.route.js`: Handles `/api/generate/field` for async AI copywriting via BullMQ text worker.

---

## 🛠️ Codebase Invariants & Environment Constraints
- **Node.js Environment**: >= 24 (Node v22.17.1 / v24 used for Next.js 16 build).
- **Zod Validation Schema**: `DeployProjectSchema` enforces `min(3).max(50)` and regex `/^[a-z0-9-]+$/`.
- **Anti-Collision**: `${slug}-${uuidSuffix}` guarantees 100% slug uniqueness per project UUID.
- **AI Assist UI Protection**: Disabled when `v2BrandBrief` is empty (`!v2BrandBrief || !v2BrandBrief.trim()`).
