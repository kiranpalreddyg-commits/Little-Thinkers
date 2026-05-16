import { describe, it, expect } from 'vitest';
import { getDailyGame } from '@/lib/utils/dailyChallenge';

describe('getDailyGame', () => {
  it('returns a valid game type for any date', () => {
    const game = getDailyGame(new Date('2026-01-01'));
    expect(['word-pop', 'connection-quest', 'memory-flip', 'pattern-builder', 'grid-logic']).toContain(game);
  });

  it('returns consistent result for the same date', () => {
    const date = new Date('2026-05-16');
    expect(getDailyGame(date)).toBe(getDailyGame(date));
  });

  it('returns different games across days (rotation check)', () => {
    const results = new Set<string>();
    for (let d = 0; d < 5; d++) {
      const date = new Date(2026, 0, d + 1);
      results.add(getDailyGame(date));
    }
    expect(results.size).toBeGreaterThan(1);
  });

  it('never throws for any day of year', () => {
    for (let d = 0; d < 365; d++) {
      const date = new Date(2026, 0, d + 1);
      expect(() => getDailyGame(date)).not.toThrow();
    }
  });
});
