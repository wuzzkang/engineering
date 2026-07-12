# Decision Log — Campaign FAQ Feature

### DEC-1: Design of the Reusable FAQ Component
*   **Date:** 2026-07-12T12:49:00+07:00
*   **Context:** The user requested an FAQ feature in the Campaign templates and asked to make it a reusable component so that other products can use it later.
*   **Options Considered:**
    *   *Option A:* Inline the FAQ HTML inside neon-conversion.js and clean-trust.js. Pros: simple to code first. Cons: duplicates code, doesn't meet the "reusable component" requirement.
    *   *Option B:* Create a module `wuzzkang-lp/templates/components/Faq.js` that exports a function `initFaq(containerEl, faqs, options)`. Pros: meet reusable requirement, encapsulates styling options, lets you easily reuse it across all templates.
*   **Decision:** Option B.
*   **Impact:** New file `wuzzkang-lp/templates/components/Faq.js`. Modifying campaign template files to load and initialize it.
