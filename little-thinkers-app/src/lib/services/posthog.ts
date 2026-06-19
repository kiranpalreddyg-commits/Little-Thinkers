import type { GameType, Difficulty } from '@/lib/types/content'
import type { ExperimentGroup } from '@/lib/types/gameContent'

// Server-side PostHog event capture via HTTP API
// Client-side capture uses the NEXT_PUBLIC_POSTHOG_* vars already in .env.local
const POSTHOG_HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST ?? 'https://us.i.posthog.com'
const POSTHOG_TOKEN = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN ?? ''

interface EventProperties {
  [key: string]: string | number | boolean | null | undefined
}

async function capture(
  distinctId: string,
  event: string,
  properties: EventProperties
): Promise<void> {
  if (!POSTHOG_TOKEN) return  // no-op in environments without PostHog configured

  try {
    await fetch(`${POSTHOG_HOST}/capture/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        api_key: POSTHOG_TOKEN,
        distinct_id: distinctId,
        event,
        properties: {
          ...properties,
          $lib: 'little-thinkers-server',
        },
        timestamp: new Date().toISOString(),
      }),
    })
  } catch {
    // PostHog errors must never break the game flow
  }
}

// ── The 5 instrumented events ──────────────────────────────────────────────

export function trackGameServed(
  childId: string,
  params: {
    gameType: GameType
    source: 'static' | 'ai_generated' | 'ai_enhanced' | 'cache'
    experimentGroup: ExperimentGroup
    difficulty: Difficulty
  }
): void {
  void capture(childId, 'game_served', params)
}

export function trackGameCompleted(
  childId: string,
  params: {
    gameType: GameType
    difficulty: Difficulty
    correct: boolean
    experimentGroup: ExperimentGroup
    hintsUsed: number
  }
): void {
  void capture(childId, 'game_completed', params)
}

export function trackDifficultyPromoted(
  childId: string,
  params: {
    gameType: GameType
    fromLevel: Difficulty
    toLevel: Difficulty
    experimentGroup: ExperimentGroup
  }
): void {
  void capture(childId, 'difficulty_promoted', params)
}

export function trackPlateauDetected(
  childId: string,
  params: {
    gameType: GameType
    daysSinceLastPromotion: number
  }
): void {
  void capture(childId, 'plateau_detected', { childId, ...params })
}

export function trackBridgeGameTriggered(
  childId: string,
  params: {
    gameType: GameType
    wrongAnswerCount: number
  }
): void {
  void capture(childId, 'bridge_game_triggered', params)
}
