# WUZZKANG AUDIT

## Document Information

| Field | Value |
|------|------|
| Document | WUZZKANG_AUDIT.md |
| Version | 1.0 |
| Status | Active |
| Purpose | Record security issues, architecture issues, technical debt, and implementation findings discovered during engineering reviews |
| Audience | Engineers, Software Architects, AI Assistants |
| Last Updated | June 2026 |

---

# Purpose

This document records findings discovered during engineering reviews of the Wuzzkang codebase.

Unlike the engineering documentation, this document is intentionally opinionated.

Each finding includes:

- severity
- current status
- evidence
- impact
- recommendation

This document is a living audit and should be updated as the project evolves.

---

# Severity Levels

| Level | Meaning |
|---------|---------|
| Critical | Immediate security or data integrity risk |
| High | Major architectural or implementation issue |
| Medium | Should be improved to reduce long-term risk |
| Low | Minor issue or acceptable technical debt |

---

# Security Issues

---

## SEC-001

### Title

Payment Controller Uses `userId` From Request Body

### Severity

Critical

### Status

Open

### Evidence

```
src/controllers/payment.controller.js
```

### Description

The payment endpoint is protected by authentication, but the controller reads `userId` from `req.body` instead of the authenticated user (`req.user.id`).

An authenticated user could potentially create transactions on behalf of another user by modifying the request body.

### Recommendation

Always derive the user identity from the authenticated JWT.

Ignore any `userId` supplied by the client.

---

## SEC-002

### Title

Payment Controller Has No Request Validation

### Severity

High

### Status

Open

### Evidence

```
src/controllers/payment.controller.js
```

### Description

The controller only checks whether required fields exist.

No Zod schema or equivalent validation is applied.

Invalid types or malformed requests are accepted until runtime.

### Recommendation

Validate all incoming requests using Zod before entering business logic.

---

# Architecture Issues

---

## ARCH-001

### Title

Edit Limit Enforced Only in Application Layer

### Severity

Medium

### Status

Open

### Evidence

```
project.service.js
```

### Description

The edit limit is enforced by service logic only.

The database does not guarantee this rule.

Future code paths may accidentally bypass the limitation.

### Recommendation

Consider enforcing critical business rules at the database level where appropriate.

---

## ARCH-002

### Title

Slug Uniqueness Relies on Application Retry Logic

### Severity

Medium

### Status

Open

### Evidence

```
project.service.js
```

### Description

Slug uniqueness is verified by querying first and inserting later.

This introduces a possible race condition under concurrent requests.

Migration `20260626000000_add_slug_and_public_policy.sql` was not fully reviewed, therefore the existence of a database UNIQUE constraint could not be verified.

### Recommendation

Ensure slug uniqueness is enforced by the database and handle duplicate key errors gracefully.

---

## ARCH-003

### Title

Redis Failure Is Not Detected During Startup

### Severity

Medium

### Status

Open

### Evidence

```
utils/redis.js
```

### Description

Redis is initialized lazily.

If Redis becomes unavailable, failures occur only when affected features are executed.

No startup health check exists.

### Recommendation

Add startup health checks and graceful degradation for Redis-dependent features.

---

# Implementation Issues

---

## IMP-001

### Title

LP Version Requires Manual Increment

### Severity

Low

### Status

Open

### Evidence

```
wuzzkang-lp/script.js
```

### Description

Cache busting depends on manually updating `LP_VERSION`.

Developers must remember to increment the version after deployment.

### Recommendation

Automate asset versioning during deployment.

---

## IMP-002

### Title

Background Worker Refund Uses Hardcoded Amount

### Severity

Medium

### Status

Open

### Evidence

```
deployWorker.js
```

### Description

Refund amount is hardcoded to `10000`.

If deployment cost changes, refund value becomes incorrect.

### Recommendation

Refund the actual deducted amount.

---

## IMP-003

### Title

Hardcoded customerNo in Payment Transaction

### Severity

Medium

### Status

Open

### Evidence

```
transaction.service.js
```

### Description

Winpay requires a numeric customer number.

The implementation currently uses a fixed placeholder value for every transaction.

### Recommendation

Use the user's verified phone number instead.

---

## IMP-004

### Title

Legacy Store Template

### Severity

Low

### Status

Accepted

### Evidence

```
script.js
```

### Description

The legacy `store` template is rendered inline rather than using the newer template architecture.

### Recommendation

Eventually migrate to the same template architecture used by other domains.

---

## IMP-005

### Title

Legacy Brand Name Still Exists

### Severity

Low

### Status

Open

### Evidence

```
ai.service.js
layout.js
```

### Description

Several prompts and metadata still reference the old product name **Siluet**.

### Recommendation

Replace remaining legacy branding with Wuzzkang.

---

# Technical Debt

---

## TD-001

### Title

Wallet Transaction Is Not Atomic

### Severity

High

### Status

Open

### Evidence

```
wallet.service.js
```

### Description

Balance updates and transaction records are executed separately.

A failure between operations may leave inconsistent data.

### Recommendation

Move the entire operation into a database transaction or RPC.

---

## TD-002

### Title

Wallet Completion Is Not Atomic

### Severity

High

### Status

Open

### Evidence

```
wallet.service.js
```

### Description

Completing a payment performs multiple sequential database operations.

Partial failures may produce duplicate credits.

### Recommendation

Use a single atomic database transaction.

---

## TD-003

### Title

Coupon Usage Increment Is Not Atomic

### Severity

Medium

### Status

Open

### Evidence

```
coupon.service.js
```

### Description

Coupon usage uses a read-modify-write sequence without locking.

Concurrent requests may produce inaccurate usage counts.

### Recommendation

Perform the increment atomically inside PostgreSQL.

---

## TD-004

### Title

BullMQ Infrastructure Is Present But Unused

### Severity

Low

### Status

Accepted

### Evidence

```
queue.js
deployWorker.js
```

### Description

BullMQ infrastructure remains in the repository although deployments no longer use background workers.

### Recommendation

Remove or reactivate when deployment architecture is finalized.

---

## TD-005

### Title

Developer Notes Are Stored Inside Repository

### Severity

Low

### Status

Open

### Evidence

```
catatan.md
HISTORY.md
```

### Description

Developer scratch files are committed into the repository.

Some notes include sensitive development information.

### Recommendation

Move temporary notes outside the production repository.

---

# Code TODOs

---

## TODO-001

### File

```
src/config/index.js
```

### Finding

Supabase environment variables are marked optional even though they are required for normal operation.

---

## TODO-002

### File

```
src/config/index.js
```

### Finding

OpenAI API Key is currently optional pending future integration.

---

## TODO-003

### File

```
transaction.service.js
```

### Finding

Replace placeholder customer number with actual user phone number.

---

## TODO-004

### File

```
wallet.service.js
```

### Finding

Replace sequential balance updates with atomic transaction or RPC.

---

## TODO-005

### File

```
payments/interface.js
```

### Finding

Future payment providers (Midtrans, Xendit) are planned but not implemented.

---

## TODO-006

### File

```
NEXT_STEPS.md
```

### Finding

Several roadmap items remain incomplete, including:

- PaymentFactory orchestration
- Winpay IP whitelist
- Custom Domain
- Domain automation

---

# Audit Summary

| Category | Count |
|----------|------:|
| Security Issues | 2 |
| Architecture Issues | 3 |
| Implementation Issues | 5 |
| Technical Debt | 5 |
| Code TODOs | 6 |

---

# Related Documents

- 00_FOUNDATION.md
- 01_SYSTEM_OVERVIEW.md
- 02_CURRENT_STATE.md
- 03_ARCHITECTURE.md

---

# Notes

An audit finding does not necessarily indicate a production bug.

Some findings are accepted trade-offs or implementation decisions that should be revisited as the project evolves.