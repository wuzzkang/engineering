# Decision Log — V2 AI Assist Payload & Enum Mapping Fix

---

### DEC-003: Section Type to Zod Enum Mapping for V2 AI Assist
* **Date:** 2026-07-25T23:20:00+07:00
* **Context:** Clicking `✨ AI Assist` failed with HTTP 400 Bad Request because `sectionType` (e.g. `'hero'`, `'services'`) did not match backend Zod enum expected by `/api/generate/field` (`'v2_hero'`, `'v2_services'`, etc.), and `context` was sent as a string instead of an object.
* **Options Considered:**
  - *Option A:* Change backend `GenerateFieldRequestSchema` Zod validation in `generator.route.js` to accept raw section names and strings. (Cons: Weakens backend API validation contract).
  - *Option B:* Implement frontend helper `mapSectionToFieldType` and pass structured object `{ brandName, brief, brandDesc }` matching Zod schema. (Pros: Preserves API strictness and clean separation of concerns).
* **Decision:** Option B.
* **Impact:** `wuzzkang-dashboard/src/app/generate/v2/page.js`.
