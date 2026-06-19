---
story: 9.2
epic: 9
title: Static Game Library Content
status: done
---

# Story 9.2: Static Game Library Content (90 Games)

As a content manager, I want a curated library of 90 games (Word Pop, Connection Quest, Memory Flip × 30 Easy + 30 Medium + 30 Hard) so that children always have high-quality, educator-reviewed content available.

## Acceptance Criteria

**Given** the static library is seeded,
**When** the app requests games for any static-first game type,
**Then** it finds ≥30 games per difficulty tier for Word Pop, Connection Quest, and Memory Flip.

**Given** a game is in the library,
**When** it is inspected,
**Then** it has: question text, 4 options, correct answer, narrative wrapper, hint_1, hint_2, cognitive_load scores, and `source: 'static'`.

**Given** a child has played all games in their current pool,
**When** the event-triggered refresh fires,
**Then** the child's schedule is repopulated from unused games in the library.

## Content Specifications

### Word Pop (30 Easy / 30 Medium / 30 Hard)
- Easy: sight words, common nouns, simple adjectives (ages 7–9)
- Medium: multi-syllable words, context clues, synonyms (ages 10–11)
- Hard: etymology, figurative language, domain vocabulary (ages 12–15)
- Narrative: short sentence providing context ("The astronaut floated in the _____ silence of space")

### Connection Quest (30 Easy / 30 Medium / 30 Hard)
- Easy: basic category membership (animals, colours, shapes)
- Medium: functional relationships (tool → action, animal → habitat)
- Hard: abstract analogies (cause → effect, part → whole across domains)
- Narrative: museum curator / explorer / scientist story arc

### Memory Flip (30 Easy / 30 Medium / 30 Hard)
- Easy: 2×2 grid, 2 pairs, thematic icons
- Medium: 3×4 grid, 6 pairs, mixed categories
- Hard: 4×4 grid, 8 pairs, abstract patterns
- Each game has a `seed` field for sibling sharing

## Definition of Done
- [ ] 90 game records seeded in DB (or mock DB for pre-backend phase)
- [ ] All games pass content review checklist (age-appropriate, no PII, accessible alt text)
- [ ] Cognitive load scores validated by educator review
- [ ] Spaced repetition schedule seeds correctly from library
