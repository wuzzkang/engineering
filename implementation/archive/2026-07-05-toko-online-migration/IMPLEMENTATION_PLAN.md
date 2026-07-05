# Implementation Plan: Toko Online Migration to AI Platform

## Status: Approved for Implementation

This plan outlines the migration of the "Toko Online" template generation from the legacy synchronous route (`ai.service.js`) to the new asynchronous AI Platform (`AIOrchestrationService` + BullMQ + `GeminiProvider`).

## Proposed Changes

### Backend (`wuzzkang-api`)
- **Create** `TokoOnlineTaskCompiler.js` in `src/services/ai-platform/compilers/` extending `TaskCompiler`.
- **Modify** `register.js` in `src/services/ai-platform/` to register the new compiler under `'toko-online'`.

### Frontend (`wuzzkang-dashboard`)
- **Modify** `wuzzkang-dashboard/src/app/generate/page.js` to route `'toko-online'` requests via the asynchronous queue, parse the resulting JSON from Supabase storage, update local React states, and update preview iframe.

## Verification Plan
- Extend `test-milestone4.js` to assert `toko-online` compiler registration and compile capabilities.
- Verify dashboard code builds without compilation errors.
