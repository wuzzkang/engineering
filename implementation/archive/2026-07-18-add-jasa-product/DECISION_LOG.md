# Decision Log — Jasa Landing Page

## Decision 1: Theme & Visual Style
- **Choice**: Navy background with high-contrast Orange accents (`professional-navy`).
- **Rationale**: Matches the reference landing page styling while maintaining professional, high-conversion visual design.

## Decision 2: Product Pricing & Cost Units
- **Choice**: 100 credits per Project.
- **Rationale**: Aligning with the converted credit billing system (1 credit = 100 IDR), setting a reasonable entry-level price for landing pages.

## Decision 3: AI Field-level Assist Queue
- **Choice**: Handled synchronously/asynchronously via `POST /generate/field` using `textWorker.js`.
- **Rationale**: Leverages the lightweight textWorker queue which handles quick prompt responses for individual section fields.

## Decision 4: Registry-based JasaTaskCompiler Integration
- **Choice**: Register `JasaTaskCompiler` in `TaskCompilerRegistry` under key `jasa`.
- **Rationale**: Keeps the core AI platform orchestrator fully compliant with all template types to prevent database/worker failures if full-page jobs are issued.
