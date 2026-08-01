# Implementation Plan — Initialize `wuzzkang-sections` Standalone Git Repository

Status: `Approved for Implementation`

## Overview
Transform `wuzzkang-sections` from a root-tracked subfolder into a standalone, independent Git repository ready for pushing to GitHub, matching the structure of `wuzzkang-api`, `wuzzkang-dashboard`, and `wuzzkang-lp`.

---

## Proposed Changes

### 1. Standalone Git Initialization in `wuzzkang-sections`
- Create `wuzzkang-sections/.gitignore` ignoring `node_modules/`, `dist/`, `.turbo/`, `coverage/`, `.env*`, etc.
- Run `git init -b main` inside `wuzzkang-sections/`.
- Stage all files in `wuzzkang-sections/` and create initial commit:
  `feat(init): initialize wuzzkang-sections standalone repository`

### 2. Monorepo Root Configuration
- Add `wuzzkang-sections/` to root `.gitignore`.
- Remove `wuzzkang-sections` from root Git index (`git rm -r --cached wuzzkang-sections`).
- Create commit in root repo documenting the transition of `wuzzkang-sections` to an ignored sub-repository.

### 3. Governance Rules & Audit Update (5-Repository Architecture)
- Update `.cursorrules` and `.clinerules` to change the mandatory multi-repo audit command from 4 repositories to 5 repositories:
  `for dir in . wuzzkang-dashboard wuzzkang-api wuzzkang-lp wuzzkang-sections; do echo "=== $dir ===" && (cd $dir && git status); done`
- Update all 10 specialized skills (`wuzzkang-code-reviewer`, `wuzzkang-implementation-protocol`, etc.) to enforce the 5-repository audit command.
- Dual-sync all updated skills to `~/.gemini/config/skills/`.

### 4. Technical Documentation Update
- Update `wuzzkang-engineering/docs/08_REPOSITORY_MAP.md` and `wuzzkang-engineering/docs/02_CURRENT_STATE.md` to list `wuzzkang-sections` as an active standalone sub-repository.

---

## Verification Plan

### Automated Verification
- Verify that `git status` inside `wuzzkang-sections` shows clean `main` branch.
- Verify 5-repository audit command succeeds across all 5 directories (`.`, `wuzzkang-dashboard`, `wuzzkang-api`, `wuzzkang-lp`, `wuzzkang-sections`).
- Verify 100% skill dual-sync via `diff`.

### Manual Verification
- Ask user to inspect `wuzzkang-sections` git history (`git log`) and root `git status`.
