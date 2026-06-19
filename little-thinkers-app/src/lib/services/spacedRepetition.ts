import type { GameType, Difficulty } from '@/lib/types/content'

// Correct-answer interval ladder (days): first → second → steady-state
const CORRECT_INTERVALS = [3, 7, 14] as const

// Incorrect answer always reschedules to +1 day
const INCORRECT_INTERVAL = 1

export type AnswerResult = 'correct' | 'incorrect'

export interface ScheduleEntry {
  childId: string
  gameId: string
  gameType: GameType
  difficulty: Difficulty
  /** Number of consecutive correct answers (determines which rung of the ladder) */
  correctStreak: number
  status: 'unseen' | 'due' | 'scheduled' | 'mastered'
  nextDue: string  // ISO date string (date only, no time)
  lastAnsweredAt: string | null
  createdAt: string
}

export interface AnswerPayload {
  childId: string
  gameId: string
  gameType: GameType
  difficulty: Difficulty
  result: AnswerResult
}

// In-memory store — replace with Supabase/DB in production
const scheduleStore = new Map<string, ScheduleEntry>()

function scheduleKey(childId: string, gameId: string) {
  return `${childId}::${gameId}`
}

function addDays(days: number): string {
  const d = new Date()
  d.setDate(d.getDate() + days)
  return d.toISOString().slice(0, 10)
}

function todayStr(): string {
  return new Date().toISOString().slice(0, 10)
}

/** Record the outcome of one game answer and update the schedule. */
export function recordAnswer(payload: AnswerPayload): ScheduleEntry {
  const key = scheduleKey(payload.childId, payload.gameId)
  const existing = scheduleStore.get(key)

  if (payload.result === 'correct') {
    const streak = (existing?.correctStreak ?? 0) + 1
    const intervalIdx = Math.min(streak - 1, CORRECT_INTERVALS.length - 1)
    const interval = CORRECT_INTERVALS[intervalIdx]
    const status: ScheduleEntry['status'] = streak >= CORRECT_INTERVALS.length ? 'mastered' : 'scheduled'

    const entry: ScheduleEntry = {
      childId: payload.childId,
      gameId: payload.gameId,
      gameType: payload.gameType,
      difficulty: payload.difficulty,
      correctStreak: streak,
      status,
      nextDue: addDays(interval),
      lastAnsweredAt: new Date().toISOString(),
      createdAt: existing?.createdAt ?? new Date().toISOString(),
    }
    scheduleStore.set(key, entry)
    return entry
  }

  // Incorrect: reset streak, reschedule +1 day
  const entry: ScheduleEntry = {
    childId: payload.childId,
    gameId: payload.gameId,
    gameType: payload.gameType,
    difficulty: payload.difficulty,
    correctStreak: 0,
    status: 'due',
    nextDue: addDays(INCORRECT_INTERVAL),
    lastAnsweredAt: new Date().toISOString(),
    createdAt: existing?.createdAt ?? new Date().toISOString(),
  }
  scheduleStore.set(key, entry)
  return entry
}

/** Return game IDs due today for a child, ordered by most overdue first. */
export function getDueGameIds(
  childId: string,
  gameType?: GameType,
  limit = 10
): string[] {
  const today = todayStr()
  const due: Array<{ gameId: string; nextDue: string }> = []

  for (const entry of scheduleStore.values()) {
    if (entry.childId !== childId) continue
    if (gameType && entry.gameType !== gameType) continue
    if (entry.status === 'mastered') continue
    if (entry.nextDue <= today) due.push({ gameId: entry.gameId, nextDue: entry.nextDue })
  }

  return due
    .sort((a, b) => a.nextDue.localeCompare(b.nextDue))
    .slice(0, limit)
    .map((e) => e.gameId)
}

/** Return the full schedule for a child (for debugging / parent dashboard). */
export function getSchedule(childId: string): ScheduleEntry[] {
  return [...scheduleStore.values()].filter((e) => e.childId === childId)
}

/** Seed an entry for a game a child has never seen. */
export function markUnseen(
  childId: string,
  gameId: string,
  gameType: GameType,
  difficulty: Difficulty
): void {
  const key = scheduleKey(childId, gameId)
  if (!scheduleStore.has(key)) {
    scheduleStore.set(key, {
      childId, gameId, gameType, difficulty,
      correctStreak: 0,
      status: 'unseen',
      nextDue: todayStr(),
      lastAnsweredAt: null,
      createdAt: new Date().toISOString(),
    })
  }
}
