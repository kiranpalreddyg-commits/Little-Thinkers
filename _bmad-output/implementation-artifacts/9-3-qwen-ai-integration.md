---
story: 9.3
epic: 9
title: QWEN AI Game Integration
status: done
---

# Story 9.3: QWEN AI Game Integration

As a child in the treatment A/B group, I want AI-generated game content for Pattern Builder and Grid Logic so that I always get a fresh, unique puzzle tailored to my level.

## Acceptance Criteria

**Given** I am in the treatment group and starting a Grid Logic session,
**When** the API serves games,
**Then** QWEN generates a unique puzzle at session start (< 2s),
**And** a rules-based validator confirms the puzzle has exactly one valid solution before delivery,
**And** the game is stored with `source: 'ai_generated'` and `expires_at: +7 days`.

**Given** I answer 3 questions incorrectly in a row,
**When** the app calls `POST /api/games/bridge`,
**Then** QWEN generates a 3-question bridging micro-game one difficulty tier below my current level,
**And** the bridging game is delivered within 2 seconds,
**And** the bridging game is ephemeral (not added to my spaced repetition schedule).

**Given** a static-first game is served to a treatment group child,
**When** the game payload is assembled,
**Then** QWEN generates the narrative wrapper (< 500ms),
**And** QWEN generates 3 plausible distractor options (< 500ms),
**And** the correct answer is unchanged from the static library record.

## Technical Notes

- QWEN API connector: `src/lib/ai/qwen.ts`
- Grid Logic validator: `src/lib/games/gridLogicValidator.ts`
- Pattern Builder variant generator: `src/lib/games/patternVariantGenerator.ts`
- Bridge endpoint: `src/app/api/games/bridge/route.ts`
- Cache layer: `hash(gameType + difficulty + childAgeRange)` → 60% expected hit rate
- All QWEN calls logged to `ai_generation_log`

## Definition of Done
- [ ] QWEN connector handles auth, retry, and timeout (5s hard limit)
- [ ] Grid Logic validator rejects puzzles with 0 or 2+ solutions
- [ ] Bridge endpoint responds in < 2s (p95)
- [ ] Cache hit rate measured and logged
- [ ] Fallback to static seed if QWEN times out or errors
- [ ] `ai_generation_log` records all calls with latency and token count
