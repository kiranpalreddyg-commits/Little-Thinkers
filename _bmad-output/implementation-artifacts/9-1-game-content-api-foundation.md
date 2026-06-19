---
story: 9.1
epic: 9
title: Game Content API Foundation
status: ready-for-dev
---

# Story 9.1: Game Content API Foundation

As a child player, I want the app to serve me the right games for my level so that I always have fresh, appropriately challenging content without delays.

**FRs covered:** Game content system Sprint 1 (design: game-content-system-design.md)

## Acceptance Criteria

**Given** I am a child starting a game session,
**When** the app requests games from `GET /api/games/next?childId=&gameType=&count=5`,
**Then** I receive 5 games appropriate to my current cognitive load profile,
**And** each game includes pre-computed hint_1 and hint_2 (sealed until triggered),
**And** the response never exposes the content source (static vs AI).

**Given** I am assigned to an A/B experiment group,
**When** my `childId` is hashed against the experiment,
**Then** assignment is stable (same child always gets same group),
**And** children with a difficulty plateau ≥ 14 days are force-assigned to the treatment group.

**Given** games are served,
**When** a game is delivered,
**Then** PostHog captures `game_served` with `{ gameType, source, experimentGroup, difficulty }`.

## Technical Notes

- TypeScript types: `src/lib/types/gameContent.ts`
- API route: `src/app/api/games/next/route.ts`
- Experiment service: `src/lib/services/experiments.ts`
- Mock data: extend `src/lib/api/mockDb.ts` with `gameLibrary` array
- Static path only in this sprint — QWEN integration is Sprint 9.3

## Definition of Done
- [ ] `GET /api/games/next` returns valid game objects for all 5 game types
- [ ] Experiment assignment is deterministic and plateau-aware
- [ ] PostHog `game_served` event fires on every response
- [ ] TypeScript compiles with no errors (`tsc --noEmit`)
- [ ] Mock DB seeded with ≥5 games per game type per difficulty (75 total seed records)
