---
stepsCompleted: [1, 2, 3, 4]
inputDocuments: []
session_topic: 'Game Ideas — 150-game static library + QWEN AI on-the-fly generation + A/B testing'
session_goals: 'Design the content system for 50 Easy/50 Medium/50 Hard games across 5 game types, served via REST APIs with weekly refresh; integrate QWEN AI for adaptive on-the-fly game generation; A/B test both approaches'
selected_approach: 'Two-speed architecture: static-first for Word Pop / Connection Quest / Memory Flip; AI-first for Pattern Builder / Grid Logic'
techniques_used: ['What If Scenarios', 'Morphological Analysis', 'SCAMPER', 'Decision Tree Mapping']
ideas_generated: [50+]
context_file: '_bmad-output/planning-artifacts/game-content-system-design.md'
status: complete
---

## Session Overview

**Topic:** Game Ideas — Static Library (150 games) + QWEN AI Adaptive Generation + A/B Testing
**Goals:** Design a scalable game content system with dual delivery modes and experimental validation
**Status:** ✅ Complete — design artifact exported to `_bmad-output/planning-artifacts/game-content-system-design.md`

## Phases Completed

### Phase 1: What If Scenarios ✅
50+ raw ideas generated across 5 challenge rounds:
- QWEN as bridging micro-game generator (fires on 3 wrong answers) — ⭐⭐⭐⭐⭐
- AI generates distractors only, keeps correct answer from static library — ⭐⭐⭐⭐
- Sealed envelope delivery (7 games downloaded Sunday, one/day) — ⭐⭐⭐⭐
- QWEN generates narrative wrappers, not question content — ⭐⭐⭐⭐
- Game pairs (adjacent difficulty pre-fetched) for instant transitions — ⭐⭐⭐⭐

### Phase 2: Morphological Analysis ✅
Per-game configuration matrix completed. Key output: **Two-speed architecture**
- Static-first: Word Pop, Connection Quest, Memory Flip (90 curated games)
- AI-first: Pattern Builder, Grid Logic (60 seed games + QWEN variants)

### Phase 3: SCAMPER ✅
8 architecture changes identified:
1. Single `/api/games/next` source-agnostic endpoint
2. Embed hints in game payload at generation time
3. A/B test targets plateaued learners, not random 50/50
4. Spaced repetition for game re-exposure scheduling
5. Eliminate difficulty selector; use natural-language mode
6. Single `games` table with `source` field
7. Cognitive load score replaces Easy/Medium/Hard as primary dimension
8. Hardest-first session opener (to test separately)

### Phase 4: Decision Tree Mapping ✅
Full architecture designed:
- Data model (games, child_game_schedule, experiments_assignments, ai_generation_log)
- API contract (`GET /api/games/next`, `POST /api/games/bridge`)
- QWEN integration map (6 integration points)
- 5-sprint implementation roadmap
- A/B test design with primary metric: learning velocity (difficulty promotions/30d)
