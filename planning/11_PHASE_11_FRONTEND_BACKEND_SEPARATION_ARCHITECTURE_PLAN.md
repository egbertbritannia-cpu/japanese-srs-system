# Phase 11 — Frontend / Backend Separation Architecture & Migration Plan

> Status: **APPROVED ARCHITECTURE PLAN**
>
> Project: **Japanese SRS System**
>
> Date: **2026-10-07**
>
> Scope: Refactor the current Next.js full-stack repository into two independently deployable projects while preserving the existing learning experience, data, SRS behavior, offline support, media pipeline, and integrations.

---

## 1. Decision Summary

The project will be separated into two applications:

| Project | Technology | Primary responsibility |
|---|---|---|
| **japanese-srs-web** | Next.js + React + TypeScript | Presentation, interaction, PWA, offline cache, client state |
| **japanese-srs-api** | Fastify + TypeScript | Business logic, FSRS, database, AI/RAG, integrations, media APIs |

The backend remains a **modular monolith**. This project will **not** be split into microservices.

The persistence stack remains:

- **Turso / SQLite-compatible database**
- **Drizzle ORM**
- **Google Drive** for multimodal assets
- Existing Google integrations where still useful

The frontend remains deployable on Vercel.

The existing production site is considered a **single-user personal application** protected by **Vercel Authentication**. No multi-user login system, JWT architecture, user registration, RBAC, tenant isolation, or SaaS authentication layer will be added unless the product scope changes in the future.

---

# 2. Why This Refactor Is Being Done

The current repository started as a Next.js full-stack application and accumulated several responsibilities inside one deployment:

- UI rendering
- Next.js API routes
- FSRS scheduling
- Turso / SQLite persistence
- AI / RAG
- Google integrations
- multimodal media handling
- offline synchronization
- crawlers and manifest generation
- application tests
- CI / SRE tooling

This was useful while the project evolved quickly, but it now creates several architectural problems:

1. UI code and backend business rules have weak boundaries.
2. FSRS logic can be invoked through more than one execution path.
3. API route files can contain too much business logic.
4. Backend services are difficult to test independently from Next.js.
5. Client-side and server-side concerns are mixed.
6. Deployment of the UI is coupled to backend changes.
7. Database tests currently depend too strongly on application state.
8. Future backend experimentation is harder because the backend is embedded in the web project.

Separating FE and BE creates a clean boundary without introducing microservice complexity.

---

# 3. Important Scope Change: Add Card Is Removed

The project no longer supports general card creation by the user.

Therefore the new architecture must **not preserve dead add-card functionality merely for backward compatibility**.

The following features must be audited and removed if they are no longer reachable or required:

- manual Add Card page
- POST card-creation endpoint
- card creation server action
- AI draft-to-card approval path
- automatic card insertion from sentence mining
- capture API paths whose sole purpose is inserting cards
- create-card agent skills that are no longer used
- UI buttons or navigation to card creation
- tests that exist only for card creation
- obsolete documentation describing card creation as a current feature

Read-only card retrieval remains.

Review state mutation remains.

Grammar/practice state mutation remains where required.

Administrative import scripts may remain **only if they are explicitly treated as maintenance tools**, not user-facing application APIs.

---

# 4. Target System Architecture

~~~text
                   ┌──────────────────────────────┐
                   │      japanese-srs-web        │
                   │                              │
                   │ Next.js + React + TypeScript │
                   │                              │
                   │ Pages / Components           │
                   │ Feature state                │
                   │ IndexedDB / Dexie            │
                   │ Offline review queue         │
                   │ API client                   │
                   └──────────────┬───────────────┘
                                  │
                                  │ HTTPS REST / JSON
                                  │
                                  ▼
                   ┌──────────────────────────────┐
                   │      japanese-srs-api        │
                   │                              │
                   │ Fastify + TypeScript         │
                   │                              │
                   │ Routes / Controllers         │
                   │ Services                     │
                   │ Domain                       │
                   │ Repositories                 │
                   │ Integrations                 │
                   └───────────┬─────────┬────────┘
                               │         │
                         ┌─────▼───┐ ┌───▼────────────┐
                         │  Turso  │ │  Google Drive   │
                         │ SQLite  │ │  Google APIs    │
                         └─────────┘ └────────────────┘
~~~

Architectural rule:

> **Frontend owns presentation and offline client state. Backend owns business truth. Domain code owns business rules. Database code owns persistence. Integrations own external systems.**

---

# 5. Repository Strategy

## 5.1 Final repositories

### Repository A

**japanese-srs-web**

Responsibilities:

- Next.js routes/pages
- UI components
- visual design
- PWA behavior
- client-side state
- IndexedDB
- offline review queue
- network status
- API client
- client-side accessibility
- browser performance
- frontend tests

### Repository B

**japanese-srs-api**

Responsibilities:

- Fastify application
- REST endpoints
- FSRS review processing
- review transaction integrity
- scheduler optimization
- grammar backend operations
- card retrieval
- RAG / AI
- Google integrations
- media access
- Turso/Drizzle
- migrations
- crawler data orchestration
- backend tests

---

# 6. Backend Architecture

The backend must use a layered modular-monolith structure.

~~~text
HTTP Request
    │
    ▼
Route / Controller
    │
    ▼
Service / Use Case
    │
    ▼
Domain
    │
    ▼
Repository
    │
    ▼
Database
~~~

External services are accessed through integration adapters:

~~~text
Service
   │
   ├── Repository ──> Turso
   ├── AI Provider ──> OpenAI / Gemini
   ├── Google Adapter ──> Google APIs
   └── Media Adapter ──> Google Drive
~~~

## 6.1 Proposed backend layout

~~~text
japanese-srs-api/
├── src/
│   ├── app.ts
│   ├── server.ts
│   │
│   ├── modules/
│   │   ├── cards/
│   │   │   ├── cards.routes.ts
│   │   │   ├── cards.service.ts
│   │   │   ├── cards.repository.ts
│   │   │   ├── cards.schemas.ts
│   │   │   └── cards.types.ts
│   │   │
│   │   ├── reviews/
│   │   │   ├── reviews.routes.ts
│   │   │   ├── reviews.service.ts
│   │   │   ├── reviews.repository.ts
│   │   │   ├── reviews.schemas.ts
│   │   │   └── reviews.types.ts
│   │   │
│   │   ├── grammar/
│   │   ├── scheduler/
│   │   ├── chat/
│   │   ├── media/
│   │   ├── google/
│   │   └── health/
│   │
│   ├── domain/
│   │   ├── fsrs/
│   │   ├── grammar/
│   │   ├── conjugation/
│   │   ├── kanji/
│   │   └── interference/
│   │
│   ├── db/
│   │   ├── client.ts
│   │   ├── schema.ts
│   │   ├── migrations/
│   │   └── seed/
│   │
│   ├── integrations/
│   │   ├── google/
│   │   ├── ai/
│   │   └── drive/
│   │
│   ├── infrastructure/
│   │   ├── config/
│   │   ├── logging/
│   │   └── errors/
│   │
│   └── shared/
│       ├── types/
│       └── utils/
│
├── scripts/
│   ├── crawlers/
│   ├── imports/
│   └── maintenance/
│
├── tests/
│   ├── unit/
│   ├── integration/
│   └── contract/
│
├── drizzle/
├── package.json
├── tsconfig.json
└── README.md
~~~

---

# 7. Frontend Architecture

The frontend must not import backend persistence or server integration modules.

## 7.1 Proposed frontend layout

~~~text
japanese-srs-web/
├── src/
│   ├── app/
│   │   ├── page.tsx
│   │   ├── review/
│   │   ├── cards/
│   │   ├── grammar/
│   │   ├── conjugation/
│   │   ├── integrations/
│   │   └── ielts/
│   │
│   ├── features/
│   │   ├── review/
│   │   ├── cards/
│   │   ├── grammar/
│   │   ├── media/
│   │   └── integrations/
│   │
│   ├── components/
│   ├── hooks/
│   │
│   ├── lib/
│   │   ├── api/
│   │   │   ├── client.ts
│   │   │   ├── cards.api.ts
│   │   │   ├── reviews.api.ts
│   │   │   ├── grammar.api.ts
│   │   │   ├── media.api.ts
│   │   │   └── chat.api.ts
│   │   │
│   │   └── offline/
│   │       ├── db.ts
│   │       ├── review-queue.ts
│   │       └── sync.ts
│   │
│   ├── types/
│   └── styles/
│
├── public/
├── tests/
├── package.json
└── next.config.ts
~~~

## 7.2 Frontend must not contain

The frontend must not directly import or own:

- Drizzle
- Turso credentials
- database schema
- Google service account credentials
- Google refresh tokens
- AI API keys
- backend FSRS persistence rules
- database transactions
- crawler logic
- Drive upload logic

---

# 8. Backend as the Single Source of Truth for FSRS

This is a non-negotiable invariant.

There must be only **one canonical implementation path** for a review mutation.

~~~text
User chooses rating
      │
      ▼
Frontend
      │
POST /api/v1/reviews
      │
      ▼
ReviewService
      │
      ├── hydrate FSRS card
      ├── calculate next state
      ├── validate transition
      │
      ▼
Database Transaction
      ├── UPDATE card
      └── INSERT review log
      │
      ▼
Response
~~~

The frontend may calculate a visual preview if needed, but the backend result is authoritative.

Any old path that calculates scheduling independently must be removed or delegated to the canonical service.

Examples of patterns that must disappear:

- duplicated scheduling code in server actions
- separate manually computed scheduledDays paths
- direct DB update from a route without ReviewService
- UI code that assumes its predicted next due date is authoritative

---

# 9. Review API Contract

Recommended API version prefix:

**/api/v1**

## 9.1 Retrieve cards

### GET /api/v1/cards

Supported query parameters may include:

- deck
- search
- limit
- state

The route is read-only.

## 9.2 Retrieve due reviews

### GET /api/v1/reviews/due

Returns the canonical review queue.

## 9.3 Submit one review

### POST /api/v1/reviews

Example request:

~~~json
{
  "reviewId": "07180b85-2dd0-4eed-a933-0e6b03a16128",
  "cardId": "card_x",
  "rating": "Good",
  "reviewedAt": 1791351700000
}
~~~

Example response:

~~~json
{
  "success": true,
  "reviewId": "07180b85-2dd0-4eed-a933-0e6b03a16128",
  "cardId": "card_x",
  "state": "Review",
  "stability": 12.42,
  "difficulty": 5.18,
  "scheduledDays": 8,
  "nextReviewDate": "2026-10-15T10:00:00.000Z"
}
~~~

## 9.4 Batch offline sync

### POST /api/v1/reviews/batch

Example:

~~~json
{
  "reviews": [
    {
      "reviewId": "uuid-1",
      "cardId": "card-a",
      "rating": "Good",
      "reviewedAt": 1791351700000
    },
    {
      "reviewId": "uuid-2",
      "cardId": "card-b",
      "rating": "Again",
      "reviewedAt": 1791351760000
    }
  ]
}
~~~

The backend must apply reviews in deterministic chronological order where ordering matters.

---

# 10. Offline-First Architecture

IndexedDB remains in the frontend.

~~~text
ONLINE
Frontend ─────────────> Backend

OFFLINE
Frontend
   │
   ├── cached cards
   └── pending review queue
             │
             ▼
         IndexedDB

CONNECTION RESTORED
IndexedDB
   │
   ▼
POST /api/v1/reviews/batch
   │
   ▼
Backend
~~~

## 10.1 Required idempotency

Every offline review must have a stable client-generated **reviewId**.

Recommended source:

- crypto.randomUUID()

The backend must enforce idempotency.

Pseudo-flow:

~~~text
BEGIN TRANSACTION

Does reviewId already exist?
    │
    ├── YES → return existing result
    │
    └── NO
          │
          ├── calculate FSRS
          ├── update card
          ├── insert review log with reviewId
          └── commit

END TRANSACTION
~~~

This prevents a network retry from applying the same review twice.

---

# 11. Database Plan

## 11.1 Drizzle is the only schema source

The final backend must not maintain two independent schema definitions.

Canonical flow:

~~~text
src/db/schema.ts
      │
      ▼
Drizzle migration
      │
      ▼
Turso / SQLite
~~~

Handwritten CREATE TABLE blocks inside the runtime database client should be phased out once the migration path is confirmed.

## 11.2 Remove db:any

The database client must preserve Drizzle typing.

Goal:

- schema-invalid inserts fail TypeScript checks
- repository methods expose typed inputs
- route DTOs cannot be passed directly to DB without mapping

## 11.3 Foreign keys

Foreign-key behavior must be explicit and tested.

No implicit fallback to invalid deck IDs.

## 11.4 Migration safety rule

Before migration:

1. Export / backup Turso.
2. Record current table counts.
3. Record current deck IDs.
4. Record current review log counts.
5. Run schema migration.
6. Re-run invariants.
7. Only then switch production backend.

---

# 12. Card Creation Removal Plan

Because add-card is removed, the migration must deliberately reduce scope.

## Remove if unused

- cards/new UI
- user-facing card POST endpoint
- user-facing card creator service
- create-card server action
- AI card approval endpoint
- card draft queue if it only exists for card creation
- sentence-mining write endpoint if it only creates cards
- capture extension write flow if it only creates cards
- card creation navigation
- creation-specific tests

## Keep only when needed for maintenance

Bulk import scripts can remain as backend maintenance scripts if they are useful for dataset management.

They must not be exposed as ordinary public application APIs unless there is a concrete use case.

---

# 13. AI / RAG Architecture

AI must be treated as a backend integration.

Frontend:

~~~text
User question
   │
   ▼
POST /api/v1/chat
~~~

Backend:

~~~text
ChatRoute
   │
   ▼
ChatService
   │
   ├── RAG retrieval
   ├── context construction
   ├── provider adapter
   └── fallback engine
~~~

## 13.1 Provider abstraction

The current configuration should be normalized to one abstraction.

Example interface:

~~~text
LLMProvider
├── generate()
└── generateStructured()
~~~

Implementations can include:

- OpenAIProvider
- GeminiProvider

Anthropic/Ollama should only remain listed as supported if a real adapter exists.

Do not expose configuration options that the runtime does not actually support.

## 13.2 Environment variables

Normalize names.

Recommended pattern:

- LLM_PROVIDER
- LLM_MODEL
- OPENAI_API_KEY when provider=openai
- GEMINI_API_KEY when provider=gemini

Avoid having unrelated configuration layers silently ignore each other.

---

# 14. Google Integration Architecture

Google OAuth and Google service operations belong in the backend.

Frontend should only call application APIs.

Example:

~~~text
Frontend
   │
   ▼
GET /api/v1/google/status
GET /api/v1/google/auth-url
POST /api/v1/google/calendar
POST /api/v1/google/tasks
~~~

Backend owns:

- OAuth state verification
- token handling
- Google SDK
- Drive API
- Calendar API
- Tasks API
- Sheets API if retained

OAuth CSRF state must be mandatory:

~~~text
stored state exists
AND
returned state exists
AND
both match
~~~

Missing state must be rejected.

---

# 15. Media Architecture

Backend owns media metadata and proxy behavior.

Frontend should receive stable media URLs or application media endpoints.

## 15.1 Avoid full buffering where possible

Large media should not be loaded entirely into server memory before response.

Preferred architecture:

~~~text
Upstream media
      │
      ▼
stream / pipe
      │
      ▼
client
~~~

## 15.2 Cache requirements

If application-level in-memory caching remains:

- use byte-size limit, not only item count
- use TTL
- use LRU or equivalent eviction
- do not allow unbounded Buffer accumulation

## 15.3 Approved Drive assets

If fileId-based media proxy remains, it should only serve assets registered in the approved application manifest unless there is an explicit administrative use case.

---

# 16. Crawler Placement

Crawlers move to the backend repository under scripts/crawlers.

They are **operational tooling**, not request-time backend services.

Crawler runtime and web API runtime must remain logically separate even when stored in the same repository.

Recommended layout:

~~~text
japanese-srs-api/
├── src/
│   └── ...
└── scripts/
    └── crawlers/
~~~

Crawler workflows may run in GitHub Actions.

## Crawler workflow rules

- do not commit generated manifests when the crawler fails
- do not hide git pull/push failures behind unconditional echo commands
- use workflow concurrency control
- preserve source metadata
- preserve license/provenance metadata where relevant
- validate generated manifests before commit

---

# 17. Authentication and Access Model

This remains a **single-user project**.

## Frontend

Production frontend is protected using **Vercel Authentication**.

No additional user-account architecture is required.

## Backend

If the backend is also deployed as a separately accessible public URL, choose one of the following simple protections:

### Preferred when supported

Protect the backend deployment through platform-level access protection as well.

### Alternative

Use a small server-to-server gateway/BFF if a secret must remain hidden from the browser.

Do **not** put a real backend secret in NEXT_PUBLIC_* variables because those are visible to browser users.

The project must not introduce:

- user registration
- passwords database
- JWT refresh architecture
- RBAC
- organization/team tenancy

unless project scope changes.

---

# 18. API Design Principles

The backend uses REST.

GraphQL is intentionally rejected for this project because the domain does not currently need its added complexity.

Rules:

1. Routes should be thin.
2. Request validation happens before service invocation.
3. Services own use-case orchestration.
4. Domain logic has no Fastify dependency.
5. Repositories own persistence.
6. External SDKs stay in integrations.
7. All mutation endpoints return explicit failure states.
8. Never swallow a persistence failure and return success.
9. API version prefix starts at /api/v1.
10. Error responses follow one consistent shape.

Suggested error format:

~~~json
{
  "success": false,
  "error": {
    "code": "REVIEW_NOT_FOUND",
    "message": "Card review target was not found."
  }
}
~~~

---

# 19. Testing Architecture

The current test suite must be divided into clear categories.

## 19.1 Unit tests

Must not require:

- Turso
- network
- production .env
- production card counts
- Google APIs

Examples:

- FSRS transformations
- conjugation
- cloze parsing
- grammar rules
- interleaving logic
- serializers
- validators

## 19.2 Integration tests

Use a temporary isolated database.

Each test suite must:

1. create isolated DB
2. migrate schema
3. seed known fixtures
4. run assertions
5. clean up

Do not assert production facts such as:

- database contains exactly 676 cards
- production has exactly 4 decks
- a specific live Turso table count

Those are monitoring/invariant checks, not general unit tests.

## 19.3 Production integration tests

Live Turso tests must be explicitly opt-in.

Example concept:

~~~text
RUN_TURSO_INTEGRATION=true
~~~

If required environment variables are absent, tests should skip rather than crash while loading .env.

## 19.4 Contract tests

The frontend API client and backend routes should share contract verification for:

- request fields
- response fields
- enum values
- error shape

---

# 20. Node.js Runtime

Backend and CI must use a runtime compatible with dependencies.

Target:

**Node.js >= 22**

Add package engine constraints.

Example:

~~~json
{
  "engines": {
    "node": ">=22"
  }
}
~~~

Use the same major Node version for:

- local development
- backend deployment
- frontend build where practical
- GitHub Actions

---

# 21. CI Plan

Both repositories get independent CI.

## Frontend CI

Order:

1. npm ci
2. lint
3. typecheck
4. frontend unit tests
5. Next.js production build
6. optional Lighthouse/performance test

## Backend CI

Order:

1. npm ci
2. lint
3. typecheck
4. unit tests
5. isolated integration tests
6. build
7. optional security/dependency audit report

A failing test must block later release-gate stages.

However, tests must first be made deterministic and environment-independent.

---

# 22. Deployment Plan

## Frontend

Recommended:

- Vercel
- Vercel Authentication enabled
- environment variable for API base URL

Example:

~~~text
NEXT_PUBLIC_API_BASE_URL=https://<backend-host>/api/v1
~~~

This value is not a secret.

## Backend

Possible deployment options:

- Vercel-compatible server deployment if Fastify adapter/runtime behavior is acceptable
- Render
- Railway
- Fly.io
- another lightweight Node host

Deployment choice is secondary to architecture.

The backend must expose a stable HTTPS origin.

## CORS

Allow only required frontend origins.

Development:

- http://localhost:3000

Production:

- exact production frontend origin

Avoid wildcard CORS for mutation APIs.

---

# 23. Migration Strategy

The project must be migrated incrementally.

Do not rewrite the whole system and switch everything at once.

---

## Phase A — Freeze and Baseline

Goal: know exactly what must remain working.

Tasks:

- confirm add-card is fully removed from desired product scope
- record current pages and features
- record current DB schema
- backup Turso
- record working review behavior
- record working grammar behavior
- record media behavior
- record Google integrations still required
- identify dead API routes
- identify dead card-creation code
- document current production URL

Exit criteria:

- clear feature inventory
- DB backup exists
- migration branch or migration repositories prepared

---

## Phase B — Create Backend Skeleton

Create japanese-srs-api.

Tasks:

- Fastify setup
- Node >=22
- TypeScript strict mode
- environment config module
- health route
- Drizzle client
- Drizzle schema
- database migration support
- standard error handler
- logging
- test runner

Exit criteria:

- backend boots independently
- health route works
- isolated DB test works
- no Next.js dependency

---

## Phase C — Migrate Read-Only Cards API

Move card retrieval first because it is low-risk.

Tasks:

- CardRepository
- CardsService
- GET /api/v1/cards
- filtering
- deck summaries
- search
- frontend API client

Frontend temporarily switches only card reads to new backend.

Exit criteria:

- card library behaves identically
- data counts match current production DB
- frontend no longer reads card data through old route

---

## Phase D — Migrate Review / FSRS

This is the highest-value phase.

Tasks:

- extract canonical FSRS domain service
- migrate review route
- move review transaction to backend
- move review logs
- add idempotent reviewId
- implement batch sync
- remove duplicate scheduling path
- frontend review API client
- offline sync points to new backend

Exit criteria:

- one source of truth for FSRS
- single review works
- batch review works
- duplicate reviewId does not apply twice
- card + review log update atomically
- old review route is disabled

---

## Phase E — Migrate Grammar and Learning Engines

Tasks:

- grammar repository
- grammar service
- grammar read endpoints
- grammar practice mutation endpoints if necessary
- conjugation/backend evaluation where appropriate

Pure presentation helpers may remain in FE.

Pure reusable domain logic should live in backend domain modules unless offline execution requires a client copy.

Exit criteria:

- grammar screens function against new API
- backend tests do not need Next.js

---

## Phase F — Migrate AI / RAG

Tasks:

- move RAG retrieval
- move provider configuration
- normalize OpenAI/Gemini adapter
- migrate /chat endpoint
- keep API keys only in backend
- add rate/cost protection if necessary

Exit criteria:

- frontend contains no AI provider secret
- chat behavior works through backend
- provider config matches actual runtime support

---

## Phase G — Migrate Google Integrations

Tasks:

- OAuth URL generation
- OAuth callback
- state validation
- token handling
- Sheets if retained
- Calendar
- Tasks
- Drive service

Exit criteria:

- frontend has no Google secret
- missing OAuth state is rejected
- integration UI still works

---

## Phase H — Migrate Media Services

Tasks:

- media manifest service
- media metadata endpoint
- stream/proxy route
- range support
- memory-safe streaming
- cache limits
- Drive allowlist

Exit criteria:

- audio/image playback works
- large media does not require full in-memory buffering where avoidable
- FE only consumes media APIs/URLs

---

## Phase I — Move Crawlers

Tasks:

- move crawler scripts
- move manifest tooling
- move crawler GitHub workflow
- add concurrency control
- stop committing partial state after failure
- validate manifest before push

Exit criteria:

- crawler operation is fully independent of frontend repository
- frontend deployment is unaffected by crawler changes

---

## Phase J — Clean Frontend

Remove migrated server dependencies.

Delete from web project when no longer needed:

- db
- Drizzle
- Turso server client
- API route business logic
- Google SDK
- AI SDK
- backend RAG
- server-only FSRS persistence
- crawler scripts
- service-account handling

Exit criteria:

- web repository builds without backend-only dependencies
- web repository can run using only API base URL

---

## Phase K — CI Reset

Frontend and backend CI become independent.

Tasks:

- remove production-count assumptions from normal tests
- isolate DB tests
- move live Turso checks to optional integration workflow
- Node >=22
- enable typecheck
- verify build
- re-enable Lighthouse only after tests are green

Exit criteria:

- both default branches green
- no test requires local .env file to exist
- no test mutates shared production DB

---

## Phase L — Production Cutover

Recommended order:

1. deploy backend
2. smoke-test backend directly
3. configure frontend API base URL
4. deploy frontend
5. run production smoke tests
6. verify review writes
7. verify offline synchronization
8. verify grammar
9. verify media
10. verify AI
11. verify Google integrations
12. monitor database counts and review logs
13. remove or disable old Next.js API routes

Do not delete the old implementation until the new backend has passed the smoke checklist.

---

# 24. Feature Migration Matrix

| Feature | Frontend | Backend | Notes |
|---|---|---|---|
| Dashboard UI | Yes | Data API only | FE rendering |
| Card library | Yes | Yes | Read-only application feature |
| Add card | Removed | Removed | Out of scope |
| Review UI | Yes | Yes | BE authoritative |
| FSRS | Optional preview only | **Yes** | Single source of truth |
| Offline cache | **Yes** | No | IndexedDB |
| Offline review sync | Queue/client | **Apply/dedupe** | reviewId required |
| Grammar UI | Yes | Yes | domain in BE |
| Conjugation UI | Yes | Domain as needed | pure helpers can remain client |
| Chat UI | Yes | **Yes** | provider secrets in BE |
| RAG | No | **Yes** | server-side |
| Google OAuth | UI trigger only | **Yes** | server-side |
| Google Drive SDK | No | **Yes** | server-side |
| Media player | Yes | API/proxy | |
| Crawlers | No | scripts/tooling | backend repo |
| Turso | No | **Yes** | server-side |
| Drizzle | No | **Yes** | server-side |
| Vercel Authentication | **Yes** | platform/deployment decision | single-user |

---

# 25. Code Movement Map From Current Repository

## Move to japanese-srs-api

Primarily:

- src/db/**
- src/core/**
- src/services/google/**
- src/services/multimodal/**
- server-side src/lib/rag/**
- backend-relevant src/modules/**
- backend-relevant src/agents/** only if those functions are still used
- src/app/api/** rewritten as Fastify modules
- scripts/**
- backend/integration tests
- crawler workflows

## Keep in japanese-srs-web

Primarily:

- src/app pages/layouts that render UI
- src/components/**
- client hooks
- styles
- browser utilities
- Dexie / IndexedDB
- service worker / PWA
- frontend tests
- public assets

## Delete instead of move

Any code whose only purpose is the removed add-card flow.

---

# 26. What Not to Do

The refactor must avoid the following:

### Do not introduce microservices

No separate FSRS server, grammar server, AI server, media server, etc.

### Do not rewrite working TypeScript business logic into Java only for appearance

Spring Boot may be considered for a future Java-focused project, but this migration prioritizes reliability and reuse.

### Do not migrate database and architecture simultaneously without a backup

Keep Turso initially.

### Do not redesign the UI during backend extraction

Architecture migration and UI redesign should remain separate changes.

### Do not preserve dead add-card APIs

Deleted product scope should result in deleted dead architecture.

### Do not let FE call Turso directly

All server persistence goes through the backend.

### Do not put secrets in NEXT_PUBLIC variables

Only public values such as API base URL belong there.

### Do not keep two FSRS mutation implementations

Backend ReviewService is canonical.

### Do not use production database state as unit-test fixtures

Use isolated deterministic fixtures.

---

# 27. Definition of Done

The FE/BE split is complete only when all conditions below are true.

## Frontend

- [ ] Next.js repository has no database credentials
- [ ] No Drizzle server persistence
- [ ] No Google service-account credential handling
- [ ] No AI provider secret
- [ ] No crawler code
- [ ] All remote data uses API client modules
- [ ] IndexedDB offline mode works
- [ ] Vercel Authentication remains enabled
- [ ] Production build passes

## Backend

- [ ] Fastify runs independently
- [ ] Node >=22
- [ ] Drizzle schema is canonical
- [ ] Migrations work
- [ ] Card retrieval works
- [ ] ReviewService is the only FSRS mutation path
- [ ] reviewId idempotency works
- [ ] card + review log transaction is atomic
- [ ] grammar endpoints work
- [ ] AI/RAG works if enabled
- [ ] Google integrations work if enabled
- [ ] media works
- [ ] crawler scripts work independently
- [ ] unit tests are deterministic
- [ ] integration tests use isolated DB
- [ ] CI is green

## Product

- [ ] No add-card UI remains
- [ ] No obsolete add-card public API remains
- [ ] Existing cards are preserved
- [ ] Existing review history is preserved
- [ ] Review scheduling remains correct
- [ ] Offline review does not duplicate
- [ ] No production data migration loss
- [ ] Existing learning flows remain usable

---

# 28. Priority Order

## P0 — Correctness before separation

1. Freeze desired features.
2. Confirm add-card deletion scope.
3. Backup Turso.
4. Define review contract.
5. Define reviewId idempotency.
6. Establish canonical FSRS behavior.

## P1 — Backend extraction

1. Fastify skeleton.
2. DB/Drizzle.
3. Cards read API.
4. Review/FSRS API.
5. Grammar.
6. AI/RAG.
7. Google.
8. Media.

## P2 — Frontend cleanup

1. API client.
2. remove server persistence.
3. migrate offline sync.
4. remove old Next API routes.
5. delete obsolete add-card code.

## P3 — Reliability

1. isolated tests
2. Node >=22
3. CI split
4. crawler workflow cleanup
5. dependency audit
6. streaming/cache improvements

---

# 29. Architectural Invariants

These rules should be treated as long-term project constraints.

### INV-01 — Backend authority

The backend is authoritative for all persistent learning state.

### INV-02 — One FSRS path

Every review mutation passes through the same ReviewService.

### INV-03 — Atomic review

Card state and review log must commit together.

### INV-04 — Idempotent offline synchronization

The same reviewId may be retried but applied only once.

### INV-05 — Drizzle schema authority

Database schema is defined once and migrated.

### INV-06 — No client secrets

The frontend contains no server credential.

### INV-07 — No dead Add Card architecture

Card creation remains out of the product unless explicitly reintroduced as a new feature.

### INV-08 — Modular monolith

Backend modules are logically separated but deployed as one backend application.

### INV-09 — Deterministic tests

Default CI must not depend on mutable production data.

### INV-10 — Independent deployability

Frontend changes should not require backend redeployment unless the API contract changes, and backend internal changes should not require frontend redeployment when the contract remains stable.

---

# 30. Recommended First Implementation Sequence

The first development cycle should be intentionally small.

### Step 1

Create japanese-srs-api with:

- Fastify
- TypeScript
- Node 22+
- Drizzle
- health endpoint

### Step 2

Move CardRepository and GET cards behavior.

### Step 3

Connect japanese-srs-web to the new cards endpoint.

### Step 4

Extract ReviewService and FSRS domain logic.

### Step 5

Implement:

- POST /api/v1/reviews
- POST /api/v1/reviews/batch
- idempotent reviewId
- atomic transaction

### Step 6

Switch frontend review/offline sync to the new backend.

### Step 7

Delete the old review mutation path.

At this point, the architectural separation becomes real even before every secondary feature has moved.

Only after this core succeeds should grammar, AI, Google, media, and crawlers be migrated.

---

# 31. Final Architecture Decision Record

**Decision**

Use two repositories:

- **Next.js frontend**
- **Fastify + TypeScript backend**

Keep:

- Turso
- Drizzle
- IndexedDB/Dexie
- Google Drive
- REST API
- single-user deployment model

Use a **modular monolith**, not microservices.

Remove dead add-card architecture.

Make the backend the canonical owner of:

- FSRS
- database state
- review logs
- AI/RAG
- external integrations
- media services

Make the frontend the owner of:

- presentation
- UX
- PWA
- local/offline cache
- pending review synchronization

This architecture is selected because it gives the project a clean backend boundary while minimizing rewrite risk and preserving the large amount of existing TypeScript domain logic.

---

# 32. Success Criterion

The migration is successful when a user can:

1. open the protected frontend,
2. browse existing cards,
3. study and submit reviews,
4. go offline,
5. perform reviews offline,
6. reconnect and synchronize exactly once,
7. use grammar and other learning modules,
8. access media,
9. use optional AI/Google integrations,

while:

- the frontend has no direct database access,
- the backend contains the only persistent business logic,
- CI is deterministic,
- no add-card feature remains,
- and the production learning data is preserved.

---

**Approved target architecture:**

> **Next.js FE + Fastify/TypeScript BE + Drizzle/Turso + IndexedDB offline + Google Drive media, implemented as two independently deployable projects with a modular-monolith backend.**
