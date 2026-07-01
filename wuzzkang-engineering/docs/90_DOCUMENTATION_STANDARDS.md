# Documentation Standards

---

## Document Information

| Field | Value |
|---|---|
| Version | 1.0.0 |
| Status | Released |
| Target | All Wuzzkang Technical Documentation |

---

# Purpose

This document defines the official writing, formatting, organization, and maintenance standards for every technical document within the Wuzzkang Engineering repository.

Its objective is to ensure every document is:

- Consistent
- Predictable
- Easy to review
- Easy to maintain
- Easy to navigate
- Suitable for long-term engineering documentation

These standards apply to documentation written by both engineers and AI assistants.

---

# Out of Scope

This document does not define:

- Software architecture
- Domain models
- Database design
- API specifications
- Coding conventions

Those topics belong to their respective technical specifications.

---

# Part 1 — General Principles

Every technical document must satisfy the following principles.

## 1.1 Single Source of Truth

A concept should be documented only once.

Other documents should reference it instead of duplicating it.

---

## 1.2 Clear Scope

Every document must define:

- Purpose
- Scope
- Out of Scope

Readers should immediately understand what belongs inside the document and what does not.

---

## 1.3 Canonical Documentation

Every released document becomes the canonical engineering reference for its topic.

Engineers should not rely on scattered notes or chat histories.

---

## 1.4 Engineering First

Documentation exists for engineers.

Always prioritize:

- clarity
- correctness
- maintainability

over marketing or narrative writing.

---

# Part 2 — Document Structure Standard

Every document should begin with the following sections.

```
Document Information

Purpose

Out of Scope
```

After that, organize content into numbered Parts.

Example:

```
Part 1

Part 2

Part 3
```

Avoid long documents without hierarchy.

---

# Part 3 — Heading Hierarchy

Use a consistent heading structure.

```
#

##

###

####
```

Recommended usage:

```
#

Document Title

##

Part

###

Section

####

Subsection
```

Avoid skipping heading levels.

---

# Part 4 — Naming Conventions

## Document Names

Use uppercase snake case.

Example:

```
03_ARCHITECTURE.md

04_DOMAIN_MODEL.md

05_API_SPECIFICATION.md

09_DATABASE_ARCHITECTURE.md
```

---

## Internal Headings

Use Title Case.

Correct:

```
Database Ownership

Physical Table Specifications

API Versioning Strategy
```

Avoid:

```
database ownership

DATABASE OWNERSHIP
```

---

## Table Names

Use plural nouns.

Example:

```
profiles

projects

transactions

products
```

---

## Entity Names

Use singular nouns.

Example:

```
Project

Transaction

Coupon

Profile
```

---

# Part 5 — Writing Style

Documentation should be:

- precise
- objective
- technical
- concise

Avoid:

- storytelling
- opinions
- unnecessary explanations
- marketing language

Incorrect:

```
This awesome feature dramatically improves the system.
```

Correct:

```
This feature reduces redundant database queries.
```

---

# Part 6 — Scope Definition

Every major Part should include:

Purpose

Scope

Out of Scope

Example:

```
Purpose

Explain database ownership.

Scope

Database roles
Permissions
Service role

Out of Scope

API Authentication
Frontend Authorization
```

---

# Part 7 — Tables

Prefer tables when presenting structured information.

Example:

| Field | Description |
|------|-------------|
| id | Primary Key |
| created_at | Creation timestamp |

Avoid long bullet lists when a table communicates better.

---

# Part 8 — Lists

Use bullet lists for:

- responsibilities
- requirements
- assumptions

Use numbered lists only when order matters.

---

# Part 9 — Code Blocks

Always specify language.

Example:

````text
```sql
SELECT * FROM profiles;
```
`````

Supported examples:

```
sql

typescript

javascript

json

bash

yaml

mermaid
```

---

# Part 10 — Diagrams

Prefer Mermaid diagrams.

Supported diagrams include:

* Flowcharts
* Sequence diagrams
* ER diagrams
* State diagrams
* Dependency graphs

Large diagrams should be isolated into dedicated sections.

---

# Part 11 — Cross References

Reference related documents instead of duplicating information.

Example:

```
See:

03_ARCHITECTURE.md

04_DOMAIN_MODEL.md

09_DATABASE_ARCHITECTURE.md
```

Avoid copying content across documents.

---

# Part 12 — Terminology Standards

Use consistent terminology.

Example:

| Preferred        | Avoid                        |
| ---------------- | ---------------------------- |
| Project          | Website                      |
| Transaction      | Payment Record               |
| CouponRedemption | Coupon Usage (logical model) |
| Profile          | User Data                    |

Physical database names may differ.

When necessary, explicitly map:

```
CouponRedemption

↓

coupon_usages
```

---

# Part 13 — Versioning

Each document should contain:

| Field   | Value    |
| ------- | -------- |
| Version | 1.0.0    |
| Status  | Released |

Recommended versions:

```
0.x

Draft

1.0.0

Released

1.x

Minor Updates

2.0.0

Major Revision
```

---

# Part 14 — Status Values

Recommended document statuses:

```
Draft

Structure Approved

Content Complete

Reviewed

Audited

Released

Deprecated
```

Only Released documents are considered canonical.

---

# Part 15 — Markdown Formatting

Rules:

Use ATX headings.

Correct:

```
#

##

###
```

Use blank lines between sections.

Avoid trailing spaces.

Prefer tables over manual alignment.

Keep line length readable.

---

# Part 16 — Diagrams & Images

Images should only be used when diagrams cannot adequately communicate the concept.

Preferred order:

1. Mermaid
2. Markdown tables
3. Images

---

# Part 17 — Examples

Examples should represent real Wuzzkang implementations.

Avoid fictional examples unless necessary.

Prefer:

```
profiles

projects

transactions
```

instead of:

```
users

orders

products
```

when documenting Wuzzkang internals.

---

# Part 18 — Consistency Rules

Every document should maintain consistency in:

* terminology
* heading style
* numbering
* capitalization
* formatting
* cross references

The same concept should always be described the same way.

---

# Part 19 — AI Writing Standards

When documentation is generated using AI:

* AI must follow approved structure.
* AI must not invent implementation details.
* AI must distinguish verified facts from recommendations.
* AI must reference existing documents before introducing new concepts.
* AI should generate large documents incrementally.
* Every generated batch must be reviewed before continuing.

Human review remains mandatory before release.

---

# Part 20 — Completion Criteria

A document is considered complete when:

* Structure approved
* All sections populated
* No placeholder sections
* No TODO items
* Formatting validated
* Cross references verified
* Review completed
* Technical audit completed
* Status updated to Released

---

# Related Documents

* `99_DOCUMENTATION_WORKFLOW.md`
* `91_REVIEW_CHECKLIST.md`
* `92_AI_PROMPT_LIBRARY.md`
* `00_FOUNDATION.md`
* `03_ARCHITECTURE.md`
* `04_DOMAIN_MODEL.md`
