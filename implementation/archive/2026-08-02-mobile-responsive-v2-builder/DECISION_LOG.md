# Decision Log — Mobile Responsive Layout for V2 Builder

### DEC-019: Mobile Layout Architecture Selection (Bottom Nav Bar vs Drawer vs Scrollable)
*   **Date:** 2026-08-02
*   **Context:** Currently V2 Builder has a fixed 3-column horizontal layout (280px Left Panel + Center Canvas + 320px Right Property Panel). On mobile viewports (<768px), sidebars overlap and collapse, rendering the canvas invisible and unreadable.
*   **Options Considered:**
    *   *Option A (Bottom Navigation Bar + Single Active Panel):* Show 1 active panel at a time (Canvas / Sections / Properties) controlled via a fixed Bottom Nav Bar on mobile screens. (Pros: Very clean, optimal ergonomics, industry standard like Canva/Framer/Webflow mobile. Cons: Requires switching tabs).
    *   *Option B (Drawer Overlay):* Canvas always visible, sidebars slide in as temporary drawer overlays when triggered. (Pros: Canvas stays behind drawer. Cons: Drawer blocks canvas while editing properties).
    *   *Option C (Vertical Stack):* Stack all 3 panels vertically and allow scrolling. (Pros: Simple CSS. Cons: Extremely tall page, canvas preview gets squished to tiny height).
*   **Decision:** Selected **Option A (Bottom Navigation Bar + Single Active Panel)** as recommended approach for optimal mobile builder ergonomics.
*   **Impact:** Modifies `wuzzkang-dashboard/src/app/generate/v2/[projectId]/page.jsx`. Desktop layout remains 100% untouched.
