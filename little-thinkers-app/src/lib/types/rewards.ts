export const BRAIN_JAR_CAPACITY = 20

export type SparkSource = 'correct-answer' | 'game-completion' | 'milestone'

export type FeedbackType = 'correct' | 'incorrect'

export interface ThoughtSpark {
  id: string
  childId: string
  source: SparkSource
  amount: number
  earnedAt: string   // ISO timestamp
  gameType?: string
}

export interface BrainJar {
  childId: string
  totalSparks: number
  capacity: number      // sparks needed to fill one jar level (20)
  fillPercent: number   // (totalSparks % capacity) / capacity * 100
}

export interface AnswerFeedback {
  type: FeedbackType
  message: string
  sparksAwarded: number   // 0 for incorrect
}
