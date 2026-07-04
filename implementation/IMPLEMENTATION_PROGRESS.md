# [Template] Implementation Progress Checklist

This document tracks the active execution progress of the task. Follow these instructions:
*   Use `[ ]` for pending tasks.
*   Use `[/]` for the single task currently in progress. Never mark more than one task as active at the same time.
*   Use `[x]` for completed tasks.

---

## 1. Setup & Environment
- [ ] Parse context from `AI_CONTEXT.md` and check active configuration variables.
- [ ] Run diagnostic checks (e.g. verify Redis connection, database health).
- [ ] Pull and configure new NPM package dependencies.

## 2. Database & Storage Setup
- [ ] Write the target migration file under `supabase/migrations/`.
- [ ] Execute migration script against database target.
- [ ] Verify Row-Level Security (RLS) policies and table indexes.

## 3. Core Business Logic (Backend)
- [ ] Implement new abstraction interfaces, contracts, or DTO schemas.
- [ ] Add concrete plugin classes to registries.
- [ ] Write Zod request validation schemas.
- [ ] Implement API gateway routing handlers.
- [ ] Implement queue workers and recovery compensation handlers.

## 4. User Experience (Frontend/Dashboard)
- [ ] Build form components and state managers.
- [ ] Integrate API route hooks (polling services, fetch queries).
- [ ] Build loading indicators, error modals, and success views.

## 5. Verification & Testing
- [ ] Run unit testing suites.
- [ ] Execute manual verification scenarios.
- [ ] Validate ledger balance logic (verify credit deduction and refund paths).

## 6. Documentation Synchronization
- [ ] Update `docs/05_API_SPECIFICATION.md` with new/modified endpoint contracts.
- [ ] Update `docs/09_DATABASE_ARCHITECTURE.md` with database schema revisions.
- [ ] Update `docs/02_CURRENT_STATE.md` with backlog updates and resolved items.
- [ ] Generate final handover records in `HANDOVER.md`.
