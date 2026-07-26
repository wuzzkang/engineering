# Decision Log — V2 Top Up & Fee Schedule Redesign

### DEC-001: Transition from Per-Template Product Pricing to Ecosystem Fee Schedule in V2
* **Date**: 2026-07-26
* **Context**: System shifted from static V1 per-template products (`undangan-pernikahan`, `toko-online`, etc.) to V2 Unified Modular Section Builder. Displaying per-template product prices in `/topup` creates redundancy and confusion.
* **Options Considered**:
  - *Option A*: Maintain per-template products list dynamically fetched from `products` DB table. (Cons: Redundant, out of sync with V2 section builder model).
  - *Option B*: Unified Ecosystem Fee Schedule — Display single unified Landing Page publication fee + detailed ecosystem costs (AI drafting, Subdomains, Edit limit, Hosting). (Pros: Clear, modern, 100% aligned with V2 architecture).
* **Decision**: Option B selected.
* **Impact**: `wuzzkang-dashboard/src/app/topup/page.js`
