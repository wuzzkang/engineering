# AI Context & State Handover

## Project State
- Workspace: Wuzzkang Monorepo
- Active Task: Mobile Responsive Layout Support for V2 Builder (`wuzzkang-dashboard/src/app/generate/v2/[projectId]/page.jsx`)
- Objective: Design and implement a mobile-friendly UX for V2 Builder on mobile/HP view (viewport < 768px) where sidebars currently overlap and collapse.

## Key File Locations & Target Files
- V2 Builder Core Page: `wuzzkang-dashboard/src/app/generate/v2/[projectId]/page.jsx`
- Section Tree Panel: `wuzzkang-dashboard/src/components/v2/SectionTreePanel.jsx`
- Property Editor Panel / Forms: `wuzzkang-dashboard/src/components/v2-editor/forms/`
- Design System Customizer: `wuzzkang-dashboard/src/components/v2/DesignSystemCustomizer.jsx`

## Verification Strategy
- Dev server execution test: `npm run dev` in `wuzzkang-dashboard`
- Mobile viewport verification: Test layout responsiveness at 375px (iPhone SE/12), 414px, 768px (Tablet), and >1024px (Desktop).
