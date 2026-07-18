# Implementation Plan — Jasa Landing Page Product

## Goal
Add the new "Jasa" (Service) landing page product type to the Wuzzkang platform, matching references from `https://template.pegxy.com/template/jasa-landing-page/`.
Key requirements:
1. Product price set to 100 credits.
2. Supports AI-assisted copywriting (field-per-field prompt generation).
3. About section supports exactly 1 photo (Unsplash or custom upload).
4. Full integration across `wuzzkang-lp`, `wuzzkang-api`, and `wuzzkang-dashboard`.

## Proposed Changes

### Component 1: `wuzzkang-lp`
- **New Template**: Create `templates/jasa/professional-navy.js` with 13 key sections.
- **Routing**: Update `script.js` to route `templateType === 'jasa'` to import and render `professional-navy.js`.
- **Version**: Bump version to `1.2.3`.

### Component 2: `wuzzkang-api`
- **Schema**: Add `JasaPageSchema` defining brand, hero, services, pricing, about, deliverables, testimonials, why_us, how_it_works, guarantee, faqs, contact, and closing_cta fields. Add JasaPageSchema to master `PageSchema` union.
- **Generator Route**: Accept `jasa_details` in `GenerateRequestSchema`, and field types in `GenerateFieldRequestSchema`.
- **AI Service**: Implement field-by-field prompts and custom prompt assembly for all 9 jasa fields.
- **Database Migration**: Create Supabase migration file `20260718000000_add_jasa_product.sql` to insert Jasa product details (100 credits, unit: 'Project').

### Component 3: `wuzzkang-dashboard`
- **Form UI**: Implement all 13 sections in `generate/page.js` when `templateType === 'jasa'`.
- **Form States**: Add hooks for Jasa-specific inputs, including brand details, hero settings, about description, services list, testimonials, FAQs, and closing CTA values.
- **AI Assist integration**: Bind `handleAIJasaAssist()` function to trigger copywriting assistant per field.
- **Preview Sandbox**: Support Jasa template loading in `/preview/index.html` and mock preview data.

## Verification
- Run compiler unit tests to verify prompt and model configurations.
- Verify product pricing and info from Supabase database.
- Execute frontend template synchronization script.
