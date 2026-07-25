# Implementation Plan — SOP Enforcement: Pre-flight Checklist & Zero-Exception Rule

## Status: Approved for Implementation

## Objective
Memperkuat enforcement SOP `implementation/active/` agar AI tidak bisa membuat justifikasi pengecualian berdasarkan "kompleksitas task". Perbaikan dilakukan di dua file: `.cursorrules` dan `docs/98_IMPLEMENTATION_PROTOCOL.md`.

## Affected Files
- `[MODIFY] .cursorrules` — Tambah MANDATORY PRE-FLIGHT CHECKLIST section
- `[MODIFY] wuzzkang-engineering/docs/98_IMPLEMENTATION_PROTOCOL.md` — Tambah Zero-Exception Rule (rule #15) & pertegas urutan "BEFORE writing any code" di rule #11

## Milestones
- [ ] M1: Update .cursorrules — tambah pre-flight checklist
- [ ] M2: Update 98_IMPLEMENTATION_PROTOCOL.md — Zero-Exception Rule + klarifikasi rule #11
- [ ] M3: Verifikasi & dokumentasi sync
