# Implementation Plan - CV Field Copywriting & Optional AI Generation

This plan details the implementation of individual "✨ AI Generate" buttons for the "CV" (Curriculum Vitae) template, allowing users to choose whether they want to use AI generation or input their content manually, preventing automatic AI overwrites on preview generation.

## User Review Required

- Clicking the main "Generate Preview (Gratis)" button for a CV will **no longer** run the global AI Platform workflow (`POST /api/v1/ai/execute`) or rewrite/overwrite any fields. Instead, it will directly save the user's manual inputs to the draft.
- The user can individually trigger AI optimization on "Ringkasan Profesional" and "Deskripsi Kerja" (Experiences) fields using the new "✨ AI Generate" buttons.

## Proposed Changes

### Backend API (`wuzzkang-api`)

#### [generator.route.js](file:///home/bms-del112/BMS/personal-project/wuzzkang/wuzzkang-api/src/routes/generator.route.js)
- Add `cv_summary` and `cv_experience_description` to `GenerateFieldRequestSchema`'s `fieldType` enum.
- Add CV-specific context properties (`profileName`, `profileTitle`, `profileSummary`, `company`, `position`, `description`) to the `context` schema object.

#### [ai.service.js](file:///home/bms-del112/BMS/personal-project/wuzzkang/wuzzkang-api/src/services/ai.service.js)
- Handle `fieldType === 'cv_summary'` and `fieldType === 'cv_experience_description'` in `generateFieldContent`.
- Provide professional prompts to Gemini to polish profile summaries and job experience descriptions to be ATS-friendly.

### User Dashboard (`wuzzkang-dashboard`)

#### [page.js](file:///home/bms-del112/BMS/personal-project/wuzzkang/wuzzkang-dashboard/src/app/generate/page.js)
- Add state variables `isGeneratingCvSummary` and `isGeneratingCvExperienceDesc` to track loading states.
- Extend `handleAIAssist` to support `cv_summary` and `cv_experience_description`, mapping their respective parameters to the context object and updating form inputs upon completion.
- Implement `renderAICVButton` to render standard field-level "✨ AI Generate" buttons.
- Render `renderAICVButton` next to "Ringkasan Profesional" and "Deskripsi Singkat" of each experience list item.
- Modify `handleGenerate` for `templateType === 'cv'` to bypass the async `POST /api/v1/ai/execute` workflow and directly persist pageData inputs to the database via `/projects/draft` (or `/edit-deployed` if editing).

## Verification Plan

### Automated Tests
- Run backend unit tests or check server startup.

### Manual Verification
- Go to Dashboard, select CV template.
- Manually enter "Nama Lengkap" and "Jabatan". Try clicking "✨ AI Generate" on "Ringkasan Profesional". Verify that it generates a polished summary.
- Add an experience, fill in "Nama Perusahaan" and "Jabatan", then click "✨ AI Generate" next to "Deskripsi Singkat". Verify that it generates professional bullets.
- Click "Generate Preview (Gratis)" at the bottom. Verify that it directly displays the preview *without* rewriting/overwriting any manually typed/previously generated text.
