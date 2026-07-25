# Decision Log — V2 AI Assist JSON Parsing & Worker Output Fix

---

### DEC-004: JSON Mode Registration for V2 Field Generators
* **Date:** 2026-07-25T23:24:00+07:00
* **Context:** `✨ AI Assist` output displayed raw JSON text inside input fields because `ai.service.js` treated `v2_` fieldTypes as plain text strings rather than JSON objects.
* **Options Considered:**
  - *Option A:* Only parse stringified JSON on frontend. (Cons: LLM prompt still lacks strict JSON instructions, leading to potential markdown backticks or malformed JSON).
  - *Option B:* Register `v2_` fieldTypes in `isJson` check in `ai.service.js`, update cache key to `v5`, AND add a frontend stringified JSON parser shield. (Pros: Robust, guarantees pure JSON parsing end-to-end).
* **Decision:** Option B.
* **Impact:** `wuzzkang-api/src/services/ai.service.js`, `wuzzkang-dashboard/src/app/generate/v2/page.js`.
