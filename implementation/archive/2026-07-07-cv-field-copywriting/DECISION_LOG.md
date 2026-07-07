# Decision Log

### DEC-01: Bypass Global AI platform task execution for CV preview generation
*   **Date:** 2026-07-07T17:02:00+07:00
*   **Context:** Unlike other templates (Wedding, Birthday, Toko Online, Campaign), the CV template does not have a global prompt description input. All initial data is filled in manually by the user. Forcing global task execution via `/v1/ai/execute` when they click "Generate Preview" causes Gemini to automatically overwrite the user's manual inputs, which violates the user's control.
*   **Options Considered:**
    *   *Option A:* Keep calling `/v1/ai/execute` globally, but attempt to merge or prompt Gemini not to change user content unless requested.
        *   *Pros:* Consistent API endpoint usage.
        *   *Cons:* Unreliable (LLMs can still alter content), extremely slow, and wastes tokens/credits on every preview generation.
    *   *Option B:* Bypass global AI Platform task execution for CV preview. Directly save CV inputs to the DB draft using `POST /projects/draft` (similar to edit-mode saving), and offer individual field-level AI copywriting buttons.
        *   *Pros:* Completely prevents unwanted overwrites, saves user credits/balance, and gives users absolute control over whether to generate fields using AI or type manually.
        *   *Cons:* Breaks the pattern of calling `/v1/ai/execute` on creation for all template types.
*   **Decision:** Option B. The user experience of not having their manually entered content overwritten is more important. The architectural consistency is maintained by still persisting the draft correctly and using the standard `/api/generate/field` queue route for individual AI field optimizations.
*   **Impact:** Modifying `handleGenerate` in `wuzzkang-dashboard/src/app/generate/page.js` to handle `templateType === 'cv'` separately by assembling the `compiledPageData` directly and saving to database.
