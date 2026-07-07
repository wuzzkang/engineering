# Implementation Plan — CV (Curriculum Vitae) Product

## Goal Description
Implement a new Curriculum Vitae (CV) product in the Wuzzkang monorepo using the asynchronous AI Platform queue framework.
Users will provide their professional profiles, experiences, educations, skills, languages, and certifications.
Gemini (`gemini-2.5-flash`) will polish the profile summary and work experience descriptions to be highly professional, action-oriented, and ATS-friendly.
The compiled page will render using a new professional dark template with CSS-print support for direct PDF export.

## User Review Required
No major architectural shifts other than adhering to the established asynchronous queue framework (`POST /api/v1/ai/execute` and task compilers).

## Open Questions
- None.

## Proposed Changes

### `wuzzkang-api`
- **[MODIFY]** [schema.js](file:///home/bms-del112/BMS/personal-project/wuzzkang/wuzzkang-api/src/utils/schema.js) — Add `CvPageSchema` and register it in `PageSchema` union.
- **[MODIFY]** [generator.route.js](file:///home/bms-del112/BMS/personal-project/wuzzkang/wuzzkang-api/src/routes/generator.route.js) — Update routes to parse/validate `cv_details`.
- **[NEW]** [CvTaskCompiler.js](file:///home/bms-del112/BMS/personal-project/wuzzkang/wuzzkang-api/src/services/ai-platform/compilers/CvTaskCompiler.js) — Build compiler that translates CV context to ATS-optimizing Gemini prompt.
- **[MODIFY]** [register.js](file:///home/bms-del112/BMS/personal-project/wuzzkang/wuzzkang-api/src/services/ai-platform/register.js) — Register `CvTaskCompiler` under template key `'cv'`.

### `wuzzkang-lp`
- **[NEW]** [professional-dark.js](file:///home/bms-del112/BMS/personal-project/wuzzkang/wuzzkang-lp/templates/cv/professional-dark.js) — Design semantic HTML / print-ready dark theme template.
- **[MODIFY]** [script.js](file:///home/bms-del112/BMS/personal-project/wuzzkang/wuzzkang-lp/script.js) — Wire up CV router and bump LP_VERSION.

### `wuzzkang-dashboard`
- **[MODIFY]** [index.html](file:///home/bms-del112/BMS/personal-project/wuzzkang/wuzzkang-dashboard/public/preview/index.html) — Add CV template loader inside preview sandbox, bump PREVIEW_VERSION.
- **[MODIFY]** [generate/page.js](file:///home/bms-del112/BMS/personal-project/wuzzkang/wuzzkang-dashboard/src/app/generate/page.js) — Implement CV form fields, Zod-based validator, async executing queue payload submission, polling result retriever, and state syncer.
- **[MODIFY]** [page.js](file:///home/bms-del112/BMS/personal-project/wuzzkang/wuzzkang-dashboard/src/app/page.js) — Map CV into "Toko / Bisnis" filter tab and activate full edit flow.

## Verification Plan

### Automated Tests
- Validate compiled JSON schema using Node validator script.
- Execute integration compiler test against Gemini API key directly to ensure ATS-compliance parsing.

### Manual Verification
- Test PDF output printing using browser print preview layout.
