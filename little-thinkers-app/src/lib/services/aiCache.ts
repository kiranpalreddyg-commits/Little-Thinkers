import type { GameContent } from '@/lib/types/gameContent'
import type { GameType, Difficulty } from '@/lib/types/content'

interface CacheEntry {
  content: GameContent
  expiresAt: number
}

// In-memory LRU cache — replace with Redis in production
const cache = new Map<string, CacheEntry>()
const MAX_ENTRIES = 500
const DEFAULT_TTL_MS = 60 * 60 * 1000  // 1 hour

export function buildCacheKey(
  gameType: GameType,
  difficulty: Difficulty,
  ageRange: string
): string {
  return `${gameType}:${difficulty}:${ageRange}`
}

export function getCachedGame(key: string): GameContent | null {
  const entry = cache.get(key)
  if (!entry) return null
  if (Date.now() > entry.expiresAt) {
    cache.delete(key)
    return null
  }
  // LRU: re-insert to move to end
  cache.delete(key)
  cache.set(key, entry)
  return entry.content
}

export function setCachedGame(
  key: string,
  content: GameContent,
  ttlMs = DEFAULT_TTL_MS
): void {
  if (cache.size >= MAX_ENTRIES) {
    // Evict oldest (first) entry
    const firstKey = cache.keys().next().value
    if (firstKey !== undefined) cache.delete(firstKey)
  }
  cache.set(key, { content, expiresAt: Date.now() + ttlMs })
}

export function getCacheSize(): number {
  return cache.size
}

export function clearCache(): void {
  cache.clear()
}

export function ageRangeFromDifficulty(difficulty: Difficulty): string {
  if (difficulty === 'easy') return '7-9'
  if (difficulty === 'medium') return '10-11'
  return '12-15'
}
