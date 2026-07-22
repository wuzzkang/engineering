# AI Context - V2 Generator & Editor UI/UX Upgrade

This document maps target repositories, stack boundaries, and file pointers for the active V2 Generator & Editor UI/UX task.

## Target Repositories
* `wuzzkang-dashboard` (Primary)
* `wuzzkang-lp` (Reference for section styles)

## Core Files to Modify & Create
1. **[NEW]** `wuzzkang-dashboard/src/app/generate/v2Presets.js`: Starter kit preset definitions for V2 goals (`jasa`, `campaign`, `toko-online`, `wedding`, `birthday`, `e-course`, `cv`, `custom`).
2. **[NEW]** `wuzzkang-dashboard/src/components/V2VisualSectionPickerModal.jsx`: Visual card catalog modal for selecting and adding sections.
3. **[MODIFY]** `wuzzkang-dashboard/src/app/generate/page.js`: Onboarding Goal Modal, Starter Kit Preset Initializers, Global Color Theme Switcher, Visual Section Picker Modal integration, Interactive Focus Sync.

## Coding Standards & Invariants
- Preserve all existing template types (`wedding`, `birthday`, `toko-online`, `campaign`, `cv`, `e-course`, `jasa`, `dynamic-builder`).
- Reuse `<ImagePickerField>` and `handleUploadImage` signed URL pipeline.
- Respect `getSectionStyle` centralized styling engine tokens.
