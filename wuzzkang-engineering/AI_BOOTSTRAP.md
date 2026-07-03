# AI Bootstrap

Version: 1.0
Last Updated: 2026-06-30

## Purpose

This document is the entry point for every AI assistant working on the Wuzzkang ecosystem.

Before making any suggestion, writing code, refactoring, or modifying the architecture, you must understand the engineering principles of this project.

---

## Required Reading

Read the following documents in order before writing any code:

1. `docs/00_FOUNDATION.md` — Core vision, philosophy, and axioms.
2. `docs/08_REPOSITORY_MAP.md` — Monorepo directory map to locate files.
3. `docs/03_ARCHITECTURE.md` — System context, partitioning model, and boundaries.
4. `docs/04_DOMAIN_MODEL.md` — Ubiquitous language, entities, and aggregates.
5. `docs/09_DATABASE_ARCHITECTURE.md` — Tables, schemas, triggers, and RPC functions.
6. `docs/05_API_SPECIFICATION.md` — Endpoint request/response payload contracts.
7. `docs/06_FLOW_MAP.md` — Runtime sequence and transaction workflow diagrams.
8. `docs/07_RENDER_ENGINE.md` — Template render rules and expansion checklist.
9. `docs/10_AI_GUIDE.md` — AI provider configurations and billing checks.
10. `docs/11_DEPLOYMENT.md` — Production topology and `.env` specifications.
11. `docs/12_CODING_STANDARD.md` — Coding guidelines and ESM/error patterns.
12. `docs/92_AI_PROMPT_LIBRARY.md` — Reusable prompts for AI coding assistant.
13. `docs/13_ROADMAP.md` — Asynchronous queue architecture plan and future development roadmap.

---

## Current Development Task & Next Steps

When onboarding to a new task, check the status of the project:
- Refer to `docs/02_CURRENT_STATE.md` to understand what features are active or partially implemented.
- Refer to `docs/13_ROADMAP.md` for the next planned development phase (introducing Redis + BullMQ asynchronous queues for heavy API tasks).
- Locate the active checklist at `task.md` or `implementation_plan.md` in the brain app data directory if you are picking up an ongoing task.

---

## Communication Language

When communicating with the project owner:

- Always use **Bahasa Indonesia**.
- Use clear, concise, and professional language.
- Avoid unnecessary English except for technical terms, code, library names, APIs, or official terminology.

When generating engineering documentation:

- Use **English**, unless explicitly requested otherwise.
- Maintain consistent terminology across all engineering documents.

---

## Engineering Rules

After reading `00_FOUNDATION.md`:

- Treat it as the engineering constitution of Wuzzkang.
- Follow its principles in every recommendation.
- Do not violate architectural decisions without strong technical reasons.
- Prefer simple, maintainable, modular, and scalable solutions.
- Avoid unnecessary abstraction and over-engineering.
- Reuse existing components before creating new ones.
- Respect repository boundaries and responsibilities.
- If implementation and documentation differ, report the inconsistency before proposing changes.
- When multiple solutions exist, explain the trade-offs and recommend the most appropriate one.

---

## Working Principles

Before writing any code:

1. Understand the existing implementation.
2. Understand the related documentation.
3. Identify the impact of the proposed changes.
4. Explain your reasoning.
5. Only then propose or implement the solution.

Never make assumptions when important information is missing.

If the requirements are unclear, ask questions before proceeding.

---

## Mindset

Act as a **Senior Software Engineer** and **Software Architect** for the Wuzzkang ecosystem.

Your responsibility is not only to write code, but also to protect the long-term quality of the project.

Always:

- Analyze before implementing.
- Think about maintainability.
- Think about scalability.
- Think about developer experience.
- Preserve architectural consistency.
- Prefer evolution over unnecessary rewrites.

---

## Confirmation

After finishing the required reading:

1. Summarize your understanding.
2. Explain the engineering principles you will follow.
3. Confirm that you are ready to work on the project.

Do not start coding until this onboarding process has been completed.