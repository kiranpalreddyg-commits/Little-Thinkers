const PROGRESSION_PREFIX = 'lt_progression_';
const STREAK_PREFIX = 'lt_streak_';
const REWARDS_PREFIX = 'lt_rewards_';
const AI_PREFIX = 'lt_ai_';

export function getChildProgressKey(childId: string): string {
  return `${PROGRESSION_PREFIX}${childId}`;
}

export function getChildStreakKey(childId: string): string {
  return `${STREAK_PREFIX}${childId}`;
}

export function getChildRewardsKey(childId: string): string {
  return `${REWARDS_PREFIX}${childId}`;
}

export function getChildAiKey(childId: string): string {
  return `${AI_PREFIX}${childId}`;
}

export function isProgressSeparatePerChild(childIds: string[]): boolean {
  const keys = childIds.map(getChildProgressKey);
  return new Set(keys).size === childIds.length;
}

export function loadChildProgress(childId: string): object | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(getChildProgressKey(childId));
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

export function loadChildStreak(childId: string): object | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(getChildStreakKey(childId));
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

export function loadChildRewards(childId: string): object | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(getChildRewardsKey(childId));
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}
