# Decision Log - Birthday Template AI Migration

### DEC-1: Map AI Output to Quote
*   **Date:** 2026-07-05T15:00:00+07:00
*   **Context:** Birthday template schema and renderer only contain a single `quote` string field for AI wishes/quotes. The compiler is requested to output `banner_tagline`, `invitation_intro`, and `closing_message` JSON. We must map this output to prevent schema validation failures.
*   **Options Considered:** 
    *   *Option A:* Extend `BirthdayPageSchema` with those new fields. Cons: requires updating all birthday templates in `wuzzkang-lp` and the sync mechanism, causing high risk.
    *   *Option B:* Map `aiConfig.invitation_intro` directly to the `quote` field, while storing the additional generated fields (`banner_tagline`, `closing_message`) under content as optional fields. Pros: 100% backward-compatible, works out of the box with existing template files without any rendering changes.
*   **Decision:** Option B
*   **Impact:** Zero modifications needed for `BirthdayPageSchema` or template renderers.
