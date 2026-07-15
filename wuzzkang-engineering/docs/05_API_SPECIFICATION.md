# Wuzzkang Core API Specification

---

## Document Information

| Field | Value |
|---|---|
| Version | 1.0.0 |
| Status | Structure Approved |
| Target System | Wuzzkang Backend API |

---

## Purpose

This document defines the canonical HTTP API specification for the Wuzzkang platform. It serves as the contract between the Wuzzkang backend services and all client systems (dashboard, rendering engine, third-party payment gateways, and integrations).

---

## Out of Scope

This specification does not cover:
- High-level business invariants or entities (documented in `04_DOMAIN_MODEL.md`).
- Logical database structures, tables, RLS policies, or stored procedures (documented in `09_DATABASE_ARCHITECTURE.md`).
- Client-side application routing, state management, or UI render cycles.
- Server controller implementations, middleware algorithms, or runtime code patterns.

---

## Part 1 — API Design Principles
* **Purpose:** Establish the architectural paradigms and architectural guidelines governing Wuzzkang's API design.
* **Scope:** RESTful standards, resource-oriented modeling, HTTP verb mappings, and protocol standards.
* **Out of Scope:** Code level route registration syntax or specific library selections (e.g. Express/Fastify).

### 1.1 Architectural Paradigms & Conventions
Wuzzkang follows the REST (Representational State Transfer) architectural style for API interaction, focusing on resources and stateless communication:
* **Resource-Oriented Path Design:** URI paths represent nouns identifying entities (e.g. `/api/projects`, `/api/profile`). 
* **HTTP Method Mapping:**
  * `GET` (Safe, Idempotent): Used exclusively for retrieving resources (e.g. fetching user profiles or fetching specific projects). No state updates or side effects may occur on GET requests.
  * `POST` (Non-Idempotent): Used for creating resources (e.g. initiating payment transactions), trigger actions, and state transitions (e.g. deploying a project, AI content generation).
* **Stateless Communication:** The API server preserves no session state in memory. Each request is independent and contains all validation details and identity claims (via JWT tokens) needed to authorize and execute the request.
* **Separation of Concerns:** Business rule calculations (e.g. billing, project deployment state machine rules, coupon validation limits) are encapsulated strictly inside the API services. Client repositories (such as the Dashboard and Landing Page) are restricted to UI representation and dynamic rendering consumption.
* **Strict Router Validation:** Payload formats are validated via Zod schemas at the Express router boundary before propagating to business logic services, preventing incomplete or malformed data from reaching SQL execution layers.

---

## Part 2 — API Versioning & Base URL Strategy
* **Purpose:** Define how version updates are managed and how the base API endpoints are resolved.
* **Scope:** Versioning mechanisms (URL, headers, query params), environment URLs (development, staging, production), and subdomains.
* **Out of Scope:** DNS configuration details or network proxy/load balancer specifications.

### 2.1 API Versioning Strategy
* **Verified Implementation:** The active API code does not currently apply version prefix segments (e.g., resources are bound directly under `/api/projects` instead of `/api/v1/projects`).
* **Architectural Convention:** To maintain backward compatibility and support future platform evolution, major API updates causing breaking envelope modifications will adopt URI-based versioning (e.g., `/api/v1/projects`).

### 2.2 Base URL Resolution Strategy
API host resolution is driven by the running environment to ensure correct routing of dashboard traffic and external payment webhooks:
* **Local Development:** `http://localhost:3026/api` (The API server runs on port `3026` by default in local scripts, while template assets and static previews resolve separately).
* **Staging Environment:** `https://api-staging.wuzzkang.com/api`
* **Production Environment:** `https://api.wuzzkang.com/api`

---

## Part 3 — Authentication & Authorization
* **Purpose:** Outline security controls governing access to API endpoints.
* **Scope:** JWT token format, credentials propagation, user context validation, and role-based permissions access.
* **Out of Scope:** Supabase Auth system authentication internals or user credential storage mechanisms.

### 3.1 Token Propagation & Middleware Validation
* **JWT Propagation:** User authentication is verified using JSON Web Tokens (JWT) issued by Supabase Auth (GoTrue). The Dashboard propagates this token in every HTTP request header:
  `Authorization: Bearer <access_token>`
* **Token Verification Middleware (`authMiddleware`):** The middleware intercepts the request, parses the Bearer token, and executes a verification check against the Supabase service instance (`supabase.auth.getUser(token)`).
* **Request Context Attachment:** Upon successful token verification, the auth middleware attaches the verified user's unique identifier to the request context object:
  `req.user = { id: user.id }`
  Any request lacking a token or containing an invalid/expired signature is rejected immediately with a `401 Unauthorized` status response.

### 3.2 Service Role Database Bypassing & Authorization
* **Database Access Mode:** The API is configured to bypass PostgreSQL Row-Level Security (RLS) policies by initializing database client instances using the privileged `SUPABASE_SERVICE_KEY`.
* **API-Level Authorization Enforcement:** Because the API operates in a database RLS-bypassed mode, the API service layer must explicitly enforce tenant boundaries. For example, when fetching or updating a project, services must verify that the project's owning user matches the authenticated user ID (`req.user.id`).

---

## Part 4 — Request & Response Standards
* **Purpose:** Standardize payload formats and request/response envelopes.
* **Scope:** JSON body formats, common response envelopes, default payload values, and mandatory HTTP headers.
* **Out of Scope:** Specific language serialization serializers or ORM output format definitions.

### 4.1 Content Negotiation & Common Headers
* **Payload Type:** All request payloads modifying data (POST) must be serialized in JSON format.
* **Required Headers:**
  * `Content-Type: application/json`
  * `Authorization: Bearer <access_token>` (for authenticated endpoints)

### 4.2 Response Envelope Specifications
* **Success Envelope (Verified Implementation):**
  Successful responses wrap results inside a consistent payload layout:
  ```json
  {
    "success": true,
    "data": { ... }
  }
  ```
* **Error Envelope (Verified Implementation):**
  When errors occur (authentication failure, server issues, validation errors), the API responds with `success: false` and uses three verified structures depending on the failure source:
  1. *String Error Envelope* (typically from route controllers or auth middleware):
     ```json
     {
       "success": false,
       "error": "Unauthorized: Invalid token"
     }
     ```
  2. *Centralized Exception Object* (returned by `errorMiddleware.js`):
     ```json
     {
       "success": false,
       "error": {
         "message": "Internal Server Error"
       }
     }
     ```
  3. *Validation Error Envelope* (returned by router Zod checks):
     ```json
     {
       "success": false,
       "error": {
         "pageData": ["Invalid template configuration"]
       }
     }
     ```
* **Unified Error Envelope (Architectural Convention):**
  To simplify client parsing across all endpoints, all future errors should be standardized to output a unified object block:
  ```json
  {
    "success": false,
    "error": {
      "code": "ERROR_CODE",
      "message": "Human-readable description of error",
      "details": []
    }
  }
  ```

## Part 5 — Error Handling Specification
* **Purpose:** Standardize error structures returned to client applications on failures.
* **Scope:** Standard error response schemas, error code definitions, HTTP status code mappings, and validation payload error lists.
* **Out of Scope:** Internal server error stack traces or log aggregation configurations.

### 5.1 HTTP Status Code Mappings
The Wuzzkang API maps specific business validations and authentication failures to standard HTTP status codes:
* **`400 Bad Request`:** Raised when request input parameters fail schema validation (Zod parsing), or when coupon requirements are violated (e.g. usage limit reached).
* **`401 Unauthorized`:** Returned when the Bearer token is missing, malformed, or has an invalid/expired cryptographic signature.
* **`402 Payment Required`:** Returned when the user attempts a deployment or AI generation but has insufficient wallet balance to cover the cost.
* **`403 Forbidden`:** Returned when the tenant validation boundary check fails (e.g. the user attempts to retrieve or edit a project owned by a different user profile).
* **`404 Not Found`:** Returned when the requested resource (Project, Product, or Coupon) does not exist in the database.
* **`500 Internal Server Error`:** Unhandled exceptions or server-side connection failures. Centralized middleware (`errorMiddleware.js`) intercepts these, log the trace internally, and return a clean payload to the client.

### 5.2 Error Response Payload Structure
Errors returned from validation schemas output flat arrays corresponding to the invalid properties. Standard exceptions format a structured exception payload as defined in the request/response standards.

---

## Part 6 — Query Parameters: Pagination, Filtering, & Sorting
* **Purpose:** Define patterns for querying resource collections.
* **Scope:** Page/limit standards, query filter parameter formats, multi-column sorting patterns, and collection search patterns.
* **Out of Scope:** Database SQL query building implementations or index performance optimizations.

### 6.1 Collection Queries Specification
* **Verified Implementation:** Currently, list endpoints (`GET /api/projects` and `GET /api/products`) do not implement pagination, filtering, or sorting at the HTTP API level. The API simply returns the entire list of user-owned projects or active products directly.
* **Architectural Convention:** To prevent memory bloat and latency degradation as collection sizes grow, all future query operations returning arrays should implement the following query standards:
  * **Pagination Parameters:**
    * `page` (Integer): The target page index (1-indexed, defaults to `1`).
    * `limit` (Integer): The number of items to return per page (defaults to `10`, maximum allowed value is `100`).
  * **Filtering Parameter Pattern:** Filter criteria map directly to table column attributes (e.g. `/api/projects?status=deployed`).
  * **Sorting Parameter Pattern:**
    * `sort_by` (String): The column name to sort by (e.g. `created_at`).
    * `sort_dir` (Enum): The direction of sorting (`asc` or `desc`).

---

## Part 7 — Idempotency & Rate Limiting
* **Purpose:** Enforce API reliability, safety, and abuse prevention.
* **Scope:** Idempotency header conventions, retry-after timings, transaction deduping, and rate limit header keys.
* **Out of Scope:** Redis cache layer connection codes or system limit storage specs.

### 7.1 Idempotency Mechanisms
* **Verified Implementation:** Idempotency is enforced for payment provider webhook notifications. The callback handler verifies that the transaction's `order_id` references a pending transaction row in the database. If the payment gateway sends a duplicate notification, the API ignores the request if the local status is already updated to `SUCCESS` or `FAILED`, protecting the user balance from double-crediting.
* **Architectural Convention:** Write operations (POST, PUT) modifying sensitive resources should support client-propagated header validation:
  * **Header Key:** `X-Idempotency-Key` (standard UUID value generated by client).
  * **Behavior:** The API cache detects identical keys within a 24-hour window, returning cached response headers without re-executing service methods.

### 7.2 Usage Limits & Rate Limiting
* **Verified Implementation:** AI generation tasks utilize a daily free usage quota. 
  * The daily quota limit (`daily_ai_limit`, defaults to `15`) is tracked in Redis using keys structured as `wuzzkang:user:<userId>:ai_field_limit:<yyyy-mm-dd>`.
  * If the user's daily count is below the limit, the request is executed for free.
  * If the count is equal to or exceeds the limit, the API charges the user's wallet. If the user profile balance is insufficient to pay the fee (`ai_generate_cost`), the request is rejected with a `400` status.

---

## Part 8 — Resource Specifications
* **Purpose:** Establish the contract shapes of primary API resources.
* **Scope:** Logical attributes specifications for Profiles, Projects, Transactions, Products, and Coupons schemas.
* **Out of Scope:** Database column specifications or logical domain rules.

### 8.1 Resource Schema Contracts
The following JSON definitions represent the structured data models returned in response payloads:

#### Profile Resource
Represents the user's wallet account state and usage limitations:
```json
{
  "id": "uuid",
  "email": "string",
  "full_name": "string",
  "avatar_url": "string | null",
  "balance": "integer",
  "daily_ai_limit": "integer",
  "ai_generate_cost": "integer",
  "remainingFree": "integer",
  "updated_at": "string (ISO-8601)"
}
```

#### Project Resource
Represents the configuration payload of a generated/deployed page:
```json
{
  "id": "uuid",
  "user_id": "uuid",
  "slug": "string",
  "status": "draft | deployed | failed",
  "live_url": "string | null",
  "edit_count": "integer",
  "page_data": {
    "meta": {
      "title": "string",
      "template_type": "wedding | birthday | toko-online | campaign | store",
      "theme": "string",
      "design_key": "string"
    },
    "content": {
      "groom": {
        "name": "string",
        "nickname": "string",
        "father": "string",
        "mother": "string",
        "image_url": "string | null"
      },
      "bride": {
        "name": "string",
        "nickname": "string",
        "father": "string",
        "mother": "string",
        "image_url": "string | null"
      },
      "story": [
        {
          "title": "string",
          "date": "string",
          "desc": "string",
          "image_url": "string | null"
        }
      ],
      "akad": {
        "date": "string",
        "time": "string",
        "location": "string",
        "maps_url": "string | null"
      },
      "resepsi": {
        "date": "string",
        "time": "string",
        "location": "string",
        "maps_url": "string | null"
      },
      "gift": {
        "bank_name": "string | null",
        "account_number": "string | null",
        "account_holder": "string | null"
      },
      "quote": "string"
    }
  }
}
```
*(Note: `page_data.content` schema adapts dynamically to the target template_type matching `StorePageSchema`, `WeddingPageSchema`, `BirthdayPageSchema`, `TokoOnlinePageSchema`, or `CampaignPageSchema` details as declared in validation schemas).*

#### Transaction Resource
Represents balance mutations and audits:
```json
{
  "id": "uuid",
  "user_id": "uuid",
  "amount": "integer",
  "type": "topup | deployment | refund",
  "status": "PENDING | SUCCESS | FAILED",
  "reference_id": "string | null",
  "gateway_status": "string | null",
  "metadata": "object"
}
```

#### Product Resource
Represents registered templates available for deployment purchase:
```json
{
  "id": "string",
  "cost": "integer",
  "active": "boolean"
}
```

#### Coupon Resource
Represents discount validations:
```json
{
  "id": "uuid",
  "code": "string",
  "discount_amount": "integer",
  "active": "boolean",
  "max_uses": "integer",
  "uses_count": "integer"
}
```

## Part 9 — Endpoint Specifications
* **Purpose:** Specify the contract paths, input standards, and expected responses of all HTTP endpoints.
* **Scope:** URL paths, HTTP verbs, path variables, query strings, request payloads, response payloads, and exception triggers per endpoint.
* **Out of Scope:** Handler controller logic or service client database operations.

### 9.1 Profile & Catalog Endpoints

#### `GET /api/profile`
* **Purpose:** Retrieve the profile configuration, wallet balance, AI usage quotas, and tracking pixel configuration of the authenticated user.
* **Authentication Required:** Yes (Bearer JWT).
* **Headers:** `Authorization: Bearer <access_token>`
* **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "data": {
      "id": "18f9e612-40e9-4e4b-9e45-cf80d38b556b",
      "email": "user@example.com",
      "full_name": "Jhon Doe",
      "avatar_url": null,
      "balance": 1500,
      "daily_ai_limit": 15,
      "ai_generate_cost": 1,
      "credit_price_idr": 100,
      "remainingFree": 12,
      "tracking_config": {
        "facebook_pixel_id": "1234567890",
        "google_analytics_id": "G-XXXXXXXXXX",
        "google_ads_id": "AW-XXXXXXXXXX",
        "tiktok_pixel_id": "CXXXXXXXXXXXXXXXXX"
      },
      "updated_at": "2026-07-01T12:00:00.000Z"
    }
  }
  ```
* **Exception Triggers:**
  * `401 Unauthorized`: Token is missing or validation signature checks fail.

#### `PATCH /api/profile/tracking`
* **Purpose:** Save or update the user's tracking pixel configuration. These IDs are stored once in `profiles.tracking_config` and automatically merged into every generated `page_data.meta` at request-time, so they apply to all landing pages without re-entry.
* **Authentication Required:** Yes (Bearer JWT).
* **Headers:** `Authorization: Bearer <access_token>`, `Content-Type: application/json`
* **Request Body Schema (all fields optional, pass `null` to clear):**
  ```json
  {
    "facebook_pixel_id": "string | null",
    "google_analytics_id": "string | null",
    "google_ads_id": "string | null",
    "tiktok_pixel_id": "string | null"
  }
  ```
* **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "data": {
      "tracking_config": {
        "facebook_pixel_id": "1234567890",
        "google_analytics_id": "G-XXXXXXXXXX",
        "google_ads_id": null,
        "tiktok_pixel_id": null
      }
    }
  }
  ```
* **Exception Triggers:**
  * `400 Bad Request`: Invalid field values (e.g. value exceeds 100 chars).
  * `401 Unauthorized`: Token is missing or expired.

#### `GET /api/products`
* **Purpose:** Retrieve the listing of template products with their associated cost configurations.
* **Authentication Required:** Yes (Bearer JWT).
* **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "data": [
      {
        "id": "wedding",
        "cost": 190,
        "active": true
      },
      {
        "id": "birthday",
        "cost": 190,
        "active": true
      }
    ]
  }
  ```

#### `POST /api/coupons/validate`
* **Purpose:** Validate a coupon code entered by the user and calculate discount value.
* **Authentication Required:** Yes (Bearer JWT).
* **Request Body Schema:**
  ```json
  {
    "code": "string (min: 1)"
  }
  ```
* **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "data": {
      "id": "b1a134a4-1188-4226-bf73-b295c52e4d0d",
      "code": "DISCOUNT50",
      "discount_type": "fixed",
      "discount_value": 50000,
      "max_uses_per_user": 1
    }
  }
  ```
* **Exception Triggers:**
  * `400 Bad Request`: Coupon is inactive, expired, non-existent, or usage limits are exceeded.

---

### 9.2 Project Management & Deployment Endpoints

#### `POST /api/projects/draft`
* **Purpose:** Persist a pre-compiled `pageData` as a new draft project record after asynchronous AI Platform generation completes. No AI is invoked — the caller must supply a fully compiled `pageData` object obtained from the task result.
* **Authentication Required:** Yes (Bearer JWT).
* **Usage Context:** Called exclusively by the wedding template async flow in the dashboard after `GET /api/v1/ai/task/:id` returns `completed` and the compiled `pageData` is downloaded from `result_url`.
* **Request Body Schema:**
  ```json
  {
    "name": "string (2-100 characters)",
    "template_type": "string (default: 'wedding')",
    "pageData": "object (compiled pageData from AI Platform task result)"
  }
  ```
* **Success Response (201 Created):**
  ```json
  {
    "success": true,
    "data": {
      "id": "31b9d4cf-2321-4f11-9a74-9f874bcde102",
      "projectId": "31b9d4cf-2321-4f11-9a74-9f874bcde102",
      "name": "Pernikahan Budi & Ani",
      "pageData": { "..." }
    }
  }
  ```
* **Exception Triggers:**
  * `400 Bad Request`: Missing or invalid `name` or `pageData` fields.

#### `GET /api/projects`
* **Purpose:** List all projects (drafts and deployed) owned by the authenticated user.
* **Authentication Required:** Yes (Bearer JWT).
* **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "data": [
      {
        "id": "31b9d4cf-2321-4f11-9a74-9f874bcde102",
        "slug": "wedding-jhon-jane",
        "status": "deployed"
      }
    ]
  }
  ```

#### `GET /api/projects/:id`
* **Purpose:** Retrieve full configuration details and pageConfig data of a specific project.
* **Authentication Required:** Yes (Bearer JWT).
* **Path Parameters:** `id` (UUID)
* **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "data": {
      "id": "31b9d4cf-2321-4f11-9a74-9f874bcde102",
      "user_id": "18f9e612-40e9-4e4b-9e45-cf80d38b556b",
      "slug": "wedding-jhon-jane",
      "status": "deployed",
      "live_url": "https://wuzzkang.github.io/wedding-jhon-jane/",
      "edit_count": 0,
      "page_data": { ... }
    }
  }
  ```
* **Exception Triggers:**
  * `403 Forbidden`: The target project belongs to another user.
  * `404 Not Found`: Project ID does not exist.

#### `POST /api/projects/:id/deploy`
* **Purpose:** Trigger deployment execution for a draft project. This process deducts the product cost from the user's wallet, applies discount coupons if provided, and configures the live publishing details.
* **Authentication Required:** Yes (Bearer JWT).
* **Path Parameters:** `id` (UUID)
* **Request Body Schema:**
  ```json
  {
    "slug": "string (lowercase only, a-z, 0-9, dash only; min 3, max 50 chars)",
    "couponCode": "string (optional)"
  }
  ```
  * **Slug Validation:** The `slug` field must match `/^[a-z0-9-]+$/`. Uppercase letters, underscores, and spaces are rejected with `400 Bad Request`.
  * **Final Stored Slug:** The API appends a 6-character deterministic suffix derived from the first 6 hex characters of the project UUID before storing (e.g., user supplies `toko-saya`, stored as `toko-saya-3b9d4c`). This guarantees global uniqueness without additional DB queries.
* **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Project deployed",
    "project": {
      "id": "31b9d4cf-2321-4f11-9a74-9f874bcde102",
      "status": "deployed",
      "live_url": "https://wuzzkang.github.io/wedding-jhon-jane/"
    }
  }
  ```
* **Exception Triggers:**
  * `402 Payment Required`: Insufficient balance in wallet to purchase the template deployment.
  * `400 Bad Request`: Slug format validation failure (uppercase, invalid chars) or coupon requirements validation failure.

#### `POST /api/projects/:id/retry-pages`
* **Purpose:** Manually re-trigger enabling of GitHub Pages configurations for projects that are marked deployed but failed CDN activation.
* **Authentication Required:** Yes (Bearer JWT).
* **Path Parameters:** `id` (UUID)
* **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "GitHub Pages retry triggered"
  }
  ```

#### `POST /api/projects/:id/edit-deployed`
* **Purpose:** Update the content configuration (`pageData`) of an already active landing page. This mutation is restricted to a maximum of 3 times.
* **Authentication Required:** Yes (Bearer JWT).
* **Path Parameters:** `id` (UUID)
* **Request Body Schema:**
  ```json
  {
    "pageData": "object (must match PageSchema schema definitions)"
  }
  ```
* **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Deployed project updated",
    "project": {
      "id": "31b9d4cf-2321-4f11-9a74-9f874bcde102",
      "edit_count": 1
    }
  }
  ```
* **Exception Triggers:**
  * `400 Bad Request`: Validation failures in PageSchema fields, or edit limit quota (3) has already been reached.

#### `DELETE /api/projects/:id`
* **Purpose:** Permanently delete a project. This releases any claimed subdomains, deletes all uploaded user images from Supabase Storage associated with this project (while preserving default template placeholder images located under `/defaults/`), and deletes the database row in the `projects` table.
* **Authentication Required:** Yes (Bearer JWT).
* **Path Parameters:** `id` (UUID)
* **Success Response (200 OK):**
* ```json
  {
    "success": true,
    "message": "Proyek beserta seluruh asetnya berhasil dihapus."
  }
  ```
* **Exception Triggers:**
  * `400 Bad Request`: User does not own the project, or the project does not exist.
  * `401 Unauthorized`: Token is missing or expired.

#### `POST /api/deploy`
* **Purpose:** Asynchronously add a project deployment task to the background processing queue (legacy/worker flow).
* **Authentication Required:** Yes (Bearer JWT).
* **Request Body Schema:**
  ```json
  {
    "projectId": "uuid",
    "pageData": "object (PageSchema)",
    "repoName": "string (min: 3, max: 100)",
    "templateOwner": "string (optional, default: 'wuzzkang')",
    "templateRepo": "string (optional, default: 'landing-page-template')"
  }
  ```
* **Success Response (202 Accepted):**
  ```json
  {
    "success": true,
    "message": "Deployment job added to queue",
    "jobId": "string (job queue id)"
  }
  ```

#### `GET /api/jobs/:id/status`
* **Purpose:** Retrieve the current status, progress, and result of a queued BullMQ background job.
* **Authentication Required:** Yes (Bearer JWT).
* **URL Parameters:**
  * `id`: string (the unique job queue identifier).
* **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "jobId": "string",
    "state": "string (completed | failed | active | delayed | waiting)",
    "progress": "number | object",
    "failedReason": "string (only if failed)",
    "result": "object (returnValue from job execution, if completed)"
  }
  ```
* **Exception Triggers:**
  * `404 Not Found`: If the job with the requested ID does not exist in the queue.

---

### 9.3 AI Generation & Payment Endpoints

#### `POST /api/generate`
* **Purpose:** Orchestrate LLM content creation. This endpoint generates a complete, structured landing page JSON config from a high-level user prompt.
* **Authentication Required:** Yes (Bearer JWT).
* **Request Body Schema:**
  ```json
  {
    "projectId": "uuid (optional, maps to existing draft to update)",
    "name": "string (min: 2)",
    "prompt": "string (min: 5)",
    "template_type": "wedding | birthday | toko-online | campaign",
    "wedding_details": "object (optional)",
    "birthday_details": "object (optional)",
    "toko_online_details": "object (optional)",
    "campaign_details": "object (optional)"
  }
  ```
* **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "data": {
      "projectId": "31b9d4cf-2321-4f11-9a74-9f874bcde102",
      "pageData": { ... }
    }
  }
  ```
* **Exception Triggers:**
  * `400 Bad Request`: Target domain details are missing for `template_type`, or the template type is inactive/unregistered.
  * `402 Payment Required`: Free AI quota is exhausted and user has insufficient balance to pay the generation fee.

#### `POST /api/generate/field`
* **Purpose:** Generate content/copy values for a specific input field using AI.
* **Authentication Required:** Yes (Bearer JWT).
* **Request Body Schema:**
  ```json
  {
    "fieldType": "store_description | product_description | store_quote | campaign_hero | campaign_problems | campaign_benefits | campaign_testimonials | campaign_urgency | cv_summary | cv_experience_description",
    "context": {
      "storeName": "string (optional)",
      "storeTagline": "string (optional)",
      "productName": "string (optional)",
      "productPrice": "string (optional)",
      "campaignName": "string (optional)",
      "campaignBrief": "string (optional)",
      "profileName": "string (optional)",
      "profileTitle": "string (optional)",
      "profileSummary": "string (optional)",
      "company": "string (optional)",
      "position": "string (optional)",
      "description": "string (optional)"
    }
  }
  ```
* **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "data": {
      "content": "AI generated marketing copy string...",
      "remainingFree": 11,
      "charged": 0
    }
  }
  ```
* **Exception Triggers:**
  * `400 Bad Request`: Validation failure in payload fields.
  * `402 Payment Required`: Daily AI quota exhausted and balance is insufficient.

#### `POST /api/generate-image`
* **Purpose:** Generate an AI image (avatar) using OpenAI DALL-E, download it, and host it on Supabase Storage.
* **Authentication Required:** Yes (Bearer JWT).
* **Request Body Schema:**
  ```json
  {
    "prompt": "string (min: 5)"
  }
  ```
* **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "url": "https://supabase-url/wuzzkang-bucket/image-name.png",
    "remainingFree": 11,
    "charged": 0
  }
  ```
* **Exception Triggers:**
  * `500 Internal Server Error`: OpenAI service communication failures or image download/upload error.

#### `POST /api/media/process`
* **Purpose:** Unified endpoint for dynamic image/media processing with built-in graceful fallback logic.
* **Authentication Required:** Yes (Bearer JWT).
* **Request Body Schema:**
  ```json
  {
    "mode": "generate_avatar | search_unsplash | merge_couple | change_background",
    "params": {
      "prompt": "string (required for generate_avatar)",
      "query": "string (optional for search_unsplash)",
      "category": "string (optional for search_unsplash)",
      "image_url_1": "string (required for merge_couple)",
      "image_url_2": "string (required for merge_couple)",
      "image_url": "string (required for change_background)",
      "background_prompt": "string (optional for change_background, e.g. white)"
    }
  }
  ```
* **Success Response (200 OK):**
  * *For generate_avatar:*
    ```json
    {
      "success": true,
      "url": "https://supabase-url/wuzzkang-bucket/uploads/filename.png",
      "remainingFree": 11,
      "charged": 0
    }
    ```
  * *For search_unsplash:*
    ```json
    {
      "success": true,
      "url": "https://images.unsplash.com/photo-1519741497674-611481863552?...",
      "urls": [
        "https://images.unsplash.com/photo-1519741497674-611481863552?...",
        "..."
      ],
      "fallback": true
    }
    ```
  * *For merge_couple:*
    ```json
    {
      "success": true,
      "message": "Pemrosesan penggabungan foto AI telah dimulai.",
      "predictionId": "string",
      "url": "https://source-image-url.jpg",
      "fallback": true
    }
    ```
  * *For change_background:*
    ```json
    {
      "success": true,
      "url": "https://supabase-url/wuzzkang-bucket/uploads/bgremoved-filename.png",
      "fallback": true
    }
    ```
* **Exception Triggers:**
  * `400 Bad Request`: Validation failure (missing mode or required mode parameters).
  * `402 Payment Required`: Daily AI quota exhausted and balance is insufficient.

#### `POST /api/media/prewedding`
* **Purpose:** Two-step AI pipeline to analyze uploaded groom & bride photos via Gemini 2.5 Flash and generate a composite romantic prewedding-style image using Gemini Imagen 3 (with automatic fallback to OpenAI/Sumopod/Aesthetic Stock Photos).
* **Authentication Required:** Yes (Bearer JWT).
* **Request Body Schema:**
  ```json
  {
    "groomImageUrl": "string (required, public URL of groom photo)",
    "brideImageUrl": "string (required, public URL of bride photo)",
    "style": "string (optional, visual style hint, e.g. 'elegant romantic')"
  }
  ```
* **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "preweddingPhotoUrl": "https://supabase-url/wuzzkang-bucket/prewedding-filename.png",
    "promptUsed": "string (AI-generated scene prompt)"
  }
  ```
* **Exception Triggers:**
  * `400 Bad Request`: Missing groomImageUrl or brideImageUrl.
  * `500 Internal Server Error`: All generator and stock image fallbacks failed.

#### `POST /api/media/upload`
* **Purpose:** Mediated backend endpoint to receive binary file uploads from the dashboard client, upload them to Supabase Storage, and return the hosted public URL.
* **Authentication Required:** Yes (Bearer JWT).
* **Headers:**
  * `Authorization: Bearer <access_token>`
  * `Content-Type: <mime-type (e.g. image/jpeg, image/png)>`
  * `x-file-name: <original-filename (e.g. avatar.jpg)>`
* **Request Body:** Raw binary file payload (stream/octet-stream).
* **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "url": "https://supabase-url/wuzzkang-bucket/uploads/1783047641634-gya9gs.jpg"
  }
  ```
* **Exception Triggers:**
  * `400 Bad Request`: Empty file payload.
  * `401 Unauthorized`: Token is missing or validation signature checks fail.
  * `500 Internal Server Error`: Backend error uploading to Supabase Storage.

#### `GET /api/payment-methods`
* **Purpose:** Retrieve active payment methods configured in the database.
* **Authentication Required:** Yes (Bearer JWT).
* **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "data": [
      {
        "id": "qris",
        "name": "QRIS",
        "is_active": true,
        "config": {
          "mode": "image",
          "image_url": "/qris.png"
        }
      },
      {
        "id": "virtual_account",
        "name": "Virtual Account",
        "is_active": true,
        "config": {
          "channels": ["BCA", "MANDIRI", "BNI", "BRI"]
        }
      }
    ]
  }
  ```

### 9.5 Custom Domain & Subdomain Endpoints

#### `POST /api/domains/claim-subdomain`
* **Purpose:** Claim a unique subdomain prefix (`{name}.siluet.web.id`) for an active project. Deducts a one-time non-refundable fee of 10 credits from the user's wallet.
* **Authentication Required:** Yes (Bearer JWT).
* **Request Body Schema:**
  ```json
  {
    "project_id": "uuid (required)",
    "subdomain_name": "string (min 3, max 15, alphanumeric + hyphens only)"
  }
  ```
* **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "data": {
      "domain": "andi.siluet.web.id",
      "domain_type": "subdomain",
      "domain_status": "active",
      "new_balance": 990
    }
  }
  ```
* **Exception Triggers:**
  * `400 Bad Request`: Validation failure on Zod schema checks.
  * `402 Payment Required`: Insufficient wallet credit balance (requires 10 credits).
  * `403 Forbidden`: The target project is not owned by the authenticated user.
  * `404 Not Found`: Project ID does not exist.
  * `409 Conflict`: Subdomain name is already claimed by another project (`SUBDOMAIN_TAKEN`).

#### `GET /api/domains/:projectId`
* **Purpose:** Retrieve the active domain mapping, URLs, and status config for a specific project.
* **Authentication Required:** Yes (Bearer JWT).
* **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "data": {
      "project_id": "uuid",
      "custom_domain": "andi.siluet.web.id",
      "domain_type": "subdomain",
      "domain_status": "active",
      "slug_url": "https://siluet.web.id/?slug=slug-xxx",
      "domain_url": "https://andi.siluet.web.id"
    }
  }
  ```

#### `DELETE /api/domains/:projectId`
* **Purpose:** Release the claimed subdomain or custom domain from a project. The 10 credit claiming fee is non-refundable.
* **Authentication Required:** Yes (Bearer JWT).
* **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Custom domain/subdomain berhasil dihapus."
  }
  ```

#### `GET /api/domains/check`
* **Purpose:** Check the global availability of a subdomain name.
* **Authentication Required:** Yes (Bearer JWT).
* **Query Parameters:**
  * `name` (String, required): Subdomain name to verify.
* **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "data": {
      "name": "andi",
      "available": true,
      "full_domain": "andi.siluet.web.id"
    }
  }
  ```

#### `POST /api/admin/payments/:id/complete`

* **Purpose:** Manually mark a pending top-up payment transaction as PAID.
* **Authentication Required:** Yes (Bearer JWT). Must possess `complete_payment` permission in `public.role_access`.
* **Headers:**
  * `X-Admin-Secret`: Standard pre-shared administrative secret token.
* **Path Parameters:**
  * `id`: UUID of the target transaction record.
* **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Transaction completed successfully",
    "newBalance": 1500
  }
  ```
* **Exception Triggers:**
  * `401 Unauthorized`: Missing session token or invalid `X-Admin-Secret` header value.
  * `403 Forbidden`: Authenticated user role is not authorized with `complete_payment` privilege.

#### `POST /api/payments/create`
* **Purpose:** Create a new pending top-up transaction record and generate a virtual account payment number or manual QRIS payment instructions.
* **Authentication Required:** Yes (Bearer JWT).
* **Request Body Schema:**
  ```json
  {
    "amount": "integer (positive credit count to purchase, e.g. 100)",
    "userId": "uuid",
    "channel": "string (payment channel description, e.g. CIMB)"
  }
  ```
* **Success Response (200 OK):**
  ```json
  {
    "id": "uuid",
    "user_id": "uuid",
    "amount": 500,
    "type": "topup",
    "status": "PENDING",
    "order_id": "INV-1719888888",
    "description": "Top-up via CIMB",
    "va_number": "1234567890123456",
    "metadata": {
      "channel": "CIMB",
      "customerNo": "081234567890",
      "cash_amount": 50000,
      "credit_price": 100,
      "winpay": { "responseCode": "2002700", "responseDescription": "Success", "virtualAccountData": { "partnerServiceId": "88301", "customerNo": "081234567890", "virtualAccountNo": "88301081234567890", "virtualAccountName": "Wuzzkang User" } }
    }
  }
  ```
* **Exception Triggers:**
  * `400 Bad Request`: Missing required payload properties (amount, userId, or channel).

#### `GET /api/payments/pending`
* **Purpose:** Retrieve the currently active, unexpired pending top-up transaction for the authenticated user (to display active invoices or block duplicate checkout spam).
* **Authentication Required:** Yes (Bearer JWT).
* **Success Response (200 OK):**
  - If a pending transaction exists:
    ```json
    {
      "success": true,
      "data": {
        "id": "uuid",
        "user_id": "uuid",
        "amount": 500,
        "type": "topup",
        "status": "PENDING",
        "order_id": "INV-1719888888",
        "va_number": "88301081234567890",
        "metadata": {
          "channel": "BCA",
          "customerNo": "081234567890",
          "cash_amount": 50000,
          "credit_price": 100,
          "expired_at": "2026-07-06T15:30:00.000Z"
        }
      }
    }
    ```
  - If no pending transaction exists:
    ```json
    {
      "success": true,
      "data": null
    }
    ```

#### `POST /api/payments/:id/cancel`
* **Purpose:** Cancel a pending top-up payment transaction, marking its status as `EXPIRED`.
* **Authentication Required:** Yes (Bearer JWT).
* **Path Parameters:**
  * `id`: UUID of the transaction to cancel.
* **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "data": {
      "id": "uuid",
      "status": "EXPIRED"
    }
  }
  ```

#### `GET /api/payments/history`
* **Purpose:** Retrieve all historical ledger transactions (top-ups, deployments, etc.) for the authenticated user, ordered by creation date descending.
* **Authentication Required:** Yes (Bearer JWT).
* **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "data": [
      {
        "id": "uuid",
        "user_id": "uuid",
        "amount": 500,
        "type": "topup",
        "status": "PAID",
        "order_id": "INV-1719888888",
        "created_at": "2026-07-06T14:00:00.000Z",
        "metadata": {
          "channel": "QRIS",
          "cash_amount": 50000
        }
      },
      {
        "id": "uuid",
        "user_id": "uuid",
        "amount": -100,
        "type": "deployment",
        "status": "SUCCESS",
        "created_at": "2026-07-06T12:00:00.000Z",
        "metadata": {}
      }
    ]
  }
  ```

---

### 9.4 AI Platform (Task Orchestration) Endpoints

#### `POST /api/v1/ai/execute`
* **Purpose:** Submit a new AI rendering task. Performs idempotency deduplication, atomic wallet deduction, and enqueues the task for background processing.
* **Authentication Required:** Yes (Bearer JWT).
* **Idempotency:** Requests sharing the same `idempotencyKey` within a 60-second window return the original task without re-charging the wallet.
* **Request Body Schema:**
  ```json
  {
    "idempotencyKey": "string (min: 8, max: 128) — required",
    "projectId": "uuid | null (optional)",
    "templateType": "string (e.g. 'wedding', 'birthday', 'product') — required",
    "styleKey": "string (e.g. 'prewedding', 'artistic') — required",
    "providerKey": "string (default: 'gemini') — optional",
    "inputAssets": [
      { "url": "string (valid URL)", "role": "string (e.g. 'groom', 'bride')" }
    ],
    "inputContext": "object (optional, arbitrary key-values for compiler)",
    "async": "boolean (default: true)"
  }
  ```
* **Success Response (202 Accepted) — New task:**
  ```json
  {
    "success": true,
    "data": {
      "taskId": "uuid",
      "status": "queued",
      "technicalStatus": "none",
      "creditsUsed": 4,
      "isIdempotent": false
    }
  }
  ```
* **Success Response (200 OK) — Idempotent duplicate:**
  ```json
  {
    "success": true,
    "data": {
      "taskId": "uuid",
      "status": "queued",
      "technicalStatus": "none",
      "creditsUsed": 4,
      "isIdempotent": true
    }
  }
  ```
* **Exception Triggers:**
  * `400 Bad Request`: Missing or invalid fields (idempotencyKey, inputAssets[].url format, etc.).
  * `402 Payment Required`: Insufficient wallet credits (`INSUFFICIENT_FUNDS`).
  * `500 Internal Server Error`: Task record creation failed (wallet refund issued automatically).

---

#### `GET /api/v1/ai/task/:id`
* **Purpose:** Poll the current status of an AI rendering task. Results are scoped to the authenticated user — users cannot read other users' tasks.
* **Authentication Required:** Yes (Bearer JWT).
* **Path Parameters:** `id` (UUID)
* **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "data": {
      "taskId": "uuid",
      "status": "queued | processing | completed | failed",
      "technicalStatus": "none | uploading_assets | building_prompt | calling_provider | saving_result",
      "errorMessage": "string | null",
      "resultUrl": "string | null",
      "creditsUsed": 4,
      "createdAt": "2026-07-05T00:00:00.000Z",
      "updatedAt": "2026-07-05T00:01:00.000Z"
    }
  }
  ```
* **Exception Triggers:**
  * `400 Bad Request`: `id` path parameter is not a valid UUID format.
  * `404 Not Found`: Task does not exist or does not belong to the authenticated user.

---

## Part 10 — Webhook Specifications

* **Purpose:** Specify asynchronous event contracts sent to or received from external platforms.
* **Scope:** Webhook payload formats, authentication signatures, payload validations (e.g. WinPay notification schemas), and retry behaviors.
* **Out of Scope:** External gateway webhook dispatcher engines or proxy routing settings.

### 10.1 Inbound Webhook: WinPay Payment Callback
The API exposes a public, unauthenticated endpoint to receive payment state changes from the WinPay gateway:
* **Endpoint Path:** `POST /api/payments/webhook` (also resolves `/api/payment/webhook/*` dynamic routes).
* **Headers:**
  * `X-Signature` or `Signature`: Cryptographic hash generated by WinPay for request verification.
  * `X-Timestamp` or `Timestamp`: Epoch millisecond or ISO timestamp.
* **Inbound Payload Structure:**
  ```json
  {
    "trxId": "string (references order_id in transactions table)",
    "paidAmount": {
      "value": "integer",
      "currency": "IDR"
    },
    "responseCode": "string (e.g. 2002700 for success)",
    "responseMessage": "string"
  }
  ```
* **Processing Behavior:**
  1. The handler extracts the signature headers and raw request body.
  2. The signature is verified against the payload to validate authenticity. If validation fails, it returns `401 Unauthorized` (`responseCode: "4012700"`).
  3. The local transaction is retrieved. If the transaction is not found, it returns `404 Not Found` (`responseCode: "4042700"`).
  4. If the transaction has already been processed (`status: "PAID"`), it immediately exits with a `200` status.
  5. If the callback indicates success, the API invokes `walletService.completeTransaction()` to update the transaction status and add funds to the user's profile balance.
* **Success Outbound Response (200 OK):**
  Matches the payment provider's SNAP success format response payload.

---

## Part 11 — File Upload APIs
* **Purpose:** Define how clients upload binary assets and images.
* **Scope:** File upload endpoints, pre-signed upload URLs, size limit constraints, and response file metadata.
* **Out of Scope:** Centralized Supabase Storage bucket policy configurations.

### 11.1 Client Upload Architecture
The Wuzzkang platform uses a **Direct-to-Storage Upload via Signed URLs** model to handle file uploads securely without exhausting backend server resources:

1. **Get Upload URL**: The Dashboard calls the backend API endpoint `POST /api/media/upload-url` providing the target file's metadata.
2. **Direct PUT Upload**: The Dashboard performs a direct binary HTTP `PUT` request to the returned pre-signed URL to upload the asset directly to the Supabase Storage Bucket.

#### `POST /api/media/upload-url`
* **Purpose:** Request a pre-signed upload URL for direct client-to-storage upload.
* **Authentication Required:** Yes (Bearer JWT).
* **Request Body Schema:**
  ```json
  {
    "fileName": "string (original filename, e.g. avatar.jpg)",
    "mimeType": "string (allowed image mime-types: image/jpeg, image/jpg, image/png, image/webp, image/gif)",
    "category": "string (optional folder category, e.g. avatar | background | gallery | story | product | cv | other)"
  }
  ```
* **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "signedUrl": "https://supabase-url/storage/v1/s3/signed-upload-url-token...",
    "token": "string (signed token)",
    "path": "uploads/user-uuid/category/timestamp.ext",
    "publicUrl": "https://supabase-url/storage/v1/object/public/wuzzkang-bucket/uploads/user-uuid/category/timestamp.ext"
  }
  ```
* **Exception Triggers:**
  * `400 Bad Request`: Missing required request body parameters, or unsupported MIME-type.

#### Direct Upload Execution
The client must upload the raw binary payload to `signedUrl` using `PUT`:
```http
PUT /storage/v1/s3/signed-upload-url-token... HTTP/1.1
Content-Type: image/jpeg

[Raw Binary Data]
```

### 11.2 Upload Constraints
* **Size Limit**: Enforced dynamically client-side based on the `NEXT_PUBLIC_MAX_UPLOAD_SIZE_MB` env variable (default: `5MB`). Non-images exceeding this size are blocked immediately.
* **Auto-Resizing**: If an image exceeds the maximum upload size, the client-side `compressImage` utility automatically resizes and compresses the image to fit within the `NEXT_PUBLIC_MAX_IMAGE_SIZE_KB` threshold (default: `300KB`) before uploading. If compression fails or the final size still exceeds the limit, the upload is aborted.
* **Type Constraints**: Only whitelisted image MIME-types (`image/jpeg`, `image/png`, `image/webp`, `image/gif`) are signed by the backend.

### 11.3 Legacy Endpoint (Deprecated)
* **`POST /api/media/upload`**: Prompts the backend to proxy binary uploads to Supabase. This route is deprecated and will be removed in a future release.

### 11.4 Media Deletion API

#### `DELETE /api/media`
* **Purpose:** Delete an uploaded file/image from Supabase Storage bucket.
* **Authentication Required:** Yes (Bearer JWT).
* **Request Body Schema:**
  ```json
  {
    "path": "string (storage relative path, e.g. uploads/user-uuid/gallery/timestamp.png)"
  }
  ```
* **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Berkas berhasil dihapus dari storage."
  }
  ```
* **Exception Triggers:**
  * `400 Bad Request`: Missing path in request body.
  * `403 Forbidden`: Authenticated user is not the owner of the target file (checked via path hierarchy or legacy name).
  * `500 Internal Server Error`: Backend error removing file from Supabase bucket.

---

## Part 12 — API Security Standards
* **Purpose:** Specify security configurations protecting the API endpoints.
* **Scope:** CORS policies, SSL/TLS specifications, payload validation, SQL injection blocks, and sanitization standards.
* **Out of Scope:** Database RLS policy statements.

### 12.1 Security Controls
Wuzzkang enforces the following security standards across all public-facing backend endpoints:
* **CORS Policies:** Cross-Origin Resource Sharing is enabled via CORS middleware to restrict request origins. Requests are allowed from authorized Dashboard and Landing Page host subdomains.
* **Transport Encryption:** All production traffic is encrypted using TLS 1.3 over HTTPS.
* **Zod Payload Validation:** All POST request bodies, path parameters, and query parameters are parsed using Zod schemas at the router level, blocking malformed inputs and SQL injection attempts.
* **Service Role Isolation:** The API server bypasses database RLS securely using the `SUPABASE_SERVICE_KEY`. Access to this key is strictly limited to the backend runtime container. The client Dashboard is restricted to the low-privileged `anon` key.
* **Cryptographic Signature Verification:** External payment callbacks are authenticated using RSA signature verification. Webhooks lacking valid signatures are rejected before executing database balance credits, preventing balance manipulation.
* **Sanitization:** Input values are stripped of execution scripts to prevent Cross-Site Scripting (XSS) when pages are dynamically loaded on the Landing Page.

## Part 13 — OpenAPI / Swagger Alignment
* **Purpose:** Outline how this document maps to automatically generated Swagger schemas.
* **Scope:** Path formats, model definitions, authentication scheme properties, and description generation.
* **Out of Scope:** Local Swagger UI package setup or Swagger-to-client SDK generators.

### 13.1 JSDoc to OpenAPI Compilation
* **Verified Status:** Swagger/OpenAPI specifications are currently **not implemented** in the active codebase repository.
* **Proposed Convention:** Future iterations should employ `swagger-jsdoc` to generate OpenAPI 3.0 schemas from routes comments, rendering a GUI under `/api-docs` using the following config structure:
  * Route endpoints must map variables to the central models.
  * Security configurations must expose `BearerAuth` properties mapping to standard HTTP headers.

---

## Part 14 — Deprecation Policy & Backward Compatibility
* **Purpose:** Define how deprecated endpoints are phased out and how API updates maintain backward compatibility.
* **Scope:** Deprecation headers, notice windows, version deprecation cycles, and breaking change definitions.
* **Out of Scope:** Feature branch merging or git workflow guidelines.

### 14.1 Deprecation Standards
To ensure continuity of frontend dashboard modules and rendering runtimes, all endpoint modifications must adhere to these conventions:
* **Backward Compatibility Invariants:** Existing API routes must not delete fields from response payloads or add required properties to request bodies.
* **Deprecation Notice Headers:** When an endpoint is marked for deprecation, its response headers must include:
  * `Deprecation: true`
  * `Sunset: <Date-RFC-1123>`
* **Grace Period Window:** Deprecated endpoints must be maintained in active status for a minimum sunset window of `90 days` prior to hard deletion from routing tables.

---

## Part 15 — API Examples
* **Purpose:** Provide complete, raw HTTP request and response examples for typical flows.
* **Scope:** Request/response cycles for project creation, wallet billing checkout, WinPay top-ups, and coupon validation.
* **Out of Scope:** Code snippets for client applications or SDK integration examples.

### 15.1 Flow Examples

#### 1. Page Configuration Generation (`POST /api/generate`)
* **Request:**
  ```http
  POST /api/generate HTTP/1.1
  Host: api.wuzzkang.com
  Authorization: Bearer mock-jwt-token-value
  Content-Type: application/json

  {
    "name": "Wedding of Jhon & Jane",
    "prompt": "Buat undangan pernikahan bernuansa sage green romantis untuk Jhon dan Jane",
    "template_type": "wedding",
    "wedding_details": {
      "groom": {
        "name": "Jhon Doe",
        "nickname": "Jhon",
        "father": "Father Doe",
        "mother": "Mother Doe"
      },
      "bride": {
        "name": "Jane Smith",
        "nickname": "Jane",
        "father": "Father Smith",
        "mother": "Mother Smith"
      }
    }
  }
  ```
* **Response (200 OK):**
  ```http
  HTTP/1.1 200 OK
  Content-Type: application/json

  {
    "success": true,
    "data": {
      "projectId": "31b9d4cf-2321-4f11-9a74-9f874bcde102",
      "pageData": {
        "meta": {
          "title": "Wedding of Jhon & Jane",
          "theme": "sage-green",
          "template_type": "wedding",
          "design_key": "sage-green"
        },
        "content": {
          "groom": {
            "name": "Jhon Doe",
            "nickname": "Jhon",
            "father": "Father Doe",
            "mother": "Mother Doe",
            "image_url": null
          },
          "bride": {
            "name": "Jane Smith",
            "nickname": "Jane",
            "father": "Father Smith",
            "mother": "Mother Smith",
            "image_url": null
          },
          "quote": "Cinta sejati adalah berjalan bersama..."
        }
      }
    }
  }
  ```

#### 2. Project Deployment (`POST /api/projects/:id/deploy`)
* **Request:**
  ```http
  POST /api/projects/31b9d4cf-2321-4f11-9a74-9f874bcde102/deploy HTTP/1.1
  Host: api.wuzzkang.com
  Authorization: Bearer mock-jwt-token-value
  Content-Type: application/json

  {
    "slug": "jhon-jane-wedding",
    "couponCode": "DISCOUNT50"
  }
  ```
* **Response (200 OK):**
  ```http
  HTTP/1.1 200 OK
  Content-Type: application/json

  {
    "success": true,
    "message": "Project deployed",
    "project": {
      "id": "31b9d4cf-2321-4f11-9a74-9f874bcde102",
      "status": "deployed",
      "live_url": "https://wuzzkang.github.io/jhon-jane-wedding/"
    }
  }
  ```

#### 3. Top-Up VA Generation (`POST /api/payments/create`)
* **Request:**
  ```http
  POST /api/payments/create HTTP/1.1
  Host: api.wuzzkang.com
  Authorization: Bearer mock-jwt-token-value
  Content-Type: application/json

  {
    "amount": 50000,
    "userId": "18f9e612-40e9-4e4b-9e45-cf80d38b556b",
    "channel": "CIMB"
  }
  ```
* **Response (200 OK):**
  ```http
  HTTP/1.1 200 OK
  Content-Type: application/json

  {
    "id": "77f722a2-3f82-4211-93c1-0cbe4a9ef1c2",
    "user_id": "18f9e612-40e9-4e4b-9e45-cf80d38b556b",
    "amount": 50000,
    "type": "topup",
    "status": "PENDING",
    "order_id": "INV-1719888888",
    "description": "Top-up via CIMB",
    "va_number": "1234567890123456"
  }
  ```

#### 4. Coupon Validation (`POST /api/coupons/validate`)
* **Request:**
  ```http
  POST /api/coupons/validate HTTP/1.1
  Host: api.wuzzkang.com
  Authorization: Bearer mock-jwt-token-value
  Content-Type: application/json

  {
    "code": "DISCOUNT50"
  }
  ```
* **Response (200 OK):**
  ```http
  HTTP/1.1 200 OK
  Content-Type: application/json

  {
    "success": true,
    "data": {
      "id": "b1a134a4-1188-4226-bf73-b295c52e4d0d",
      "code": "DISCOUNT50",
      "discount_type": "fixed",
      "discount_value": 50000,
      "max_uses_per_user": 1
    }
  }
  ```

---

## Part 16 — Change Log
* **Purpose:** Track version changes made to the API contracts.
* **Scope:** Chronological release log of API changes (additions, deprecations, modifications).
* **Out of Scope:** Repository git commit histories.

### 16.1 Version History

#### Version 1.0.0 (Released 2026-07-01)
* **Status:** Released
* **Changes:** Initial release of the Wuzzkang Core API Specification including standard endpoint shapes, security headers, and webhook callback schemas.

#### Version 1.1.0 (Released 2026-07-05)
* **Status:** Released
* **Changes:**
  * Added **Section 9.4** — AI Platform (Task Orchestration) Endpoints:
    * `POST /api/v1/ai/execute` — Submit AI rendering task with idempotency dedup, wallet billing, and async queue dispatch.
    * `GET /api/v1/ai/task/:id` — Poll AI task execution status (user-scoped).
  * Both endpoints mount under `/api` with `authMiddleware` (Bearer JWT required).

#### Version 1.2.0 (Released 2026-07-08)
* **Status:** Released
* **Changes:**
  * Updated **Section 11.1** — Added optional `category` parameter to `POST /api/media/upload-url` payload to support uploads to categorized user subfolders (`uploads/userId/category/filename`).
  * Added **Section 11.4** — `DELETE /api/media` endpoint for secure, ownership-validated asset deletion from Supabase Storage.

#### Version 1.3.0 (Released 2026-07-09)
* **Status:** Released
* **Changes:**
  * Added **Section 9.5** — Custom Domain & Subdomain Endpoints:
    * `POST /api/domains/claim-subdomain` — Claim subdomain with Zod format validation and 10 credits wallet deduction.
    * `GET /api/domains/:projectId` — Fetch active domain and target URL endpoints.
    * `DELETE /api/domains/:projectId` — Release claimed subdomain from active project.
    * `GET /api/domains/check` — Verify subdomain prefix availability.

---

## Part 17 — Related Documents

* **Purpose:** Provide references to related technical specifications.
* **Scope:** References to `00_FOUNDATION.md`, `02_CURRENT_STATE.md`, `03_ARCHITECTURE.md`, `04_DOMAIN_MODEL.md`, `09_DATABASE_ARCHITECTURE.md`, and `audit/DATABASE_AUDIT_2026_07_01.md`.
* **Out of Scope:** Non-engineering business plans or slide decks.

### 17.1 Reference Listing
- [00_FOUNDATION.md](file:///home/bms-del112/BMS/personal-project/wuzzkang/wuzzkang-engineering/docs/00_FOUNDATION.md) — Platform engineering foundation & philosophy
- [02_CURRENT_STATE.md](file:///home/bms-del112/BMS/personal-project/wuzzkang/wuzzkang-engineering/docs/02_CURRENT_STATE.md) — Tech debt & issue logs
- [03_ARCHITECTURE.md](file:///home/bms-del112/BMS/personal-project/wuzzkang/wuzzkang-engineering/docs/03_ARCHITECTURE.md) — Physical repository & boundaries layout
- [04_DOMAIN_MODEL.md](file:///home/bms-del112/BMS/personal-project/wuzzkang/wuzzkang-engineering/docs/04_DOMAIN_MODEL.md) — Conceptual business invariant models
- [09_DATABASE_ARCHITECTURE.md](file:///home/bms-del112/BMS/personal-project/wuzzkang/wuzzkang-engineering/docs/09_DATABASE_ARCHITECTURE.md) — Storage engine RLS & triggers spec
- [DATABASE_AUDIT_2026_07_01.md](file:///home/bms-del112/BMS/personal-project/wuzzkang/wuzzkang-engineering/audit/DATABASE_AUDIT_2026_07_01.md) — Database schema audit report
