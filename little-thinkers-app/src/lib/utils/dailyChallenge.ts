const DAILY_GAMES = ['word-pop', 'connection-quest', 'memory-flip', 'pattern-builder', 'grid-logic'] as const;
export type DailyGameType = typeof DAILY_GAMES[number];

export function getDailyGame(date: Date = new Date()): DailyGameType {
  const start = new Date(date.getFullYear(), 0, 1);
  const dayOfYear = Math.floor((date.getTime() - start.getTime()) / 86400000);
  return DAILY_GAMES[dayOfYear % DAILY_GAMES.length];
}
