export type GameType =
  | 'word-pop'
  | 'connection-quest'
  | 'memory-flip'
  | 'pattern-builder'
  | 'grid-logic'

export type CognitiveSkill =
  | 'vocabulary'
  | 'logic'
  | 'memory'
  | 'pattern-recognition'
  | 'curiosity'
  | 'social-emotional'

export type BloomsLevel =
  | 'remember'
  | 'understand'
  | 'apply'
  | 'analyze'
  | 'evaluate'
  | 'create'

export type Difficulty = 'easy' | 'medium' | 'hard'

export interface Game {
  type: GameType
  name: string
  description: string
  themedArea: string
  cognitiveSkill: CognitiveSkill
  bloomsLevel: BloomsLevel
  difficulties: Difficulty[]
}

export interface DailyPuzzle {
  id: string
  type: string
  difficulty: Difficulty
  hint?: string
  createdAt: string
}

export interface Story {
  id: string
  title: string
  cognitiveSkills: CognitiveSkill[]
  ageRange: { min: number; max: number }
  theme: string
  readingLevel: string
}

export interface ScienceTopic {
  id: string
  question: string
  cognitiveSkills: CognitiveSkill[]
  ageRange: { min: number; max: number }
}

export interface ContentFilter {
  topic: string
  ageMin: number
  ageMax: number
}
