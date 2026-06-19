import type { GameType, Difficulty } from './content'

export type GameSource = 'static' | 'ai_generated' | 'ai_enhanced'

export type ExperimentGroup = 'control' | 'treatment'

export interface CognitiveLoad {
  vocabulary: number  // 0–5
  memory: number
  reasoning: number
  speed: number
}

export interface GameContent {
  question: string
  options: string[]
  correct: string
  narrativeWrapper?: string
}

export interface GameRecord {
  id: string
  gameType: GameType
  difficulty: Difficulty
  cognitiveLoad: CognitiveLoad
  source: GameSource
  content: GameContent
  hint1: string
  hint2: string
  seed?: string        // Memory Flip: share code for sibling play
  expiresAt?: string   // ISO — null for permanent static games
  createdAt: string
}

export interface ChildGameScheduleEntry {
  childId: string
  gameId: string
  status: 'unseen' | 'in-progress' | 'mastered' | 'scheduled-review'
  nextDue: string    // ISO date
  attempts: number
  lastResult?: 'correct' | 'incorrect'
}

export interface ExperimentAssignment {
  childId: string
  experimentId: string
  group: ExperimentGroup
  assignedAt: string
  plateauOverride: boolean
}

export interface GameNextResponse {
  games: ServedGame[]
}

export interface ServedGame {
  id: string
  gameType: GameType
  content: GameContent
  hint1: string
  hint2: string
  seed?: string
  progressWeight: number
}

export interface BridgeGameRequest {
  childId: string
  gameType: GameType
  questionContext: string
  wrongAnswerCount: number
}
