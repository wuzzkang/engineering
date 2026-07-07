# Walkthrough — CV Field Copywriting & UX Improvements

We implemented field-level "✨ AI Generate" buttons, bypassed global AI overwrites, resolved silent validation failures in edit mode, improved the skills input tagging UX, resolved layout spacing of bottom components, and enabled dynamic database-driven post-publication editing support.

## Changes Made

### wuzzkang-api
- Added `cv_summary` and `cv_experience_description` to `GenerateFieldRequestSchema`'s `fieldType` enum.
- Expanded `context` validation schema with CV-specific fields (`profileName`, `profileTitle`, `profileSummary`, `company`, `position`, `description`) in `wuzzkang-api/src/routes/generator.route.js`.
- Implemented `cv_summary` and `cv_experience_description` prompt templates in `generateFieldContent` inside `wuzzkang-api/src/services/ai.service.js`.
- **Dynamic Post-Publication Edit Support**: Replaced hardcoded template validation checks in `editDeployedProject` inside `wuzzkang-api/src/services/project.service.js` with a dynamic query against the `products` database table. Added support for dynamic CV page names matching the profile name.

### wuzzkang-dashboard
- Added loading state variables (`isGeneratingCvSummary`, `isGeneratingCvExperienceDesc`) to track CV field-level assists in `wuzzkang-dashboard/src/app/generate/page.js`.
- Extended `handleAIAssist` to configure the CV field assist context payload, fetch content, and bind results to `cvSummary` and `cvExperiences[idx].description`.
- Implemented `renderAICVButton` styling to render "✨ AI Generate" button components.
- Added CV field buttons adjacent to "Ringkasan Profesional" and each experience item's "Deskripsi Singkat (Opsional)" fields.
- Modified `handleGenerate` to branch off CV template creation into a direct draft save (`/projects/draft`), completely bypassing the async AI Platform execution and preventing automatic overwriting of user input.
- **Error Handling Fix**: Updated `handleSaveDeployed` in edit mode to flatten and format Zod schema validation errors. Rendered a global modern error banner at the top of the generate form inside the JSX.
- **Skills Tagging Improvement**: Refactored the skills input field to listen to `onChange` events instead of `onKeyDown` for comma key entries. This allows typing a comma `,` or pasting a comma-separated list of skills to instantly turn them into structured tag items.
- **Bottom Action Bar Positioning**: Repositioned the form submit container to `fixed bottom-[84px] md:bottom-0` on mobile/desktop to completely clear the circular `+` button in the center of the bottom navigation menu. Changed the z-index of the Tracking Pixel Banner from `z-39` to `z-10` so that scrolling content sits neatly *behind* the floating action bar (`z-30`). Increased `<main>` bottom padding to `pb-48 md:pb-28` to provide sufficient scroll height.

### wuzzkang-engineering
- Documented the changes and updated `/api/generate/field` request schema definitions in `docs/05_API_SPECIFICATION.md`.
- Updated the CV template description status in `docs/02_CURRENT_STATE.md` to match the new flow.

## Verification & Testing
- Validated route schema definitions, dynamic database-driven product checks, and mock payloads.
- Verified mobile viewport scaling, z-index overlays, scroll clearance heights, and input handlers.
