# Story 8.1 — AI Integration Architecture and Design Plan

**Epic:** 8 — AI-Powered Adaptive Learning
**Status:** done
**Author:** Aria (AI Engineer)
**Completed:** 2026-05-17

## Summary

Defined the full AI architecture for Little Thinkers, covering adaptive difficulty, contextual hints, and parent Brain Reports using the Anthropic Claude API.

## Acceptance Criteria

- [x] AI architecture document created → `_bmad-output/planning-artifacts/ai-architecture.md`
- [x] Adaptive difficulty engine designed: rolling 10-answer window, difficulty_up/down after 3 consecutive same-result answers, 5 levels per game
- [x] AI hint system designed: "Think about it" Socratic prompt, 10 s timer, max 2 hints per question, static fallback
- [x] AI-powered Brain Report designed: 200-word parent narrative, weekly cadence, Redis-cached, anonymized stats only
- [x] Technology choice: `claude-haiku-4-5` for hints + difficulty (real-time, low-latency); `claude-sonnet-4-6` for Brain Reports (quality, weekly)
- [x] Privacy: AI receives anonymized `childId` (UUID) + age range band only — no name, no raw age, no email — COPPA compliant; `no_store: true` on all API calls

## Deliverable

See full design: [ai-architecture.md](../planning-artifacts/ai-architecture.md)

## Notes for Story 8.2

- Three Route Handlers to implement: `/api/ai/hint`, `/api/ai/difficulty`, `/api/ai/brain-report`
- `ANTHROPIC_API_KEY` server-side only — never in client bundle
- Static hint fallbacks required before API integration (offline-first)
- Rate limits: hints 10/hr, difficulty 60/hr, reports 2/day per identity
- Extend `useProgression` Zustand store with `gameDifficulty` and `answerWindow`
