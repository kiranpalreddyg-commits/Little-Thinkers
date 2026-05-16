# Deferred Work

Items deferred during code review; each has a reason and the story/date it came from.

---

## Deferred from: code review of 1-5-earn-thought-sparks-and-fill-the-brain-jar (2026-05-15)

- **Hardcoded game question (3+4=7)** — pre-existing placeholder; game content system is out of scope for Story 1.5. Address when real game question data is introduced.
- **`hydrateRewards` never calls `fetchBrainJar` API** — intentional localStorage-first design; cloud sync deferred to Epic 3 (`3-1-sync-gameplay-progress-to-the-cloud-when-connected`).
- **`fillPercent` drops from 100% to ~5% on jar-reset** — by-spec behaviour; the jar empties when capacity is reached. Levelling-up UX transition is Story 1.6 scope.
- **`readStoredJar` trusts localStorage shape without runtime validation** — MVP acceptable; tampered-value NaN is partially mitigated by the P3 patch (capacity guard). Full zod validation can be added in a hardening sprint.
- **2-second auto-dismiss may not meet WCAG 2.2.1 timing-adjustable** — dismissal window is defined by AC1; user-configurable timing belongs in Story 1.7 accessibility modes.
- **Rapid consecutive answers skip animation** — `isAnimating` is a boolean flag, not a queue; animation queuing is out of MVP scope.
- **Paused game allows answer submission via keyboard** — the pause overlay does not trap focus; pre-existing Story 1.4 gap. Address in a dedicated accessibility pass.
- **`isAnimating` double-set race between `earnSpark` and `completionBonus`** — effects are sequential in practice; the last correct answer + completion bonus occurring in the same render cycle may visually skip one animation. Low probability in the current game loop. Revisit when game completion flow is reworked in Story 1.6.
