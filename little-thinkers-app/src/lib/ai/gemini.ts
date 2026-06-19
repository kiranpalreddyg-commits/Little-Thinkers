import type { GameContent } from '@/lib/types/gameContent'
import type { GameType, Difficulty } from '@/lib/types/content'

// Gemini OpenAI-compatible endpoint
const GEMINI_BASE_URL =
  process.env.GEMINI_BASE_URL ?? 'https://generativelanguage.googleapis.com/v1beta/openai'
const GEMINI_MODEL = process.env.GEMINI_MODEL ?? 'gemini-2.0-flash'
const AI_TIMEOUT_MS = 5_000
const AI_RETRY_COUNT = 2

export interface QwenCallResult {
  content: GameContent | null
  latencyMs: number
  tokenCount: number
  fallbackUsed: boolean
  error?: string
}

async function callGemini(
  prompt: string,
  timeoutMs = AI_TIMEOUT_MS
): Promise<{ text: string; tokenCount: number }> {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) throw new Error('GEMINI_API_KEY not configured')

  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)

  try {
    const res = await fetch(`${GEMINI_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: GEMINI_MODEL,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 512,
        response_format: { type: 'json_object' },
      }),
      signal: controller.signal,
    })

    if (!res.ok) {
      const body = await res.text()
      throw new Error(`Gemini ${res.status}: ${body.slice(0, 200)}`)
    }

    const json = await res.json()
    const text: string = json.choices?.[0]?.message?.content ?? ''
    const tokenCount: number = json.usage?.total_tokens ?? 0
    return { text, tokenCount }
  } finally {
    clearTimeout(timer)
  }
}

async function callWithRetry(
  prompt: string,
  timeoutMs = AI_TIMEOUT_MS
): Promise<{ text: string; tokenCount: number }> {
  let lastError: Error = new Error('Unknown error')
  for (let attempt = 0; attempt <= AI_RETRY_COUNT; attempt++) {
    try {
      return await callGemini(prompt, timeoutMs)
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err))
      if (lastError.name === 'AbortError') break  // hard timeout — don't retry
      if (attempt < AI_RETRY_COUNT) await sleep(200 * 2 ** attempt)
    }
  }
  throw lastError
}

// ── Public API ──────────────────────────────────────────────────────────────

export async function generateGridLogicPuzzle(
  difficulty: Difficulty,
  ageRange: string
): Promise<QwenCallResult> {
  const t0 = Date.now()
  const prompt = `You are a logic puzzle generator for children aged ${ageRange}.
Generate a unique deductive grid logic puzzle at ${difficulty} difficulty.
The puzzle MUST have exactly one valid solution derivable from the clues.

Return ONLY a JSON object:
{
  "question": "<full puzzle text including all clues as a single paragraph>",
  "options": ["<correct answer>", "<wrong1>", "<wrong2>", "<wrong3>"],
  "correct": "<correct answer>",
  "narrativeWrapper": "<one engaging sentence setting the scene>"
}`

  try {
    const { text, tokenCount } = await callWithRetry(prompt)
    const parsed = JSON.parse(text) as GameContent
    return { content: parsed, latencyMs: Date.now() - t0, tokenCount, fallbackUsed: false }
  } catch (err) {
    return { content: null, latencyMs: Date.now() - t0, tokenCount: 0, fallbackUsed: true, error: String(err) }
  }
}

export async function generatePatternVariant(
  seedQuestion: string,
  seedCorrect: string,
  difficulty: Difficulty
): Promise<QwenCallResult> {
  const t0 = Date.now()
  const prompt = `You are a pattern sequence generator for children.
Given this seed pattern, create a NEW variant using DIFFERENT symbols but the SAME underlying rule.

Seed: ${seedQuestion}
Seed answer: ${seedCorrect}
Difficulty: ${difficulty}

Return ONLY a JSON object:
{
  "question": "<new sequence ending with ___>",
  "options": ["<correct answer>", "<wrong1>", "<wrong2>", "<wrong3>"],
  "correct": "<correct answer>",
  "narrativeWrapper": "<one engaging sentence setting the scene>"
}`

  try {
    const { text, tokenCount } = await callWithRetry(prompt, 4_000)
    const parsed = JSON.parse(text) as GameContent
    return { content: parsed, latencyMs: Date.now() - t0, tokenCount, fallbackUsed: false }
  } catch (err) {
    return { content: null, latencyMs: Date.now() - t0, tokenCount: 0, fallbackUsed: true, error: String(err) }
  }
}

export async function generateNarrativeWrapper(
  question: string,
  correctAnswer: string
): Promise<string | null> {
  const prompt = `Create a one-sentence story wrapper (max 20 words) for this educational question.
The sentence should end naturally so the question makes sense in context.

Question: ${question}
Correct answer: ${correctAnswer}

Return ONLY a JSON object: {"narrativeWrapper": "<sentence>"}`

  try {
    const { text } = await callWithRetry(prompt, 2_000)
    const parsed = JSON.parse(text) as { narrativeWrapper: string }
    return parsed.narrativeWrapper ?? null
  } catch {
    return null
  }
}

export async function generateDistractors(
  gameType: GameType,
  question: string,
  correctAnswer: string,
  count = 3
): Promise<string[] | null> {
  const prompt = `Generate exactly ${count} plausible but WRONG answer options for this ${gameType} question.
The distractors should seem reasonable but be clearly incorrect.

Question: ${question}
Correct answer (DO NOT include this): ${correctAnswer}

Return ONLY a JSON object: {"distractors": ["<wrong1>", "<wrong2>", "<wrong3>"]}`

  try {
    const { text } = await callWithRetry(prompt, 2_000)
    const parsed = JSON.parse(text) as { distractors: string[] }
    return parsed.distractors?.slice(0, count) ?? null
  } catch {
    return null
  }
}

export async function generateBridgeGame(
  gameType: GameType,
  difficulty: Difficulty,
  ageRange: string
): Promise<QwenCallResult> {
  const t0 = Date.now()
  const prompt = `You are an educational game designer for children aged ${ageRange}.
Generate a SHORT bridging micro-game for ${gameType} at ${difficulty} difficulty.
This game helps a child who is struggling — keep it simple and encouraging.

Return ONLY a JSON object:
{
  "question": "<clear, simple question>",
  "options": ["<correct>", "<wrong1>", "<wrong2>", "<wrong3>"],
  "correct": "<correct>",
  "narrativeWrapper": "<one warm, encouraging sentence>"
}`

  try {
    const { text, tokenCount } = await callWithRetry(prompt, 2_000)
    const parsed = JSON.parse(text) as GameContent
    return { content: parsed, latencyMs: Date.now() - t0, tokenCount, fallbackUsed: false }
  } catch (err) {
    return { content: null, latencyMs: Date.now() - t0, tokenCount: 0, fallbackUsed: true, error: String(err) }
  }
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms))
}
