# Decision Log — Mobile Horizontal Scroll Fix (< 460px)

### DEC-001: Fix Strategy for Horizontal Scroll on Mobile < 460px
* **Date:** 2026-07-26
* **Context:** On mobile viewports < 460px, a horizontal scrollbar appears. Viewport at 459px shows overflow but 460px and above is fine.
* **Root Cause Identified:**
  1. `globals.css` — html/body missing `overflow-x: hidden`.
  2. `page.js` line 600 — search input wrapper has `min-w-[240px]` which forces minimum width even on narrow screens.
* **Decision:** Add `overflow-x: hidden` to `html` and `body` in globals.css. Change `min-w-[240px]` to `w-full` on the search wrapper in page.js so it shrinks properly on narrow screens.

### DEC-002: Regression Fix — overflow-x: clip replaces overflow-x: hidden
* **Date:** 2026-07-26
* **Context:** After DEC-001, a new horizontal scroll appeared at viewport >= 529px. Root cause: `overflow-x: hidden` on `body` causes `body` to become a new BFC (Block Formatting Context) and scroll container. This changes how `position: fixed` elements (Sidebar drawer, bottom nav bar) compute their containing block — at certain viewport widths, fixed elements inside the `overflow: hidden` body are positioned relative to body layout rather than the viewport, creating a layout shift that causes overflow.
* **Decision:** Replace `overflow-x: hidden` with `overflow-x: clip` on `html` only, and remove `overflow-x` from `body`. `overflow-x: clip` clips overflow visually WITHOUT creating a new BFC or scroll container, preserving correct behavior for `position: fixed` and `position: sticky` elements at all viewport widths.

