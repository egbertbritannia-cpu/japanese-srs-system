# Phase 11 — Frontend / Backend Separation Architecture & Migration Plan

> Status: **REVISED — ARCHITECTURE HARDENING**
>
> Project: **Japanese SRS System**
>
> Date: **2026-10-07**
>
> Scope: Separate frontend and backend responsibilities without a big-bang rewrite, preserve learning data and review semantics, fix known correctness defects before cutover, and keep the design appropriate for a single-user personal application.

---

# 1. Executive Decision

The architectural goal is **independent frontend/backend deployability and a hard business-logic boundary**. A physical two-repository split is no longer treated as a prerequisite.

## Recommended default

Use a workspace/monorepo during migration and keep it as the default final layout unless repository independence becomes operationally useful:

~~~text
japanese-srs-system/
├── apps/
│   ├── web/          Next.js frontend + thin BFF
│   └── api/          Fastify modular monolith
├── packages/
│   ├── contracts/    API schemas/types only
│   └── test-kit/     deterministic fixtures/helpers
├── tools/
│   ├── crawlers/
│   ├── imports/
│   └── maintenance/
└── planning/
~~~

The two applications remain independently deployable. If a later operational reason requires two Git repositories, apps/web and apps/api can be extracted after the API contract is stable.

## Why this changes the previous plan

For this personal project, splitting repositories immediately adds coordination cost, duplicated contract/version work, and more difficult atomic changes without improving runtime isolation. Logical separation and independent deployment provide the important architectural benefits. Repository separation is a packaging decision, not a domain boundary.

## Technology direction

| Area | Decision |
|---|---|
| Frontend | Next.js + React + TypeScript |
| Browser persistence | IndexedDB / Dexie |
| Backend | Fastify + TypeScript, modular monolith |
| Database | Turso / libSQL + Drizzle |
| API | REST under /api/v1 |
| Media | Google Drive-backed, manifest allowlisted |
| AI/RAG | Backend integration only |
| Authentication | Vercel Authentication for web; separate backend trust boundary |
| Runtime | Node.js >= 22 |
| Repository | Workspace monorepo by default; two repos optional later |

Fastify is retained because an independent API runtime is useful for database ownership, Google OAuth, media streaming, AI/RAG and non-Next.js testing. It is **not** permission to move every script into request-time Fastify handlers.

---

# 2. Product Constraints

This is a **single-user personal learning application**, not a SaaS product.

The architecture must therefore avoid:

- user registration
- password storage
- RBAC
- organizations/tenants
- JWT refresh-token architecture for application users
- microservices
- distributed queues unless a concrete workload requires one
- Kubernetes or equivalent orchestration

The production web application is protected by Vercel Authentication.

Important trust-boundary rule:

> **Vercel Authentication on the web deployment does not automatically make a separately deployed backend private.**

The backend must have its own access boundary. Browser-visible secrets are forbidden.

---

# 3. Product Scope: Add Card Is Removed

General user-facing card creation is out of scope.

Delete rather than migrate code whose only purpose is card creation:

- manual Add Card page
- user-facing POST card endpoint
- create-card server action
- AI draft-to-card approval flow
- automatic sentence-mining insertion
- capture write flow if its only purpose is card creation
- create-card agent skills
- card-creation navigation
- creation-only tests and documentation

Known current behavior in src/app/api/capture/process/route.ts can return success after a failed insert. Because Add Card is removed, the preferred fix is **delete the dead write path**, not spend migration effort perfecting it.

Administrative dataset imports may remain as explicit tools under tools/imports. They are not public application APIs.

The browser extension must pass a scope gate:

1. If it only supports removed capture/card creation, archive/delete it.
2. If it has another retained learning use case, redesign it separately.
3. Do not migrate the current localhost-hardcoded capture flow by default.

---

# 4. Revised Target Architecture

~~~text
Browser / PWA
    │
    │ same-origin requests
    ▼
┌────────────────────────────────────┐
│ apps/web — Next.js                 │
│ Vercel Authentication protected    │
│                                    │
│ UI / PWA / Dexie                   │
│ Thin BFF gateway only              │
└────────────────┬───────────────────┘
                 │ server-to-server
                 │ authenticated
                 ▼
┌────────────────────────────────────┐
│ apps/api — Fastify                 │
│ modular monolith                   │
│                                    │
│ routes -> services -> domain       │
│          -> repositories           │
│          -> integrations           │
└───────────┬───────────┬────────────┘
            │           │
       ┌────▼────┐ ┌────▼─────────────┐
       │ Turso   │ │ Google / AI /    │
       │ libSQL  │ │ Drive adapters   │
       └─────────┘ └──────────────────┘

tools/crawlers and tools/imports run as operational jobs,
not inside normal request handling.
~~~

## Boundary rules

1. Browser owns presentation, local cache and pending offline events.
2. Web BFF owns only same-origin gateway concerns: access boundary, request forwarding, request ID propagation and response passthrough.
3. API owns persistent business truth.
4. Domain code has no Fastify or database dependency.
5. Repository code owns persistence mapping.
6. Integrations own external SDKs.
7. Tools/crawlers are separate execution entry points.
8. No database or provider secret enters browser code.

The BFF must **not** become a second business-logic backend.

---

# 5. Backend Access / Trust Boundary

## 5.1 Preferred model

Browser calls same-origin web/BFF routes. The BFF calls the backend server-to-server.

If both deployments use Vercel and platform support is available, prefer short-lived trusted project identity/OIDC between deployments instead of a long-lived shared bypass secret.

If the API is hosted elsewhere, use a high-entropy server-side service credential stored only in deployment secrets:

~~~text
Browser
  │ no backend secret
  ▼
Vercel-protected web/BFF
  │ Authorization/service credential
  ▼
API
~~~

Requirements:

- API rejects missing/invalid service identity before business handlers.
- Service credential is never NEXT_PUBLIC_*.
- Rotate credential without code changes.
- CORS is not treated as authentication.
- If the browser never calls API directly, disable cross-origin browser access rather than maintaining broad CORS.
- Do not rely on Sec-Fetch-Site, Origin substring matching, or fail-open secret checks as authentication.
- Remove or replace the current fail-open behavior in src/lib/auth-guard.ts during migration.

## 5.2 CSRF implication

With same-origin BFF requests behind Vercel Authentication, mutation routes should still use normal same-origin protections. Do not create a cross-origin cookie-authenticated API unnecessarily.

## 5.3 Minimal rate protection

This is a personal app, so rate limiting is a safety rail, not a user quota system. Apply small limits only to expensive AI, OAuth initiation and media-proxy abuse surfaces.

---

# 6. Repository / Workspace Decision Record

## Option A — Immediate two repositories

Advantages:

- hard ownership boundary
- independent history and permissions
- independent release pipelines

Costs:

- duplicated contract/version management
- cross-repo PR coordination
- harder atomic migration
- more setup for one maintainer

## Option B — Workspace monorepo

Advantages:

- atomic FE/API/contract changes
- one dependency lockfile
- easier refactor and code movement
- shared test fixtures without publishing packages
- independent deployment is still possible

Costs:

- CI needs path filtering
- accidental imports must be prevented by lint/package boundaries

## Decision

**Use Option B now.**

A future two-repo split is a SHOULD-NOT-YET, not a rejected option. Extract only after contracts stabilize and only if separate lifecycle/permissions provide measurable value.

---

# 7. Proposed Workspace Layout

~~~text
apps/
├── web/
│   ├── src/app/
│   ├── src/features/
│   ├── src/lib/api/
│   ├── src/lib/offline/
│   └── src/app/api/bff/
│
└── api/
    ├── src/app.ts
    ├── src/server.ts
    ├── src/modules/
    │   ├── cards/
    │   ├── reviews/
    │   ├── grammar/
    │   ├── scheduler/
    │   ├── chat/
    │   ├── media/
    │   ├── google/
    │   └── health/
    ├── src/domain/
    │   ├── fsrs/
    │   ├── grammar/
    │   ├── conjugation/
    │   └── interference/
    ├── src/db/
    │   ├── client.ts
    │   ├── schema.ts
    │   └── migrations/
    ├── src/integrations/
    │   ├── ai/
    │   ├── google/
    │   └── drive/
    └── src/infrastructure/
        ├── config/
        ├── logging/
        ├── auth/
        └── errors/

packages/
├── contracts/
└── test-kit/

tools/
├── crawlers/
├── imports/
└── maintenance/
~~~

packages/contracts contains transport schemas and generated/inferred API types only. It must not contain Drizzle tables, secrets or backend repositories.

---

# 8. API Contract Strategy

Use one runtime schema source for each endpoint and derive TypeScript types/OpenAPI from it. Do not maintain three independent definitions for validation, DTO types and API documentation.

Fastify route schemas must validate:

- params
- query
- request body
- response body

Response schemas are required for mutation endpoints to reduce accidental data leakage.

Generate an OpenAPI document in CI and use it to detect contract drift. The web API client may be generated or type-checked against packages/contracts.

## Error envelope

~~~json
{
  "success": false,
  "error": {
    "code": "REVIEW_CONFLICT",
    "message": "Review history changed and was reconciled.",
    "requestId": "req_..."
  }
}
~~~

Rules:

- stable machine-readable error codes
- human-readable message
- requestId on server errors
- validation errors are 4xx
- persistence/integration failures never return success
- no secret values or credential prefixes in errors/health output

## Versioning

Start with /api/v1. Do not create /v2 for additive fields. Version only when compatibility cannot reasonably be preserved.

---

# 9. FSRS: Canonical Source of Truth

The current repository has more than one review mutation implementation. In particular, the current Next.js review route uses the FSRS library while src/app/actions/srs.ts contains a separate manual scheduling path and mismatched review-log writes.

This must be fixed **before** migration cutover.

## Invariant

> Every accepted review event is processed by one canonical ReviewService and one scheduler adapter.

No route, server action, offline sync path or maintenance endpoint may compute and persist an independent schedule.

## Canonical flow

~~~text
Review event
   │
   ▼
ReviewService
   ├── validate event
   ├── load ordered card history/state
   ├── apply scheduler version + parameter set
   ├── derive next card state
   └── transaction:
         insert immutable review event
         update derived card state/version
         write reconciliation metadata if needed
~~~

The card row is a **derived current snapshot**. Review history is the durable learning record.

---

# 10. Review Event Model

Idempotency by reviewId is necessary but not sufficient.

A review event should minimally record:

- reviewId — globally unique immutable event ID
- cardId
- rating
- reviewedAt — client-observed event time in UTC
- receivedAt — server receipt time
- deviceId/clientInstanceId
- localSequence — monotonic sequence per client instance
- baseCardVersion — card version observed when review was made
- schedulerVersion
- parameterSetId
- stateBefore or enough information to reproduce it
- stateAfter
- scheduledDays / due result
- review duration if retained
- timezone/day-boundary metadata if optimizer needs it

Recommended uniqueness/indexes:

- UNIQUE(reviewId)
- INDEX(cardId, reviewedAt)
- INDEX(cardId, receivedAt)
- INDEX(deviceId, localSequence)

Review events should be append-only under normal application behavior.

---

# 11. Offline Sync Protocol

## 11.1 Why simple dedupe is insufficient

These cases must be handled:

1. request commits but response is lost, then client retries;
2. two offline reviews exist for the same card;
3. events arrive out of order;
4. two tabs/devices review the same card from the same base version;
5. a client has stale card state;
6. local clock is wrong;
7. batch partially fails.

## 11.2 Client event

~~~json
{
  "reviewId": "uuid",
  "cardId": "card_x",
  "rating": "Good",
  "reviewedAt": 1791351700000,
  "deviceId": "device_uuid",
  "localSequence": 42,
  "baseCardVersion": 17
}
~~~

The client stores the event before considering the local action durable.

## 11.3 Server processing

For each batch:

1. Validate all events structurally.
2. Deduplicate by reviewId.
3. Group new events by cardId.
4. Lock/serialize each card's mutation within the database transaction model available.
5. Detect base-version mismatch.
6. Insert immutable events.
7. Establish deterministic order.
8. Replay/reconcile that card's history when a late event changes ordering.
9. Persist final derived card snapshot and increment card version.
10. Return per-event status and the canonical final card snapshot.

Deterministic order:

1. reviewedAt
2. localSequence when events share the same device
3. receivedAt
4. reviewId as final stable tie-break

Do not trust extreme client timestamps blindly. Reject or flag impossible future timestamps and record clock-skew diagnostics.

## 11.4 Conflict semantics

For this single-user app, do not silently drop a distinct review merely because baseCardVersion is stale.

- duplicate reviewId → return prior result, no reapply
- distinct event with current base version → normal apply
- distinct event with stale base version but valid chronology → accept and reconcile/replay
- impossible/corrupt event → reject that event with explicit status
- unrecoverable history inconsistency → stop mutation and require resync; do not guess

## 11.5 Batch response

Return a status per event:

- applied
- duplicate
- reconciled
- rejected

Also return:

- canonical card version
- canonical FSRS state
- next due
- server sync cursor/revision if introduced

The client replaces optimistic state with canonical server state after sync.

---

# 12. Scheduler Reproducibility and Versioning

FSRS evolves. Review history must remain reproducible even if the scheduler library or optimized parameters change.

Create explicit scheduler configuration records:

~~~text
scheduler_parameter_sets
- id
- algorithm
- algorithmVersion
- libraryName
- libraryVersion
- desiredRetention
- parametersJson
- createdAt
- activatedAt
~~~

Each review event references the parameterSetId used for its result.

Rules:

- never overwrite historical parameter sets in place;
- activating new parameters creates a new version;
- migration to a new FSRS algorithm is an explicit operation;
- replay tests must pin library/version/config;
- scheduler fuzz/randomness, if enabled, must be deterministic or recorded sufficiently for reproduction.

## Time semantics

Store timestamps in UTC.

If “learning day” grouping matters for optimization/statistics, store an explicit IANA timezone and day-start/cutoff policy. Do not infer historical day boundaries from the server timezone.

UI “due today” is presentation logic based on an explicit user timezone; persistent due timestamps remain canonical UTC instants.

---

# 13. Database Plan

## 13.1 One schema source

src/db/schema.ts + generated Drizzle migrations are canonical.

Remove handwritten runtime CREATE TABLE definitions after migration validation.

Remove db:any from src/db/client.ts.

Enable and test foreign-key behavior explicitly.

## 13.2 Constraints

At minimum:

- review event reviewId unique
- required card/deck references constrained
- enum-like values checked in application schema and, where practical, DB constraints
- card version non-negative
- no silent fallback to invalid deck IDs

## 13.3 Index review

Create indexes from actual query patterns, especially:

- cards by deck/state/due
- review events by card/time
- pending scheduler optimization inputs
- media manifest lookup keys

Do not add speculative indexes without query evidence.

## 13.4 Migration discipline

Production schema changes use generated migration files committed to Git.

Do not use schema push as the production migration strategy.

Before each production migration:

1. create/verify backup;
2. record schema version;
3. record row counts and key invariants;
4. apply migration;
5. run post-migration invariant checks;
6. smoke-test read and review write;
7. keep a documented rollback/restore path.

For destructive SQLite changes, prefer expand → backfill → verify → contract rather than one destructive step.

---

# 14. Review History Integrity

Review history is more important than the derived card snapshot.

Rules:

- application review events are immutable;
- corrections use an explicit repair/reconciliation tool and audit metadata;
- no normal endpoint deletes review history;
- derived card state can be rebuilt from history plus scheduler configuration;
- add a maintenance command to verify/rebuild one card;
- add a full invariant command for backup validation and migrations.

Useful invariants:

- every review references an existing card;
- no duplicate reviewId;
- current card version matches accepted event count/reconciliation policy;
- current card state equals replayed history;
- due/stability/difficulty values are finite and within valid ranges.

---

# 15. Google OAuth and Integrations

Google OAuth remains backend-owned.

Fix the current state-validation weakness: callback acceptance requires a stored transaction state and a returned state that match. Missing stored state or missing returned state is failure.

Use Authorization Code flow through the backend. Add PKCE when supported by the selected Google server-side flow/library; it is defense-in-depth even for confidential clients.

## Token storage

Preferred:

- refresh/access token material stored server-side;
- encrypted at rest using a deployment secret/KMS-equivalent where practical;
- browser stores no Google refresh token;
- application cookie/session contains only opaque state if a cookie is needed.

Do not keep long-lived OAuth tokens as the primary browser cookie storage model.

## Recovery

Implement:

- refresh-token failure → integration becomes disconnected/degraded, not application crash;
- explicit disconnect revokes credentials when possible, then deletes local token record;
- least scopes necessary;
- OAuth transaction state has TTL and one-time use.

---

# 16. Media / Google Drive

The current media route must not buffer entire large upstream files with arrayBuffer before returning them.

## Preferred delivery order

1. Direct stable/public asset URL when redistribution and access model permit.
2. Short-lived/signed access if the storage/provider supports it cleanly.
3. Backend streaming proxy only when access control/transformation requires it.

If proxying:

- stream response bodies;
- support Range for audio/video where needed;
- forward safe content headers;
- enforce timeout and maximum size;
- cancel upstream request when client disconnects;
- never cache arbitrary Buffers without byte accounting.

## Drive allowlist

fileId alone is not authorization.

Only proxy file IDs registered in the approved manifest/database. Unknown IDs return not found/forbidden before Drive fetch.

## Cache

Prefer CDN/provider caching for immutable media. If process memory cache remains, it must be byte-bounded + TTL + LRU. Serverless memory must not depend on item count alone.

## SVG

If SVG is served from anything other than a fully trusted static corpus, sanitize with an allowlist that removes script-capable content, event handlers and unsafe external references.

---

# 17. AI / RAG

Keep the abstraction smaller than the current configuration surface.

The current repository has configuration drift between LLM_API_KEY, OPENAI_API_KEY, GEMINI_API_KEY and provider/model selection. Normalize it.

## Required provider interface

~~~text
LLMProvider
- generate()
- generateStructured()
~~~

Only expose providers with real adapters and tests.

## Structured output

Every AI response that drives application logic must pass runtime schema validation. Invalid output is an integration failure/fallback case, not trusted data.

## Reliability controls

MUST:

- timeout
- bounded retry for transient failures only
- abort signal propagation
- maximum prompt/context size
- structured logging of provider/model/latency without logging secrets
- explicit fallback behavior

SHOULD:

- record token/cost usage when provider exposes it
- cache safe deterministic retrieval results where useful
- cap RAG result count/context length

Do not build a generic multi-agent platform for this project.

Because Add Card is removed, delete card-creation agent code instead of repairing its static in-memory draft store or deterministic-ID collision unless another retained feature actually depends on it.

---

# 18. Health, Logging and Observability

## Structured logs

Each request gets requestId.

Log:

- requestId
- route
- status
- duration
- high-level error code
- external provider latency/result category
- reviewId/cardId for review reconciliation where useful

Never log:

- OAuth tokens
- API keys
- authorization headers
- secret prefixes
- full sensitive prompts by default

## Endpoints

GET /health/live

- process is running
- no external dependency calls required

GET /health/ready

- required configuration loaded
- optional lightweight DB readiness check

Health responses report configured/healthy booleans only. Remove the current behavior that exposes secret prefixes or lengths.

## Metrics

For a personal app, keep metrics minimal:

- API error count
- review apply/reconcile/reject counts
- DB latency
- AI latency/failure
- media proxy failure
- OAuth refresh failure

Error tracking is SHOULD, not MUST.

---

# 19. Crawler / Import / Maintenance Architecture

Move operational tooling under tools rather than treating it as Fastify application code.

~~~text
tools/
├── crawlers/
├── imports/
└── maintenance/
~~~

They may reuse backend packages through explicit internal APIs, but do not start the HTTP server.

## Workflow correctness

Fix current crawler workflow behavior:

- do not commit manifests after crawler failure;
- do not swallow git pull/push failures with unconditional success;
- use concurrency groups;
- validate manifests before commit;
- make uploads/manifest updates idempotent;
- write temp output then atomically promote;
- record checksum/source/retrievedAt.

## Provenance

For redistributed media, manifest metadata SHOULD include:

- source URL/reference
- license
- license URL
- attribution
- redistributionAllowed
- retrievedAt
- checksum

Public availability is not treated as redistribution permission.

---

# 20. API Resource Design

Initial endpoints:

~~~text
GET    /api/v1/cards
GET    /api/v1/cards/:id
GET    /api/v1/reviews/due
POST   /api/v1/reviews
POST   /api/v1/reviews/batch

GET    /api/v1/grammar/...
POST   /api/v1/grammar/...

POST   /api/v1/chat

GET    /api/v1/google/status
POST   /api/v1/google/oauth/start
GET    /api/v1/google/oauth/callback
POST   /api/v1/google/disconnect

GET    /api/v1/media/:assetId
~~~

Use application asset IDs instead of raw Drive file IDs in normal frontend contracts.

## Pagination

Use cursor pagination for potentially growing collections. Small bounded lookup lists may remain unpaginated.

## Caching

Personal learning state is private data.

- review/due endpoints: no-store
- mutable card state: private/no-store unless a validated revalidation design exists
- immutable media: cache aggressively by content identity
- do not use public CDN caching for personalized review state

ETag/version fields are useful for read reconciliation but must not replace review-event conflict handling.

---

# 21. Testing Strategy

## 21.1 Domain tests — MUST

No DB/network/env.

- FSRS transition fixtures
- replay from review history
- scheduler version/parameter fixtures
- conjugation/grammar/cloze
- deterministic ordering
- timestamp/day-boundary behavior

Add property/invariant tests for FSRS wrapper:

- no NaN/Infinity
- valid state transitions
- due result valid
- replay is deterministic for fixed inputs/config
- duplicate event does not change state

## 21.2 API contract tests — MUST

Verify request/response/error schemas and generated OpenAPI.

## 21.3 DB integration tests — MUST

Each suite gets an isolated temporary DB:

1. create
2. migrate
3. seed fixture
4. test
5. destroy

No production cardinality assertions.

## 21.4 Offline-sync simulation — MUST

Test:

- duplicate retry
- response lost after commit
- two events same card in one batch
- out-of-order arrival
- stale baseCardVersion
- two device IDs
- duplicate across batches
- one invalid event in batch
- clock skew
- replay after late event

## 21.5 Migration tests — MUST

Start from a schema snapshot representative of current production and apply all new migrations. Verify invariants and replay.

## 21.6 External integration tests — SHOULD

Google/AI/Drive tests are opt-in and require explicit secrets. Missing secrets cause skip, not module-load crash.

## 21.7 Production smoke tests — MUST before cutover

Read-only checks plus one controlled review test on a dedicated fixture card if possible.

---

# 22. CI Repair Before Migration

Current CI must be repaired before it becomes the migration gate.

Known issues to resolve:

- CI currently uses Node 20 while important dependencies require Node >=22;
- Turso integration test reads a local .env file synchronously and crashes when absent;
- tests depend on production-like counts;
- shared mutable DB state makes suites non-hermetic;
- current failing tests prevent build/Lighthouse stages;
- dependency audit currently reports high/critical findings that need triage.

Required baseline:

1. Node 22 in package engines and CI.
2. Unit tests independent of .env.
3. Integration tests use isolated DB.
4. Live Turso workflow explicitly opt-in.
5. npm audit findings classified by reachable runtime risk; do not blindly force-upgrade.
6. Build runs after deterministic tests are green.

Workspace CI can use path filtering, but a contract change must test both web and api.

---

# 23. Threat Model — Personal App Scope

Protect against realistic failure modes, not enterprise hypotheticals.

## MUST address

- public caller reaching backend directly
- leaked backend/API provider secrets
- OAuth callback CSRF/state mismatch
- OAuth token leakage
- arbitrary Drive fileId proxying
- duplicated/replayed review submissions
- out-of-order offline reviews
- persistence failure reported as success
- dependency/supply-chain vulnerabilities in reachable code
- accidental production DB mutation by tests
- unbounded media buffering/cache memory

## SHOULD address

- SSRF-like upstream misuse in media/integration adapters
- abusive AI request loops
- malicious SVG if source trust changes
- stale client contract
- clock skew

## Not required now

- multi-tenant isolation
- per-user RBAC
- organization policy engine
- service mesh
- distributed tracing platform

---

# 24. Migration Strategy: Strangler, Not Rewrite

The current Next.js application remains production until vertical slices prove the replacement.

Each migrated feature follows:

~~~text
baseline current behavior
→ implement new backend path
→ contract/integration tests
→ route selected web traffic to new path
→ verify production invariants
→ disable old mutation path
→ delete old code after observation period
~~~

Never run two writable implementations for the same review mutation longer than necessary.

---

# 25. Migration Roadmap

## Phase 0 — Correctness Baseline

MUST complete before architecture extraction.

Tasks:

- backup Turso and verify restore/export procedure;
- inventory retained features;
- confirm Add Card/capture/extension deletion scope;
- repair CI runtime to Node 22;
- make default tests hermetic;
- snapshot current DB schema and invariants;
- create golden review-history fixtures;
- identify the canonical current FSRS library/version/config;
- remove or disable duplicate manual review mutation in src/app/actions/srs.ts;
- fix any path that returns success after persistence failure;
- fix Google OAuth state validation;
- remove secret prefix/length exposure from health.

Exit criteria:

- deterministic green baseline;
- one known review behavior specification;
- production backup verified;
- no known false-success mutation path remains reachable.

Rollback: no architecture cutover has occurred.

---

## Phase 1 — Workspace Boundary

Tasks:

- introduce apps/web, apps/api, packages/contracts, packages/test-kit, tools;
- move code mechanically before redesign where possible;
- add import-boundary lint rules;
- keep production deployment pointed at current web app;
- establish independent web/api build commands.

Exit criteria:

- existing app still works;
- API skeleton boots on Node 22;
- no production traffic moved yet.

Rollback: revert workspace movement only.

---

## Phase 2 — Contract + API Foundation

Tasks:

- Fastify app/server split;
- config validation at startup;
- structured error handler;
- request IDs/logging;
- liveness/readiness;
- route schemas;
- OpenAPI generation;
- backend service-auth middleware;
- BFF forwarding skeleton.

Exit criteria:

- unauthenticated direct API mutation is rejected;
- BFF can call health/cards through server identity;
- OpenAPI generated in CI.

---

## Phase 3 — Database Authority

Tasks:

- typed Drizzle client;
- canonical schema;
- generated migrations;
- explicit FK behavior;
- isolated test DB;
- indexes based on real queries;
- migration invariant command.

Exit criteria:

- no db:any in new API;
- no runtime handwritten DDL in new path;
- schema migration test passes from current snapshot.

---

## Phase 4 — Read-Only Cards Vertical Slice

Tasks:

- CardRepository;
- CardsService;
- GET cards/card detail;
- BFF proxy;
- web API client;
- remove public caching of mutable personal card state.

Exit criteria:

- production card views match old implementation;
- counts and representative records verified;
- rollback is environment/route switch.

---

## Phase 5 — Review Event Foundation

Tasks:

- define immutable review event schema;
- add reviewId uniqueness;
- add card version;
- add scheduler parameter-set table;
- implement canonical ReviewService;
- port current FSRS behavior without algorithm upgrade;
- replay/rebuild command;
- golden-history comparison.

Exit criteria:

- replayed state matches existing known cards/fixtures;
- card + event commit atomically;
- duplicate event is a no-op.

Important: do not upgrade FSRS algorithm and architecture in the same change. Preserve behavior first.

---

## Phase 6 — Offline Reconciliation

Tasks:

- deviceId/localSequence/baseCardVersion;
- batch endpoint;
- deterministic ordering;
- late-event replay;
- per-event batch status;
- client canonical-state replacement;
- sync simulations.

Exit criteria:

- retry after lost response is safe;
- out-of-order events converge;
- stale client does not corrupt card state;
- multi-tab/device simulation is deterministic.

---

## Phase 7 — Review Cutover

Tasks:

- route web review through BFF/API;
- route offline sync through same ReviewService;
- production smoke test;
- monitor review apply/reconcile/reject counts;
- disable old Next.js review mutation;
- remove src/app/actions/srs.ts scheduling logic.

Exit criteria:

- exactly one writable FSRS path;
- old review mutation returns disabled/not-found;
- production invariants remain valid through observation window.

Rollback: route BFF back only if old path has not yet been deleted and data model remains compatible; otherwise restore from verified backup and event log. Document the exact point of no-return.

---

## Phase 8 — Grammar / Learning Modules

Move only backend-dependent logic. Pure UI helpers remain web-side. If offline execution requires a pure algorithm in the browser, treat it as a pure shared package with no persistence authority.

---

## Phase 9 — AI / RAG

Tasks:

- delete dead card-creation agent paths;
- normalize provider config;
- move retained RAG/chat;
- structured output validation;
- timeout/retry/cost logging;
- remove unsupported provider claims.

Exit criteria:

- no provider secret in web;
- failure degrades cleanly;
- runtime configuration and adapter implementation agree.

---

## Phase 10 — Google OAuth

Tasks:

- backend OAuth transaction store;
- mandatory state;
- PKCE where supported;
- server-side token storage;
- refresh/revocation recovery;
- minimal scopes.

Exit criteria:

- missing/mismatched state rejected;
- browser never stores refresh token;
- disconnect/reconnect tested.

---

## Phase 11 — Media

Tasks:

- application asset IDs;
- manifest allowlist;
- Range support;
- streaming proxy;
- byte-bounded cache or remove process cache;
- timeout/abort;
- immutable caching strategy.

Exit criteria:

- large media does not require full buffering;
- arbitrary Drive file ID cannot be proxied;
- playback works through expected browsers.

---

## Phase 12 — Crawlers / Imports

Tasks:

- move to tools;
- fix workflow failure semantics;
- concurrency;
- provenance metadata;
- idempotent manifest generation;
- validation before commit.

Exit criteria:

- crawler failure cannot publish partial manifest;
- web/API deployment does not depend on crawler runtime.

---

## Phase 13 — Cleanup

Delete:

- old Next API business routes;
- dead Add Card/capture code;
- obsolete agent code;
- server-only dependencies from web;
- duplicate schema/DDL;
- old auth guard patterns;
- stale planning docs.

Keep compatibility adapters only when a live caller still exists.

---

# 26. Deployment Decision

## Web

- Vercel
- Vercel Authentication on all deployments
- same-origin BFF routes
- no backend secret in browser environment

## API

Choose host based on actual runtime needs.

Fastify on a lightweight Node host is preferred if media streaming, stable process behavior or long request handling makes serverless awkward.

If API is deployed on Vercel, validate Fastify adapter/runtime behavior and use platform trusted-source identity between projects where available.

Do not choose a host merely to satisfy the architecture diagram.

## Tools

Crawlers/imports run in GitHub Actions or explicit operator jobs. They are not web requests.

---

# 27. MUST / SHOULD / COULD

## MUST

- one canonical ReviewService
- immutable/idempotent review events
- out-of-order offline reconciliation
- typed Drizzle schema + migrations
- backend trust boundary independent of frontend Vercel Authentication
- no browser secrets
- OAuth state correctness
- memory-safe media path
- deterministic tests
- Node >=22
- no false-success persistence responses
- backup + migration verification

## SHOULD

- monorepo/workspaces during migration
- OpenAPI generation
- server-side encrypted Google token storage
- PKCE for Google OAuth where supported
- structured logs/request IDs
- byte-bounded media cache or CDN-first design
- provenance metadata
- property/invariant tests
- path-filtered CI

## COULD

- error tracking service
- generated frontend API client
- scheduler optimization automation
- two-repository extraction after stabilization
- richer metrics dashboard

---

# 28. Known Current-Repo Defects Mapped to Plan

| Current issue | Planned resolution |
|---|---|
| Duplicate FSRS mutation logic | Phase 0 + Phase 5/7: one ReviewService |
| src/app/actions/srs.ts review-log/schema mismatch | Remove/delegate before cutover |
| capture/process can return success after insert failure | Delete dead Add Card flow or fail closed |
| db:any | Phase 3 typed Drizzle client |
| runtime DDL differs from Drizzle schema | Phase 3 migrations only |
| offline reviewId lacks full ordering/conflict protocol | Phase 6 reconciliation |
| OAuth callback accepts missing stored state case | Phase 0/10 mandatory transaction state |
| Google tokens in long-lived cookie | Phase 10 server-side token storage |
| health leaks secret prefix/length | Phase 0/18 boolean-only health |
| media route buffers full file | Phase 11 streaming |
| media cache limited by item count, not bytes | Phase 11 byte-bounded/remove |
| arbitrary Drive fileId proxy surface | Phase 11 application asset allowlist |
| AI provider env/config drift | Phase 9 normalize provider adapter/config |
| static in-memory Copilot draft state | Delete if Add Card-only; otherwise persist explicitly |
| deterministic Copilot card IDs can collide across senses | Delete if Add Card-only; do not migrate dead path |
| extension hardcodes localhost capture API | Delete/archive unless retained use case exists |
| crawler workflow can commit after failure | Phase 12 failure-atomic workflow |
| CI Node 20 vs dependencies requiring Node 22 | Phase 0 |
| tests read local .env / production counts | Phase 0/21 |
| public cache semantics on personal mutable card state | Phase 4 private/no-store |

---

# 29. Architectural Invariants

### INV-01 — Backend authority
Persistent learning state is authoritative in the API/database.

### INV-02 — One review path
Every accepted review uses ReviewService.

### INV-03 — Immutable review identity
reviewId identifies one logical review forever.

### INV-04 — Atomicity
Review event insertion and derived card-state update commit atomically.

### INV-05 — Replayability
A card can be rebuilt from review history plus scheduler configuration.

### INV-06 — Offline convergence
Retries and out-of-order delivery converge to one deterministic canonical state.

### INV-07 — Schema authority
Drizzle schema + migrations are the only production schema source.

### INV-08 — No browser secrets
Browser bundles/storage contain no backend, DB, Google or AI credential.

### INV-09 — Independent backend protection
Frontend deployment protection is never assumed to secure the backend origin.

### INV-10 — Thin BFF
The BFF forwards authenticated requests but does not duplicate domain logic.

### INV-11 — No dead Add Card architecture
Removed product scope is deleted, not migrated.

### INV-12 — Deterministic CI
Default CI does not depend on mutable production state or local .env files.

### INV-13 — Versioned scheduler
Algorithm/library/parameter changes are explicit and historical results remain explainable.

### INV-14 — Media allowlist
Normal media access resolves application asset identity before provider file identity.

### INV-15 — Failure is explicit
Persistence/integration failure never becomes a success response.

---

# 30. Definition of Done

## Web

- [ ] Vercel Authentication enabled
- [ ] no DB/Google/AI/backend service credential in browser
- [ ] API access goes through typed client/BFF
- [ ] Dexie queue persists review events before sync
- [ ] canonical server state replaces optimistic state after sync
- [ ] no user-facing Add Card/capture flow
- [ ] production build/tests green

## API

- [ ] Fastify boots independently on Node >=22
- [ ] backend service identity enforced
- [ ] OpenAPI/route schemas generated and tested
- [ ] Drizzle typed client + migrations
- [ ] one ReviewService
- [ ] immutable review events
- [ ] duplicate retry safe
- [ ] out-of-order replay/reconciliation tested
- [ ] scheduler parameter/version recorded
- [ ] Google OAuth state fixed
- [ ] tokens server-side
- [ ] media streaming/allowlist
- [ ] health leaks no secret metadata
- [ ] deterministic unit/integration tests

## Data

- [ ] backup verified before cutover
- [ ] existing cards preserved
- [ ] review history preserved
- [ ] replay invariants pass
- [ ] no production test mutation
- [ ] migration checks documented

## Operations

- [ ] crawler failure cannot publish partial state
- [ ] request IDs/logging present
- [ ] CI uses Node 22
- [ ] dependency audit triaged
- [ ] rollback/cutover checklist exists

---

# 31. First Implementation Cycle

Do not begin by creating a new repository.

Recommended first cycle:

1. Repair CI and move to Node 22.
2. Freeze/delete dead Add Card/capture scope.
3. Create golden FSRS review fixtures from current behavior.
4. Remove/delegate duplicate src/app/actions/srs.ts scheduling path.
5. Fix OAuth state and health secret disclosure.
6. Introduce workspace boundaries.
7. Create Fastify API skeleton + service-auth boundary + BFF.
8. Move read-only cards as the first vertical slice.
9. Add review event schema/versioning.
10. Implement canonical ReviewService and replay tests.
11. Implement offline reconciliation.
12. Cut review traffic only after convergence tests pass.

This sequence prioritizes correctness and reversibility over visual architectural progress.

---

# 32. Final Architecture Decision Record

**Decision**

Use **logical FE/BE separation with independent deployment**, implemented initially as a **workspace monorepo**:

- apps/web — Next.js, UI/PWA/Dexie, Vercel Authentication, thin BFF
- apps/api — Fastify/TypeScript modular monolith
- packages/contracts — transport contracts only
- packages/test-kit — deterministic test support
- tools — crawlers/imports/maintenance
- Turso/libSQL + Drizzle
- Google Drive/media
- REST /api/v1

The backend is separately protected and is never assumed to inherit frontend Vercel Authentication.

Review history becomes an immutable event stream sufficient to rebuild derived FSRS card state. reviewId dedupe is combined with card versioning, deterministic ordering and late-event reconciliation.

A physical two-repository split is deferred until it has a concrete operational benefit.

**Reason**

This keeps the strongest parts of the original Phase 11 plan—backend authority, modular monolith, Fastify, Drizzle/Turso, offline Dexie, no microservices—while fixing its largest design gaps:

- repo split was being treated as architecture rather than packaging;
- backend trust boundary was underspecified;
- offline idempotency did not solve ordering/conflicts;
- scheduler reproducibility/versioning was missing;
- API contracts and OpenAPI drift were underspecified;
- migration phases lacked enough rollback/data-verification detail;
- dead Add Card code risked being migrated unnecessarily;
- current known correctness defects were not explicit prerequisites.

---

# 33. Success Criterion

The migration is successful when the protected web app can:

1. browse cards;
2. review online;
3. review offline;
4. reconnect after retries/out-of-order delivery;
5. converge to one canonical review history and card state;
6. use retained grammar/learning modules;
7. use media without unsafe buffering;
8. use retained AI/Google integrations;

while:

- only the API owns persistent learning rules;
- review history is replayable;
- browser contains no secret;
- backend direct access is separately protected;
- CI is deterministic;
- dead Add Card architecture is gone;
- production data is backed up and verified;
- and frontend/backend can deploy independently.

---

**Revised target architecture:**

> **Next.js web + thin protected BFF + Fastify/TypeScript modular-monolith API + Drizzle/Turso + immutable/replayable review events + Dexie offline queue + Google Drive media, developed in a workspace monorepo and independently deployable.**
