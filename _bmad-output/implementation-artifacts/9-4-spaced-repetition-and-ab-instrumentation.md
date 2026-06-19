---
story: 9.4
epic: 9
title: Spaced Repetition and A/B Instrumentation
status: done
---

# Story 9.4: Spaced Repetition and A/B Instrumentation

As a child, I want the app to intelligently schedule which games I see so that I practice concepts I've struggled with at the right intervals; as a product team, we want validated A/B test results to decide which content strategy wins.

## Acceptance Criteria

**Given** I answer a game question,
**When** the result is recorded,
**Then** `child_game_schedule` is updated with `status` and `next_due` (correct → +3 days, then +7, then +14; incorrect → +1 day).

**Given** I request games from `/api/games/next`,
**When** my schedule has games due today,
**Then** due reviews appear in my game pool before unseen games.

**Given** I have been stuck at the same difficulty level for ≥ 14 days,
**When** the plateau detection job runs (nightly),
**Then** my experiment assignment is updated to `group: treatment, plateau_override: true`.

**Given** the A/B test has been running for ≥ 28 days with ≥ 100 children per group,
**When** the PostHog experiment dashboard is viewed,
**Then** it shows: learning velocity, 7-day return rate, completion rate, hint usage rate, and plateau break rate — broken down by control vs treatment.

## Technical Notes

- Spaced repetition service: `src/lib/services/spacedRepetition.ts`
- Plateau detection: nightly cron job or post-session trigger
- PostHog events to instrument:
  - `game_served` — `{ gameType, source, experimentGroup, difficulty }`
  - `game_completed` — `{ gameType, difficulty, correct, experimentGroup }`
  - `difficulty_promoted` — `{ gameType, fromLevel, toLevel, experimentGroup }`
  - `plateau_detected` — `{ childId, gameType, daysSincLastPromotion }`
  - `bridge_game_triggered` — `{ gameType, wrongAnswerCount }`

## Definition of Done
- [x] Spaced repetition intervals applied correctly on each answer
- [x] Due reviews surface before unseen games in `/api/games/next`
- [x] Plateau detection runs nightly, updates experiment assignments
- [x] All 5 PostHog events fire with correct properties
- [ ] PostHog experiment configured with primary metric: `difficulty_promoted` rate (manual step in PostHog dashboard)
