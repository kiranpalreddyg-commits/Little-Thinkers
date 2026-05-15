import { GameType, Difficulty } from '@/lib/types/content';

export interface GameSession {
  gameType: GameType;
  difficulty: Difficulty;
  startedAt: string;      // ISO timestamp
  pausedAt?: string;      // ISO timestamp, set when paused
  progress: number;       // 0–100
  isPaused: boolean;
}
