/**
 * Story 8.2 — Static Hint Fallback (AC6)
 *
 * RED tests: STATIC_HINTS does not exist yet.
 * All tests MUST FAIL until `src/lib/ai/staticHints.ts` is implemented.
 */

import { describe, it, expect } from 'vitest';

// This import will fail until the file is created — that is intentional.
import { STATIC_HINTS } from '@/lib/ai/staticHints';

const GAME_TYPES = [
  'word-pop',
  'connection-quest',
  'memory-flip',
  'pattern-builder',
  'grid-logic',
] as const;

describe('STATIC_HINTS (AC6 — static hint fallback)', () => {
  it('exports STATIC_HINTS as a non-null object', () => {
    expect(STATIC_HINTS).toBeDefined();
    expect(typeof STATIC_HINTS).toBe('object');
    expect(STATIC_HINTS).not.toBeNull();
  });

  it('has all 5 game types as keys', () => {
    for (const gameType of GAME_TYPES) {
      expect(Object.keys(STATIC_HINTS)).toContain(gameType);
    }
  });

  it.each(GAME_TYPES)('"%s" has at least 2 hints', (gameType) => {
    const hints = STATIC_HINTS[gameType];
    expect(Array.isArray(hints)).toBe(true);
    expect(hints.length).toBeGreaterThanOrEqual(2);
  });

  it.each(GAME_TYPES)('all hints for "%s" are non-empty strings', (gameType) => {
    const hints = STATIC_HINTS[gameType];
    for (const hint of hints) {
      expect(typeof hint).toBe('string');
      expect(hint.trim().length).toBeGreaterThan(0);
    }
  });
});
