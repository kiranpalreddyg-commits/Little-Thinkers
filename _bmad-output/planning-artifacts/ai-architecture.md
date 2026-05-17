# AI Integration Architecture — Little Thinkers

**Author:** Aria (AI Engineer)
**Date:** 2026-05-17
**Story:** 8.1 — AI Integration Architecture and Design Plan
**Status:** Approved

---

## 1. Overview

Little Thinkers uses the Anthropic Claude API to deliver two AI-powered features:

| Feature | Model | Trigger |
|---------|-------|---------|
| Real-time adaptive difficulty | claude-haiku-4-5 | After every 3 consecutive correct or incorrect answers |
| Contextual "Think about it" hints | claude-haiku-4-5 | After 10 seconds of no answer |
| Parent Brain Report | claude-sonnet-4-6 | Weekly, on-demand from parent dashboard |

**Privacy constraint (COPPA):** The AI layer never receives a child's name, age, email, or any PII. Every Claude API call uses an anonymized `childId` token (UUID) only.

---

## 2. Adaptive Difficulty Engine

### 2.1 How It Works

The engine maintains a rolling **performance window** of the last 10 answered questions per child per game. After each answer it evaluates the window:

```
If last 3 answers ALL correct  → request difficulty_up signal
If last 3 answers ALL incorrect → request difficulty_down signal
Otherwise                       → no change
```

Difficulty levels per game (1 = easiest, 5 = hardest):

| Game | Levels | Adjustable Dimension |
|------|--------|----------------------|
| word-pop | 1–5 | Word length + obscurity |
| connection-quest | 1–5 | Category breadth + misdirection |
| memory-flip | 1–5 | Grid size (2×2 → 6×6) |
| pattern-builder | 1–5 | Sequence length + step count |
| grid-logic | 1–5 | Grid size + constraint count |

### 2.2 Claude API Call — Difficulty Adjustment

Called server-side (Next.js Route Handler) to prevent API key exposure.

**Endpoint:** `POST /api/ai/difficulty`

**Request payload (no PII):**
```json
{
  "childId": "anon-uuid-v4",
  "gameType": "word-pop",
  "currentLevel": 2,
  "recentAnswers": [true, true, true],
  "ageRange": "7-9"
}
```

**System prompt:**
```
You are an educational game difficulty adjuster for children aged {ageRange}.
Given the child's recent performance, decide whether to increase, decrease, or maintain difficulty.
Respond ONLY with valid JSON: {"action": "up"|"down"|"maintain", "reason": "one sentence"}
Do not include any child name or personal information in your response.
```

**Response:**
```json
{ "action": "up", "reason": "Three consecutive correct answers indicates readiness for harder content." }
```

**Fallback:** If the API call fails or times out (>2 s), the engine maintains the current difficulty level. No user-facing error is shown.

### 2.3 State Management

Difficulty state lives in the `useProgression` Zustand store alongside `sparks` and `streak`:

```ts
interface ProgressionState {
  // existing
  sparks: number;
  streak: number;
  // new in Story 8.2
  gameDifficulty: Record<GameType, 1 | 2 | 3 | 4 | 5>;
  answerWindow: Record<GameType, boolean[]>; // last 10 answers per game
}
```

Persisted to `localStorage` under key `lt:progression:{childId}`. Cleared on sign-out.

---

## 3. Hint System ("Think About It")

### 3.1 Trigger and UX Flow

```
Player loads question
  └─ 10 s timer starts (reset on any keypress or tap)
      └─ "Need a hint? 💡" button fades in
          └─ Player taps → spinner (≤2 s) → hint text appears
              └─ Hint is contextual, Socratic, age-appropriate
```

Maximum **2 hints per question**. After both hints are consumed the button disappears. Hint usage is counted per session and stored for the parent Brain Report.

### 3.2 Claude API Call — Hint Generation

**Endpoint:** `POST /api/ai/hint`

**Request payload:**
```json
{
  "childId": "anon-uuid-v4",
  "gameType": "word-pop",
  "questionContext": "A four-letter word meaning happy",
  "hintNumber": 1,
  "ageRange": "7-9"
}
```

`questionContext` is the question text — no child name or PII. Age range (`"7-9"` | `"10-12"` | `"13-15"`) is derived server-side from the child's stored age band; the raw age integer is never sent to the API.

**System prompt:**
```
You are a friendly educational assistant helping a child aged {ageRange} think through a problem.
Use the Socratic method: ask guiding questions rather than giving the answer.
Keep your response under 30 words. Use encouraging, age-appropriate language.
Do not repeat the question. Do not reveal the answer.
This is hint #{hintNumber} of 2 — make hint 2 more specific than hint 1.
```

**User message:**
```
The question is: {questionContext}
```

**Example responses:**
- Hint 1: "Think about how you feel when you're laughing and something great happens. What short word describes that feeling?"
- Hint 2: "It rhymes with 'glad' and starts with the same letter as 'giggle'."

**Fallback:** Pre-authored static hints per game type stored in `src/lib/ai/staticHints.ts`. Used when:
- Claude API returns an error
- Request times out after 2 s
- User is offline (Service Worker intercepts)

### 3.3 Static Hint Fallback Shape

```ts
// src/lib/ai/staticHints.ts
export const STATIC_HINTS: Record<GameType, string[]> = {
  'word-pop':         ["Think about the letters you can see.", "Try sounding it out syllable by syllable."],
  'connection-quest': ["Look for something these items have in common.", "Think about one category at a time."],
  'memory-flip':      ["Try to remember the position, not just the picture.", "Focus on one row at a time."],
  'pattern-builder':  ["What changes between each step?", "Count the pieces — does the number grow or stay the same?"],
  'grid-logic':       ["Start with the row or column that has the most clues.", "If one option is impossible, eliminate it."],
};
```

---

## 4. Parent Brain Report

### 4.1 What It Is

A weekly AI-generated narrative (≤200 words) summarizing a child's cognitive skill development. Delivered via the parent dashboard (Epic 2). It replaces raw numbers with plain-language insight:

> "This week Alex showed strong pattern recognition, solving 23 pattern challenges — up 40% from last week. They found memory games tricky but kept trying. Working memory is an area where continued play will help."

### 4.2 Claude API Call — Brain Report

**Endpoint:** `POST /api/ai/brain-report`
**Auth:** Parent JWT required (parent-tier endpoint, child is never authenticated here).

**Request payload:**
```json
{
  "childId": "anon-uuid-v4",
  "ageRange": "10-12",
  "weeklyStats": {
    "word-pop":         { "played": 12, "accuracy": 0.72, "avgDifficulty": 2.3 },
    "connection-quest": { "played": 5,  "accuracy": 0.60, "avgDifficulty": 1.8 },
    "memory-flip":      { "played": 20, "accuracy": 0.85, "avgDifficulty": 3.1 },
    "pattern-builder":  { "played": 23, "accuracy": 0.91, "avgDifficulty": 3.5 },
    "grid-logic":       { "played": 3,  "accuracy": 0.33, "avgDifficulty": 1.0 }
  },
  "hintsUsed": 7,
  "streakDays": 5,
  "sparksEarned": 380
}
```

No name, no raw age, no email. The parent dashboard maps `childId` → display name client-side after receiving the report text.

**System prompt:**
```
You are a child development specialist writing a friendly weekly progress summary for a parent.
The child is in the {ageRange} age group.
Write in warm, encouraging, plain English. Maximum 200 words.
Describe cognitive skill patterns (memory, language, logic, pattern recognition) based on the game statistics.
Do not mention specific scores. Highlight one strength and one growth area.
End with one actionable suggestion for the parent.
Do not use the child's name — use "your child" or "they/them".
```

**Caching:** Reports are generated once per week per child and cached in Redis for 7 days. If the parent requests a report mid-week, the cached version is returned instantly.

---

## 5. Privacy and COPPA Compliance

| Data sent to Claude API | Allowed? | Notes |
|-------------------------|----------|-------|
| Child name | NO | Never transmitted |
| Child age (exact) | NO | Only age range band (e.g., "10-12") |
| Child email | NO | Never stored at child level |
| `childId` (UUID) | YES | Anonymized, non-reversible from API side |
| Game performance stats | YES | Aggregated, no identifying info |
| Question text | YES | Game content only, no user data |

**Data retention:** Claude API is called in streaming or standard mode with `no_store: true` (Anthropic's zero-retention flag). No conversation history is sent — every API call is stateless.

**Audit log:** Every AI API call logs `{timestamp, childId, endpoint, model, latencyMs, fallbackUsed}` to the compliance audit table (Epic 3 story 3-3). PII is never written to the audit log.

---

## 6. API Route Handlers

All Claude API calls go through Next.js Route Handlers (server-side). The `ANTHROPIC_API_KEY` environment variable is never exposed to the client bundle.

```
src/app/api/ai/
  difficulty/route.ts   ← POST, child-auth required
  hint/route.ts         ← POST, child-auth required
  brain-report/route.ts ← POST, parent-auth required
```

### Rate Limiting

| Endpoint | Limit |
|----------|-------|
| `/api/ai/hint` | 10 req / child / hour |
| `/api/ai/difficulty` | 60 req / child / hour |
| `/api/ai/brain-report` | 2 req / parent / day |

Rate limits enforced at the API Gateway layer (existing `F[API Gateway]` in architecture.md §2).

### Response Time Budget

| Endpoint | Target p95 | Fallback threshold |
|----------|-----------|-------------------|
| `/api/ai/hint` | 1.5 s | 2 s → static hint |
| `/api/ai/difficulty` | 1.0 s | 2 s → maintain level |
| `/api/ai/brain-report` | 5.0 s | none (async, cached) |

---

## 7. Updated System Architecture Diagram (AI Layer)

```mermaid
graph TB
    subgraph "Client (PWA)"
        A[Game UI]
        B[Parent Dashboard]
    end

    subgraph "Next.js Route Handlers (server-side)"
        H1["/api/ai/hint"]
        H2["/api/ai/difficulty"]
        H3["/api/ai/brain-report"]
    end

    subgraph "Anthropic Claude API"
        M1["claude-haiku-4-5<br/>(hints, difficulty)"]
        M2["claude-sonnet-4-6<br/>(brain reports)"]
    end

    subgraph "Fallback"
        F1[Static Hints<br/>staticHints.ts]
        F2[Maintain Level<br/>(no-op)]
    end

    subgraph "Cache"
        R[(Redis<br/>brain-report cache 7d)]
    end

    A -->|"POST hint request<br/>(childId, question)"| H1
    A -->|"POST difficulty request<br/>(childId, answers)"| H2
    B -->|"POST report request<br/>(childId, weeklyStats)"| H3

    H1 -->|"API key hidden server-side"| M1
    H2 --> M1
    H3 --> M2

    H1 -->|"timeout/error"| F1
    H2 -->|"timeout/error"| F2
    H3 --> R

    M1 --> H1
    M1 --> H2
    M2 --> H3
```

---

## 8. Implementation Checklist (for Story 8.2)

- [ ] `src/app/api/ai/hint/route.ts` — POST handler with fallback
- [ ] `src/app/api/ai/difficulty/route.ts` — POST handler with fallback
- [ ] `src/app/api/ai/brain-report/route.ts` — POST handler with Redis cache
- [ ] `src/lib/ai/staticHints.ts` — static fallback hints per game type
- [ ] `src/lib/ai/claudeClient.ts` — shared Anthropic SDK wrapper, timeout handling
- [ ] Extend `useProgression` store: `gameDifficulty`, `answerWindow`, `hintsUsed`
- [ ] Gameplay: 10 s hint timer, "Need a hint? 💡" button, max 2 hints per question
- [ ] Gameplay: after-3-answers difficulty evaluation, optimistic UI (no spinner)
- [ ] `ANTHROPIC_API_KEY` in `.env.local` (never committed), Vercel env vars for prod
- [ ] Rate limiting headers validated in integration tests
- [ ] Unit tests: `claudeClient.ts` with mocked SDK, fallback paths
- [ ] E2E tests: hint button appears after 10 s, difficulty level persists across reload
