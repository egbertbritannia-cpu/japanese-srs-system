---
name: japanese-srs-fullstack-engineer
description: Elite Fullstack Software Engineer skill specialized in Next.js 15 App Router, React Suspense hydration, TypeScript strict typing, Drizzle ORM, Turso Cloud HTTPS REST optimization for Vercel Serverless, FSRS cognitive scheduling algorithms, and Japanese NLP integration. Use whenever implementing application code, backend API routes, frontend React components, database repositories, or refactoring code.
---

# 💻 Japanese SRS Fullstack Engineer Skill (技術実装・設計統括)

This skill empowers AI agents to operate as an elite **Fullstack Software Engineer & Next.js/FSRS Architect**, translating pedagogical requirements and Wa-style UI designs into production-grade, highly performant, serverless-optimized software with zero architectural regression.

---

## 1. TECHNICAL STACK & ARCHITECTURAL FOUNDATIONS

```
┌────────────────────────────────────────────────────────────────────────┐
│                          PRESENTATION LAYER                            │
│  Next.js 15 App Router | React 19 Client/Server Components | Suspense │
│  Tailwind CSS & CSS Variables (Nippon Colors) | Web Speech API (ja-JP) │
├────────────────────────────────────────────────────────────────────────┤
│                           BUSINESS CORE                                │
│  FSRS Cognitive Scheduler (DSR Engine) | Card Validation (Atomicity)   │
│  Japanese NLP (Furigana Ruby, Pitch Accent Graph, i+1 Sentence Engine) │
├────────────────────────────────────────────────────────────────────────┤
│                         DATA ACCESS & PERSISTENCE                      │
│  Drizzle ORM (Type-Safe) | LibSQL Client (HTTPS REST Serverless Mode)  │
│  Turso Cloud Distributed Database (aws-ap-northeast-1 / Tokyo Node)    │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 2. SERVERLESS & DATABASE ENGINEERING GUIDELINES

### 2.1. The Turso Serverless HTTPS Protocol Mandate
- **Problem**: In Serverless environments (Vercel Functions / AWS Lambda), the native WebSocket protocol (`libsql://`) will hang indefinitely because serverless containers cannot sustain persistent TCP socket handshakes.
- **Mandate**: In `src/db/client.ts`, ALWAYS normalize database URLs starting with `libsql://` to `https://`.
- **Implementation Guarantee**:
  ```typescript
  const rawUrl = process.env.TURSO_DATABASE_URL || '';
  const normalizedUrl = rawUrl.startsWith('libsql://')
    ? rawUrl.replace('libsql://', 'https://')
    : rawUrl;

  export const db = drizzle(createClient({
    url: normalizedUrl,
    authToken: process.env.TURSO_AUTH_TOKEN,
  }), { schema });
  ```

### 2.2. Zero Native SQLite on Vercel Serverless (The EROFS Invariant)
- **Constraint**: The Vercel runtime filesystem is **Read-Only (`EROFS`)** and cannot execute C++ native binaries compiled with `better-sqlite3`.
- **Rule**: Never fallback to `better-sqlite3` or call `fs.mkdirSync('data')` when running in a serverless cloud environment (`process.env.VERCEL === '1'`).
- If `TURSO_DATABASE_URL` is missing on Vercel, throw a descriptive initialization error rather than crashing the Node.js runtime process.

---

## 3. NEXT.JS 15 APP ROUTER & HYDRATION ARCHITECTURE

### 3.1. Suspense Boundary Protocol for `useSearchParams`
- **Rule**: Any client component (`'use client'`) utilizing `useSearchParams()` MUST be wrapped inside a `<Suspense fallback={<WashiSkeleton />}>` boundary.
- **Failure Consequence**: Omitting `<Suspense>` causes Next.js during `npm run build` to de-opt the entire page into client-side rendering with build-time warnings.
- **Standard Implementation Pattern**:
  ```tsx
  // src/app/review/page.tsx
  function ReviewSessionInner() {
    const searchParams = useSearchParams();
    const deckId = searchParams.get('deck') || 'all';
    // ... component logic
  }

  export default function ReviewPage() {
    return (
      <Suspense fallback={<ReviewLoadingSkeleton />}>
        <ReviewSessionInner />
      </Suspense>
    );
  }
  ```

### 3.2. URL-First State Architecture
- Avoid ephemeral in-memory state for critical session attributes (such as active deck, study mode, filter terms).
- Always sync active state with URL query parameters (`/review?deck=deck_jpd133_kanji&mode=fsrs_due`).
- Benefits: Guarantees deep-linkability, bookmarking, and zero state loss upon browser refresh (F5).

---

## 4. FSRS SCHEDULING ENGINE INTEGRATION

### 4.1. The DSR Memory Model
The Fullstack Engineer interacts with FSRS via `ISchedulerEngine` (`src/core/scheduler/`):
- **Difficulty ($D$)**: Inherent complexity of the Kanji or vocabulary ($1.0 \le D \le 10.0$).
- **Stability ($S$)**: Time (in days) required for the memory Retrievability to decay from 100% to 90%.
- **Retrievability ($R$)**: Probability of recalling the card at elapsed time $t$:
  $$R(t, S) = \left(1 + \text{factor} \cdot \frac{t}{S}\right)^{-w}$$

### 4.2. API Grading Contract (`POST /api/review`)
The API endpoint accepts four standardized grade ratings:
- `Again` (1): Complete memory lapse $\rightarrow$ Reset stability, increment `lapses`.
- `Hard` (2): Recalled with significant struggle $\rightarrow$ Modest stability increase.
- `Good` (3): Optimal recall $\rightarrow$ Standard FSRS interval multiplication.
- `Easy` (4): Effortless mastery $\rightarrow$ Bonus stability increase.

---

## 5. JAPANESE NLP & MULTIMEDIA ENGINEERING

### 5.1. Japanese Speech Synthesis Protocol
- Use Web Speech API (`window.speechSynthesis`) with resilient voice selection:
  ```typescript
  export function speakJapanese(text: string) {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ja-JP';
    utterance.rate = 0.9; // Slight pacing reduction for clear learning phonetic perception
    const voices = window.speechSynthesis.getVoices();
    const jaVoice = voices.find((v) => v.lang.startsWith('ja') || v.name.includes('Japanese'));
    if (jaVoice) utterance.voice = jaVoice;
    window.speechSynthesis.speak(utterance);
  }
  ```

### 5.2. Pitch Accent SVG Parser
- Parse pitch numbers: `0` (Heiban - flat), `1` (Atamadaka - drop after mora 1), `2` (Nakadaka - drop after mora 2), etc.
- Render SVG line segments with coordinate calculations based on mora count.

---

## 6. FULLSTACK VERIFICATION RUNBOOK
Before submitting any pull request or pushing code to `main`:
```bash
# 1. Type check
npx tsc --noEmit

# 2. Unit and Integration tests
npm run test

# 3. Production static compilation
npm run build
```
*Zero warnings, zero errors required.*
