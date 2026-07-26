# AI Context — V2 Editor Mobile Split View & Preview Toggle Optimization

## Task Scope
Enhance `/generate/v2` mobile split screen view layout to match target designs:
1. Default split view ratio on mobile set to 85% / 15% (Form takes 85%, Preview takes 15%) so component section cards (Header, Hero, Product Grid, Guarantee, FAQ, Slug, Buttons) are visible without clipping (Image 2).
2. Add interactive "Preview" button/control in the live preview sandbox bar.
3. Clicking "Preview" toggles split ratio to 15% / 85% (Form takes 15%, Preview expands full taking 85% below global theme bar) (Image 3).
4. Clicking again toggles back to 85% / 15% (Image 2).

## Target Files
- `wuzzkang-dashboard/src/app/generate/v2/page.js`

## Session Context
- Request Date: 2026-07-26
- Repository: `wuzzkang-dashboard`
- User Instruction: Update `/generate/v2` layout from Image 1 (50/50 default) to Image 2 (85/15 default), add clickable "preview" element that expands preview to Image 3 (15/85).
