---
name: japanese-srs-qa-engineer
description: Master Quality Assurance (QA) and Test Automation Specialist skill for designing cognitive test matrices, validating FSRS mathematical invariants, authoring Vitest unit and integration suites, executing clickstream scenarios, and stress-testing edge cases. Use whenever writing tests, investigating bugs, verifying acceptance criteria, or designing automated test suites.
---

# 🧪 Japanese SRS QA Engineer Skill (品質保証・自動検証)

This skill empowers AI agents to operate as an elite **Quality Assurance (QA) Engineer & Test Automation Specialist**, safeguarding the mathematical fidelity of the FSRS cognitive memory model, verifying edge-case resilience, and ensuring flawless user experiences.

---

## 1. QUALITY ASSURANCE MANIFESTO & TESTING PYRAMID

```
                      / \
                     / E2E \       Playwright / Clickstream Scenarios
                    /───────\      (Review flow, Hotkeys, Deck switching)
                   /  Integ  \     API Route & Database Integration
                  /───────────\    (GET /api/cards, POST /api/review, Drizzle)
                 /  Unit Tests \   Vitest Unit & FSRS Invariant Suites
                /───────────────\  (DSR calculations, Card atomicity, Furigana)
```

### Core Testing Mandates:
1. **FSRS Mathematical Invariants**: Spaced repetition calculations must be mathematically provable and monotonic.
2. **Zero False Positives**: Tests must be deterministic, isolated from real external network delays, and independent of timezone discrepancies.
3. **Resilience to Chaos**: The application must never throw uncaught exceptions on empty decks, invalid query parameters, or network timeouts.

---

## 2. FSRS MATHEMATICAL INVARIANT TESTING PROTOCOL

When testing `src/core/scheduler/fsrs-engine.ts`, the QA Engineer must verify these fundamental invariants:

| Mathematical Invariant | Property Tested | Test Assertion Criteria |
| :--- | :--- | :--- |
| **Monotonic Interval Growth** | For any rating $\in \{\text{Good}, \text{Easy}\}$, subsequent interval $I_{n+1} > I_n$. | `expect(result.Good.interval).toBeGreaterThanOrEqual(card.stability);` |
| **Rating Ordering Law** | For identical card state: $I_{\text{Again}} < I_{\text{Hard}} < I_{\text{Good}} < I_{\text{Easy}}$. | `expect(res.Again.interval).toBeLessThan(res.Hard.interval);`<br>`expect(res.Hard.interval).toBeLessThan(res.Good.interval);`<br>`expect(res.Good.interval).toBeLessThan(res.Easy.interval);` |
| **Lapse Penalty Invariant** | Rating `Again` on a Review card must reset or drastically decrease Stability and increment `lapses`. | `expect(result.Again.card.lapses).toBe(initialLapses + 1);` |
| **Fuzz Factor Bounds** | The randomized fuzz offset must not perturb the calculated interval by more than $\pm 10\%$. | `expect(Math.abs(fuzzed - raw) / raw).toBeLessThanOrEqual(0.10);` |

---

## 3. VITEST UNIT & INTEGRATION TEST TEMPLATES

### 3.1. Standard Deck-Scoped Queue Test
```typescript
// tests/deck-queue.test.ts
import { describe, it, expect } from 'vitest';
import { CardItem } from '@/core/cards/deck.types';

describe('Deck Queue Prioritization Algorithm', () => {
  const mockCards: CardItem[] = [
    { id: '1', kanji: '桜', meaning: 'Cherry blossom', type: 'Vocab', deckId: 'deck_vocab', state: 'New' },
    { id: '2', kanji: '学', meaning: 'Study', type: 'Kanji', deckId: 'deck_kanji', state: 'Review', due: new Date(Date.now() - 86400000) },
    { id: '3', kanji: '猫', meaning: 'Cat', type: 'Vocab', deckId: 'deck_vocab', state: 'Review', due: new Date(Date.now() - 172800000) },
    { id: '4', kanji: '本', meaning: 'Book', type: 'Kanji', deckId: 'deck_kanji', state: 'Review', due: new Date(Date.now() + 86400000) }, // Not due
  ];

  it('filters strictly by deckId when a specific deck is requested', () => {
    const kanjiCards = mockCards.filter((c) => c.deckId === 'deck_kanji');
    expect(kanjiCards.every((c) => c.deckId === 'deck_kanji')).toBe(true);
    expect(kanjiCards).toHaveLength(2);
  });

  it('orders overdue cards by greatest overdue margin first', () => {
    const now = new Date();
    const dueVocabCards = mockCards
      .filter((c) => c.deckId === 'deck_vocab' && c.state !== 'New' && new Date(c.due!) <= now)
      .sort((a, b) => new Date(a.due!).getTime() - new Date(b.due!).getTime());

    expect(dueVocabCards[0].id).toBe('3'); // Oldest overdue first
  });
});
```

---

## 4. EDGE CASE & FAULT INJECTION CHECKLIST (MA TRẬN KIỂM THỬ BIÊN)

| Test Vector ID | Edge Case Condition | Expected System Behavior | Vitest / Assertion Logic |
| :--- | :--- | :--- | :--- |
| **EC-01** | Deck has 0 cards total | Display Zen Empty state; do not crash; provide AI creator CTA. | `expect(queue).toHaveLength(0);`<br>`expect(screen.getByText(/Chưa có thẻ/)).toBeDefined();` |
| **EC-02** | URL has invalid deck (`?deck=fake_123`) | Fallback to `all` gracefully with non-intrusive notification. | `expect(activeDeck).toBe('all');` |
| **EC-03** | Corrupted Pitch Accent string (`pitch: "NaN"`) | Default pattern to `0 (Heiban)`. Do not break SVG rendering. | `expect(getPitchPattern("NaN")).toBe(0);` |
| **EC-04** | All cards reviewed today (`due > now`) | Display completion celebration with Cramming CTA. | `expect(screen.getByText(/hoàn thành/i)).toBeDefined();` |
| **EC-05** | Double Spacebar press during flip | Idempotent flip; prevent audio from triggering twice concurrently. | `expect(speechSynthesis.speak).toHaveBeenCalledTimes(1);` |
| **EC-06** | Browser offline during rating | Cache rating to `localStorage['pending_reviews']` and advance queue. | `expect(localStorage.getItem('pending_reviews')).toContain('card_xyz');` |

---

## 5. BUG REPORTING & ROOT CAUSE ANALYSIS (RCA) TEMPLATE

When identifying any defect, the QA Engineer writes:

```markdown
### 🐛 BUG-[ID]: [Concise Defect Title]
**Severity**: [S1 - Critical Blocker | S2 - Major Flaw | S3 - Minor Inconvenience]
**Affected Module**: [e.g., `src/app/review/page.tsx` / `src/db/client.ts`]

#### 1. Steps to Reproduce
1. Navigate to `http://localhost:3000/review?deck=deck_jpd133_kanji`
2. Wait for cards to load and press `Space` to reveal answer.
3. Rapidly click button `良 (3)` three times in succession.

#### 2. Expected Behavior (Gherkin Requirement)
- System should process exactly 1 review rating for the active card, log `Good`, and advance `currentIdx` from 1 to 2.

#### 3. Actual Observed Behavior
- `currentIdx` jumped from 1 to 4, skipping 2 cards due to missing debounce on `handleGrade`.

#### 4. Root Cause Analysis (RCA)
- State setter in `handleGrade` lacked async lock/debounce guard, allowing concurrent keydown/click events to fire in parallel.

#### 5. Verification & Fix Verification
- [ ] Add `isSubmitting` flag or debounce guard.
- [ ] Re-run `npm run test` $\rightarrow$ Vitest passes.
- [ ] Re-run clickstream scenario $\rightarrow$ Verified resolved.
```
