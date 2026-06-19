import type { GameType } from '@/lib/types/content'
import { getExperimentGroup } from '@/lib/services/experiments'

const PLATEAU_THRESHOLD_DAYS = 14

export interface DifficultyPromotion {
  childId: string
  gameType: GameType
  promotedAt: string
}

// In-memory store for last promotion timestamps — replace with DB in production
const lastPromotionStore = new Map<string, DifficultyPromotion>()

function promotionKey(childId: string, gameType: GameType) {
  return `${childId}::${gameType}`
}

/** Call this whenever a child is promoted to a harder difficulty level. */
export function recordDifficultyPromotion(
  childId: string,
  gameType: GameType
): void {
  lastPromotionStore.set(promotionKey(childId, gameType), {
    childId,
    gameType,
    promotedAt: new Date().toISOString(),
  })
}

/** Returns days since last promotion, or Infinity if never promoted. */
export function daysSinceLastPromotion(
  childId: string,
  gameType: GameType
): number {
  const record = lastPromotionStore.get(promotionKey(childId, gameType))
  if (!record) return Infinity
  const ms = Date.now() - new Date(record.promotedAt).getTime()
  return Math.floor(ms / (1000 * 60 * 60 * 24))
}

export interface PlateauCheckResult {
  childId: string
  gameType: GameType
  daysSincePromotion: number
  isPlateaued: boolean
  overrideApplied: boolean
}

/**
 * Check one child+gameType combination.
 * If plateaued, updates their experiment assignment to treatment with plateau_override: true.
 */
export function checkPlateau(
  childId: string,
  gameType: GameType
): PlateauCheckResult {
  const days = daysSinceLastPromotion(childId, gameType)
  const isPlateaued = days >= PLATEAU_THRESHOLD_DAYS

  let overrideApplied = false
  if (isPlateaued) {
    // Pass plateauDays so getExperimentGroup forces treatment override
    const assignment = getExperimentGroup(childId, days)
    overrideApplied = assignment.plateauOverride
  }

  return { childId, gameType, daysSincePromotion: days, isPlateaued, overrideApplied }
}

/**
 * Nightly job entry point — checks all tracked children for all game types.
 * In production, replace the child list source with a DB query.
 */
export function runNightlyPlateauDetection(
  childIds: string[],
  gameTypes: GameType[]
): PlateauCheckResult[] {
  const results: PlateauCheckResult[] = []
  for (const childId of childIds) {
    for (const gameType of gameTypes) {
      const result = checkPlateau(childId, gameType)
      if (result.isPlateaued) results.push(result)
    }
  }
  return results
}
