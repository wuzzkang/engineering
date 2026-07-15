# Implementation Plan: E-Course Product & Template

This plan outlines the steps to add the new "e-course" product, including its AI compilers, Zod schema validations, pricing settings, landing page rendering template (`purple-academy`), and dashboard generation form support.

## User Review Required

> [!IMPORTANT]
> The database migration will insert the `'e-course'` product category with a cost of `150` credits (similar to the CV product).
> We will name the template design `'purple-academy'`, matching the visual gradient of the pegxy template.

## Open Questions
- None.

## Proposed Changes

---

### Supabase Database Migration

#### [NEW] [20260712190000_add_e_course_product.sql](file:///home/bms-del112/BMS/personal-project/wuzzkang/wuzzkang-api/supabase/migrations/20260712190000_add_e_course_product.sql)
Create a new migration script to insert the `e-course` product:
```sql
INSERT INTO products (id, name, is_active, cost, unit)
VALUES ('e-course', 'E-Course', TRUE, 150, 'Kelas')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  is_active = EXCLUDED.is_active,
  cost = EXCLUDED.cost,
  unit = EXCLUDED.unit;
```

---

### API Schemas and Routes (`wuzzkang-api`)

#### [MODIFY] [schema.js](file:///home/bms-del112/BMS/personal-project/wuzzkang/wuzzkang-api/src/utils/schema.js)
Define `ECoursePageSchema` with details for:
- `meta`: template type (`e-course`), theme/design key (`purple-academy`), and template version.
- `content`: hero, problems, solutions, audience, mentor, curriculum (modules), benefits, bonuses, pricing, testimonials, faqs, contact.
Add `ECoursePageSchema` to the exported union `PageSchema`.

#### [MODIFY] [generator.route.js](file:///home/bms-del112/BMS/personal-project/wuzzkang/wuzzkang-api/src/routes/generator.route.js)
1. In `GenerateRequestSchema`, add `e_course_details` validation matching the new schema.
2. In `/generate` endpoint, check for `template_type === 'e-course'` and validate `e_course_details`.
3. In `GenerateFieldRequestSchema.fieldType` and the `/generate/field` handler, support optional e-course field generation if needed (e.g. `e_course_summary`, etc.) or fallback to generic text cues.

#### [MODIFY] [ai.service.js](file:///home/bms-del112/BMS/personal-project/wuzzkang/wuzzkang-api/src/services/ai.service.js)
1. In `generateLandingPage`, add a block for `templateType === 'e-course'` to compile the page config when no prompt is provided.

#### [NEW] [ECourseTaskCompiler.js](file:///home/bms-del112/BMS/personal-project/wuzzkang/wuzzkang-api/src/services/ai-platform/compilers/ECourseTaskCompiler.js)
Create a concrete `TaskCompiler` for compiling the e-course details and generating a prompt for Gemini to output the full JSON content structure.

#### [MODIFY] [register.js](file:///home/bms-del112/BMS/personal-project/wuzzkang/wuzzkang-api/src/services/ai-platform/register.js)
Register `ECourseTaskCompiler` as `'e-course'`.

#### [MODIFY] [AICostEstimator.js](file:///home/bms-del112/BMS/personal-project/wuzzkang/wuzzkang-api/src/services/ai-platform/AICostEstimator.js)
Add `'e-course'` to `LOCAL_FALLBACK_PRICING` with a base rate of `2` credits.

---

### Landing Page Rendering (`wuzzkang-lp`)

#### [MODIFY] [script.js](file:///home/bms-del112/BMS/personal-project/wuzzkang/wuzzkang-lp/script.js)
1. Add check for `templateType === 'e-course'` in `renderPage`.
2. Load fonts and import the versioned file (`templates/e-course/purple-academy.js`).

#### [NEW] [purple-academy.js](file:///home/bms-del112/BMS/personal-project/wuzzkang/wuzzkang-lp/templates/e-course/purple-academy.js)
Implement the visual layout of the Pegxy template.
It must include:
- Navigation bar with "Join Sekarang" button
- Hero section with text, countdown timer, and two CTA buttons
- Pain points/agitation block
- Solution value proposition
- Target audience grid
- Mentor profile card
- Curriculum accordion/list
- Benefits list
- Special bonuses
- Pricing packages table (Basic/Pro/Ultimate or single pricing)
- Guarantee 100% money back
- Testimonials carousel/quotes
- FAQ section
- Footer with WhatsApp redirect and copyright

---

### Dashboard Forms (`wuzzkang-dashboard`)

#### [MODIFY] [page.js](file:///home/bms-del112/BMS/personal-project/wuzzkang/wuzzkang-dashboard/src/app/generate/page.js)
1. Add state variables for e-course form fields.
2. In `TEMPLATE_LATEST_VERSIONS` registry, map `'purple-academy'` to version `1`.
3. In `assembledPageData` compiler, compile e-course payload.
4. Render e-course form fields inside the generator UI when `templateType === 'e-course'`.

---

## Verification Plan

### Automated Tests
- Run `node test-api.js` or similar validator script.

### Manual Verification
- Deploy to local sandbox and test form filling.
- Test generating preview using manual editing.
- Test AI copywriting execution.
