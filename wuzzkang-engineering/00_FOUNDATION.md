# Wuzzkang Foundation

> "People should describe what they want to build. Wuzzkang should decide how it should be built."

---

## Document Information

| Field | Value |
|------|------|
| Document | 00_FOUNDATION.md |
| Version | 1.0.0 |
| Status | Draft |
| Owner | Muhammad Arif Setiawan |
| Purpose | Define the philosophy, engineering principles, and long-term vision of Wuzzkang |
| Audience | Engineers, AI Assistants, Contributors, Technical Reviewers |

---

# Purpose

This document is the highest-level technical and philosophical reference for the Wuzzkang platform.

It does **not** explain implementation details.

Instead, it explains the principles that should guide every architectural decision, engineering discussion, feature proposal, and AI-generated code.

Frameworks may change.

Infrastructure may change.

Programming languages may change.

The philosophy defined here should remain stable.

Whenever implementation conflicts with this document, the implementation should be questioned before the philosophy.

---

# Table of Contents

1. Introduction
2. Why Wuzzkang Exists
3. Core Philosophy
4. Mental Model
5. Product Philosophy
6. Engineering Philosophy
7. Runtime Philosophy
8. Architecture Principles
9. Engineering Constitution
10. Design Principles
11. Non Goals
12. Official Glossary
13. Wuzzkang Axioms
14. Future Vision
15. Closing Manifesto

---

# 1. Introduction

Wuzzkang is a platform for transforming structured information into digital experiences.

At first glance, it may appear to be an invitation generator or a landing page builder.

It is neither.

Wedding invitations, campaign pages, product catalogs, company profiles, and online stores are merely different domains supported by the same engine.

The real product is the platform itself.

Every generated website is simply one possible representation of structured information.

This distinction influences every engineering decision inside Wuzzkang.

---

# 2. Why Wuzzkang Exists

Most website builders ask users to think like developers.

Typical questions include:

- Which layout should come first?
- Which section should be wider?
- What animation should be used?
- Which font looks better?
- How should this page behave on mobile devices?

These questions belong to engineers.

They should not belong to business owners.

A florist wants to sell flowers.

A couple wants to invite guests.

A restaurant wants customers.

A consultant wants leads.

None of them want to write HTML.

The mission of Wuzzkang is simple:

> Users describe information.

> Wuzzkang determines presentation.

The platform exists to remove unnecessary technical complexity from digital publishing.

---

# 3. Core Philosophy

Everything inside Wuzzkang is built upon a single principle:

> Information is more valuable than presentation.

Presentation changes.

Design trends evolve.

Frameworks become obsolete.

Technology improves.

Information survives.

Therefore the platform protects information first and presentation second.

This philosophy affects:

- Database design
- API contracts
- Rendering engine
- AI integration
- Deployment strategy
- Product evolution

Whenever a decision prioritizes presentation over information, it should be reconsidered.

---

# 4. Mental Model

The most important concept inside Wuzzkang is understanding the lifecycle of information.

```text
Reality
    │
    ▼
Human Information
    │
    ▼
Structured Data (pageConfig)
    │
    ▼
Rendering Runtime
    │
    ▼
Website
```

The website is **not** the source of truth.

The structured data is.

A website is simply one visual interpretation of structured information.

Tomorrow the same data could generate:

- a printable PDF
- a kiosk display
- a mobile application
- an email campaign
- a digital invitation
- a landing page

without changing the underlying information.

---

# 5. The Source of Truth

Every project inside Wuzzkang has exactly one source of truth:

```
pageConfig
```

Not HTML.

Not CSS.

Not screenshots.

Not AI prompts.

Everything begins and ends with pageConfig.

Every repository interacts with pageConfig differently.

Dashboard creates it.

API validates it.

Database stores it.

Renderer interprets it.

AI enriches it.

Nothing should bypass it.

---

# 6. Information Before Presentation

Whenever a new feature is proposed, the first question is never:

> "How should the UI look?"

The correct question is:

> "What information are we trying to represent?"

Example:

Wrong:

"I need a beautiful wedding page."

Correct:

"I need to represent two people, two families, two events, and one invitation."

Beauty is generated.

Meaning is authored.

---

# 7. One Platform, Many Domains

Wedding is not the platform.

Birthday is not the platform.

Campaign is not the platform.

Store is not the platform.

These are domains.

The platform is responsible for rendering structured information regardless of its domain.

Today Wuzzkang supports only a few domains.

Tomorrow it may support dozens.

The philosophy remains unchanged.

---

# 8. The Value of Structure

Structured information has several advantages over manually written HTML.

It is:

- searchable
- versionable
- reusable
- portable
- machine-readable
- AI-friendly

This makes future evolution significantly easier.

Instead of rewriting websites, the platform simply renders the same information differently.

---

# 9. Platform Over Product

Products change.

Platforms evolve.

Wedding invitations may become less popular.

Restaurant websites may become more popular.

Property listings may become important.

Education may become a future market.

The platform should adapt naturally without changing its core identity.

The rendering engine is more valuable than any individual product category.

---

# 10. Foundation Principles

The following principles define the identity of Wuzzkang.

✓ Information is more valuable than presentation.

✓ pageConfig is the only source of truth.

✓ Rendering is deterministic.

✓ AI assists but never owns the platform.

✓ Business logic belongs outside the renderer.

✓ Every repository has one responsibility.

✓ Platforms outlive features.

✓ Simplicity scales.

✓ Architecture is more valuable than convenience.

These principles should guide every future engineering decision.


---

# 11. Product Philosophy

Wuzzkang is not a website builder.

It is a structured publishing platform.

The product should encourage users to describe their information instead of designing interfaces.

Whenever possible, users should answer questions rather than manipulate layouts.

For example:

Instead of asking:

- Which font should be used?
- Where should the image be placed?
- Should this section have rounded corners?

The platform should ask:

- Who is getting married?
- Where is the event?
- What products are being sold?
- What is the campaign about?

The platform owns presentation.

Users own information.

This separation keeps the platform scalable.

---

## Information First

Every feature proposal should begin by identifying the information that needs to be represented.

UI comes later.

Animations come later.

Themes come later.

The information model should always exist before visual implementation.

---

## Domain Independence

Every supported product should follow the same philosophy.

Wedding invitations.

Birthday invitations.

Campaign pages.

Online stores.

Future products.

All of them are different representations of structured information.

No domain should receive architectural privileges over another.

---

## Templates are Replaceable

Templates are visual implementations.

They are intentionally disposable.

A template can be redesigned.

A template can be rewritten.

A template can be deleted.

None of these actions should require changes to business data.

If deleting a template requires changing stored information, the architecture is incorrect.

---

# 12. Engineering Philosophy

Software should be easy to understand before it becomes easy to extend.

Readability is preferred over cleverness.

Explicitness is preferred over magic.

Predictability is preferred over abstraction.

The goal is not writing less code.

The goal is writing code that survives years of maintenance.

---

## Prefer Boring Solutions

When choosing between:

- a clever solution
- a boring solution

Prefer the boring solution.

Boring software is easier to debug.

Boring software is easier to document.

Boring software survives longer.

---

## Optimize for Future Developers

Every line of code should assume that someone else will maintain it.

That someone may be:

- another engineer
- future you
- an AI coding assistant

Write code that minimizes cognitive load.

---

## Minimize Hidden Behavior

Avoid systems that behave differently depending on invisible side effects.

Business rules should be explicit.

Configuration should be visible.

State transitions should be understandable.

Surprises create bugs.

---

## Composition over Duplication

When functionality repeats, extract reusable components.

When behavior differs significantly, keep implementations separate.

Avoid premature abstraction.

Not everything that looks similar should share code.

---

## Every Layer Has One Responsibility

Each repository should solve one category of problems.

Dashboard handles user interaction.

API handles business rules.

LP handles rendering.

Avoid leaking responsibilities across boundaries.

---

# 13. AI Philosophy

Artificial Intelligence is an assistant.

It is never the owner of the architecture.

AI should accelerate engineering.

AI should never replace engineering judgment.

Whenever AI generates code, humans remain responsible for correctness.

---

## AI Should Produce Deterministic Results

Given identical structured input, AI-assisted workflows should produce predictable outcomes whenever possible.

Randomness should be controlled.

Repeatability is valuable.

---

## AI Generates Content

AI does not generate architecture.

AI may generate:

- copywriting
- avatar images
- product descriptions
- campaign text

AI should not decide:

- database schemas
- API contracts
- repository structure
- security decisions

These belong to engineering.

---

## AI Should Respect Existing Architecture

Whenever AI proposes changes, it should first understand:

- repository responsibilities
- existing conventions
- architectural constraints
- documentation

New code should extend the platform.

Not reinvent it.

---

## AI is a Contributor

AI should behave like an experienced engineer joining an existing team.

It should:

read first

understand first

modify later

Large refactors require justification.

Small improvements should respect local conventions.

---

# 14. Runtime Philosophy

Rendering is deterministic.

The runtime exists to transform structured information into presentation.

Nothing more.

It should not contain business logic.

It should not modify stored information.

It should not make financial decisions.

It should not become a second backend.

---

## Pure Rendering

The renderer receives:

```
pageConfig
```

and produces:

```
HTML
```

The renderer should not mutate the input.

It should not write to the database.

It should not trigger payments.

It should not call unrelated APIs.

---

## Stateless Rendering

Rendering should depend only on:

- pageConfig
- rendering parameters
- runtime configuration

Avoid hidden dependencies.

The same input should produce the same output.

---

## Fast by Default

Every generated page should prioritize:

- fast loading
- minimal JavaScript
- mobile responsiveness
- accessibility
- SEO

Performance is a product feature.

---

## Presentation Can Evolve

The rendering engine may improve over time.

Older projects should continue to render correctly whenever possible.

Backward compatibility is valuable.

---

# 15. Repository Responsibilities

Wuzzkang is intentionally separated into multiple repositories.

Each repository owns one responsibility.

---

## Dashboard

Responsible for:

- authentication
- project management
- structured forms
- editing experience
- preview
- billing interface
- AI interaction

The dashboard should never contain business logic.

---

## API

Responsible for:

- validation
- orchestration
- business rules
- billing
- deployment
- queue management
- persistence

The API is the platform brain.

---

## LP

Responsible for:

- rendering
- template loading
- visual presentation
- runtime execution

The LP is intentionally lightweight.

It should remain independent from business rules.

---

## Separation of Concerns

If a feature requires changing all repositories, first verify whether the architecture is correct.

Most features should naturally belong to only one repository.

Cross-repository changes should be uncommon.

When they become frequent, reconsider the system design.

---

# End of Part 2

---

# 16. Architecture Principles

Architecture is the long-term structure of the platform.

Features should adapt to the architecture.

The architecture should not adapt to every new feature request.

A feature may live for weeks.

Architecture should survive for years.

Whenever a feature conflicts with the architecture, the feature should be redesigned before the architecture is changed.

---

## Architecture Evolves Slowly

The architecture of Wuzzkang is expected to evolve.

However, architectural changes must be intentional.

Architecture should never change because:

- a new framework becomes popular
- AI suggests a different structure
- another project uses a different pattern

Architecture changes only when the current design can no longer support the long-term vision.

---

## Favor Evolution Over Revolution

Large rewrites are expensive.

Whenever possible:

improve

instead of

replace.

Prefer incremental improvements over complete rewrites.

Every major rewrite should answer one question:

"What problem cannot be solved by evolving the current architecture?"

If no clear answer exists, avoid the rewrite.

---

## Stable Core, Flexible Edges

Some parts of Wuzzkang should rarely change.

Examples:

- pageConfig philosophy
- repository responsibilities
- rendering pipeline
- business boundaries

Other parts are expected to evolve frequently.

Examples:

- templates
- UI
- themes
- AI providers
- payment providers

Protect the core.

Experiment at the edges.

---

## Every Layer Has Boundaries

The platform consists of multiple layers.

Each layer has one responsibility.

```
User

↓

Dashboard

↓

API

↓

Database

↓

Runtime

↓

Browser
```

Responsibilities should always flow downward.

Business logic should never move into the Runtime.

Presentation should never move into the Database.

Database should never own UI decisions.

---

# 17. Engineering Constitution

Every contributor should follow the same engineering rules.

These rules exist to protect long-term maintainability.

---

## Rule 1

Prefer explicit code over clever code.

Code is read far more often than it is written.

---

## Rule 2

Business logic belongs inside the API.

Never duplicate business rules inside:

- Dashboard
- LP
- Templates

---

## Rule 3

Rendering should remain deterministic.

The same pageConfig should always produce the same website.

---

## Rule 4

Repositories communicate through contracts.

Never through assumptions.

Examples of contracts:

- API schema
- pageConfig
- HTTP responses
- Type definitions

---

## Rule 5

Every new feature must have a clear owner.

Ask:

Which repository owns this feature?

If the answer is "all of them",

the feature probably needs redesign.

---

## Rule 6

Every architectural decision should reduce future complexity.

Not current effort.

Short-term convenience often creates long-term maintenance costs.

---

## Rule 7

Documentation is part of the architecture.

Undocumented architecture slowly disappears.

Whenever architecture changes:

update the documentation.

---

## Rule 8

Optimize for maintainability.

Not cleverness.

Not novelty.

Not trends.

---

## Rule 9

The platform should become easier to understand over time.

Not harder.

Every refactor should reduce cognitive load.

---

## Rule 10

When uncertain,

choose the solution that future engineers will understand first.

---

# 18. Decision Framework

Before implementing any feature, evaluate it using the following questions.

---

## Step 1

What information is being represented?

If this question cannot be answered,

the feature is probably UI-driven.

---

## Step 2

Does this require changing pageConfig?

If yes,

is the new information fundamental,

or merely visual?

Visual changes should not modify the data model.

---

## Step 3

Which repository owns the responsibility?

Dashboard?

API?

LP?

Only one should be the primary owner.

---

## Step 4

Can existing architecture support it?

If yes,

extend.

If no,

identify why.

Architecture changes require justification.

---

## Step 5

Will this increase complexity?

If yes,

is the added complexity permanent,

or temporary?

Permanent complexity requires stronger justification.

---

## Step 6

Can AI understand this decision six months from now?

If documentation is required,

write the documentation first.

Then write the code.

---

# 19. Design Principles

Design exists to communicate.

Decoration is secondary.

Communication is primary.

Every visual decision should improve understanding.

---

## Mobile First

Every template should be designed for mobile devices before desktop.

Most users will interact with generated websites using smartphones.

Desktop is an enhancement.

Mobile is the baseline.

---

## Accessibility

Generated websites should be usable by as many people as possible.

Whenever practical:

- semantic HTML
- keyboard navigation
- sufficient color contrast
- meaningful image descriptions
- proper heading hierarchy

Accessibility is part of quality.

---

## Performance

Performance is a feature.

Users should never pay the cost of unnecessary visual complexity.

Prefer:

- lightweight JavaScript
- optimized assets
- lazy loading
- efficient rendering

---

## Consistency

Every template may look different.

Every interaction should feel familiar.

Users should learn the platform once.

Not every template individually.

---

## Progressive Enhancement

Content should remain available even when optional enhancements fail.

Animations should improve the experience.

They should never become a dependency.

---

## Timeless Design

Avoid following temporary design trends.

Prefer visual styles that remain attractive for years.

Longevity is more valuable than novelty.

---

# 20. Anti Patterns

The following practices should be avoided.

---

## Business Logic Inside Templates

Templates exist to render.

Not to decide.

---

## Presentation Driving Data

Changing colors should not require changing database schemas.

---

## AI Owning Architecture

AI assists implementation.

Humans own architecture.

---

## Hidden State

Avoid behavior that depends on invisible conditions.

State should always be explicit.

---

## Premature Abstraction

Not everything needs to become reusable immediately.

Duplicate first.

Abstract later.

---

## Large Refactors Without Clear Benefits

Never rewrite working systems simply because a newer technology exists.

---

## Repository Responsibility Drift

Avoid moving responsibilities between repositories without architectural discussion.

Boundaries protect maintainability.

---

## Optimizing Before Measuring

Do not optimize code because it "feels slow."

Measure first.

Optimize second.

---

# End of Part 3

---

# 21. Core Values

The following values define how engineering decisions should be made within Wuzzkang.

These values are intentionally independent from technology.

Programming languages may change.

Frameworks may change.

Infrastructure may change.

These values should remain stable.

---

## Simplicity Over Complexity

Simple systems are easier to understand.

Simple systems are easier to debug.

Simple systems survive longer.

Complexity should only be introduced when it solves a proven problem.

---

## Explicit Over Implicit

Behavior should be visible.

Configuration should be visible.

State should be visible.

Hidden behavior increases maintenance cost.

---

## Platform Over Product

Products evolve.

Platforms endure.

Every engineering decision should strengthen the platform instead of optimizing for a single product category.

---

## Long-Term Over Short-Term

Avoid decisions that save one hour today but create months of future maintenance.

Engineering should optimize for sustainability.

---

## Documentation Over Assumption

If important knowledge exists only inside one person's head,

the platform is already accumulating technical debt.

Documentation is part of the implementation.

---

## Evolution Over Rewrite

Improve existing systems whenever possible.

Large rewrites should be exceptional events.

---

## Consistency Over Cleverness

Developers should recognize familiar patterns throughout the codebase.

Consistency reduces cognitive load.

---

## Determinism Over Randomness

Predictable systems are easier to test.

Predictable systems are easier to maintain.

Predictable systems are easier to trust.

---

# 22. Official Glossary

This glossary defines the official meaning of common terms used throughout Wuzzkang.

---

## Project

A website created by a user.

A project contains structured information that can be rendered into a public website.

---

## pageConfig

The canonical structured representation of a project.

This is the single source of truth.

Everything else is derived from it.

---

## Domain

A business category supported by the platform.

Examples include:

- Wedding
- Birthday
- Campaign
- Store

Future domains should follow the same architectural philosophy.

---

## Renderer

A deterministic function that transforms pageConfig into HTML.

---

## Template

A reusable renderer implementation.

Templates define presentation only.

---

## Theme

A visual variation of a template.

Themes never modify business information.

---

## Dashboard

The application used to create and manage projects.

---

## API

The orchestration layer responsible for validation, business rules, deployment, and persistence.

---

## Runtime

The rendering engine responsible for producing websites.

---

## Preview

A temporary rendering used while editing.

---

## Published Project

A project that has been successfully deployed and is publicly accessible.

---

## Draft

A project that exists but has not yet been published.

---

## Wallet

The balance used for paid platform operations.

---

## AI Generation

Any operation where artificial intelligence assists in generating content.

Examples:

- copywriting
- avatar generation
- marketing text
- product descriptions

---

## Guest Name

A rendering parameter used for invitation personalization.

It is not part of pageConfig.

---

# 23. Wuzzkang Axioms

The following axioms summarize the philosophy of the platform.

1. Information outlives presentation.

2. pageConfig is the only source of truth.

3. Rendering is deterministic.

4. AI assists but does not own architecture.

5. Business logic belongs to the API.

6. Rendering belongs to the Runtime.

7. Editing belongs to the Dashboard.

8. Documentation is part of engineering.

9. Simplicity scales.

10. Consistency beats cleverness.

11. Platforms outlive products.

12. Every repository owns one responsibility.

13. Architecture evolves slowly.

14. Data should be reusable.

15. Templates are replaceable.

16. Presentation is temporary.

17. Structured information is permanent.

18. Optimize for maintainability.

19. Protect the core.

20. Experiment at the edges.

---

# 24. Future Vision

The current capabilities of Wuzzkang represent only the beginning of the platform.

The long-term vision extends beyond invitations and landing pages.

As long as information can be represented structurally,

Wuzzkang should be capable of publishing it.

Possible future domains include:

- Company Profiles
- Restaurant Websites
- Property Listings
- Digital Catalogs
- Educational Platforms
- Community Websites
- Healthcare Landing Pages
- Portfolios
- Event Registration
- Membership Platforms

The supported domains may evolve.

The underlying philosophy should remain unchanged.

---

## Long-Term Vision

```
People

↓

Structured Information

↓

pageConfig

↓

Rendering Engine

↓

Any Digital Experience
```

Today:

Website

Tomorrow:

- Mobile App
- PDF
- Email
- Digital Signage
- Printed Material
- API Response
- Voice Assistant
- Future Interfaces

The destination format is temporary.

The structured information is permanent.

---

# 25. Closing Manifesto

Wuzzkang is built on a simple belief.

People should communicate ideas.

Computers should handle complexity.

Artificial intelligence should amplify creativity.

Structured information should outlive technology.

Presentation should evolve without changing meaning.

Every engineering decision should move the platform closer to this vision.

The goal is not merely to generate websites.

The goal is to build a platform where information can be transformed into any digital experience through deterministic, maintainable, extensible systems.

Technology will evolve.

Frameworks will evolve.

Programming languages will evolve.

Artificial intelligence will evolve.

The philosophy should not.

---

# Document Status

Version: 1.0.0

Status: Draft

Next Recommended Documents:

- 01_ARCHITECTURE.md
- 02_CURRENT_STATE.md
- 03_ROADMAP.md
- 04_AI_CONSTITUTION.md
- 05_DOMAIN_MODEL.md

---

End of Document