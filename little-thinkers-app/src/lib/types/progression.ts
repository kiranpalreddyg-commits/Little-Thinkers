export const GAME_TYPES = ['word-pop', 'connection-quest', 'memory-flip', 'pattern-builder', 'grid-logic'] as const;
export type GameTypeKey = typeof GAME_TYPES[number];

export type DifficultyLevel = 1 | 2 | 3 | 4 | 5;

export const BADGE_TYPES = ['first-correct', 'ten-correct', 'game-complete', 'five-day-streak', 'explorer'] as const;
export type BadgeType = typeof BADGE_TYPES[number];

export const BADGE_META: Record<BadgeType, { name: string; description: string }> = {
  'first-correct': { name: 'First Spark!', description: 'You got your first correct answer — brilliant start!' },
  'ten-correct': { name: 'Spark Collector', description: 'You answered 10 questions correctly — great thinking!' },
  'game-complete': { name: 'Game Master', description: 'You completed a full game — impressive focus!' },
  'five-day-streak': { name: 'Streak Keeper', description: 'You played 5 days in a row — amazing dedication!' },
  'explorer': { name: 'Explorer', description: 'You unlocked a new world area — adventure awaits!' },
};

export interface Badge {
  id: string;
  childId: string;
  badgeType: BadgeType;
  name: string;
  description: string;
  earnedAt: string; // ISO timestamp
}

export type WorldArea = 'word-woods' | 'math-mountains' | 'science-sea' | 'art-archipelago' | 'history-highlands';

export interface WorldMapArea {
  id: WorldArea;
  name: string;
  isUnlocked: boolean;
  sparkThreshold: number;
}

export const WORLD_AREAS: WorldMapArea[] = [
  { id: 'word-woods', name: 'Word Woods', isUnlocked: true, sparkThreshold: 0 },
  { id: 'math-mountains', name: 'Math Mountains', isUnlocked: false, sparkThreshold: 20 },
  { id: 'science-sea', name: 'Science Sea', isUnlocked: false, sparkThreshold: 50 },
  { id: 'art-archipelago', name: 'Art Archipelago', isUnlocked: false, sparkThreshold: 100 },
  { id: 'history-highlands', name: 'History Highlands', isUnlocked: false, sparkThreshold: 200 },
];

export interface MascotState {
  childId: string;
  level: number;
  experience: number;
  accessories: string[]; // stored, but derived from level at read-time in UI
}

export interface ThinkingStreak {
  childId: string;
  currentStreak: number;
  longestStreak: number;
  lastActivityDate: string | null;
  pausedUntil: string | null;
}

export type BadgeEventType = 'correct-answer' | 'game-complete' | 'streak-check';
export interface BadgeEvent {
  type: BadgeEventType;
  totalCorrect?: number;
  streakDays?: number;
}
