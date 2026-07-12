# AI Context: E-Course Product & Template

This document tracks target files and boundaries for the e-course product implementation.

## Repositories & Key Files

### wuzzkang-api
- [schema.js](file:///home/bms-del112/BMS/personal-project/wuzzkang/wuzzkang-api/src/utils/schema.js) - Schema definitions
- [register.js](file:///home/bms-del112/BMS/personal-project/wuzzkang/wuzzkang-api/src/services/ai-platform/register.js) - AI compiler registration
- [ECourseTaskCompiler.js](file:///home/bms-del112/BMS/personal-project/wuzzkang/wuzzkang-api/src/services/ai-platform/compilers/ECourseTaskCompiler.js) - AI prompt compiler [NEW]
- [AICostEstimator.js](file:///home/bms-del112/BMS/personal-project/wuzzkang/wuzzkang-api/src/services/ai-platform/AICostEstimator.js) - Pricing estimation
- [generator.route.js](file:///home/bms-del112/BMS/personal-project/wuzzkang/wuzzkang-api/src/routes/generator.route.js) - Generator routes Zod schema and AI assist fields

### wuzzkang-lp
- [script.js](file:///home/bms-del112/BMS/personal-project/wuzzkang/wuzzkang-lp/script.js) - LP Router
- [purple-academy.js](file:///home/bms-del112/BMS/personal-project/wuzzkang/wuzzkang-lp/templates/e-course/purple-academy.js) - E-Course design template [NEW]

### wuzzkang-dashboard
- [page.js](file:///home/bms-del112/BMS/personal-project/wuzzkang/wuzzkang-dashboard/src/app/generate/page.js) - Generate form fields, AI execute call, assembledContent compilation

## Environment & Testing
- Supabase Local DB (migrations under `wuzzkang-api/supabase/migrations/`)
- API Port: Local development dev server
