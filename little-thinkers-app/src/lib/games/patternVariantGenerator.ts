import type { GameRecord, GameContent } from '@/lib/types/gameContent'

// Symbol pools for substitution — keep sets visually distinct
const SYMBOL_POOLS = [
  ['🔴', '🔵', '🟡', '🟢', '🟠', '🟣'],
  ['⭐', '🔶', '🔷', '🔸', '🔹', '💠'],
  ['🐱', '🐶', '🐦', '🐟', '🐰', '🦊'],
  ['🍎', '🍌', '🍇', '🍊', '🍓', '🍋'],
  ['A', 'B', 'C', 'D', 'E', 'F'],
]

const NUMBER_OFFSETS = [1, 2, 3, 5, 7, 11]  // prime-ish to avoid collisions

/**
 * Produces a lightweight client-side variant of a seed Pattern Builder game
 * by substituting symbols with a different set from the same pool category.
 *
 * Used as the synchronous fallback when QWEN is unavailable or times out.
 * Returns null if the seed content cannot be safely transformed.
 */
export function buildSymbolVariant(seed: GameRecord): GameContent | null {
  const q = seed.content.question
  const correct = seed.content.correct
  const options = seed.content.options

  // Detect which symbol pool the seed uses
  const poolIndex = SYMBOL_POOLS.findIndex((pool) =>
    pool.some((sym) => q.includes(sym))
  )
  if (poolIndex === -1) return null  // numeric or text pattern — skip

  const currentPool = SYMBOL_POOLS[poolIndex]
  const nextPool = SYMBOL_POOLS[(poolIndex + 1) % SYMBOL_POOLS.length]

  // Build substitution map: currentPool[i] → nextPool[i]
  const subMap = new Map<string, string>()
  currentPool.forEach((sym, i) => subMap.set(sym, nextPool[i]))

  const substituteAll = (text: string) =>
    text.replace(
      new RegExp(currentPool.map(escapeRegExp).join('|'), 'g'),
      (m) => subMap.get(m) ?? m
    )

  const newQuestion = substituteAll(q)
  const newCorrect = substituteAll(correct)
  const newOptions = options.map(substituteAll)

  // Ensure correct is still in options after substitution
  if (!newOptions.includes(newCorrect)) return null

  return {
    question: newQuestion,
    options: newOptions,
    correct: newCorrect,
    narrativeWrapper: seed.content.narrativeWrapper,
  }
}

/**
 * Builds a numeric offset variant of a seed: shifts all numbers by a fixed offset.
 * E.g. "2  4  6  8  ___" with offset 1 → "3  5  7  9  ___"
 */
export function buildNumericVariant(seed: GameRecord): GameContent | null {
  const q = seed.content.question
  const numbers = q.match(/\d+/g)
  if (!numbers || numbers.length < 3) return null

  const offset = NUMBER_OFFSETS[Math.floor(Math.random() * NUMBER_OFFSETS.length)]
  const shiftNum = (text: string) =>
    text.replace(/\d+/g, (n) => String(parseInt(n, 10) + offset))

  const newQuestion = shiftNum(q)
  const newCorrect = shiftNum(seed.content.correct)
  const newOptions = seed.content.options.map(shiftNum)

  if (!newOptions.includes(newCorrect)) return null

  return {
    question: newQuestion,
    options: newOptions,
    correct: newCorrect,
    narrativeWrapper: seed.content.narrativeWrapper,
  }
}

/**
 * Top-level selector: tries symbol substitution first, then numeric offset.
 * Returns the original seed content if neither succeeds, so the caller always
 * gets a usable game even without QWEN.
 */
export function buildLocalVariant(seed: GameRecord): GameContent {
  return buildSymbolVariant(seed) ?? buildNumericVariant(seed) ?? seed.content
}

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}
