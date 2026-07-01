# 91_REVIEW_CHECKLIST.md

# Wuzzkang Documentation Review Checklist

---

# Document Information

| Field | Value |
|---|---|
| Document | 91_REVIEW_CHECKLIST.md |
| Version | 1.0.0 |
| Status | Approved |
| Purpose | Documentation Quality Assurance Checklist |

---

# Purpose

This document defines the mandatory review checklist that every technical document must pass before it is considered complete.

The objective is to guarantee that every specification:

- is technically correct,
- is internally consistent,
- has no contradictions,
- clearly defines its responsibility,
- and can be safely used as the single source of truth.

This checklist applies to every engineering specification inside the Wuzzkang documentation.

---

# Review Stages

Every document must pass the following review stages.

```
Structure Review
        ↓
Content Review
        ↓
Consistency Review
        ↓
Technical Verification
        ↓
Final QA
        ↓
Release
```

No stage should be skipped.

---

# Stage 1 — Structure Review

Objective:

Verify that the document architecture is complete before any content is written.

---

## Checklist

### Purpose exists

- [ ] Purpose is clearly defined.
- [ ] Responsibility of this document is obvious.

---

### Scope exists

- [ ] Scope explains what the document contains.
- [ ] Scope is specific.

---

### Out of Scope exists

- [ ] Out of Scope is explicit.
- [ ] No overlap with other documents.

---

### Sections are complete

- [ ] All required sections exist.
- [ ] Section ordering is logical.
- [ ] No duplicated sections.
- [ ] No missing topics.

---

### Related documents

- [ ] Related documents are referenced.

---

# Stage 2 — Content Review

Objective:

Verify that the document content is technically correct.

---

## Checklist

### Technical correctness

- [ ] Statements are factually correct.
- [ ] No assumptions presented as facts.
- [ ] No speculative implementation mixed with verified implementation.

---

### Completeness

- [ ] Every section is populated.
- [ ] No placeholder text.
- [ ] No TODO.
- [ ] No "coming soon".

---

### Consistency

- [ ] Terminology is consistent.
- [ ] Naming conventions are consistent.
- [ ] Style is consistent.

---

### Clarity

- [ ] Content is concise.
- [ ] Easy to understand.
- [ ] No ambiguous wording.

---

# Stage 3 — Cross Document Consistency Review

Objective:

Ensure this document is consistent with all other specifications.

---

## Checklist

### Architecture

- [ ] Consistent with Architecture document.

---

### Domain

- [ ] Consistent with Domain Model.

---

### Database

- [ ] Consistent with Database Architecture.

---

### API

- [ ] Consistent with API Specification.

---

### Security

- [ ] Consistent with Security documentation.

---

### Deployment

- [ ] Consistent with Deployment documentation.

---

# Stage 4 — Naming Review

Objective:

Verify terminology consistency.

---

## Checklist

### Entity names

- [ ] Same entity uses same name everywhere.

Example:

Correct

```
CouponRedemption
```

Wrong

```
CouponUsage
CouponRedeemed
Coupon History
```

unless explicitly documented as:

```
Logical Name

↓

Physical Table
```

---

### API naming

- [ ] Endpoint naming consistent.
- [ ] Resource naming consistent.
- [ ] Payload naming consistent.

---

### Database naming

- [ ] snake_case
- [ ] plural table names
- [ ] UUID conventions
- [ ] timestamp conventions

---

# Stage 5 — Architecture Review

Objective:

Verify architectural correctness.

---

## Checklist

### Layer responsibility

- [ ] Domain logic is not mixed into infrastructure.
- [ ] Database details are not mixed into Domain.
- [ ] API implementation is not mixed into API Specification.

---

### Separation of concerns

- [ ] Logical Architecture
- [ ] Physical Architecture
- [ ] Runtime Behavior

are documented separately.

---

### Single Source of Truth

- [ ] Information exists in only one document.

---

# Stage 6 — Diagram Review

If diagrams exist.

---

## Checklist

- [ ] Diagram matches text.
- [ ] Diagram matches implementation.
- [ ] Diagram uses consistent naming.
- [ ] Diagram is readable.
- [ ] Diagram is not outdated.

---

# Stage 7 — Examples Review

If examples exist.

---

## Checklist

Examples are:

- [ ] realistic
- [ ] executable
- [ ] technically valid
- [ ] consistent with specification

---

# Stage 8 — Implementation Verification

Objective:

Verify against actual implementation.

---

## Checklist

### Database

- [ ] Verified against migrations.
- [ ] Verified against schema.
- [ ] Verified against SQL.

---

### Backend

- [ ] Verified against services.
- [ ] Verified against controllers.
- [ ] Verified against middleware.

---

### Frontend

- [ ] Verified against actual UI.

---

### Infrastructure

- [ ] Verified against deployment configuration.

---

# Stage 9 — Quality Review

Objective:

Evaluate overall document quality.

---

## Readability

- [ ] Easy to navigate.
- [ ] Consistent formatting.
- [ ] Consistent headings.

---

## Maintainability

- [ ] Easy to update.
- [ ] No duplicated explanations.

---

## Accuracy

- [ ] No outdated information.
- [ ] No obsolete implementation.
- [ ] No dead features documented as active.

---

# Stage 10 — Final QA

Before release verify:

---

## Critical Issues

- [ ] No Critical findings.

---

## Major Issues

- [ ] No Major findings.

---

## Minor Issues

- [ ] Minor findings reviewed.
- [ ] Minor findings accepted or fixed.

---

## Overall Status

Choose one.

```
Draft
```

or

```
In Review
```

or

```
Approved
```

or

```
Released
```

---

# Severity Classification

## Critical

Examples:

- Wrong architecture
- Wrong API contract
- Wrong database schema
- Contradictory documentation
- Missing core section

Must be fixed before release.

---

## Major

Examples:

- Missing explanations
- Incorrect references
- Incomplete section
- Incorrect diagrams
- Missing relationships

Should be fixed before release.

---

## Minor

Examples:

- Formatting
- Terminology alignment
- Readability improvements
- Additional examples

Can be postponed if approved.

---

# Recommended AI Review Prompt

For every review, use the following prompt:

> Review this document as a Principal Software Architect.
>
> Evaluate:
>
> 1. Structural completeness
> 2. Technical correctness
> 3. Internal consistency
> 4. Cross-document consistency
> 5. Naming consistency
> 6. Missing sections
> 7. Incorrect statements
> 8. Contradictions
> 9. Architectural violations
> 10. Readiness for release
>
> Classify every finding as:
>
> - Critical
> - Major
> - Minor
>
> Do not rewrite the document.
> Produce only the review report.

---

# Exit Criteria

A document is considered complete only if:

- Structure Approved
- All sections populated
- Technical verification completed
- Cross-document consistency verified
- No Critical findings
- No Major findings
- Final QA passed
- Status updated to **Approved**