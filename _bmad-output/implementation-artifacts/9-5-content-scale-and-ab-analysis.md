---
story: 9.5
epic: 9
title: Content Scale and A/B Analysis
status: backlog
---

# Story 9.5: Content Scale and A/B Analysis

As a product team, we want the full 150-game library available (including Pattern Builder and Grid Logic seed libraries) and a clear A/B test conclusion so that we can decide whether to invest further in AI-generated content.

## Acceptance Criteria

**Given** Sprint 9.2 delivered 90 static games,
**When** Sprint 9.5 is complete,
**Then** the library has 60 additional seed games (Pattern Builder: 30 Easy/Medium/Hard; Grid Logic: 30 Easy/Medium/Hard),
**And** QWEN generates unique variants from each seed, verified by the validator.

**Given** the A/B test has run for ≥ 28 days with ≥ 100 children per group,
**When** the analysis is run,
**Then** a written decision is produced: "Treatment wins" / "Control wins" / "Extend test",
**And** the decision is documented in `_bmad-output/planning-artifacts/ab-test-analysis-{date}.md`.

**Given** the narrative pipeline is live,
**When** a static game is loaded for a treatment group child,
**Then** 100% of games have a QWEN-generated narrative wrapper (no bare questions).

## Content Specifications

### Pattern Builder Seeds (30 per difficulty)
- Easy: AB, AAB, ABB patterns with shapes/colours
- Medium: AABB, ABC, ABAC with numbers and symbols
- Hard: recursive patterns, multi-attribute sequences

### Grid Logic Seeds (30 per difficulty)
- Easy: 3×3 grid, 2 constraints, 1 solution
- Medium: 4×4 grid, 4 constraints, 1 solution
- Hard: 5×5 grid, 6+ constraints, 1 solution

## A/B Test Decision Criteria

| Outcome | Condition | Action |
|---------|-----------|--------|
| Treatment wins | Learning velocity ≥ 1.2× AND return rate not down | Roll out AI path to 100% |
| Control wins | Learning velocity < 1.0× OR return rate drops > 5pp | Keep static library; deprioritise QWEN |
| Inconclusive | 0.9–1.2× with overlapping CIs | Extend test 4 more weeks with higher n |

## Definition of Done
- [ ] 60 seed games for Pattern Builder and Grid Logic in DB
- [ ] QWEN variant generation verified for all 60 seeds
- [ ] Narrative pipeline batch-processes all 90 static games
- [ ] A/B analysis document written and filed
- [ ] Sprint-status.yaml updated: epic-9 → done
