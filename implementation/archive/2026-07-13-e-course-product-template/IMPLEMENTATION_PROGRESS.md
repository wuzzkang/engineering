# Implementation Progress: E-Course Product & Template

- [x] Milestone 1: API Schemas and Service Configurations
  - [x] Add `ECoursePageSchema` to `wuzzkang-api/src/utils/schema.js` and export in `PageSchema` union.
  - [x] Register new compiler `'e-course'` in `wuzzkang-api/src/services/ai-platform/register.js`.
  - [x] Create task compiler `ECourseTaskCompiler.js` under `wuzzkang-api/src/services/ai-platform/compilers/`.
  - [x] Update `generateLandingPage` block in `wuzzkang-api/src/services/ai.service.js`.
  - [x] Update `AICostEstimator.js` fallback pricing rules to include `'e-course'`.
  - [x] Update `generator.route.js` request body schema and fields validation.

- [x] Milestone 2: Landing Page Router and E-Course Template (`wuzzkang-lp`)
  - [x] Add `'e-course'` template loading routing to `wuzzkang-lp/script.js`.
  - [x] Create `wuzzkang-lp/templates/e-course/purple-academy.js` design template.

- [x] Milestone 3: Dashboard React Forms (`wuzzkang-dashboard`)
  - [x] Update state, registries, forms, assembledContent builder, and preview rendering support in `wuzzkang-dashboard/src/app/generate/page.js`.

- [x] Milestone 4: Verification and Polish
  - [x] Verify local rendering, compilation, validation, and AI generation tasks.

- [x] Milestone 5: Dynamic Product Selection Priority (User Requested)
  - [x] Push migration `20260713183500_add_priority_to_products.sql` to add `priority` column to `products`.
  - [x] Implement sorting logic in `wuzzkang-dashboard` to sort by `priority` first, then `created_at` descending.
  - [x] Make `templateType` state dynamic on load to default select the top priority active template instead of hardcoded toko-online.
  - [x] Add theme preview trigger button for Purple Academy in E-Course generator fields.
  - [x] Fix syntax block indentation error inside CV template load of preview sandbox `index.html`.
  - [x] Add global window unhandled error/rejection catchers to sandbox `index.html` to prevent silent blank pages.
