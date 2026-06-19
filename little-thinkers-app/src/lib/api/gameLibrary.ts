import type { GameRecord } from '@/lib/types/gameContent'
import { WORD_POP_GAMES } from './gameLibrary/wordPop'
import { CONNECTION_QUEST_GAMES } from './gameLibrary/connectionQuest'
import { MEMORY_FLIP_GAMES } from './gameLibrary/memoryFlip'
import { PATTERN_BUILDER_SEEDS } from './gameLibrary/patternBuilder'
import { GRID_LOGIC_SEEDS } from './gameLibrary/gridLogic'

export const GAME_LIBRARY: GameRecord[] = [
  ...WORD_POP_GAMES,
  ...CONNECTION_QUEST_GAMES,
  ...MEMORY_FLIP_GAMES,
  ...PATTERN_BUILDER_SEEDS,
  ...GRID_LOGIC_SEEDS,
]
