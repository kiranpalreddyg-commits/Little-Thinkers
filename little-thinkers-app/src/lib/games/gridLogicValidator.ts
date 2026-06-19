import type { GameContent } from '@/lib/types/gameContent'

export interface ValidationResult {
  valid: boolean
  reason?: string
}

/**
 * Validates that a QWEN-generated Grid Logic puzzle is well-formed.
 * Structural rules (fast, synchronous):
 *   - Required fields present and non-empty
 *   - correct answer exists in options array
 *   - exactly 4 options, all distinct
 *   - no option is empty or whitespace-only
 *
 * Uniqueness rule: QWEN is prompted to produce exactly one solution.
 * For natural-language constraint puzzles we trust the model and verify
 * structural integrity here; a deeper CSP solver can be added in Sprint 9.5.
 */
export function validateGridLogicPuzzle(content: GameContent): ValidationResult {
  if (!content.question?.trim()) {
    return { valid: false, reason: 'Missing question' }
  }
  if (!content.correct?.trim()) {
    return { valid: false, reason: 'Missing correct answer' }
  }
  if (!Array.isArray(content.options) || content.options.length !== 4) {
    return { valid: false, reason: 'Options must be an array of exactly 4 items' }
  }

  const trimmed = content.options.map((o) => o.trim())
  if (trimmed.some((o) => o === '')) {
    return { valid: false, reason: 'Empty option detected' }
  }
  if (new Set(trimmed).size !== 4) {
    return { valid: false, reason: 'Duplicate options detected' }
  }
  if (!trimmed.includes(content.correct.trim())) {
    return { valid: false, reason: 'Correct answer not found in options' }
  }

  // Minimum question complexity check — a real deductive puzzle needs at least
  // two named entities and one constraint word.
  const constraintWords = ['not', 'before', 'after', 'between', 'next to', 'opposite',
    'heavier', 'lighter', 'older', 'younger', 'higher', 'lower']
  const hasConstraint = constraintWords.some((w) =>
    content.question.toLowerCase().includes(w)
  )
  if (!hasConstraint) {
    return { valid: false, reason: 'Question does not appear to contain logical constraints' }
  }

  return { valid: true }
}

/**
 * Validates a Pattern Builder game content.
 * Checks structural integrity and that the sequence contains a blank marker.
 */
export function validatePatternContent(content: GameContent): ValidationResult {
  if (!content.question?.trim()) return { valid: false, reason: 'Missing question' }
  if (!content.correct?.trim()) return { valid: false, reason: 'Missing correct answer' }
  if (!Array.isArray(content.options) || content.options.length !== 4) {
    return { valid: false, reason: 'Options must be an array of exactly 4 items' }
  }

  const trimmed = content.options.map((o) => o.trim())
  if (new Set(trimmed).size !== 4) {
    return { valid: false, reason: 'Duplicate options detected' }
  }
  if (!trimmed.includes(content.correct.trim())) {
    return { valid: false, reason: 'Correct answer not found in options' }
  }

  const hasBlank = content.question.includes('___') || content.question.includes('?')
  if (!hasBlank) {
    return { valid: false, reason: 'Pattern question must contain a blank (___) or ?' }
  }

  return { valid: true }
}
