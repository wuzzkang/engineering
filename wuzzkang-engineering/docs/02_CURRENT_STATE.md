# Current State

## Document Information

| Field | Value |
|------|------|
| Document | 02_CURRENT_STATE.md |
| Version | 1.0 |
| Status | Draft |
| Purpose | Describe the current implementation state of Wuzzkang |
| Audience | Engineers, AI Assistants |

---

# Purpose

This document describes the current implementation state of Wuzzkang.

It focuses on what exists today, without proposing improvements or future architecture.

Future designs belong to later documents.

---

# Repository Status

## Active Repositories

| Repository | Status | Description |
|------------|--------|-------------|
| wuzzkang-api | Active | Backend API |
| wuzzkang-dashboard | Active | Dashboard |
| wuzzkang-lp | Active | Landing Page Runtime |

---

# Infrastructure

## Runtime

- Node.js
- Next.js
- Vanilla JavaScript

## Database

- Supabase PostgreSQL

## Authentication

- Supabase Auth

## Storage

- Supabase Storage

## Cache

- Redis

---

# Current Runtime Flow

## Project Generation

1. Dashboard
2. API
3. AI
4. Validation
5. Save Draft

---

## Deployment

1. Deploy request
2. Balance deduction
3. Update project
4. Publish

---

## Landing Page Rendering

1. Read slug/domain
2. Load pageConfig
3. Select template
4. Render

---

## Wallet

1. Create VA
2. Webhook
3. Verify
4. Update Balance

---

# Implemented Features

## Core

- Multi-domain generation
- AI generation
- AI image
- Draft project
- Deployment
- Project editing
- Live preview

## Asynchronous Processing (BullMQ & Redis)

- Asynchronous AI Image Generation (Avatar queue with automatic wallet refunds on failure)
- Asynchronous AI Text Copywriting (Field copywriting queue)
- Asynchronous Payment Webhook Processing (Winpay webhook instant response offloading)

## Billing

- Wallet (Credits-based with dynamic Rupiah conversion rate setting)
- Coupon
- Winpay
- Refund
- Transaction (Logs Credit amount and stores IDR raw values in metadata)

## Authentication

- Supabase Auth
- JWT

## Database

- Projects
- Profiles
- Transactions
- Products
- Coupons

---

# Existing Components

## AI

- Sumopod
- Groq

## Payment

- Winpay
- Dummy Provider

## Queue

- BullMQ (Enabled for AI Image, AI Text, and Payment Webhook tasks)

## Rendering

- Dynamic Template Loader

---

# Disabled Features

- GitHub Deployment Worker
- Legacy Deploy Endpoint

---

# Partially Implemented Features

- Custom Domain
- PaymentFactory Refactor
- IP Whitelisting

---

# Known Technical Debt

> Technical debt that currently exists in the codebase.

- Payment controller uses body.userId
- Wallet transaction not fully atomic
- Coupon increment not atomic
- Manual LP versioning
- Legacy "Siluet" naming
- Hardcoded customerNo

---

# Unknown Areas

Areas that require manual verification.

- Large Dashboard Generate Page
- Individual Templates
- Sidebar
- Login
- Topup
- Migration Verification
- Test Coverage
- Production Infrastructure

---

# References

See:

- 00_FOUNDATION.md
- 01_SYSTEM_OVERVIEW.md

---

# Next Reading

03_ARCHITECTURE.md