# Implementation Plan: Template Versioning

Refer to the approved implementation plan at `/home/bms-del112/.gemini/antigravity-ide/brain/6cc91586-cd98-4e80-882b-870717082908/implementation_plan.md`.

## Summary
Introduce `template_version` to meta schema of all template types (wedding, birthday, toko-online, campaign, cv) to prevent updates from breaking live sites.

## Steps
1. Backend: Update `wuzzkang-api/src/utils/schema.js` to define `template_version` with default `1`.
2. LP Router: Update `wuzzkang-lp/script.js` to dynamic loading version suffix if version > 1.
3. Preview Sandbox: Update `wuzzkang-dashboard/public/preview/index.html` to dynamic loading version suffix if version > 1.
4. Dashboard: Update `wuzzkang-dashboard/src/app/generate/page.js` to read/write `template_version` in meta and show upgrade banner/button if version is outdated.
