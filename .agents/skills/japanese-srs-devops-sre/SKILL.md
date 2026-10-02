---
name: japanese-srs-devops-sre
description: Elite DevOps Engineer and Cloud SRE skill specialized in Vercel Serverless deployments, Turso Cloud distributed LibSQL database orchestration, HTTPS REST latency tuning, environment variable security, zero-downtime database synchronization, and automated CI/CD observability. Use whenever configuring infrastructure, deploying to Vercel, managing Turso databases, troubleshooting serverless connection timeouts, or handling production environments.
---

# ⚙️ Japanese SRS DevOps & SRE Skill (運用基盤・SRE統括)

This skill empowers AI agents to operate as an elite **DevOps Engineer & Site Reliability Engineer (SRE)**, guaranteeing 99.99% availability, sub-50ms database latency, and bulletproof security for the Japanese SRS application across Vercel Serverless and Turso Cloud.

---

## 1. INFRASTRUCTURE TOPOLOGY & RUNTIME ARCHITECTURE

```
[ User Browser / Global CDN ]
              │ HTTPS (TLS 1.3)
              ▼
[ Vercel Edge Network / Serverless Lambda ]
  - Node.js 20+ Runtime
  - Regions: hnd1 (Tokyo) / sin1 (Singapore)
  - Memory: 1024MB | Timeout: 15s (Hobby) / 60s (Pro)
  - Read-Only Container Filesystem (EROFS Invariant)
              │ HTTPS REST API (Port 443) via fetch()
              ▼
[ Turso Cloud Distributed Database ]
  - Engine: LibSQL / SQLite Architecture
  - Primary Location: aws-ap-northeast-1 (Tokyo)
  - URL Format: https://japanese-srs-db-*.turso.io
  - Latency: ~10ms - 25ms REST ping
```

---

## 2. PRODUCTION ENVIRONMENT VARIABLE GOVERNANCE

### 2.1. Mandatory Environment Variables Matrix

| Variable Name | Environment Scopes | Purpose | Security Classification |
| :--- | :--- | :--- | :--- |
| `TURSO_DATABASE_URL` | Production, Preview, Dev | Primary LibSQL Database endpoint (Must be `https://`) | Public Configuration |
| `TURSO_AUTH_TOKEN` | Production, Preview, Dev | JWT Bearer Token for LibSQL authentication | **HIGH SECRET** (Never leak) |
| `OPENAI_API_KEY` | Production, Preview, Dev | LLM API for Kanji decomposition and $i+1$ sentences | **HIGH SECRET** (Never leak) |
| `LLM_PROVIDER` | Production, Preview, Dev | Active AI provider (`openai` \| `gemini`) | Public Configuration |
| `LLM_MODEL` | Production, Preview, Dev | Model selector (e.g., `gpt-4o-mini`, `gemini-1.5-flash`) | Public Configuration |
| `GEMINI_API_KEY` | Production, Preview, Dev | Alternative LLM fallback | **HIGH SECRET** (Never leak) |

### 2.2. Zero-Leak Secret Masking Policy
- **Rule**: Never print full authentication tokens or API keys to terminal logs, client-side bundles, or Git commits.
- Diagnostic routes (like `/api/health`) must ONLY output presence status (`"Configured"` vs `"Missing"`), never raw values.

---

## 3. TURSO SERVERLESS CONNECTION TUNING & SYNC PROTOCOLS

### 3.1. The WebSocket vs HTTPS REST Rule
- In serverless runtimes (AWS Lambda, Vercel), WebSocket protocols (`libsql://`) will **hang until timeout** because sockets are severed when the function freezes.
- **SRE Standard**: All connection URLs must be normalized to `https://`.
- Measurement: HTTPS REST calls using global `fetch()` execute with zero cold-socket penalty in ~13ms - 25ms.

### 3.2. Automated Database Sync Script Protocol
If the Cloud database is ever desynchronized from local data, the SRE executes the verified Turso sync script:
```bash
# Đồng bộ an toàn toàn bộ 383 thẻ và Decks từ SQLite local lên Turso Cloud
npx tsx scripts/sync-turso.ts
```
The script uses idempotent upserts (`INSERT OR IGNORE` or conflict resolution) to prevent duplicate card creation.

---

## 4. OBSERVABILITY & HEALTH MONITORING (`/api/health`)

The SRE maintains a dedicated health route at [`src/app/api/health/route.ts`](file:///D:/project/japanese-srs-system/src/app/api/health/route.ts):

```typescript
// Sample Health Status Response Schema:
{
  "status": "healthy",
  "timestamp": "2026-10-02T18:37:09.123Z",
  "database": {
    "status": "connected",
    "totalDecks": 2,
    "totalCards": 383,
    "latency": "13ms"
  },
  "environment": {
    "tursoDbUrl": "Configured",
    "tursoAuthToken": "Configured",
    "openaiApiKey": "Configured"
  }
}
```

### SLA Alert Triggers:
- If `database.latency > 150ms`: Warning - High latency to Tokyo region.
- If `database.status !== "connected"`: **CRITICAL ALERT** - Database connection down.
- If `environment.tursoAuthToken === "Missing"`: **CRITICAL ALERT** - Missing deployment variable.

---

## 5. INCIDENT RESPONSE & TROUBLESHOOTING RUNBOOK

| Incident / Symptom | Root Cause | Automated SRE Resolution Action |
| :--- | :--- | :--- |
| **504 Gateway Timeout on Vercel** | `@libsql/client` hung trying to open WebSocket via `libsql://` | Check `src/db/client.ts`. Ensure URL normalization `rawUrl.replace('libsql://', 'https://')` is active. |
| **`EROFS: read-only file system`** | App tried to create `data/app.db` locally on Vercel | Set `TURSO_DATABASE_URL` and `TURSO_AUTH_TOKEN` in Vercel Project Settings. Verify `process.env.VERCEL` guard in `src/db/client.ts`. |
| **Hydration Mismatch on `/review`** | `useSearchParams` used without `<Suspense>` | Wrap component in `<Suspense fallback={<ReviewLoadingSkeleton />}>`. Recompile with `npm run build`. |
| **0 Cards in Production Database** | Data was imported locally but not pushed to Turso Cloud | Run `npx tsx scripts/sync-turso.ts` with production credentials to populate cloud tables. |

---

## 6. SRE DEPLOYMENT SIGN-OFF CHECKLIST
Before signing off on any production deployment:
- [ ] Vercel Project Settings contain all mandatory environment variables across Production and Preview.
- [ ] Turso Cloud URL uses HTTPS REST protocol.
- [ ] `/api/health` returns `status: "healthy"` and latency $< 50\text{ms}$.
- [ ] `npm run build` generates 100% static/dynamic routes with zero hydration warnings.
- [ ] Cloud database card count matches local verification standard (383 cards).
