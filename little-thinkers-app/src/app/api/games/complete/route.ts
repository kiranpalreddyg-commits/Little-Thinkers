import { NextRequest, NextResponse } from 'next/server'
import { recordAnswer } from '@/lib/services/spacedRepetition'
import { recordDifficultyPromotion } from '@/lib/services/plateauDetection'
import { getExperimentGroup } from '@/lib/services/experiments'
import {
  trackGameCompleted,
  trackDifficultyPromoted,
} from '@/lib/services/posthog'
import type { GameType, Difficulty } from '@/lib/types/content'

interface CompleteRequest {
  childId?: string
  gameId: string
  gameType: GameType
  difficulty: Difficulty
  correct: boolean
  hintsUsed?: number
  promoted?: boolean
  promotedTo?: Difficulty
}

export async function POST(req: NextRequest) {
  const body = (await req.json()) as Partial<CompleteRequest>
  const { gameId, gameType, difficulty, correct } = body
  const childId = body.childId ?? 'anon'
  const hintsUsed = body.hintsUsed ?? 0

  if (!gameId || !gameType || !difficulty || correct === undefined) {
    return NextResponse.json(
      { error: 'gameId, gameType, difficulty, and correct are required' },
      { status: 400 }
    )
  }

  const assignment = getExperimentGroup(childId)

  // Update spaced repetition schedule (only for static games with stable IDs)
  let scheduleEntry = null
  if (!gameId.startsWith('ai-') && !gameId.startsWith('bridge-ai-')) {
    scheduleEntry = recordAnswer({
      childId,
      gameId,
      gameType,
      difficulty,
      result: correct ? 'correct' : 'incorrect',
    })
  }

  trackGameCompleted(childId, {
    gameType,
    difficulty,
    correct,
    experimentGroup: assignment.group,
    hintsUsed,
  })

  // Caller signals a difficulty promotion (e.g. after N consecutive correct answers)
  if (body.promoted && body.promotedTo) {
    recordDifficultyPromotion(childId, gameType)
    trackDifficultyPromoted(childId, {
      gameType,
      fromLevel: difficulty,
      toLevel: body.promotedTo,
      experimentGroup: assignment.group,
    })
  }

  return NextResponse.json({
    ok: true,
    scheduleEntry,
    experimentGroup: assignment.group,
  })
}
