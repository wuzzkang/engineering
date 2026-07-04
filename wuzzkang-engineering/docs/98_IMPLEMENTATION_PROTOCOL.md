# Implementation Protocol

---

## Document Information

| Field | Value |
|---|---|
| Version | 3.0.0 |
| Status | Released |
| Target | All Wuzzkang Repository Implementations |

---

## Versioning Rules

The version of this protocol must be incremented whenever implementation procedures, required artifacts, lifecycle stages, or operational rules are modified.

Versioning follows Semantic Versioning:

- MAJOR: incompatible workflow changes
- MINOR: new procedures or mandatory sections
- PATCH: wording improvements or clarifications

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

# 1. Implementation Workspace Structure

Every implementation task must use the standardized workspace located under:

`[workspace-root]/implementation/`

The implementation workspace is divided into two areas:

```
implementation/
│
├── active/
│   ├── AI_CONTEXT.md
│   ├── IMPLEMENTATION_SUMMARY.md
│   ├── IMPLEMENTATION_PLAN.md
│   ├── IMPLEMENTATION_PROGRESS.md
│   ├── DECISION_LOG.md
│   └── HANDOVER.md
│
└── archive/
    ├── YYYY-MM-DD-feature-name/
    ├── YYYY-MM-DD-feature-name/
    └── ...
```

## active/

Contains the implementation currently in progress.

Only ONE active implementation is allowed at any given time.

All implementation activities must operate exclusively inside this directory.

## archive/

Contains completed implementations.

Each completed implementation must be archived into its own timestamped directory.

Example:

```
archive/
├── 2026-07-04-ai-platform/
├── 2026-07-19-payment-engine/
└── 2026-08-01-template-engine/
```

Archived implementations must never be modified except for historical investigation or audit purposes.

---

# 2. File Lifecycles

### 2.1 `AI_CONTEXT.md`
*   **Creation:** Pre-existing/initialized at system startup.
*   **Update:** Updated at the beginning of a task by the AI to map specific file and environment targets.
*   **Purpose:** Quickly orients incoming developers or AI assistants with codebase boundaries.

### 2.2 `IMPLEMENTATION_SUMMARY.md`
* **Creation:** Created immediately after a new implementation workspace is initialized.
* **Update:** IMPLEMENTATION_SUMMARY.md must be updated after every completed milestone and after any major architectural decision.
* **Purpose:** Provides a concise snapshot of the implementation so another AI assistant or engineer can understand the current state within minutes without reading all implementation artifacts.

Typical contents include:

* Feature name
* Current status
* Current milestone
* Completed milestones
* Remaining milestones
* Key architectural decisions
* Modified files
* Known limitations
* Next recommended action

### 2.2.1 Recommended Structure

IMPLEMENTATION_SUMMARY.md should contain:

- Project
- Feature
- Status
- Current Milestone
- Progress
- Architecture Overview
- Major Decisions
- Modified Files
- Pending Work
- Known Issues
- Next Action
- Last Updated

### 2.3 `IMPLEMENTATION_PLAN.md`
*   **Creation:** Created during the **Research & Design** phase before any code is modified.
*   **Update:** Updated only when major structural/architectural changes are agreed upon. Requires user re-approval.
*   **Purpose:** Captures the target goals, proposed files to modify/create, and verification strategy.

### 2.4 `IMPLEMENTATION_PROGRESS.md`
*   **Creation:** Instantiated immediately after the implementation plan is approved.
*   **Update:** Updated continuously. Marked with status tags (`[ ]`, `[/]`, `[x]`) before starting a task and immediately after completing it.
*   **Purpose:** Keeps track of the immediate execution list.

### 2.5 `DECISION_LOG.md`
*   **Creation:** Instantiated during the initial design phase.
*   **Update:** Appended chronologically whenever a technical decision is made, an unexpected bug forces a change in design, or a workaround is introduced.
*   **Purpose:** Explains *why* the code was written in a certain way, preventing future refactor regression.

### 2.6 `HANDOVER.md`
*   **Creation:** Created when the first code task is completed.
*   **Update:** Populated with verification command outputs, manual tests, screenshots, and logs as tasks are verified.
*   **Purpose:** Serves as the technical proof of validation and handover criteria.

## 2.7 Archive Lifecycle

After an implementation is fully completed:

1. Verify that every milestone has been completed.
2. Verify that all engineering documentation has been synchronized.
3. Verify that HANDOVER.md contains final verification evidence.
4. Move the entire implementation workspace from:

```
implementation/active/
```

into

```
implementation/archive/YYYY-MM-DD-feature-name/
```

5. Reinitialize `implementation/active/` by creating a fresh set of tracking documents for the next implementation.

The new workspace must contain:

* AI_CONTEXT.md
* IMPLEMENTATION_SUMMARY.md
* IMPLEMENTATION_PLAN.md
* IMPLEMENTATION_PROGRESS.md
* DECISION_LOG.md
* HANDOVER.md

for the next implementation.

Implementation artifacts must never be deleted.

The archive serves as the permanent engineering history of the project.

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

## 3.1 Milestone Lifecycle

Every milestone must follow the complete lifecycle below.


Prepare
│
▼
Implement
│
▼
Self Review
│
▼
Automatic Remediation (if findings exist)
│
▼
Re-Review
│
▼
Documentation Synchronization
│
▼
Milestone Closure
│
▼
Next Milestone Planning
│
▼
WAIT FOR USER APPROVAL


Rules:

- No milestone may skip any stage.
- A milestone is not considered complete until all stages have been executed.
- AI must stop after "Next Milestone Planning" and wait for explicit user approval before implementing the next milestone.

## 3.2 Research Validation

Before creating IMPLEMENTATION_PLAN.md AI must:

- inspect current repository state
- inspect engineering documentation
- inspect related implementations
- inspect implementation/archive for similar completed implementations that can be reused.
- identify existing reusable components
- identify architectural constraints
- identify potential conflicts

AI must avoid proposing architecture that already exists inside the repository.

Research must always precede planning.

---

# 4. Rules Before Starting Any Task

1. **Scan for Context**
First inspect:
implementation/active/
If no active implementation exists, initialize a new implementation workspace.
If an active implementation exists, resume from IMPLEMENTATION_PROGRESS.md.
Archived implementations are read-only references and must not be modified.
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

## 6.1 Mandatory Self Review

Immediately after completing a milestone implementation, the AI must perform an internal architecture review.

The review must evaluate:

- Architecture compliance
- Clean Architecture
- SOLID principles
- Dependency correctness
- Security
- Performance
- Scalability
- Maintainability
- Code consistency
- Documentation consistency

All findings must be classified as:

- Critical
- Major
- Minor

The review must not introduce new features.

Its only purpose is to verify implementation quality.

## 6.2 Automatic Remediation

If the self review identifies findings:

Critical findings
- MUST be fixed immediately.

Major findings
- MUST be fixed immediately.

Minor findings
- SHOULD be fixed whenever possible.
- If intentionally deferred, the reason must be documented in DECISION_LOG.md.

After all fixes are applied:

- perform another self review.
- repeat until no Critical or Major findings remain.

Only then may the milestone proceed to completion.

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


## 8.1 Documentation Synchronization Checklist

Before closing any milestone, AI must verify whether implementation affects engineering documentation.

Potentially affected documents include:

- 02_CURRENT_STATE.md
- 03_ARCHITECTURE.md
- 04_DOMAIN_MODEL.md
- 05_API_SPECIFICATION.md
- 07_RENDER_ENGINE.md
- 08_REPOSITORY_MAP.md
- 09_DATABASE_ARCHITECTURE.md
- 10_AI_GUIDE.md
- 13_ROADMAP.md

or any other canonical documentation.

If changes are required:

- update the document immediately.

Documentation must never lag behind implementation.

---

# 9. Handover Procedure

When ending a session or passing work to another developer/AI, the handover package must be compiled. The handover response must contain:
1.  **Current Progress Status:** State exactly which tasks in `IMPLEMENTATION_PROGRESS.md` are completed vs pending.
2.  **Code Walkthrough:** Link directly to modified files and highlight structural changes.
3.  **Verification Proof:** Show outputs of unit tests or network console logs.
4.  **Next Steps:** Provide a clear directive on which task the next assistant should pick up first.

---

# 10. Recovery Procedure (Resuming Paused Work)

1. Scan implementation/active/.
2. If multiple active implementations are detected, AI must stop and ask the user to resolve the inconsistency before proceeding.
3. Ignore implementation/archive/ unless explicitly requested for historical reference.
4. Read IMPLEMENTATION_SUMMARY.md to obtain the current implementation state.
5. Resume from IMPLEMENTATION_PROGRESS.md.
6. Consult IMPLEMENTATION_PLAN.md,
DECISION_LOG.md,
and HANDOVER.md only when additional context is required.

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
*   [ ] Implementation directory has been archived under implementation/archive/.
*   [ ] Archive procedure has been completed successfully.
*   [ ] implementation/active has been reinitialized for the next implementation.


## 11.1 Milestone Completion Criteria

A milestone is officially complete only when all conditions below are satisfied.

Implementation
- All milestone tasks completed.

Verification
- Build successful.
- Tests successful.
- No Critical findings.
- No Major findings.

Documentation
- IMPLEMENTATION_PROGRESS.md updated.
- HANDOVER.md updated.
- DECISION_LOG.md updated (if applicable).
- Engineering documentation synchronized.

Planning
- Next milestone has been prepared.

Only after all conditions above are satisfied may the milestone be marked as Completed.


## 11.2 Next Milestone Planning

Immediately after closing a milestone, AI must prepare the next milestone.

Preparation includes:

- objective
- implementation strategy
- affected files
- dependencies
- risks
- acceptance criteria

This planning must be based on IMPLEMENTATION_PLAN.md.

After preparing the next milestone:

STOP.

Wait for explicit user approval.

AI must never automatically begin implementing the next milestone.

## 11.3 Implementation Closure

An implementation is officially closed only when:

- All Definition of Done items are satisfied.
- Archive procedure has been completed.
- implementation/active has been reinitialized.

---

# 12. AI Operational Rules

1.  **Do Not Bypass Procedures:** Never skip writing the `implementation_plan.md` or updating `task.md` to save time. Short-cuts lead to disjointed state histories.
2.  **Lint Check Invariant:** Every file replacement must be immediately verified. If compilation fails, roll back or resolve before starting other code changes.
3.  **Communication Casing:** Use **Bahasa Indonesia** for conversational interaction with the user, but keep all technical documentation, code comments, and handover specs in **English**.
4. AI must autonomously execute the complete Milestone Lifecycle defined in Section 3.1 without requiring additional user prompts between stages.
5. AI must never consider a milestone finished immediately after coding. Review, remediation, documentation synchronization, and next milestone planning are mandatory.
6. AI must stop only after completing the planning phase of the next milestone and wait for explicit user approval.

7. Before starting any implementation, AI must always check whether an active implementation already exists.
8. If one exists, AI must resume it instead of creating a new implementation.
9. AI must never overwrite an archived implementation.
10. Archived implementations are immutable historical records.
11. When starting a brand new implementation, AI must initialize the active implementation workspace by creating all required tracking documents inside:

implementation/active/

including:
- AI_CONTEXT.md
- IMPLEMENTATION_SUMMARY.md
- IMPLEMENTATION_PLAN.md
- IMPLEMENTATION_PROGRESS.md
- DECISION_LOG.md
- HANDOVER.md
12. AI must never modify IMPLEMENTATION_PLAN.md after implementation has started unless the user explicitly approves an architectural change.

Architectural changes require:
- updating IMPLEMENTATION_PLAN.md
- updating DECISION_LOG.md
- obtaining user approval before implementation continues.

13. AI must never rely on conversation history as the primary source of implementation context.

Implementation artifacts always take precedence over conversation history.

# 13. Implementation Continuity Guarantee

One of the primary objectives of this protocol is guaranteeing implementation continuity across different AI models, different AI vendors, different user accounts, and different engineering sessions.

Therefore every implementation must be self-contained.

A new AI assistant with no previous conversation history must be able to continue the implementation by reading only:

- implementation/active/
- engineering documentation
- current repository state

No implementation may depend on hidden conversation history.

All architectural decisions, implementation progress, deviations, verification evidence, and future plans must exist as project artifacts.

Conversation history is considered temporary.

Implementation artifacts are considered the permanent source of truth.

# 14. AI Authority Boundary
AI may autonomously make implementation decisions only when they do not alter the approved architecture.

The following changes always require explicit user approval:

- Architecture changes
- Database schema redesign
- Public API breaking changes
- Security model changes
- Authentication changes
- Technology stack replacement
- Major dependency additions
- Changes affecting project scope

If uncertainty exists, AI must stop and ask for clarification instead of making assumptions.