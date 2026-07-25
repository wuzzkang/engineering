# AI Context — V2 AI Assist Payload & Enum Mapping Fix

---

## 🎯 Target Repositories & Components
- **`wuzzkang-dashboard`**:
  - `/src/app/generate/v2/page.js`: Fixed `handleGenerateAIV2Section` to map section types to Zod enums (`v2_hero`, `v2_about`, `v2_services`, `v2_pricing`, `v2_faq`, `v2_contact`, `v2_custom`) and pass structured `context` object `{ brandName, brief, brandDesc }`.
- **`wuzzkang-api`**:
  - `/src/routes/generator.route.js`: Validates `GenerateFieldRequestSchema` requiring enum `fieldType` and object `context`.
  - `/src/services/ai.service.js`: Processes `v2_` field generators via Gemini text provider.

---

## 🛠️ Validation & Type Invariants
- `fieldType` MUST be one of Zod enum values (`v2_hero`, `v2_about`, `v2_services`, `v2_pricing`, `v2_faq`, `v2_contact`, `v2_custom`).
- `context` MUST be a JSON object, e.g. `{ "brandName": "...", "brief": "..." }`.
