# AI Context — V2 AI Assist JSON Parsing & Worker Output Fix

---

## 🎯 Target Repositories & Components
- **`wuzzkang-api`**:
  - `/src/services/ai.service.js`: Added `fieldType.startsWith('v2_')` to `isJson` check and bumped Redis cache key version to `v5` to enforce proper JSON object parsing from LLM response.
- **`wuzzkang-dashboard`**:
  - `/src/app/generate/v2/page.js`: Added JSON string parsing shield in `handleGenerateAIV2Section` to safely parse stringified JSON before updating section content.

---

## 🛠️ Validation & Type Invariants
- AI responses for `v2_` field generators MUST be parsed JSON objects (`{ headline, subheadline, cta_text }`), not raw stringified JSON.
- Frontend safeguards attempt `JSON.parse` if `aiContent` is a string starting with `{` or `[`.
