# Implementation Protocol

---

## Document Information

| Field | Value |
|---|---|
| Version | 1.0.0 |
| Status | Released |
| Target | All Wuzzkang Repository Implementations |

---

# Purpose

This document defines the official standard operating procedure (SOP) for executing, tracking, and handing over technical implementations within the Wuzzkang monorepo. 

Its objective is to ensure that any AI assistant or human engineer can pick up, pause, or resume any implementation task at any moment without loss of context, architectural deviation, or synchronization gaps between source code and documentation.

---

# Scope

This protocol applies to all feature implementations, refactoring tasks, bug fixes, and system migrations across all repositories within the Wuzzkang workspace.

---

# Guiding Principles

1.  **Transparency:** Every step of the implementation must be visible, structured, and auditable.
2.  **Continuity:** An implementation must be structured so that Engineer A can stop at any line of code, and Engineer B (or AI B) can resume immediately with zero friction.
3.  **Documentation Invariant:** Code changes and technical documentation must remain synchronized at all times. No commit or handover is valid if the corresponding documents are stale.
4.  **No Assumption:** Any ambiguity or missing requirement must be raised for user clarification before code is written.

---

# 1. Required Files

Every implementation task must maintain a dedicated workspace directory under:
`[workspace-root]/implementation/`

This directory acts as the single source of truth for the task's progress. The following files are mandatory:

```
implementation/
├── AI_CONTEXT.md             # High-level system context and workspace pointers
├── IMPLEMENTATION_PLAN.md    # The approved architectural & technical design blueprint
├── IMPLEMENTATION_PROGRESS.md # The living progress checklist of components and tasks
├── DECISION_LOG.md           # Immutable ledger of all design decisions and deviations
└── HANDOVER.md               # Verification results, manual validation records, and final summary
```

---

# 2. File Lifecycles

### 2.1 `AI_CONTEXT.md`
*   **Creation:** Pre-existing/initialized at system startup.
*   **Update:** Updated at the beginning of a task by the AI to map specific file and environment targets.
*   **Purpose:** Quickly orients incoming developers or AI assistants with codebase boundaries.

### 2.2 `IMPLEMENTATION_PLAN.md`
*   **Creation:** Created during the **Research & Design** phase before any code is modified.
*   **Update:** Updated only when major structural/architectural changes are agreed upon. Requires user re-approval.
*   **Purpose:** Captures the target goals, proposed files to modify/create, and verification strategy.

### 2.3 `IMPLEMENTATION_PROGRESS.md`
*   **Creation:** Instantiated immediately after the implementation plan is approved.
*   **Update:** Updated continuously. Marked with status tags (`[ ]`, `[/]`, `[x]`) before starting a task and immediately after completing it.
*   **Purpose:** Keeps track of the immediate execution list.

### 2.4 `DECISION_LOG.md`
*   **Creation:** Instantiated during the initial design phase.
*   **Update:** Appended chronologically whenever a technical decision is made, an unexpected bug forces a change in design, or a workaround is introduced.
*   **Purpose:** Explains *why* the code was written in a certain way, preventing future refactor regression.

### 2.5 `HANDOVER.md`
*   **Creation:** Created when the first code task is completed.
*   **Update:** Populated with verification command outputs, manual tests, screenshots, and logs as tasks are verified.
*   **Purpose:** Serves as the technical proof of validation and handover criteria.

---

# 3. Implementation Lifecycle

The execution of any task must follow the systematic lifecycle stages below:

```
[ Phase 1: Research & Plan ]
            │
            ▼
[ Phase 2: User Approval ]
            │
            ▼
[ Phase 3: Task Checklist Initialization ]
            │
            ▼
[ Phase 4: Incremental Code & Test Cycles ]
            │
            ▼
[ Phase 5: Documentation Synchronization ]
            │
            ▼
[ Phase 6: Handover Verification ]
```

---

# 4. Rules Before Starting Any Task

1.  **Scan for Context:** Read `docs/02_CURRENT_STATE.md` and check the `implementation/` directory for any pre-existing plans.
2.  **Validate Dependencies:** Verify that all referenced database schemas, environment keys, and utility dependencies are active in the target code repositories.
3.  **Confirm Approval:** Verify that `IMPLEMENTATION_PLAN.md` has its status marked as `Approved for Implementation`. Do not edit code if the plan is in `Draft` or `Awaiting Review`.
4.  **Initialize Checklist:** Ensure `IMPLEMENTATION_PROGRESS.md` exists and matches the plan's milestones exactly.

---

# 5. Rules During Implementation

1.  **Atomic Task Execution:** Work on exactly one item from `IMPLEMENTATION_PROGRESS.md` at a time. Mark the active item as `[/] In Progress`.
2.  **Incremental Linting:** Run build/lint commands (`npm run build`, `npm run dev`) frequently to verify syntax. Do not write hundreds of lines of code without validating intermediate builds.
3.  **Document Decisions immediately:** If you hit an API bottleneck or schema limitation that forces a deviation from the plan, pause, add an entry to `DECISION_LOG.md`, and explain the rationale.
4.  **No Placeholders:** Never commit or write mock codes, `TODO` comments, or blank methods unless explicitly designed as a mock provider.

---

# 6. Rules After Completing a Task

1.  **Mark Completion:** Update the completed item in `IMPLEMENTATION_PROGRESS.md` to `[x] Completed`.
2.  **Run Tests:** Execute automated unit tests or local execution routes.
3.  **Update Walkthrough:** Append the test outputs, execution duration, or manual verification steps directly to `HANDOVER.md`.
4.  **Commit / Save Progress:** Save the files. If in a git environment, commit with clear descriptions.

---

# 7. Decision Logging Protocol

Every entry in `DECISION_LOG.md` must follow this chronological template:

```markdown
### DEC-[ID]: [Title of Decision]
*   **Date:** [ISO Timestamp]
*   **Context:** [Why was this decision necessary? Describe the unexpected problem/bottleneck]
*   **Options Considered:** 
    *   *Option A:* [Description, Pros, Cons]
    *   *Option B:* [Description, Pros, Cons]
*   **Decision:** [Selected option and reasons]
*   **Impact:** [List of files and components affected by this change]
```

---

# 8. Documentation Synchronization Rules

As changes are introduced, technical specifications must remain updated. Before completing the session, the AI or engineer must verify and update the following canonical files:

*   **API Adjustments:** Any route, request payload Zod schema, or response changes must be logged in `docs/05_API_SPECIFICATION.md`.
*   **Database Alterations:** Any table additions, column type updates, or RLS policies must be logged in `docs/09_DATABASE_ARCHITECTURE.md`.
*   **Render Engine / Template adjustments:** Any theme keys, assets, or frontend schema modifications must be logged in `docs/07_RENDER_ENGINE.md`.
*   **Tech Debt & Status:** Current implementation milestones and resolved bugs must be added to `docs/02_CURRENT_STATE.md`.

---

# 9. Handover Procedure

When ending a session or passing work to another developer/AI, the handover package must be compiled. The handover response must contain:
1.  **Current Progress Status:** State exactly which tasks in `IMPLEMENTATION_PROGRESS.md` are completed vs pending.
2.  **Code Walkthrough:** Link directly to modified files and highlight structural changes.
3.  **Verification Proof:** Show outputs of unit tests or network console logs.
4.  **Next Steps:** Provide a clear directive on which task the next assistant should pick up first.

---

# 10. Recovery Procedure (Resuming Paused Work)

When an AI assistant starts a new session on an ongoing task:
1.  **Locate Implementation Files:** Check `[workspace-root]/implementation/` for tracking files.
2.  **Verify Active Task:** Read `IMPLEMENTATION_PROGRESS.md` to find items tagged with `[/] In Progress` or the first `[ ] Pending` item.
3.  **Audit Workspace Code:** Run `git status` or inspect recent file timestamps to ensure local changes match the recorded task list.
4.  **Synchronize State:** If discrepancy exists (e.g. code is written but task is marked pending), update `IMPLEMENTATION_PROGRESS.md` and `DECISION_LOG.md` to match reality before proceeding.

---

# 11. Definition of Done (DoD)

A task is officially complete and "Done" only when:
*   [ ] All implementation steps in `IMPLEMENTATION_PROGRESS.md` are marked `[x] Completed`.
*   [ ] Code builds successfully without compiler warnings, syntax errors, or console failures.
*   [ ] Zod schemas validate all boundary incoming payloads.
*   [ ] All modified/new SQL files are verified as executed against the target database.
*   [ ] `HANDOVER.md` lists concrete execution logs and test outputs.
*   [ ] All related documentation files in `docs/` are updated and in-sync with the code.
*   [ ] No leftover debug logs (`console.log`), unused imports, or placeholder comments remain.

---

# 12. AI Operational Rules

1.  **Do Not Bypass Procedures:** Never skip writing the `implementation_plan.md` or updating `task.md` to save time. Short-cuts lead to disjointed state histories.
2.  **Lint Check Invariant:** Every file replacement must be immediately verified. If compilation fails, roll back or resolve before starting other code changes.
3.  **Communication Casing:** Use **Bahasa Indonesia** for conversational interaction with the user, but keep all technical documentation, code comments, and handover specs in **English**.
