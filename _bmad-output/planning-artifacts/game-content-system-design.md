---
created: 2026-05-19
source: brainstorming-session-2026-05-19-2100.md
status: approved
epic: epic-9
---

# Game Content System Design

## Architecture: Two-Speed Content Delivery

```
┌─────────────────────────────────────────────────┐
│  STATIC-FIRST (curated, high-touch)             │
│  Word Pop · Connection Quest · Memory Flip      │
│  30 Easy + 30 Medium + 30 Hard = 90 games       │
│  Weekly refresh (event-triggered, per-child)    │
│  QWEN enhances: narrative wrappers + distractors│
├─────────────────────────────────────────────────┤
│  AI-FIRST (generative, infinite)                │
│  Pattern Builder · Grid Logic                   │
│  60 seed games as templates                     │
│  QWEN generates unique variants per session     │
│  Rules-based validator confirms correctness     │
└─────────────────────────────────────────────────┘
```

## Data Model

### games table
```
id            UUID PRIMARY KEY
game_type     TEXT  -- word-pop | connection-quest | memory-flip | pattern-builder | grid-logic
difficulty    TEXT  -- easy | medium | hard
cognitive_load JSONB -- { vocabulary: 0-5, memory: 0-5, reasoning: 0-5, speed: 0-5 }
source        TEXT  -- static | ai_generated | ai_enhanced
content       JSONB -- { question, options, correct, narrativeWrapper }
hint_1        TEXT  -- pre-computed, delivered after 10s
hint_2        TEXT  -- pre-computed, delivered after hint_1 used
seed          TEXT  -- Memory Flip share code (share same grid with sibling)
expires_at    TIMESTAMPTZ -- null=permanent; set for AI-generated variants (+7 days)
created_at    TIMESTAMPTZ
```

### child_game_schedule table
```
child_id      UUID
game_id       UUID
status        TEXT  -- unseen | in-progress | mastered | scheduled-review
next_due      DATE  -- spaced repetition next exposure date
attempts      INT
last_result   TEXT  -- correct | incorrect
```

### experiments_assignments table
```
child_id        UUID
experiment_id   TEXT
group_name      TEXT  -- control | treatment
assigned_at     TIMESTAMPTZ
plateau_override BOOLEAN
```

### ai_generation_log table
```
id            UUID
child_id      UUID
game_type     TEXT
trigger       TEXT  -- session-start | bridging | distractor | narrative
prompt_hash   TEXT  -- for dedup/caching
latency_ms    INT
tokens_used   INT
created_at    TIMESTAMPTZ
```

## API Contract

### Primary endpoint (source-agnostic)
```
GET /api/games/next?childId=&gameType=&count=5

Server-side logic:
  1. Lookup child's experiment group
  2. Lookup child's cognitive_load profile
  3. Static path (control OR word-pop/connection-quest/memory-flip):
       Query games WHERE source='static' AND matches_load_profile
  4. AI path (treatment AND pattern-builder/grid-logic):
       Call QWEN with child_profile context
       Validate with rules engine
       Insert to games (source='ai_generated', expires_at=+7d)
  5. Apply spaced repetition filter
  6. Return games[] — client never sees source field

Response:
{
  games: [{
    id, gameType,
    content: { question, options, correct, narrativeWrapper },
    hint1, hint2,    -- sealed, delivered client-side on schedule
    seed,            -- Memory Flip share code
    progressWeight: 1
  }]
}
```

### Bridging micro-game
```
POST /api/games/bridge
{ childId, gameType, questionContext, wrongAnswerCount: 3 }

→ QWEN generates 3-question stepping-stone game
→ Difficulty = one tier below current
→ Ephemeral, not stored in spaced repetition
```

## A/B Test Design

| | Group A (Control) | Group B (Treatment) |
|---|---|---|
| Word Pop | Static library | Static + AI narrative wrapper |
| Connection Quest | Static library | Static + AI distractors |
| Memory Flip | Static library | Static + personalized theme |
| Pattern Builder | Static seeds (60) | QWEN variants from seeds |
| Grid Logic | Static seeds (60) | Full QWEN generation |
| Assignment | Hash(childId + experimentId) mod 100, 0–49 | 50–99 |
| Special case | — | Plateau ≥14 days → force treatment |

### Success Metrics
| Metric | Threshold |
|--------|-----------|
| Learning velocity (promotions/30d) | Treatment ≥ 1.2× Control |
| 7-day return rate | Treatment ≥ +5pp |
| Game completion rate | Treatment ≥ +8pp |
| Hint usage rate | Treatment ≤ Control |
| Plateau break rate | Treatment ≥ 2× Control |

**Primary metric:** Learning velocity. **Guard rail:** Return rate must not drop.

## QWEN Integration Points

| Trigger | Task | Latency target |
|---------|------|----------------|
| Session start (AI-first types) | Full puzzle generation | < 2s |
| Pattern Builder seed | Surface variant generation | < 1s |
| Static game load | Narrative wrapper | < 500ms |
| Static game load | Distractor generation | < 500ms |
| 3 wrong answers | Bridging micro-game (3 questions) | < 2s |
| Post-session async | Adaptive hint threshold update | Async |

**Cost control:** Cache QWEN outputs by `hash(gameType + difficulty + childAgeRange)`. Estimated cache hit rate: ~60%.

## Implementation Roadmap

| Sprint | Deliverable |
|--------|-------------|
| 9.1 | DB types + `/api/games/next` (static path) + experiment assignment |
| 9.2 | 90 static games authored (30×3 difficulty for Word Pop, Connection Quest, Memory Flip) |
| 9.3 | QWEN connector + Grid Logic validator + `/api/games/bridge` |
| 9.4 | Spaced repetition scheduling + A/B instrumentation + PostHog dashboard |
| 9.5 | Pattern Builder + Grid Logic seed libraries; narrative pipeline; 4-week A/B analysis |
