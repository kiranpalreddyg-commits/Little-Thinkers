import { NextRequest, NextResponse } from 'next/server'
import { getExperimentGroup, shouldUseAI } from '@/lib/services/experiments'
import { GAME_LIBRARY } from '@/lib/api/gameLibrary'
import {
  buildCacheKey,
  getCachedGame,
  setCachedGame,
  ageRangeFromDifficulty,
} from '@/lib/services/aiCache'
import { logAIGeneration } from '@/lib/services/aiGenerationLog'
import { getDueGameIds } from '@/lib/services/spacedRepetition'
import { trackGameServed } from '@/lib/services/posthog'
import {
  generateGridLogicPuzzle,
  generatePatternVariant,
  generateNarrativeWrapper,
  generateDistractors,
} from '@/lib/ai/gemini'
import { validateGridLogicPuzzle, validatePatternContent } from '@/lib/games/gridLogicValidator'
import { buildLocalVariant } from '@/lib/games/patternVariantGenerator'
import type { GameType, Difficulty } from '@/lib/types/content'
import type { GameNextResponse, ServedGame } from '@/lib/types/gameContent'

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const childId = searchParams.get('childId') ?? 'anon'
  const gameType = searchParams.get('gameType') as GameType | null
  const count = Math.min(parseInt(searchParams.get('count') ?? '5', 10), 10)
  const difficulty = (searchParams.get('difficulty') as Difficulty | null) ?? 'medium'

  if (!gameType) {
    return NextResponse.json({ error: 'gameType is required' }, { status: 400 })
  }

  const assignment = getExperimentGroup(childId)
  const useAI = shouldUseAI(gameType, assignment.group)

  // Spaced repetition: surface due reviews before unseen games
  const dueIds = getDueGameIds(childId, gameType, count)
  const dueGames = dueIds.length > 0
    ? pickSpecificGames(dueIds, gameType)
    : []
  const remaining = Math.max(0, count - dueGames.length)

  let games: ServedGame[]

  if (useAI) {
    const aiGames = await buildAIGames(gameType, difficulty, childId, remaining)
    games = [...dueGames, ...aiGames]
  } else {
    const freshGames = remaining > 0 ? pickFromLibrary(gameType, difficulty, remaining) : []
    games = [...dueGames, ...freshGames]
    // Treatment group + static-first type: enhance with Gemini narrative & distractors
    if (assignment.group === 'treatment' && games.length > 0) {
      games = await enhanceWithQwen(games, gameType)
    }
  }

  // Fire game_served for each game in the response
  for (const g of games) {
    const source = g.id.startsWith('ai-') ? 'ai_generated' : 'static'
    trackGameServed(childId, { gameType, source, experimentGroup: assignment.group, difficulty })
  }

  const body: GameNextResponse = { games }
  const res = NextResponse.json(body)
  res.headers.set('x-experiment-group', assignment.group)
  return res
}

// ── AI-first path (pattern-builder / grid-logic in treatment group) ──────────

async function buildAIGames(
  gameType: GameType,
  difficulty: Difficulty,
  childId: string,
  count: number
): Promise<ServedGame[]> {
  const ageRange = ageRangeFromDifficulty(difficulty)
  const games: ServedGame[] = []

  for (let i = 0; i < count; i++) {
    const cacheKey = buildCacheKey(gameType, difficulty, ageRange)
    const cached = getCachedGame(cacheKey)

    if (cached) {
      logAIGeneration({
        gameType, difficulty, childId,
        latencyMs: 0, tokenCount: 0, cacheHit: true,
        fallbackUsed: false, source: 'cache',
      })
      games.push(toServedGame(`ai-${gameType}-${Date.now()}-${i}`, gameType, cached))
      continue
    }

    const result = gameType === 'grid-logic'
      ? await generateGridLogicPuzzle(difficulty, ageRange)
      : await generatePatternVariantFromSeed(gameType, difficulty)

    logAIGeneration({
      gameType, difficulty, childId,
      latencyMs: result.latencyMs,
      tokenCount: result.tokenCount,
      cacheHit: false,
      fallbackUsed: result.fallbackUsed,
      source: result.fallbackUsed ? 'static_fallback' : 'gemini',
      error: result.error,
    })

    if (result.content) {
      const isValid = gameType === 'grid-logic'
        ? validateGridLogicPuzzle(result.content).valid
        : validatePatternContent(result.content).valid

      if (isValid) {
        setCachedGame(cacheKey, result.content)
        games.push(toServedGame(`ai-${gameType}-${Date.now()}-${i}`, gameType, result.content))
        continue
      }
    }

    // Fallback: use a static seed (or local variant for pattern-builder)
    const fallback = pickFromLibrary(gameType, difficulty, 1)[0]
    if (fallback) games.push(fallback)
  }

  return games
}

async function generatePatternVariantFromSeed(
  gameType: GameType,
  difficulty: Difficulty
): Promise<ReturnType<typeof generatePatternVariant>> {
  const seed = GAME_LIBRARY.find(
    (g) => g.gameType === gameType && g.difficulty === difficulty
  )
  if (!seed) {
    return { content: null, latencyMs: 0, tokenCount: 0, fallbackUsed: true, error: 'No seed found' }
  }

  const result = await generatePatternVariant(
    seed.content.question,
    seed.content.correct,
    difficulty
  )

  // If QWEN failed, use a local symbol/numeric substitution
  if (result.fallbackUsed || !result.content) {
    const localVariant = buildLocalVariant(seed)
    return { content: localVariant, latencyMs: result.latencyMs, tokenCount: 0, fallbackUsed: true }
  }
  return result
}

// ── Enhancement path (static-first types in treatment group) ─────────────────

async function enhanceWithQwen(
  games: ServedGame[],
  gameType: GameType
): Promise<ServedGame[]> {
  return Promise.all(
    games.map(async (game) => {
      const [narrative, distractors] = await Promise.all([
        generateNarrativeWrapper(game.content.question, game.content.correct),
        generateDistractors(gameType, game.content.question, game.content.correct),
      ])

      return {
        ...game,
        content: {
          ...game.content,
          ...(narrative ? { narrativeWrapper: narrative } : {}),
          ...(distractors ? { options: [game.content.correct, ...distractors] } : {}),
        },
      }
    })
  )
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function pickFromLibrary(
  gameType: GameType,
  difficulty: Difficulty,
  count: number
): ServedGame[] {
  const pool = GAME_LIBRARY.filter(
    (g) => g.gameType === gameType && g.difficulty === difficulty
  )
  const shuffled = [...pool].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count).map(({ id, gameType, content, hint1, hint2, seed }) => ({
    id,
    gameType,
    content,
    hint1,
    hint2,
    seed,
    progressWeight: 1,
  }))
}

function pickSpecificGames(gameIds: string[], gameType: GameType): ServedGame[] {
  return gameIds.flatMap((id) => {
    const record = GAME_LIBRARY.find((g) => g.id === id && g.gameType === gameType)
    if (!record) return []
    return [{ id: record.id, gameType: record.gameType, content: record.content,
      hint1: record.hint1, hint2: record.hint2, seed: record.seed, progressWeight: 1 }]
  })
}

function toServedGame(
  id: string,
  gameType: GameType,
  content: import('@/lib/types/gameContent').GameContent
): ServedGame {
  return { id, gameType, content, hint1: '', hint2: '', progressWeight: 1 }
}
