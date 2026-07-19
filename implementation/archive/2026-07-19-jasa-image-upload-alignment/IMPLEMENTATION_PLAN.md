# Implementation Plan: Jasa Image Upload Alignment

## Goal
Align the "Jasa" template image upload functionality with standard components, specifically the reusable `<ImagePickerField>` and backend signed-URL flow.

## Scope
- wuzzkang-dashboard/src/app/generate/page.js

## Milestone 1: Implementation & Verification
1. Add Jasa targets (`jasaHero`, `jasaAbout`, `jasaBrandLogo`) to `handleUploadImage`.
2. Replace Jasa custom image inputs with `<ImagePickerField>`.
3. Link Jasa logo upload trigger to `handleUploadImage`.
4. Delete unused `isGeneratingJasa*` states.
5. Verify changes manually.
