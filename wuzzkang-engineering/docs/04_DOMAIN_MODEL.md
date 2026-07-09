# Domain Model

## Document Information

| Field       | Value                                                                                         |
|-------------|-----------------------------------------------------------------------------------------------|
| Document    | 04_DOMAIN_MODEL.md                                                                            |
| Version     | 1.0.0                                                                                         |
| Status      | Draft                                                                                         |
| Owner       | Muhammad Arif Setiawan                                                                        |
| Purpose     | Define the business domain of Wuzzkang — entities, relationships, lifecycles, and invariants  |
| Audience    | Engineers, AI Assistants, Technical Reviewers                                                 |
| Based On    | Direct codebase reading, June–July 2026                                                       |

---

## Purpose of This Document

This document defines the business domain of Wuzzkang.

A domain model describes business concepts — what they are, why they exist, how they relate, and what rules govern them. It is not a database schema. It is not an API specification. It is not a deployment guide.

Its purpose is to give engineers, AI assistants, and future contributors a shared vocabulary and mental model of what the platform does at the business level — independent of the technology used to implement it.

Whenever implementation decisions must be made, this document establishes the canonical meaning of business concepts so that those decisions remain consistent.

This document explicitly does **not** describe:

- Database tables, columns, or indexes
- SQL, PostgreSQL, or Supabase internals
- API routes or request/response structures
- Framework-specific implementation details

Those belong to `09_DATABASE_ARCHITECTURE.md` and related documents.

---

## Out of Scope

This document intentionally does **not** define:

- Database tables, columns, indexes, or query patterns
- API endpoints, request structures, or response formats
- SQL, PostgreSQL functions, or database trigger logic
- Authentication provider internals
- Infrastructure configuration
- Deployment pipeline definitions
- Framework-specific patterns
- UI component structure or behavior
- Performance characteristics
- Security implementation mechanisms

All of the above belong to other documents in the engineering documentation suite.

---

## Part 0 — Ubiquitous Language

The following glossary defines the canonical meaning of terms used throughout this document and across the Wuzzkang engineering suite. All engineers and AI assistants must use these terms with their stated meanings to avoid ambiguity.

| Term                   | Definition |
|------------------------|------------|
| **User**               | An authenticated individual who has registered and has access to the platform. Users own Projects and Wallets. |
| **Profile**            | The business identity of a User within the platform. Holds wallet balance and AI quota. Distinct from the authentication identity. |
| **Wallet**             | The prepaid balance associated with a User's Profile. Spent during deployment. Credited through top-up Payments. |
| **Transaction**        | An immutable financial record of a single balance change event. Either a credit (top-up, refund) or a debit (deployment cost). |
| **Project**            | The primary artifact of the platform. Represents one landing page, including its content (`pageConfig`), lifecycle state, and deployment destination. |
| **pageConfig**         | Modeled as a **Value Object** representing the structured JSON content contract embedded in a Project. Contains metadata and domain-specific content. Owned and validated by the API. |
| **Draft**              | The initial state of a Project. A draft is private and not publicly accessible. |
| **Deployment**         | The business event that transitions a Project from draft to live. Billable. Assigns a slug and public URL to the Project. |
| **Deployed**           | The state of a Project that has been successfully published and is publicly accessible. |
| **Slug**               | Modeled as a **Value Object** representing a unique URL-friendly identifier assigned to a Project at the time of deployment. Cannot be changed after assignment. |
| **Template**           | A visual and structural blueprint for rendering a landing page. Defined by `template_type` and `design_key`. Owned by the Landing Page repository. |
| **template_type**      | Modeled as a **Value Object** representing the domain category of a landing page. Examples: `wedding`, `birthday`, `toko-online`, `campaign`. Determines the content schema and available templates. |
| **design_key**         | Modeled as a **Value Object** representing the identifier of a specific visual variant within a `template_type`. |
| **Product**            | A platform-managed definition of a billable template type. Specifies which `template_type` values are active and their deployment cost. |
| **Coupon**             | An administratively created discount instrument. Reduces the cost of a deployment for an eligible User. |
| **CouponRedemption**   | An immutable record of a Coupon being redeemed by a specific User. Enforces redemption limits. |
| **Top-up**             | A Transaction that credits a User's Wallet. Initiated by the User through an external payment provider. |
| **Refund**             | A Transaction that credits a User's Wallet following a failed deployment. Created as a new credit record, not by modifying the original debit. |
| **AI Generation Request** | A domain operation (not a persisted entity) that produces a `pageConfig` using AI. The request is transient; only its result persists. |
| **Field Generation**   | A per-field AI generation operation used to populate specific content fields during project creation. Subject to daily quota limits. |
| **Image Generation**   | An AI operation that produces an image for embedding in a landing page. The result is stored and its URL embedded in the `pageConfig`. |
| **Aggregate**          | A cluster of related domain entities treated as a single consistent unit. All mutations to an aggregate go through its root entity. |
| **Aggregate Root**     | The entry point entity of an Aggregate. Enforces the aggregate's invariants. |
| **Domain Invariant**   | A rule that is always true, regardless of the operation performed. Must never be violated. |
| **Domain Constraint**  | A business rule that restricts which operations are allowed under which conditions. |
| **UserDomain**         | A custom domain name associated with a deployed Project. Status: not fully verified in the current implementation. |
| **Live URL**           | The publicly accessible URL of a deployed Project. Assigned at deployment time. |
| **Edit Limit**         | The maximum number of times a deployed Project's content may be updated. Enforced by the API. |
| **Quota**              | The daily limit on free AI field generation requests per User. Excess requests are charged to the Wallet. |
| **Bounded Context**    | A logical boundary within the domain where a specific set of entities, terms, and rules apply consistently. |
| **Domain Event**       | A significant business occurrence that signals a state change and may trigger downstream behavior. |
| **ProjectStatus**      | Modeled as a **Value Object** representing the current lifecycle stage of a Project (`draft`, `deployed`, `failed`). |
| **Money**              | Conceptually modeled as a **Value Object** representing financial values (wallet balance, transaction amount, coupon discount) in a specific currency (e.g., IDR). |

---

## Part 1 — Domain Overview

Wuzzkang is a platform that enables users to create, customize, and publish digital landing pages through an AI-assisted workflow.

The business domain of Wuzzkang revolves around seven core concepts:

**Users** — Authenticated individuals who interact with the platform. Users create projects, manage their wallet, and publish landing pages.

**Projects** — The primary artifact of the platform. A project represents one landing page, from its initial creation through its deployed state.

**AI-Generated Content** — The mechanism through which projects acquire their content. Users describe what they want to build; the platform generates structured content using AI, eliminating the need for manual copywriting.

**Deployment** — The act of publishing a project to a live, publicly accessible URL. Deployment is a billable event that transitions a project from private draft to public page.

**Wallet** — The internal balance system used to pay for platform services. Users top up their wallet using a payment provider and spend it during deployment.

**Payments** — External financial transactions that increase a user's wallet balance. Payments are initiated by the user and verified through a payment provider.

**Templates** — The visual and structural blueprints for landing pages. Templates define the presentation layer but do not define the content. A project always uses exactly one template.

These seven concepts are not independent. They form a system where a user's intent (described in natural language) is transformed through AI into structured content, stored in a project, billed through a wallet, and rendered through a template.

### 1.1 Strategic Design (Subdomains)

To align engineering effort with business value, the Wuzzkang domain is divided into Core, Supporting, and Generic subdomains:

- **Core Domain: Landing Page Rendering & Project Management**
  This is the heart of the platform. It provides Wuzzkang's unique value proposition: the ability for users to manage, edit, and serve highly optimized landing pages. The rendering engine (LP) and project lifecycle are core.
  
- **Supporting Domain: AI Page & Field Generation**
  These capabilities support the core domain by automating the page creation process. While critical for the user experience, AI generation is a translator that maps prompts to the `pageConfig` contract. It is a supporting subdomain.
  
- **Generic Domain: Identity & Prepaid Billing**
  These are standard business components. Authentication (via Supabase Auth) and ledger/payments (prepaid wallet and gateways) are generic capabilities that are necessary but do not differentiate Wuzzkang from other platforms. Standard solutions or abstractions are used.

---

## Part 2 — Core Domain Entities and Value Objects

### 2.1 User

**Purpose**

A User represents an authenticated individual who has access to the platform. Every action in the system traces back to a User.

**Responsibilities**

- Owns one or more Projects.
- Owns exactly one Profile (and through it, one Wallet).
- Initiates content generation, deployment, and payment requests.

**Lifecycle**

A User is created when an individual registers through the platform's authentication system. A User exists for the duration of their platform membership. User deletion is not an active domain concept in the current implementation.

**Owned By**

The authentication provider (Supabase Auth). The API treats the User identity as a trusted claim derived from a verified JWT token.

**Owns**

- Profile (1:1)
- Projects (1:N)

**Referenced By**

- Profile
- Transaction
- CouponRedemption

**Business Rules**

- Every User must have exactly one Profile.
- A User without a Profile cannot perform any billable operation.
- A User's identity is derived from a verified authentication token, not from application-level session state.

---

### 2.2 Profile

**Purpose**

A Profile is the business identity of a User within the platform. It holds the operational state that the platform needs beyond authentication: wallet balance, AI generation quota, and any billing overrides.

**Responsibilities**

- Maintains the User's current wallet balance.
- Tracks the User's daily AI generation quota.
- Serves as the single source of truth for the User's financial standing within the platform.

**Lifecycle**

A Profile is created automatically when a User registers. It is initialized with a balance of zero and a default AI quota. The Profile persists for the lifetime of the User account.

**Owned By**

API — the API is the only component authorized to mutate Profile data.

**Owns**

- Wallet (the balance it holds)
- AI quota state

**Referenced By**

- Transaction
- Project (indirectly, through the User who owns it)

**Business Rules**

- Every User has exactly one Profile.
- A Profile's balance cannot be reduced below zero.
- A Profile is always present before any billable operation is attempted.

**Notes**

The Profile is the aggregate root of the Wallet domain. All balance mutations are performed through the Profile, never directly against a raw storage record.

---

### 2.3 Wallet

**Purpose**

The Wallet represents the prepaid balance a User maintains on the platform. It is not a separate entity but an integral part of the Profile.

**Responsibilities**

- Holds the current spendable balance.
- Records balance changes through Transactions.
- Is consulted before any billable operation is allowed to proceed.

**Lifecycle**

The Wallet is initialized at zero when the Profile is created. It grows through successful top-up Transactions and decreases through deployment billing. It cannot be explicitly deleted.

**Owned By**

API — all balance mutations are performed exclusively by the API service layer.

**Owns**

- Nothing directly. Balance state is part of the Profile.

**Referenced By**

- Transaction (every mutation produces a Transaction)
- Deployment (consulted before billing)

**Business Rules**

- The Wallet balance cannot go below zero.
- Every balance mutation — whether a debit or credit — must produce a corresponding Transaction record.
- Balance deductions are performed atomically to prevent race conditions.

---

### 2.4 Transaction

**Purpose**

A Transaction is a permanent financial record of every event that changes a User's Wallet balance. It exists to ensure that every balance change is auditable and traceable.

**Responsibilities**

- Records the amount, direction (credit or debit), and outcome of a financial event.
- Tracks the status of a payment from initiation through completion.
- Links a billing event to the Project or top-up that caused it.

**Lifecycle**

A Transaction is created in a `pending` state when a top-up or deployment billing event is initiated. It transitions to `completed` (or `paid`) when the event is confirmed. If a deployment fails after billing has been deducted, the balance is restored by creating a new credit Transaction (reversing the debit). A Transaction is never deleted, and completed status is terminal.

**Owned By**

API — only the API service layer creates or updates Transactions.

**Owns**

- Nothing.

**Referenced By**

- Profile / Wallet (balance mutation requires creating a corresponding Transaction)
- Project (deployment billing produces a Transaction)
- Payment Provider (top-up Transactions are initiated by a payment provider interaction)

**Business Rules**

- Every balance change must be backed by a Transaction record.
- A Transaction must reference the User it belongs to.
- A Transaction in `completed` state cannot be re-processed.
- Refund Transactions are created as new credit records, not by modifying the original debit.

**Transaction Types**

| Type        | Trigger                          | Effect on Balance |
|-------------|----------------------------------|-------------------|
| Top-up      | User completes external payment  | Credit (+)        |
| Deployment  | User publishes a project         | Debit (−)         |
| Refund      | Deployment fails after billing   | Credit (+)        |

---

### 2.5 Project

**Purpose**

A Project is the primary artifact of the Wuzzkang platform. It represents a single landing page at all stages of its existence, from initial generation through live deployment.

**Responsibilities**

- Contains the full content of a landing page in the form of a `pageConfig`.
- Tracks its own lifecycle state (draft, deployed, failed).
- Records its deployment destination (slug, live URL, custom domain).
- Enforces limits on how many times it can be edited after deployment.

**Lifecycle**

A Project is created as a `draft` when a User submits a generation request. It remains a `draft` until the User initiates deployment. Deployment transitions it to `deployed` (on success) or `failed` (on error). A deployed Project can be edited a limited number of times while remaining in the `deployed` state. There is no archived or deleted state in the current domain.

**Owned By**

API — the API is the only component that creates, updates, or transitions a Project.

**Owns**

- pageConfig (1:1, embedded within the Project)
- Deployment state (current status, edit count, deployment destination)

**Referenced By**

- User (owns the Project)
- Transaction (deployment produces a Transaction)
- Landing Page (reads and renders the deployed Project)

**Business Rules**

- Every Project belongs to exactly one User.
- A Project must have a valid `pageConfig` before it can be deployed.
- A Project can only be deployed if the User has sufficient wallet balance.
- A deployed Project must have a unique slug.
- A deployed Project may be edited up to a maximum number of times (edit limit enforced by the API).
- A failed deployment may be retried.
- Only Projects in the `deployed` state are publicly visible.

**Notes**

The Project is the most central entity in the platform. All other entities either contribute to creating it (User, Wallet, AI generation), control its lifecycle (Deployment, Transaction), or consume it (Landing Page renderer).

---

### 2.6 pageConfig (Value Object)

**Purpose**

`pageConfig` is a **Value Object** representing the structured content contract that connects the creation workflow (Dashboard), the business logic layer (API), and the rendering engine (Landing Page). It represents the semantic content of a landing page — not its visual output, but the information from which that output is deterministically generated.

**Responsibilities**

- Stores all content required to render a landing page.
- Carries the metadata that controls which template and design variant are used.
- Serves as the single, authoritative content source that all repositories read from.

**Lifecycle**

A `pageConfig` is immutable; it has no independent lifecycle or identifier. It is created as a single value block, validated against the domain schema, and stored inside a Project. Updates to a project's content are performed by replacing the entire `pageConfig` value object. It is read by the Landing Page projection to render the page.

**Owned By**

API — the API defines the schema, validates all instances, and is responsible for backward compatibility of the schema contract.

**Owns**

- Nothing. Being a Value Object, it has no aggregates or entities under it.

**Referenced By**

- Dashboard (reads to display project preview)
- Landing Page (reads to render the published page)

**pageConfig Top-Level Structure**

```
pageConfig
├── meta
│     ├── title        — Page title
│     ├── theme        — Visual theme hint (legacy)
│     ├── template_type — Controls which template is loaded
│     └── design_key   — Controls which design variant is used
└── content
      └── (varies by template_type)
```

**Business Rules**

- Every Project has exactly one `pageConfig`.
- A `pageConfig` must always conform to the schema for its `template_type`.
- The `template_type` field determines which content structure is required.
- The `design_key` field determines which visual variant of the template is rendered.
- A `pageConfig` that fails schema validation cannot be stored.
- The API owns backward compatibility of the `pageConfig` schema. Changes to the schema require coordinated updates across all repositories that consume it.

**Notes**

`pageConfig` is implementation-neutral. It stores information, not presentation. The same `pageConfig` always produces the same rendered output when combined with the same template. This determinism is a core platform invariant.

---

### 2.7 Product

**Purpose**

A Product defines a billable template type offered by the platform. It controls what types of landing pages can be created and at what cost.

**Responsibilities**

- Declares which template types are available for users to create.
- Defines the deployment cost for each template type.
- Can be activated or deactivated to control platform availability.

**Lifecycle**

Products are managed administratively. They are created when a new template type is introduced to the platform and deactivated when removed. Products are not created or deleted by end users.

**Owned By**

Platform administrator. The API reads Products but does not create them through the user-facing flow.

**Owns**

- Nothing.

**Referenced By**

- Project (every Project corresponds to one Product / template type)
- Transaction (deployment cost is sourced from the Product)

**Business Rules**

- A Project's deployment cost is always determined by the Product associated with its `template_type`.
- Deployment is only allowed for active Products.
- The deployment cost is resolved at the time of deployment, not at the time of project creation.

---

### 2.8 Coupon

**Purpose**

A Coupon is a discount instrument that reduces the cost of a deployment for an eligible user.

**Responsibilities**

- Defines a discount amount or rule applicable to a deployment.
- Tracks usage to enforce per-user or global redemption limits.

**Lifecycle**

A Coupon is created by a platform administrator. It is active until it has been fully consumed (all redemptions used) or explicitly deactivated. Coupons are not created by end users.

**Owned By**

Platform administrator. The API validates Coupons during the deployment flow.

**Owns**

- CouponRedemption (tracks individual redemptions)

**Referenced By**

- Deployment (a Coupon may be applied at deployment time)
- CouponRedemption (one record per redemption)

**Business Rules**

- A Coupon is validated before any billing occurs.
- A Coupon cannot reduce the deployment cost below zero.
- A Coupon may only be redeemed by the same User a limited number of times.
- Coupon validation and redemption are treated as a single atomic operation during deployment.

---

### 2.9 CouponRedemption

**Purpose**

A CouponRedemption record tracks a single redemption of a Coupon by a specific User. It exists to enforce redemption limits.

**Responsibilities**

- Proves that a specific User has redeemed a specific Coupon.
- Enables per-user and global redemption limit enforcement.

**Lifecycle**

A CouponRedemption record is created at the moment a Coupon is successfully redeemed during deployment. It is never deleted or updated.

**Owned By**

API — created automatically when a Coupon is redeemed.

**Owns**

- Nothing.

**Referenced By**

- Coupon (has N CouponRedemption records)
- User (has N CouponRedemption records)

**Business Rules**

- A CouponRedemption record must reference both a Coupon and a User.
- CouponRedemption is only created after deployment billing succeeds.
- CouponRedemption cannot be reversed or voided.

---

### 2.10 AI Generation Request

**Purpose**

An AI Generation Request represents the business event of requesting AI-generated content for a Project. It is a domain operation, not a persisted entity.

**Responsibilities**

- Accepts a user's natural language description and domain-specific details.
- Produces a `pageConfig` compliant with the requested `template_type`.
- Optionally generates individual field content for specific inputs.
- Optionally generates images to accompany the page content.

**Lifecycle**

An AI Generation Request begins when a User submits a generation prompt and ends when a valid `pageConfig` is produced and stored. The request itself is not stored. Only the resulting `pageConfig` (within the Project) persists.

**Owned By**

API — all AI generation logic is owned and orchestrated by the API.

**Quota**

Each user has a daily free quota for field-level generation requests. Requests exceeding this quota are charged against the wallet. Full-page generation and image generation are subject to their own billing rules.

**Business Rules**

- An AI Generation Request must always produce a schema-valid `pageConfig` or fail explicitly.
- A Generation Request that fails does not persist any partial content.
- Field generation respects the daily free quota before consulting the wallet.
- Image generation results are stored in platform storage; the resulting URL is embedded in the `pageConfig`.

---

### 2.11 UserDomain

**Purpose**

A UserDomain represents a custom domain name that a User may associate with a deployed Project, allowing the Project to be accessible at a URL they control.

**Responsibilities**

- Records ownership of a custom domain by a User.
- Associates that domain with a deployed Project.

**Lifecycle**

Not verified — the schema for UserDomain exists in the platform, but no active API endpoint or business flow for managing UserDomains has been confirmed in the current codebase. This entity is documented as a recognized concept pending verification.

**Owned By**

Not verified.

**Business Rules**

Not verified. See `02_CURRENT_STATE.md` for current implementation status.

### 2.12 Domain Value Objects

The following concepts are explicitly modeled as **Value Objects** within Wuzzkang. They represent attributes that have no independent identity and are defined by their values:

- **Slug**: Represents a URL-friendly, unique project identifier assigned at deployment time. Composed of two parts: (1) a user-supplied base (e.g., `toko-saya`) constrained to lowercase letters `a-z`, digits `0-9`, and dashes only; and (2) a 6-character deterministic suffix derived from the first 6 hex characters of the Project's UUID (e.g., `3b9d4c`). The full stored slug is therefore `toko-saya-3b9d4c`. It is immutable once set. The suffix guarantees global uniqueness without database collision checks. In the future, when custom domains are implemented, the Slug serves as the routing fallback key while the custom domain becomes the primary user-facing URL.
- **ProjectStatus**: Represents the lifecycle stage of a Project (`draft`, `deployed`, `failed`). It enforces strict state transition paths.
- **Money**: Conceptually represents financial values (such as Wallet balance, Transaction amounts, and Product costs). It is modeled as a decimal value with a fixed currency (IDR) to guarantee mathematical correctness.
- **TemplateType**: Represents the category of the landing page blueprint (e.g., `wedding`, `toko-online`). It determines the Zod validation schema for the embedded `pageConfig`.
- **DesignKey**: Represents the specific layout/style variant chosen within a `TemplateType`. It controls visual customization at rendering time.

---

## Part 3 — Entity Relationships

### 3.1 Core Ownership Chain

```
User
│ owns (1:1)
▼
Profile
│ holds
▼
Wallet (balance)

User
│ owns (1:N)
▼
Project
│ contains (1:1)
▼
pageConfig
```

### 3.2 Deployment Chain

```
Project
│ deployed through
▼
Deployment Event
│ billed by (1:1)
▼
Transaction
│ debits
▼
Wallet
```

### 3.3 Payment Chain

```
User
│ initiates
▼
Top-up Transaction (PENDING)
│ confirmed by
▼
Payment Provider Webhook
│ updates to (COMPLETED)
▼
Transaction
│ credits
▼
Wallet
```

### 3.4 Content Generation Chain

```
User
│ submits description to
▼
AI Generation Request
│ produces
▼
pageConfig
│ stored inside
▼
Project (draft)
```

### 3.5 Coupon Application

```
User
│ provides Coupon code at deployment
▼
Coupon
│ validated against
▼
CouponRedemption (existing records)
│ if eligible, discount applied to
▼
Transaction (deployment cost)
│ on success, records
▼
CouponRedemption (new record)
```

### 3.6 Rendering Chain

```
Visitor
│ accesses URL
▼
Landing Page
│ resolves project from URL
▼
Project (status = deployed)
│ reads
▼
pageConfig
│ routes to
▼
Template (template_type + design_key)
│ renders
▼
HTML page
```

### 3.7 Summary Relationship Table

| Entity           | Relates To          | Relationship         |
|------------------|---------------------|----------------------|
| User             | Profile             | 1:1 owns             |
| User             | Project             | 1:N owns             |
| Profile          | Transaction         | 1:N tracked by       |
| Profile          | Wallet              | 1:1 holds            |
| Project          | pageConfig          | 1:1 contains         |
| Project          | Transaction         | 1:1 per deployment   |
| Project          | User                | N:1 belongs to       |
| Transaction      | Wallet              | N:1 affects          |
| Coupon           | CouponRedemption    | 1:N tracks           |
| CouponRedemption | User                | N:1 belongs to       |
| CouponRedemption | Coupon              | N:1 belongs to       |
| Product          | Project             | 1:N template for     |
| AI Generation    | pageConfig          | 1:1 produces         |

---

### 3.8 High-Level Domain Relationship Diagram

The following diagram shows the major entities and their primary ownership and relationship lines.

```
┌──────────────┐
│     User      │
└───────┬──────┘
         │ owns
    ┌────┴─────┐
    │            │
    ▼            ▼
┌────────┐  ┌────────────────┐
│ Profile │  │    Project      │
│ (Wallet)│  │                │
└────┬───┘  │  ┌──────────┐  │
     │       │  │ pageConfig │  │
     │       │  └──────────┘  │
     │       └────────────────┘
     │                │ deployed by
     │          ┌────┴──────┐
     │          │ Deployment  │
     │          │   Event     │
     │          └────┬──────┘
     │               │ creates
     │          ┌────┴────┐
       ├─── debits │ Transaction │───► redeemed Coupon
       │          └─────────┘      ► CouponRedemption
       │
┌───┴──────────┐
│  Transaction   │  (Top-up)
│  (credit)      │───► Payment Provider
└──────────────┘

              ┌────────┐
              │ Product  │──► defines cost per Deployment
              └────────┘

    Visitor ───► Landing Page ──► reads Project (deployed) ──► pageConfig ──► Template
```

---

## Part 4 — Aggregate Boundaries

### 4.1 Project Aggregate

**Root:** Project

**Members:**
- pageConfig
- Deployment state (status, edit count, slug, live URL)

**Why they belong together:**

`pageConfig` cannot exist without a Project — it is the content of that Project. Deployment state is not a separate entity; it is a property of the Project's lifecycle. All mutations to these members are applied through the Project root, ensuring consistency.

Any operation that changes `pageConfig` (editing a deployed project) must also check and enforce the edit count limit. Any operation that changes the deployment state must also trigger the appropriate billing event. These concerns cannot be separated safely.

### 4.2 Wallet Aggregate

**Root:** Profile

**Members:**
- Wallet balance (held on the Profile)

**Why they belong together:**

The Wallet balance represents the current spendable funds held directly on the Profile. All modifications to the Wallet balance must be executed through the Profile root to ensure consistency and prevent race conditions. The business invariant requires that every balance mutation produces a corresponding Transaction, but the Transaction itself is managed under a separate aggregate.

### 4.3 Transaction Aggregate

**Root:** Transaction

**Members:**
- None (Transaction is a root-only aggregate)

**Why they belong together:**

A Transaction is an independent, immutable record of a financial event (either credit or debit) that has its own identity and audit lifecycle. Because it is accessed directly by unique references (e.g., payment order references from external webhooks) and is append-only, it stands as its own Aggregate Root. Consistency between the Wallet balance (within Profile) and Transaction creation is coordinated at the service layer.

### 4.4 Coupon Redemption Aggregate

**Root:** Coupon

**Members:**
- CouponRedemption records

**Why they belong together:**

A Coupon's validity depends on how many times it has been redeemed, and by whom. CouponRedemption records are meaningless without the Coupon they reference. Validating a Coupon and recording its redemption must be treated as a single consistent operation within the deployment flow.

---

## Part 5 — Domain Services

Domain Services encapsulate business operations that do not naturally belong to a single Entity or Aggregate Root. They coordinate activities across different aggregates to perform multi-step domain processes, ensuring that business rules are preserved.

### 5.1 DeploymentService

The `DeploymentService` coordinates the publishing of a project. Because publishing is a billable action that changes project visibility, this service orchestrates multiple domain elements:

1. **Coupon Validation**: Verifies the coupon code (if provided) against coupon limits and user history.
2. **Balance Check**: Checks if the user's wallet has sufficient funds for the selected template type (minus any coupon discount).
3. **Wallet Deduction**: Deducts the final cost from the user's wallet and registers a `Transaction` record (debit).
4. **Coupon Redemption**: Appends a `CouponRedemption` record if a coupon was successfully redeemed.
5. **Project Activation**: Transitions the project state to `deployed`, assigns a unique URL slug, and updates the `pageConfig` visibility.
6. **Error and Refund Handling**: If the publishing process fails during execution, this service orchestrates the balance restoration via a new credit `Transaction`.

### 5.2 BillingService

The `BillingService` handles wallet credit operations and financial audit integrity:

1. **Webhook Processing**: Receives and validates signature-verified payment confirmation notifications from external payment providers.
2. **Ledger Mutation**: Creates a completed `Transaction` record (credit) for the top-up amount and increments the user's wallet balance.
3. **Refund Generation**: Creates a credit `Transaction` and increments the wallet when a deployment failure is reported.

### 5.3 AIGenerationService

The `AIGenerationService` orchestrates content creation and prompt mapping:

1. **Quota Validation**: Consults the user's daily free generation counter to determine if the request is free or billable.
2. **Prompt Processing**: Maps the user's input prompt into the structured layout expected by the requested `template_type`.
3. **Contract Assembly**: Returns a schema-valid `pageConfig` Value Object and registers any generated image assets.

---

## Part 6 — Bounded Contexts

Bounded Contexts define logical groupings of domain entities within which terms, rules, and ownership are consistent. These boundaries help engineers understand which concerns belong together and which are separate.

### Context 1: Identity and Access

**Entities:** User, Profile

**Why it exists:** Authentication and business identity are distinct concerns. A User is an authentication artifact; a Profile is a business artifact. They are coupled but must be treated separately. The Identity context manages who the system recognizes and what their standing is on the platform.

**Owner:** Authentication Provider (User), API (Profile)

**Key rules within this context:**
- A User always has one Profile.
- A Profile is the authoritative source of financial standing.

---

### Context 2: Content Creation

**Entities:** Project, pageConfig, AI Generation Request, Product, Template

**Why it exists:** Creating a landing page is the core activity of the platform. This context captures everything involved in turning a user's intent into structured content. It is separated from deployment because content can exist — and be refined — before it is ever published.

**Owner:** API (Project, pageConfig, AI Generation Request, Product); Landing Page (Template)

**Key rules within this context:**
- A Project begins as a draft.
- pageConfig is always validated before storage.
- template_type determines which content schema applies.

---

### Context 3: Deployment and Publishing

**Entities:** Project (deployed state), Deployment Event, Slug, Live URL

**Why it exists:** Deployment transitions a private draft into a public artifact. This is a distinct business moment with billing, identity assignment (slug), and visibility implications. It is separated from content creation because publishing concerns differ from authoring concerns.

**Owner:** API

**Key rules within this context:**
- Deployment requires balance verification.
- A slug is immutable once assigned.
- Only the API may initiate or complete a deployment.

---

### Context 4: Wallet and Payments

**Entities:** Wallet, Transaction, Payment (external top-up)

**Why it exists:** The platform uses a prepaid wallet model. All financial events — top-ups, billing, and refunds — flow through this context. It is separated from other contexts because it involves external payment providers and requires strict auditability.

**Owner:** API (all wallet and transaction logic)

**Key rules within this context:**
- Wallet balance cannot go below zero.
- Every balance mutation requires a Transaction record.
- Transactions are immutable once completed.

---

### Context 5: Promotions

**Entities:** Coupon, CouponRedemption

**Why it exists:** Coupons are a distinct promotional mechanism that intersects with the deployment billing flow but is independent from core financial logic. It is separated to allow promotional rules to evolve without affecting wallet or transaction behavior.

**Owner:** Platform administrator (Coupon definition); API (CouponRedemption tracking)

**Key rules within this context:**
- Coupons are validated before billing.
- Redemption is recorded after billing succeeds.
- CouponRedemption is immutable.

---

### Context 6: Rendering

**Entities / Projections:** Template, PublicPage (read model/projection of Deployed Project)

**Why it exists:** Rendering is a consumer-only context. The Landing Page does not load or consume the full Project domain model. Instead, it reads a minimal read model projection (referred to conceptually as a `PublicPage`) that contains only the necessary rendering attributes (specifically `pageConfig` content, slug, and status). This ensures that authoring-specific fields, wallet balances, user profiles, or billing states are completely isolated from public-facing pages.

**Owner:** Landing Page (rendering logic and template files)

**Key rules within this context:**
- Only deployed page projections (`PublicPage`) are accessible.
- pageConfig is read as-is; no mutations occur.
- Template selection is deterministic from `template_type` and `design_key` embedded within the PublicPage.

---

## Part 7 — Business Capabilities

Business capabilities describe what the platform does, not how it does it. They are stable descriptions of the platform's value to its users.

| Capability                      | Description                                                                                   |
|---------------------------------|-----------------------------------------------------------------------------------------------|
| AI-Assisted Page Creation       | Users describe what they want to build. The platform generates a complete, structured landing page content through AI. |
| Structured Content Assembly     | Users with detailed domain knowledge can provide structured input directly, bypassing the AI prompt step, to produce the same content model. |
| Template-Based Rendering        | Content is rendered using a library of visual templates. Users choose a template type and design variant; the same content renders consistently across visits. |
| Project Management              | Users can create, view, and manage multiple projects across all lifecycle states. |
| One-Click Deployment            | A draft project can be published to a live URL with a single action, following balance verification. |
| Post-Deployment Editing         | Deployed projects can be updated up to a defined maximum number of times without requiring redeployment. |
| Prepaid Wallet System           | Users maintain an internal balance. All platform charges are deducted from this balance. |
| External Payment Top-Up         | Users add funds to their wallet by completing a payment through an external payment provider. |
| Coupon Discounts                | Eligible users may apply a discount coupon at deployment to reduce the cost. |
| AI Field Generation             | Individual content fields (e.g., product description, campaign section) can be generated independently, subject to a daily free quota. |
| AI Image Generation             | Users can generate and embed images into their landing page content using AI. |
| Custom Domain Association       | Deployed projects may be associated with a custom domain name. (Status: not fully verified in current implementation.) |

---

## Part 8 — Domain Events

Domain Events represent significant business occurrences that signal a meaningful state change. Each event is produced by one component and may trigger downstream behavior in others.

| Event                       | Trigger                                               | Producer       | Consumers                      | Resulting State Change |
|-----------------------------|-------------------------------------------------------|----------------|--------------------------------|-----------------------|
| **UserRegistered**          | A new User completes sign-up                          | Auth Provider  | API (creates Profile)          | Profile created with zero balance and default quota |
| **ProjectGenerated**        | AI Generation Request completes successfully          | API            | Dashboard                      | Project created in `draft` state with pageConfig |
| **ProjectDeployed**         | Deployment succeeds after balance deduction           | API            | Landing Page, Dashboard        | Project transitions to `deployed`; slug and live URL assigned |
| **ProjectDeploymentFailed** | Deployment fails after balance was deducted           | API            | Dashboard                      | Project transitions to `failed`; refund Transaction created |
| **ProjectEdited**           | User updates content of a deployed Project            | API            | Landing Page, Dashboard        | pageConfig updated; edit count incremented |
| **WalletCredited**          | Top-up payment is confirmed by the payment provider   | API (via webhook) | Dashboard                   | Wallet balance increases; Transaction recorded as completed |
| **WalletDebited**           | Deployment billing is applied                         | API            | Dashboard                      | Wallet balance decreases; Transaction recorded |
| **WalletRefunded**          | Deployment failure triggers a refund                  | API            | Dashboard                      | Wallet balance restored; new credit Transaction created |
| **PaymentInitiated**        | User requests a top-up                                | Dashboard (via API) | Payment Provider          | Pending Transaction created; payment reference issued |
| **CouponRedeemed**          | A valid Coupon is redeemed during deployment          | API            | —                              | CouponRedemption record created; deployment cost reduced |
| **ImageGenerated**          | AI image generation request completes                 | API            | Dashboard                      | Image stored; URL embedded in pageConfig |

**Notes on Domain Events:**

- Domain Events in this document are conceptual. They describe business occurrences, not technical message bus events.
- Whether these events are implemented as explicit messages, callbacks, or inline logic is an implementation decision outside this document's scope.
- The sequence of events within a single operation (e.g., deployment) must preserve all invariants defined in Part 12.

---

## Part 9 — Domain Lifecycles

### 8.1 Project Lifecycle

```
[created as draft]
        │
        │ Content generation completes (AI or structured input)
        │ pageConfig stored
        ▼
[draft — ready to deploy]
        │
        │ User initiates deployment
        │ Balance checked and deducted
        ▼
[deploying]
        │
        ├─ Success
        │       │ Slug assigned, live URL set
        │       ▼
        │   [deployed]
        │       │
        │       │ User initiates edit (within limit)
        │       │ pageConfig updated
        │       ▼
        │   [deployed — edited]
        │       │ (up to maximum edit count)
        │       │ further edits rejected after limit
        │
        └─ Failure
                │ Balance refunded
                ▼
            [failed]
                │
                │ User retries deployment
                ▼
            [deploying] (cycle repeats)
```

**States:**

| State    | Description                                          | Publicly Visible |
|----------|------------------------------------------------------|-----------------|
| draft    | Project created, not yet deployed                    | No               |
| deployed | Project is live at a public URL                      | Yes              |
| failed   | Deployment attempt failed; retry available           | No               |

**Allowed State Transitions:**

| From       | To         | Trigger                              |
|------------|------------|--------------------------------------|
| draft      | deployed   | Successful deployment                |
| draft      | failed     | Deployment failure                   |
| failed     | deployed   | Successful retry                     |
| failed     | failed     | Retry also fails                     |
| deployed   | deployed   | Successful content edit (within limit)|

**Forbidden Transitions:**

| Transition             | Reason                                               |
|------------------------|------------------------------------------------------|
| deployed → draft      | A published page cannot revert to a draft            |
| deployed → failed     | A live page is not considered "failed"               |
| draft → draft (re-gen)| Re-generation overwrites pageConfig in the same draft|
| Any state → deleted   | Deletion is not a supported state in the current domain |

---

### 8.2 Transaction Lifecycle

```
[pending]
    │
    ├─ Payment confirmed (top-up) or deployment billing recorded
    │       ▼
    │   [completed]
```

**States:**

| State     | Description                                             |
|-----------|---------------------------------------------------------|
| pending   | Transaction initiated, outcome not yet confirmed        |
| completed | Transaction confirmed and balance updated (terminal)    |

**Allowed State Transitions:**

| From      | To        | Trigger                                    |
|-----------|-----------|--------------------------------------------|
| pending   | completed | Payment confirmed or deployment recorded   |

**Forbidden Transitions / Immutable Ledger Rules:**

- **No Refund Transition**: The status of a `completed` transaction is terminal and immutable. A refund is never represented as a state change of the original transaction. Instead, a refund is modeled by creating a **new credit Transaction** that references the original debit Transaction ID.
- **completed → any state**: A completed Transaction cannot be altered or transition to any other status.
- **any state → deleted**: Transactions represent a permanent financial ledger and are never deleted.

---

### 8.3 Coupon Lifecycle

```
[created — active]
        │
        │ User redeems during deployment
        ▼
[redeemed — one redemption recorded]
        │
        │ (if redemption limit reached)
        ▼
[fully redeemed — no longer applicable]
```

A Coupon may also be deactivated by a platform administrator at any time, regardless of remaining redemption capacity.

**Allowed State Transitions:**

| From            | To              | Trigger                                     |
|-----------------|-----------------|---------------------------------------------|
| active          | partially redeemed | A user redeems the Coupon once            |
| partially redeemed | fully redeemed  | Redemption limit is reached               |
| active          | deactivated     | Administrator explicitly deactivates it     |
| partially redeemed | deactivated     | Administrator explicitly deactivates it     |

**Forbidden Transitions:**

| Transition              | Reason                                         |
|-------------------------|------------------------------------------------|
| fully redeemed → active | A redeemed Coupon cannot be reinstated         |
| deactivated → active   | Not supported in the current domain model      |

---

### 8.4 AI Generation Request Lifecycle

```
[submitted]
    │
    ├─ AI Provider generates content
    │       │
    │       ├─ Valid pageConfig produced
    │       │       ▼
    │       │   [completed — pageConfig stored in Project]
    │       │
    │       └─ Invalid or error response
    │               ▼
    │           [failed — no content stored]
    │
    └─ Structured input assembled directly (no AI call)
            ▼
        [completed — pageConfig stored in Project]
```

The AI Generation Request leaves no persistent record. Only the resulting `pageConfig` survives.

---

## Part 10 — Domain Principles

Domain Principles are permanent, non-negotiable statements about the nature of the business domain. They complement the invariants in Part 12 by describing the philosophy underlying the model, not just the rules.

**pageConfig is the canonical content model.**

All content in the platform is expressed as `pageConfig`. There is no alternative content structure. Any feature that introduces new content must express it through or alongside `pageConfig`.

**Templates never own content.**

A template is a rendering blueprint. It receives a `pageConfig` and produces HTML. It does not store, modify, or generate content. Content and presentation are permanently separated.

**Wallet mutations are immutable events.**

Once a balance change occurs, it cannot be undone by modification. Reversal always produces a new record in the opposite direction. This preserves a complete, auditable history of all financial events.

**Transactions are append-only.**

No Transaction record is deleted or updated after it reaches a terminal state. The ledger of financial events is permanent and grows monotonically.

**The API owns all business rules.**

No component other than the API enforces business logic. The Dashboard collects user input. The Landing Page renders output. Only the API decides whether an operation is valid and what its effects are.

**Deployment is always a billable event.**

Deployment and billing are inseparable. There is no mechanism for deploying a Project without a corresponding financial transaction (even if the net cost is zero due to a Coupon).

**Public visibility is controlled by state, not by access control lists.**

A Project is publicly accessible if and only if its state is `deployed`. This determination is made at the data layer, not through application-level permission checks. The rendering engine has no concept of a "hidden" deployed Project.

**Slugs are permanent.**

Once a slug is assigned during deployment, it does not change. URL stability is a domain commitment to the visitors of deployed pages.

**AI generation is a means, not an end.**

The purpose of AI generation is to produce a valid `pageConfig`. The AI itself is external infrastructure. From the domain's perspective, what matters is the resulting `pageConfig`, not how it was generated.

---

## Part 11 — Ownership Matrix

| Entity             | Owner               | Consumers                         | Source of Truth               |
|--------------------|---------------------|-----------------------------------|-------------------------------|
| User               | Auth Provider       | API, Dashboard                    | Authentication Provider       |
| Profile            | API                 | Dashboard (display only)          | Platform database (via API)   |
| Wallet (balance)   | API                 | Dashboard (display only)          | Profile record                |
| Transaction        | API                 | Dashboard (display only)          | Platform database (via API)   |
| Project            | API                 | Dashboard, Landing Page           | Platform database (via API)   |
| pageConfig         | API                 | Dashboard (preview), Landing Page | Project record                |
| Product            | Platform admin      | API (deployment cost lookup)      | Platform database             |
| Coupon             | Platform admin      | API (validation), Dashboard (input)| Platform database            |
| CouponRedemption   | API                 | API (validation)                  | Platform database (via API)   |
| Template JS files  | Landing Page        | Dashboard (preview copy)          | Landing Page repository       |
| AI Generation      | API                 | —                                 | Not persisted                 |
| UserDomain         | Not verified        | Not verified                      | Not verified                  |

### Repository Ownership Matrix

The following matrix shows which repository owns each major domain concept.

| Domain Concept              | wuzzkang-api | wuzzkang-dashboard  | wuzzkang-lp     |
|-----------------------------|:------------:|:-------------------:|:---------------:|
| User identity (auth)        | Verifies     | Initiates           | —               |
| Profile / Wallet            | ✅ Owns       | Reads               | —               |
| Transaction records         | ✅ Owns       | Reads               | —               |
| Project lifecycle           | ✅ Owns       | Reads / initiates   | Reads (deployed)|
| pageConfig schema           | ✅ Owns       | Consumes            | Consumes        |
| Deployment logic            | ✅ Owns       | Initiates           | —               |
| Billing logic               | ✅ Owns       | —                   | —               |
| Coupon validation           | ✅ Owns       | Passes code         | —               |
| CouponRedemption records   | ✅ Owns       | —                   | —               |
| Product catalog             | Reads         | Reads               | —               |
| AI Generation logic         | ✅ Owns       | Triggers            | —               |
| Template rendering          | —             | Preview (copy)      | ✅ Owns          |
| Template JS source files    | —             | Synchronized copy   | ✅ Owns          |
| URL resolution (rendering)  | —             | —                   | ✅ Owns          |

---

## Part 12 — Domain Invariants

The following invariants are always true in the Wuzzkang domain. They must be preserved by every implementation decision.

**User and Profile**

- Every User has exactly one Profile.
- A Profile is always present before any billable operation is initiated.
- A User's identity is derived from a verified, externally issued token.

**Wallet and Transactions**

- A Wallet balance cannot become negative.
- Every balance mutation — debit or credit — must produce a corresponding Transaction record.
- A completed Transaction cannot be reversed by modifying the original record. Reversal produces a new Transaction.
- Balance deduction and Transaction recording must be treated as a single consistent operation.

**Project and pageConfig**

- Every Project belongs to exactly one User.
- Every Project contains exactly one `pageConfig`.
- A `pageConfig` must always conform to the schema for its `template_type`.
- A `pageConfig` that fails schema validation cannot be stored.
- A Project cannot be deployed without a valid `pageConfig`.

**Deployment**

- A deployed Project must have a unique slug.
- Deployment requires sufficient wallet balance.
- Deployment cost is always sourced from the active Product associated with the `template_type`.
- If deployment fails after billing has been deducted, the balance must be refunded.
- A deployed Project may be edited only up to a defined maximum number of times.

**Coupons**

- A Coupon is validated before any billing occurs.
- A Coupon cannot reduce the deployment cost below zero.
- A CouponRedemption record must reference both the Coupon and the User.
- CouponRedemption is only recorded after redemption completes successfully.

**Public Visibility**

- Only Projects in the `deployed` state are publicly accessible.
- The Landing Page reads only deployed Projects. Draft and failed Projects are not visible.

---

## Part 13 — Domain Constraints

The following constraints define boundaries on how the domain may be operated. They exist to protect consistency, fairness, and correctness.

**Project Constraints**

- A Project cannot exist without an owner. Ownerless Projects are not a valid domain concept.
- A Project cannot be deployed by a User other than its owner.
- A Project's `template_type` cannot be changed after creation. Changing the template type would require re-generating the `pageConfig` under a different schema.

**Wallet Constraints**

- All wallet mutations must go through the API. No consumer other than the API may directly modify wallet state.
- A top-up cannot be credited to a wallet before the external payment is confirmed.
- A deployment cannot proceed if the balance check returns insufficient funds, even if the balance changes between check and deduction.

**Coupon Constraints**

- Coupon validation always precedes billing. A deployment cannot proceed with an invalid or exhausted Coupon.
- Applying a Coupon is an atomic part of the deployment transaction. A Coupon cannot be applied to a deployment that ultimately fails before billing.
- A CouponRedemption record cannot be created without a corresponding successful deployment.

**pageConfig Constraints**

- The `pageConfig` schema is owned by the API. No other component may define or extend it unilaterally.
- A `pageConfig` change (edit) must pass the same schema validation as the original creation.
- The Landing Page reads `pageConfig` as-is. It performs no further validation. The API is responsible for guaranteeing the integrity of stored `pageConfig` values.

**Visibility Constraints**

- Draft Projects are private to their owner. They are never exposed to the Landing Page.
- Failed Projects are private to their owner. They are never exposed to the Landing Page.
- The Landing Page has no mechanism to authenticate a user. Its access scope is permanently restricted to deployed content.

---

## Part 14 — Future Domain

The following entities or capabilities are recognized as potential future additions to the Wuzzkang domain. They are **not implemented in the current version**. They are documented here to establish naming conventions and prevent conceptual conflicts in future design work.

> All items in this section are speculative. They are subject to change and must not be treated as commitments.

| Concept                   | Description                                                                                      | Status       |
|---------------------------|--------------------------------------------------------------------------------------------------|--------------|
| Domain Verification       | A formal process for verifying ownership of a custom domain before association with a project.  | Not implemented |
| UserDomain (active)       | Full lifecycle management of custom domains, including API-level creation, update, and removal. | Partially implemented (schema exists, no active API) |
| Subscription Plan         | A recurring billing model that grants users a monthly allocation of credits or capabilities.     | Not implemented |
| Project Archiving         | A mechanism for marking projects as archived — no longer publicly visible but retained for the owner. | Not implemented |
| Project Deletion          | Permanent removal of a project and its content by the owner.                                    | Not implemented |
| Template Marketplace      | A system for introducing new templates from external or community contributors.                 | Not implemented |
| Team / Organization       | A multi-user ownership model where a team collectively owns projects and shares a wallet.       | Not implemented |
| Analytics                 | Per-project visitor tracking and engagement metrics.                                             | Not implemented |
| Content Versioning        | Maintaining a history of previous `pageConfig` versions to enable rollback.                     | Not implemented |
| Notification System       | Push or email notifications triggered by domain events (e.g., deployment success, low balance). | Not implemented |

---

## Part 15 — Relation to Other Documents

### 00_FOUNDATION.md

`00_FOUNDATION.md` defines the philosophy and engineering principles of Wuzzkang — why the platform exists, what it values, and what rules govern its engineering decisions. The domain model operationalizes those principles. The principle "information over presentation" is reflected here in the separation between `pageConfig` (information) and templates (presentation). The principle "pageConfig is the only source of truth" is formalized in this document as a domain invariant.

### 03_ARCHITECTURE.md

`03_ARCHITECTURE.md` defines the structural architecture of Wuzzkang — repository boundaries, communication protocols, dependency rules, and deployment topology. This document is intentionally complementary to that one. Where `03_ARCHITECTURE.md` answers "how is the system structured?", this document answers "what does the system represent at the business level?". The ownership assignments in this document align with the architectural ownership matrix in `03_ARCHITECTURE.md`.

### 09_DATABASE_ARCHITECTURE.md

`09_DATABASE_ARCHITECTURE.md` (to be created) will document the physical database implementation: table structures, column definitions, indexes, RPCs, triggers, and migration history. This document deliberately avoids that level of detail. When there is a question of "what does this column mean?", consult `09_DATABASE_ARCHITECTURE.md`. When there is a question of "what does this business concept mean?", consult this document.

---

## Document Status

| Field            | Value                                                      |
|------------------|------------------------------------------------------------|
| Version          | 1.3.0                                                      |
| Status           | Draft                                                      |
| Based on         | Direct codebase reading, June–July 2026                    |
| Verified against | wuzzkang-api, wuzzkang-dashboard, wuzzkang-lp              |
| Next review      | When a new domain entity or business rule is introduced    |

---

## Related Documents

- `00_FOUNDATION.md` — Engineering philosophy and core principles
- `02_CURRENT_STATE.md` — Current implementation status
- `03_ARCHITECTURE.md` — Repository boundaries and structural architecture
- `05_API_SPECIFICATION.md` — Core API Specification
- `09_DATABASE_ARCHITECTURE.md` — Physical database schema and implementation
- `audit/DATABASE_AUDIT_2026_07_01.md` — Database security & audit findings

