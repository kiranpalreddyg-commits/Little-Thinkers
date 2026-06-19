/**
 * Story 3.2 — Progress Persistence Tests
 *
 * AC: each child has a separate progress record; progress restores on sign-in
 */

import { describe, it, expect } from 'vitest';
import {
  getChildProgressKey,
  getChildStreakKey,
  getChildRewardsKey,
  getChildAiKey,
  isProgressSeparatePerChild,
} from '@/lib/utils/progressPersistence';

describe('Progress Persistence — Story 3.2', () => {
  it('AC: each child gets a unique progress storage key', () => {
    const key1 = getChildProgressKey('child-1');
    const key2 = getChildProgressKey('child-2');
    expect(key1).not.toBe(key2);
    expect(key1).toBe('lt_progression_child-1');
    expect(key2).toBe('lt_progression_child-2');
  });

  it('AC: streak key is unique per child', () => {
    expect(getChildStreakKey('child-1')).toBe('lt_streak_child-1');
    expect(getChildStreakKey('child-2')).toBe('lt_streak_child-2');
    expect(getChildStreakKey('child-1')).not.toBe(getChildStreakKey('child-2'));
  });

  it('AC: rewards key is unique per child', () => {
    expect(getChildRewardsKey('child-1')).toBe('lt_rewards_child-1');
    expect(getChildRewardsKey('child-2')).toBe('lt_rewards_child-2');
    expect(getChildRewardsKey('child-1')).not.toBe(getChildRewardsKey('child-2'));
  });

  it('AC: isProgressSeparatePerChild returns true for different child IDs', () => {
    expect(isProgressSeparatePerChild(['child-1', 'child-2', 'child-3'])).toBe(true);
  });

  it('AC: isProgressSeparatePerChild returns false for duplicate child IDs', () => {
    expect(isProgressSeparatePerChild(['child-1', 'child-1'])).toBe(false);
  });

  it('AC: all four data namespaces are distinct for the same child', () => {
    const keys = [
      getChildProgressKey('child-1'),
      getChildStreakKey('child-1'),
      getChildRewardsKey('child-1'),
      getChildAiKey('child-1'),
    ];
    expect(new Set(keys).size).toBe(4);
  });
});
