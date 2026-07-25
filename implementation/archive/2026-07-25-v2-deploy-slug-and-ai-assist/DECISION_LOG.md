# Decision Log — V2 Deploy, Slug Validation & AI Assist Integration

---

### DEC-001: Unified Slug Payload Structure for V2 Deploy
* **Date:** 2026-07-25T22:50:00+07:00
* **Context:** Deploying V2 projects previously failed with HTTP 400 Bad Request because `handleDeploy` sent `{ name, template_type, pageData }` without `slug`, which violated `DeployProjectSchema` in `project.route.js`.
* **Options Considered:**
  - *Option A:* Remove Zod slug validation in `project.route.js` and generate slug implicitly on backend. (Pros: Simple; Cons: Breaks API specification and removes user URL customization).
  - *Option B:* Adopt V1 slug mechanism: collect `slug` in V2 UI, auto-suggest from `name` / `v2BrandName`, and send `{ slug, couponCode: null }`. (Pros: 100% compliant with API spec, gives user full control, anti-collision guaranteed by backend `${slug}-${uuidSuffix}`).
* **Decision:** Option B.
* **Impact:** `v2/page.js`, `project.route.js`, `project.service.js`.

---

### DEC-002: Disabling AI Assist Button when AI Brief is Empty
* **Date:** 2026-07-25T23:10:00+07:00
* **Context:** AI Assist requires a business description / brief to generate accurate copywriting. Clicking AI Assist without a brief generates generic or empty text.
* **Options Considered:**
  - *Option A:* Allow clicking AI Assist with fallback default prompt. (Cons: Poor quality AI text).
  - *Option B:* Disable `✨ AI Assist` button with visual hint/tooltip until `v2BrandBrief` is filled. (Pros: Prevents wasted AI calls, clear UX feedback).
* **Decision:** Option B.
* **Impact:** `v2/page.js`, `V2SectionFormDispatcher.jsx`.
