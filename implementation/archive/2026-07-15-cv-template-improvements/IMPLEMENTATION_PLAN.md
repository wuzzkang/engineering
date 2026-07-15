# Implementation Plan - CV Template Improvements

- **Status:** Approved for Implementation
- **Feature:** CV template hide-footer option and experience list rendering
- **Target:** `wuzzkang-dashboard` and `wuzzkang-lp`

## Proposed Changes

### 1. wuzzkang-dashboard
- **[MODIFY]** `src/app/generate/page.js`
  - Add state `hideFooter` and `setHideFooter`.
  - Include `hide_footer` key in meta object of compiled/assembled page data.
  - Load `hide_footer` from Supabase workspace fetch.
  - Render checkbox under CV settings form.

- **[MODIFY]** `public/preview/templates/cv/professional-dark.js`
  - Extract bullet parsing function for experience description.
  - Implement conditional footer removal if `pageConfig.meta?.hide_footer` is true.
  - Add styles for bullet list elements (`.cv-exp-bullets`, `.cv-exp-bullets li`).

### 2. wuzzkang-lp
- **[MODIFY]** `templates/cv/professional-dark.js`
  - Implement equivalent layout changes as the preview template (bullet parsing, conditional footer removal, and styles).

## Verification Strategy
- Run `npm run build` or local development server.
- Verify through dashboard preview interaction and final live page rendering.
