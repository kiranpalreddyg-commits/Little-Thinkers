import type { ExperimentGroup, ExperimentAssignment } from '@/lib/types/gameContent'

const EXPERIMENT_ID = 'content-origin-v1'

// Stable hash-based group assignment: same childId always → same group
function hashAssign(childId: string, experimentId: string): ExperimentGroup {
  let hash = 0
  const str = childId + experimentId
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) >>> 0
  }
  return (hash % 100) < 50 ? 'control' : 'treatment'
}

// In-memory store for mock/client-side use; replace with DB call when backend is live
const assignmentCache = new Map<string, ExperimentAssignment>()

export function getExperimentGroup(
  childId: string,
  plateauDays = 0
): ExperimentAssignment {
  const cacheKey = `${childId}:${EXPERIMENT_ID}`
  const existing = assignmentCache.get(cacheKey)
  if (existing) return existing

  const group = hashAssign(childId, EXPERIMENT_ID)
  const plateauOverride = plateauDays >= 14

  const assignment: ExperimentAssignment = {
    childId,
    experimentId: EXPERIMENT_ID,
    group: plateauOverride ? 'treatment' : group,
    assignedAt: new Date().toISOString(),
    plateauOverride,
  }

  assignmentCache.set(cacheKey, assignment)
  return assignment
}

// AI-first game types — always use QWEN in treatment group
export const AI_FIRST_TYPES = new Set(['pattern-builder', 'grid-logic'])

export function shouldUseAI(gameType: string, group: ExperimentGroup): boolean {
  return group === 'treatment' && AI_FIRST_TYPES.has(gameType)
}
