# Decision Log — Multi-Version Route Isolation & Refactoring

### DEC-001: Explicit App Router Version Namespacing (`/generate/v1` & `/generate/v2`)
* **Date**: 2026-07-25
* **Context**: `wuzzkang-dashboard/src/app/generate/page.js` had grown to a monolithic 9,841 lines combining all V1 forms and V2 section builder UI. Maintaining this file incurred heavy cognitive load and risk of regression.
* **Options Considered**:
  * *Option A (Single file with dynamic imports)*: Keep one `page.js` and render `<V1Editor />` or `<V2Editor />` based on version state. (Con: Large single file remains, routing logic combined with UI).
  * *Option B (Explicit Next.js App Router folders `/generate/v1` and `/generate/v2`)*: Isolate V1 legacy forms in `/generate/v1/page.js` and V2 builder in `/generate/v2/page.js`, with an auto-redirect router at `/generate/page.js`.
* **Decision**: Selected Option B. Provides physical code-splitting, zero-interference between versions, easy future addition of V3 at `/generate/v3`, and easy deprecation of legacy V1.
* **Impact**:
  * Created `wuzzkang-dashboard/src/app/generate/v1/page.js`
  * Created `wuzzkang-dashboard/src/app/generate/v2/page.js`
  * Refactored `wuzzkang-dashboard/src/app/generate/page.js` to Auto-Redirect Router
