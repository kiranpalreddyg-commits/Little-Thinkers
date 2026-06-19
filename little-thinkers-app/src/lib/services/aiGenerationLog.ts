import type { GameType, Difficulty } from '@/lib/types/content'

export interface AIGenerationLogEntry {
  id: string
  gameType: GameType
  difficulty: Difficulty
  childId: string
  latencyMs: number
  tokenCount: number
  cacheHit: boolean
  fallbackUsed: boolean
  source: 'gemini' | 'static_fallback' | 'cache'
  error?: string
  createdAt: string
}

// In-memory log — replace with DB write (Supabase insert) in Sprint 9.4
const log: AIGenerationLogEntry[] = []
const MAX_LOG_SIZE = 10_000

export function logAIGeneration(entry: Omit<AIGenerationLogEntry, 'id' | 'createdAt'>): void {
  const record: AIGenerationLogEntry = {
    ...entry,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  }
  log.push(record)
  if (log.length > MAX_LOG_SIZE) log.shift()
}

export function getAIGenerationLog(limit = 100): AIGenerationLogEntry[] {
  return log.slice(-limit)
}

export function getAICacheHitRate(): number {
  if (log.length === 0) return 0
  const hits = log.filter((e) => e.cacheHit).length
  return hits / log.length
}

export function getAIFallbackRate(): number {
  if (log.length === 0) return 0
  const fallbacks = log.filter((e) => e.fallbackUsed).length
  return fallbacks / log.length
}

export function getAILatencyP95(): number {
  if (log.length === 0) return 0
  const sorted = [...log].map((e) => e.latencyMs).sort((a, b) => a - b)
  const idx = Math.floor(sorted.length * 0.95)
  return sorted[idx] ?? sorted[sorted.length - 1] ?? 0
}
