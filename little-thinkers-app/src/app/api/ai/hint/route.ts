import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { STATIC_HINTS } from '@/lib/ai/staticHints';
import { getPostHogClient } from '@/lib/posthog-server';

const TIMEOUT_MS = 2000;

function staticFallback(gameType: string, hintNumber: number): string {
  const hints = STATIC_HINTS[gameType] ?? STATIC_HINTS['word-pop'];
  return hints[Math.min(hintNumber - 1, hints.length - 1)];
}

export async function POST(request: NextRequest) {
  if (!request.cookies.has('lt_auth')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body: {
    childId?: string;
    gameType?: string;
    questionContext?: string;
    hintNumber?: number;
    ageRange?: string;
  };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { childId, gameType = 'word-pop', questionContext = '', hintNumber = 1, ageRange = '7-9' } = body;

  if (!childId) {
    return NextResponse.json({ error: 'childId required' }, { status: 400 });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    getPostHogClient().capture({
      distinctId: childId,
      event: 'hint_api_requested',
      properties: { game_type: gameType, hint_number: hintNumber, source: 'static_fallback', reason: 'no_api_key' },
    });
    return NextResponse.json({ hint: staticFallback(gameType, hintNumber) });
  }

  const client = new Anthropic({ apiKey });

  const systemPrompt = `You are a friendly educational assistant helping a child aged ${ageRange} think through a problem.
Use the Socratic method: ask guiding questions rather than giving the answer.
Keep your response under 30 words. Use encouraging, age-appropriate language.
Do not repeat the question. Do not reveal the answer.
This is hint #${hintNumber} of 2 — make hint 2 more specific than hint 1.`;

  try {
    const result = await Promise.race([
      client.messages.create({
        model: 'claude-haiku-4-5',
        max_tokens: 80,
        system: systemPrompt,
        messages: [{ role: 'user', content: `The question is: ${questionContext}` }],
      }),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('timeout')), TIMEOUT_MS),
      ),
    ]);

    const text =
      result.content[0]?.type === 'text' ? result.content[0].text.trim() : '';

    if (!text) {
      getPostHogClient().capture({
        distinctId: childId,
        event: 'hint_api_requested',
        properties: { game_type: gameType, hint_number: hintNumber, source: 'static_fallback', reason: 'empty_response' },
      });
      return NextResponse.json({ hint: staticFallback(gameType, hintNumber) });
    }

    getPostHogClient().capture({
      distinctId: childId,
      event: 'hint_api_requested',
      properties: { game_type: gameType, hint_number: hintNumber, source: 'ai', age_range: ageRange },
    });
    return NextResponse.json({ hint: text });
  } catch {
    getPostHogClient().capture({
      distinctId: childId,
      event: 'hint_api_requested',
      properties: { game_type: gameType, hint_number: hintNumber, source: 'static_fallback', reason: 'error_or_timeout' },
    });
    return NextResponse.json({ hint: staticFallback(gameType, hintNumber) });
  }
}
