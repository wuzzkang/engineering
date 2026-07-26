# AI Context — V2 Mobile Editor Section List Space Optimization

## Task Scope
Optimize vertical space on mobile view of `/generate/v2` editor to give the Section List more visible area.

## Target Repository
- `wuzzkang-dashboard`

## Target File
- `src/app/generate/v2/page.js` (1398 lines)

## Environment
- Next.js 15, React 19, Tailwind v4
- Node.js >= 24
- Dev server running on port (npm run dev active)

## Key References
- Top header global theme switcher: L874–890 (already exists, duplicates panel ④)
- Panel ④ (Theme Color in editor): L1050–1077 — can be hidden on mobile (hidden lg:block)
- Panel ⑤ (Brand Brief textarea): L1079–1102 — add collapse toggle
- Panel ⑥ (URL Slug input): L1144–1178 — add collapse toggle
- Section list container: L1104–1142 (flex-1 overflow-y-auto)

## Session Started
2026-07-26
