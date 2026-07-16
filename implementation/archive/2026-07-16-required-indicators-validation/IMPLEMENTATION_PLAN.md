# Implementation Plan: Visual Required Field Indicators & Active Validation

## Goal
Implement a visual indicator (`*`) for required fields and keep submit buttons active, triggering native HTML5 and custom JS error feedback upon click rather than silently disabling the buttons.

## Proposed Changes
- **wuzzkang-dashboard**:
  - `src/app/generate/page.js`: Add asterisks to placeholders and labels, create `getFormValidationErrors()`, update submit buttons and submission handlers.

## Verification
- Test all forms (Wedding, Toko Online, E-Course, CV, Birthday, Campaign).
- Verify native tooltips and custom array-based validation error banners.
