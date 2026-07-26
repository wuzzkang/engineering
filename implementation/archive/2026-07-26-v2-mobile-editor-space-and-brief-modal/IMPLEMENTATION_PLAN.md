# Implementation Plan — V2 Mobile Editor Section List Space Optimization

## Status: Awaiting User Approval

## Objective
Maximize the visible height of the Section List (`flex-1 overflow-y-auto`) on mobile view of `/generate/v2` by removing or collapsing panels that consume vertical space unnecessarily.

## Problem Statement
On mobile, the editor column stacks vertically. The section list area is cramped because:
- Panel ④ (Tema Warna) ~62px — **duplicate** of the Top Header theme switcher (L874–890)
- Panel ⑤ (Brief Bisnis textarea) ~110px — always expanded, no collapse option
- Panel ⑥ (URL Slug input) ~68px — always expanded, no collapse option

**Total recoverable space: ~240px**

## Proposed Changes

### Milestone 1 — Opsi B: Hide Theme Color Panel on Mobile
**File:** `src/app/generate/v2/page.js` — L1050–1077

The "Tema Warna Landing Page" panel inside the editor column is a full duplicate of the Theme Switcher already present in the Top Header (L874–890). On mobile screens, the Top Header is scrollable and the theme switcher is accessible.

**Change:** Add `hidden lg:flex` to the panel's outer `<div>`, so it is invisible on mobile but still shown on desktop.

**Space recovered:** ~62px on mobile.

---

### Milestone 2 — Opsi A: Collapse Toggle for "Brief Bisnis" Panel
**File:** `src/app/generate/v2/page.js` — L1079–1102

Add a `▾/▴` toggle button next to the panel label. Default state on mobile: **collapsed** (only the label row visible, ~28px). Default state on desktop: **expanded**.

**New state variable:** `isBriefCollapsed` (useState) — initialized to `true` on mobile, `false` on desktop via `useEffect` + `window.innerWidth`.

**Space recovered:** ~82px on mobile when collapsed.

---

### Milestone 3 — Opsi A: Collapse Toggle for "URL Slug" Panel
**File:** `src/app/generate/v2/page.js` — L1144–1178

Add a `▾/▴` toggle button next to the "URL Slug Landing Page" label. Default state on mobile: **collapsed** (only the label row visible, ~28px). Default state on desktop: **expanded**.

**New state variable:** `isSlugCollapsed` (useState) — initialized to `true` on mobile, `false` on desktop via `useEffect` + `window.innerWidth`.

**Space recovered:** ~40px on mobile when collapsed.

---

### Milestone 5 — Reusable Modal, Physical Back Button Interception & Input Security Sanitization
**Files:**
- [NEW] `src/components/Modal.jsx` (Generic Reusable Modal component with animation, backdrop, ESC key listener, and `history.pushState` back button interceptor)
- [NEW] `src/lib/security.js` (Security sanitization helper `sanitizeAIBriefInput` for preventing XSS, script injection tags, control characters, and malicious payloads)
- [NEW] `src/components/BriefTextareaModal.jsx` (Reusable Brief AI Modal using `Modal.jsx` and input sanitization)
- [MODIFY] `src/app/generate/v2/page.js` (Refactor modal implementation to use the new reusable components)

**Details:**
1. **Reusable `Modal.jsx` Component:**
   - Accepts `isOpen`, `onClose`, `title`, `children`, `footer`, `maxWidth`, `zIndex`, and `closeOnBackdrop`.
   - Intercepts browser/mobile physical **Back Button**: pushes a state entry to `window.history` when opened, listens for `popstate` event to close the modal smoothly without navigating away from `/generate/v2`.
   - Key listener for `Escape` key.
2. **Security Input Sanitization (`sanitizeAIBriefInput`):**
   - Sanitizes text inputs by stripping `<script>`, `<iframe>`, `javascript:`, HTML tags, event handlers (`onload=`, `onerror=`), and dangerous characters.
   - Prevents XSS, prompt injection tags, and malicious payloads from polluting state or backend compiler calls.
3. **Reusable `BriefTextareaModal.jsx`:**
   - Wraps the Brief AI editor logic into a clean, standalone, reusable component that can be placed anywhere in the application.

---

## Total Expected Space Gain on Mobile
~62 + 82 + 40 = **~184px** more vertical space for the Section List.

## Files to Modify/Create
- `wuzzkang-dashboard/src/components/Modal.jsx` [NEW]
- `wuzzkang-dashboard/src/lib/security.js` [NEW]
- `wuzzkang-dashboard/src/components/BriefTextareaModal.jsx` [NEW]
- `wuzzkang-dashboard/src/app/generate/v2/page.js` [MODIFY]

## Files to Sync (Docs)
- `wuzzkang-engineering/docs/02_CURRENT_STATE.md`

## Verification Plan
1. Next.js lint check (`npx next lint`)
2. Hardware/Browser Back button test: opening modal pushes history state; pressing back closes modal while staying on `/generate/v2`
3. Input sanitization test: entering `<script>alert('xss')</script>` or `javascript:void(0)` gets safely stripped/neutralized
4. Component reusability test: verify `BriefTextareaModal` and `Modal` clean prop interface

## Risk
- Low. Fully backwards-compatible abstractions.

