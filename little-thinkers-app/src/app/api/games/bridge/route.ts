import { NextRequest, NextResponse } from 'next/server'
import { GAME_LIBRARY } from '@/lib/api/gameLibrary'
import { getExperimentGroup } from '@/lib/services/experiments'
import { logAIGeneration } from '@/lib/services/aiGenerationLog'
import { generateBridgeGame } from '@/lib/ai/gemini'
import { ageRangeFromDifficulty } from '@/lib/services/aiCache'
import { trackBridgeGameTriggered } from '@/lib/services/posthog'
import type { Difficulty } from '@/lib/types/content'
import type { BridgeGameRequest, ServedGame } from '@/lib/types/gameContent'

const DIFFICULTY_STEP_DOWN: Record<Difficulty, Difficulty> = {
  hard: 'medium',
  medium: 'easy',
  easy: 'easy',
}

export async function POST(req: NextRequest) {
  const body = (await req.json()) as Partial<BridgeGameRequest>
  const { gameType, wrongAnswerCount } = body
  const childId = body.childId ?? 'anon'

  if (!gameType) {
    return NextResponse.json({ error: 'gameType is required' }, { status: 400 })
  }
  if ((wrongAnswerCount ?? 0) < 3) {
    return NextResponse.json({ error: 'wrongAnswerCount must be >= 3' }, { status: 400 })
  }

  const currentDifficulty = (body as { difficulty?: Difficulty }).difficulty ?? 'medium'
  const bridgeDifficulty = DIFFICULTY_STEP_DOWN[currentDifficulty]
  const assignment = getExperimentGroup(childId)

  trackBridgeGameTriggered(childId, { gameType, wrongAnswerCount: wrongAnswerCount ?? 3 })

  // Treatment group: try QWEN for personalised bridge game
  if (assignment.group === 'treatment') {
    const ageRange = ageRangeFromDifficulty(bridgeDifficulty)
    const result = await generateBridgeGame(gameType, bridgeDifficulty, ageRange)

    logAIGeneration({
      gameType, difficulty: bridgeDifficulty, childId,
      latencyMs: result.latencyMs,
      tokenCount: result.tokenCount,
      cacheHit: false,
      fallbackUsed: result.fallbackUsed,
      source: result.fallbackUsed ? 'static_fallback' : 'gemini',
      error: result.error,
    })

    if (result.content) {
      const game: ServedGame = {
        id: `bridge-ai-${Date.now()}`,
        gameType,
        content: result.content,
        hint1: '',
        hint2: '',
        progressWeight: 0,  // ephemeral — does not count toward session progress
      }
      return NextResponse.json({ game, isBridge: true, bridgeDifficulty, source: 'ai_generated' })
    }
    // Fall through to static if QWEN failed
  }

  // Control group or QWEN fallback: serve a static game one tier down
  const pool = GAME_LIBRARY.filter(
    (g) => g.gameType === gameType && g.difficulty === bridgeDifficulty
  )
  const pick = pool[Math.floor(Math.random() * pool.length)]

  if (!pick) {
    return NextResponse.json({ error: 'No bridge game available' }, { status: 404 })
  }

  const game: ServedGame = {
    id: pick.id,
    gameType: pick.gameType,
    content: pick.content,
    hint1: pick.hint1,
    hint2: pick.hint2,
    seed: pick.seed,
    progressWeight: 0,
  }

  return NextResponse.json({ game, isBridge: true, bridgeDifficulty, source: 'static' })
}
