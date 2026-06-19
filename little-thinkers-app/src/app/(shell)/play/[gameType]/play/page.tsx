'use client';

import { Suspense, useEffect, useState, useCallback, useRef } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import posthog from 'posthog-js';
import { useAuth } from '@/hooks/useAuth';
import { useContent } from '@/hooks/useContent';
import { useGameSession } from '@/hooks/useGameSession';
import { useRewards } from '@/hooks/useRewards';
import { useProgression } from '@/hooks/useProgression';
import { useAuthStore } from '@/lib/stores/authStore';
import { useAppShell } from '@/components/navigation/AppShellContext';
import dynamic from 'next/dynamic';
import { BrainJarWidget } from '@/components/rewards/BrainJarWidget';
import { AnswerFeedback } from '@/components/rewards/AnswerFeedback';

// Only shown when user pauses — lazy-load to keep initial bundle small
const PauseOverlay = dynamic(
  () => import('@/components/game/PauseOverlay').then((m) => ({ default: m.PauseOverlay })),
  { ssr: false, loading: () => null }
);

// Only shown when isAnimating === true — lazy-load to keep initial bundle small
const ThoughtSparkAnimation = dynamic(
  () => import('@/components/rewards/ThoughtSparkAnimation').then((m) => ({ default: m.ThoughtSparkAnimation })),
  { ssr: false, loading: () => null }
);

// Only shown when a badge is earned — lazy-load to keep initial bundle small
const BadgeNotification = dynamic(
  () => import('@/components/progression/BadgeNotification').then((m) => ({ default: m.BadgeNotification })),
  { ssr: false, loading: () => null }
);
import { STATIC_HINTS } from '@/lib/ai/staticHints';

const SPARK_AMOUNTS: Record<string, number> = {
  easy: 1,
  medium: 1,
  hard: 2,
};

const HINT_DELAY_MS = 10_000;
const MAX_HINTS_PER_QUESTION = 2;

interface Question {
  text: string;
  options: string[];
  correct: string;
}

const DIFFICULTY_QUESTIONS: Record<number, Question> = {
  1: { text: 'What is 1 + 1?',   options: ['1', '2', '3', '4'],   correct: '2'  },
  2: { text: 'What is 3 + 4?',   options: ['6', '7', '8', '9'],   correct: '7'  },
  3: { text: 'What is 8 + 7?',   options: ['13', '14', '15', '16'], correct: '15' },
  4: { text: 'What is 23 + 19?', options: ['40', '41', '42', '43'], correct: '42' },
  5: { text: 'What is 47 + 35?', options: ['80', '82', '83', '85'], correct: '82' },
};

function deriveAgeRange(age: number | null | undefined): string {
  if (!age) return '7-9';
  if (age <= 9)  return '7-9';
  if (age <= 12) return '10-12';
  return '13-15';
}

function GameplayPageInner() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const { setHideTabBar } = useAppShell();

  useEffect(() => {
    setHideTabBar(true);
    return () => setHideTabBar(false);
  }, [setHideTabBar]);

  const gameType = params.gameType as string;
  const difficulty = (searchParams.get('difficulty') ?? 'medium') as 'easy' | 'medium' | 'hard';

  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { games } = useContent();
  const { session, startSession, pauseSession, resumeSession, clearSession, loadSession } = useGameSession();
  const {
    brainJar, feedback, isAnimating,
    hydrateRewards, earnSpark, completionBonus,
    setFeedback, clearFeedback, setAnimating,
  } = useRewards();
  const {
    newBadgeNotification, checkAndAwardBadges, updateFromSparks,
    recordActivity, dismissNotification, getDifficulty, recordAnswer, recordHintUsed,
  } = useProgression();
  const { childProfile } = useAuthStore();

  const game = games.find((g) => g.type === gameType);

  const [isPaused, setIsPaused]         = useState<boolean>(session?.isPaused ?? false);
  const [completionBonusAwarded, setCompletionBonusAwarded] = useState<boolean>(() => {
    if (typeof window === 'undefined' || !childProfile?.id) return false;
    return sessionStorage.getItem(`lt_bonus_${childProfile.id}_${gameType}`) === 'true';
  });
  const [totalCorrect, setTotalCorrect] = useState<number>(0);

  // AI: hint state
  const [hintVisible, setHintVisible]   = useState(false);
  const [hintCount, setHintCount]       = useState(0);
  const [hintText, setHintText]         = useState('');
  const [hintLoading, setHintLoading]   = useState(false);
  const hintTimerRef                    = useRef<ReturnType<typeof setTimeout> | null>(null);

  const currentLevel = getDifficulty(gameType);
  const currentQuestion = DIFFICULTY_QUESTIONS[currentLevel] ?? DIFFICULTY_QUESTIONS[2];

  function startHintTimer() {
    if (hintTimerRef.current) clearTimeout(hintTimerRef.current);
    setHintVisible(false);
    hintTimerRef.current = setTimeout(() => {
      if (hintCount < MAX_HINTS_PER_QUESTION) {
        setHintVisible(true);
      }
    }, HINT_DELAY_MS);
  }

  function resetQuestion() {
    setHintCount(0);
    setHintText('');
    setHintVisible(false);
    startHintTimer();
  }

  // Start hint timer on mount and when question changes
  useEffect(() => {
    startHintTimer();
    return () => {
      if (hintTimerRef.current) clearTimeout(hintTimerRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentLevel]);

  useEffect(() => { setIsPaused(session?.isPaused ?? false); }, [session?.isPaused]);

  useEffect(() => {
    if (!game) return;
    const existing = loadSession(game.type);
    if (existing && existing.difficulty === difficulty) {
      resumeSession();
    } else {
      startSession(game.type, difficulty);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [game?.type, difficulty]);

  useEffect(() => {
    if (childProfile?.id) hydrateRewards(childProfile.id);
  }, [childProfile?.id, hydrateRewards]);

  useEffect(() => {
    if (childProfile?.id) {
      const today = new Date().toISOString().split('T')[0];
      recordActivity(childProfile.id, today);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [childProfile?.id]);

  useEffect(() => {
    if (childProfile?.id && brainJar) {
      updateFromSparks(childProfile.id, brainJar.totalSparks);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [childProfile?.id, brainJar?.totalSparks]);

  useEffect(() => {
    if (session?.progress === 100 && !completionBonusAwarded && childProfile?.id) {
      setCompletionBonusAwarded(true);
      if (typeof window !== 'undefined') {
        sessionStorage.setItem(`lt_bonus_${childProfile.id}_${gameType}`, 'true');
      }
      posthog.capture('game_completed', {
        game_type: gameType,
        difficulty,
        total_correct: totalCorrect,
      });
      completionBonus(childProfile.id, gameType);
      const newBadges = checkAndAwardBadges(childProfile.id, { type: 'game-complete' });
      newBadges?.forEach((badge) => {
        posthog.capture('badge_earned', { badge_type: badge.badgeType, badge_name: badge.name, game_type: gameType });
      });
    }
  }, [session?.progress, completionBonusAwarded, childProfile?.id, gameType, difficulty, totalCorrect, completionBonus, checkAndAwardBadges]);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) router.push('/login');
  }, [isAuthenticated, authLoading, router]);

  const handleDismissFeedback = useCallback(() => { clearFeedback(); }, [clearFeedback]);
  const handleAnimationEnd    = useCallback(() => { setAnimating(false); }, [setAnimating]);

  const handleAnswer = useCallback((isCorrect: boolean) => {
    const sparkAmount = SPARK_AMOUNTS[difficulty] ?? 1;
    posthog.capture('game_answer_submitted', {
      game_type: gameType,
      difficulty,
      is_correct: isCorrect,
      difficulty_level: currentLevel,
    });
    if (isCorrect) {
      if (childProfile?.id) {
        earnSpark(childProfile.id, 'correct-answer', sparkAmount, gameType);
        const newTotal = totalCorrect + 1;
        setTotalCorrect(newTotal);
        const newBadges = checkAndAwardBadges(childProfile.id, { type: 'correct-answer', totalCorrect: newTotal });
        newBadges?.forEach((badge) => {
          posthog.capture('badge_earned', { badge_type: badge.badgeType, badge_name: badge.name, game_type: gameType });
        });
      }
      setFeedback({ type: 'correct', message: `Great thinking! +${sparkAmount} Spark ✨`, sparksAwarded: sparkAmount });
    } else {
      setFeedback({ type: 'incorrect', message: 'Nice try! Keep going 💪', sparksAwarded: 0 });
    }
    if (childProfile?.id) {
      recordAnswer(childProfile.id, gameType, isCorrect);
    }
    resetQuestion();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [difficulty, childProfile?.id, gameType, totalCorrect, currentLevel, earnSpark, checkAndAwardBadges, setFeedback, recordAnswer]);

  const handleHintRequest = useCallback(async () => {
    if (hintCount >= MAX_HINTS_PER_QUESTION || hintLoading) return;
    setHintLoading(true);
    const newCount = hintCount + 1;
    setHintCount(newCount);
    if (newCount >= MAX_HINTS_PER_QUESTION) setHintVisible(false);

    recordHintUsed(gameType);
    posthog.capture('game_hint_requested', {
      game_type: gameType,
      hint_number: newCount,
      difficulty_level: currentLevel,
    });

    const ageRange = deriveAgeRange(childProfile?.age);
    const fallback = (STATIC_HINTS[gameType] ?? STATIC_HINTS['word-pop'])[Math.min(newCount - 1, 1)];
    try {
      const res = await fetch('/api/ai/hint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          childId: childProfile?.id ?? 'anon',
          gameType,
          questionContext: currentQuestion.text,
          hintNumber: newCount,
          ageRange,
        }),
      });
      if (res.ok) {
        const data = await res.json() as { hint?: string };
        setHintText(data.hint || fallback);
      } else {
        setHintText(fallback);
      }
    } catch {
      setHintText(fallback);
    } finally {
      setHintLoading(false);
    }
  }, [hintCount, hintLoading, recordHintUsed, gameType, childProfile?.id, childProfile?.age, currentQuestion.text]);

  if (!isAuthenticated) return null;
  if (!game) return null;

  const handlePause  = () => {
    posthog.capture('game_paused', { game_type: gameType, difficulty, difficulty_level: currentLevel });
    pauseSession();
    setIsPaused(true);
  };
  const handleResume = () => { resumeSession(); setIsPaused(false); };
  const handleQuit   = () => {
    posthog.capture('game_quit', { game_type: gameType, difficulty, difficulty_level: currentLevel, total_correct: totalCorrect });
    clearSession();
    router.push('/');
  };

  const settings = childProfile?.accessibility_settings;
  const reducedMotion =
    typeof settings === 'object' && settings !== null && 'reducedMotion' in settings
      ? (settings as { reducedMotion?: unknown }).reducedMotion === true
      : false;
  const feedbackDuration =
    typeof settings === 'object' && settings !== null && 'feedbackDuration' in settings
      ? Number((settings as { feedbackDuration?: unknown }).feedbackDuration) || 2000
      : 2000;

  return (
    <div className="min-h-screen">
      <main className="max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{game.name}</h1>
            <span
              data-testid="difficulty-display"
              className="inline-block mt-1 text-sm font-semibold text-[var(--color-brand)] bg-violet-100 rounded-full px-3 py-0.5"
            >
              Level {currentLevel}
            </span>
          </div>
          <BrainJarWidget brainJar={brainJar} />
        </div>

        {/* Game area */}
        <div
          data-testid="game-area"
          className="bg-white rounded-2xl shadow-sm border border-gray-200 p-10 mb-6 text-center"
        >
          <p className="text-gray-600 mb-6 text-lg">{currentQuestion.text}</p>
          <div className="flex gap-3 justify-center flex-wrap">
            {currentQuestion.options.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => handleAnswer(opt === currentQuestion.correct)}
                disabled={isPaused}
                className="px-6 py-3 text-white font-black rounded-xl border-[3px] transition-transform active:translate-y-[2px] min-h-[44px] min-w-[56px] disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-4 focus-visible:ring-offset-2 focus-visible:ring-[var(--theme-border)]"
              style={{ backgroundColor: 'var(--theme-border)', borderColor: 'var(--theme-shadow)', boxShadow: '0 4px 0 var(--theme-shadow)' }}
              >
                {opt}
              </button>
            ))}
          </div>

          {/* Hint button — visible only after 10s with hints remaining */}
          {hintVisible && hintCount < MAX_HINTS_PER_QUESTION && (
            <div className="mt-6">
              <button
                data-testid="hint-button"
                type="button"
                onClick={handleHintRequest}
                disabled={hintLoading}
                className="px-5 py-2 bg-amber-100 text-amber-700 font-semibold rounded-full text-sm
                  hover:bg-amber-200 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400
                  disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {hintLoading ? 'Thinking…' : 'Need a hint? 💡'}
              </button>
            </div>
          )}

          {/* Hint text */}
          {hintText && (
            <p
              data-testid="hint-text"
              className="mt-4 text-amber-700 bg-amber-50 rounded-xl px-4 py-3 text-sm font-medium"
            >
              💡 {hintText}
            </p>
          )}
        </div>

        {/* Answer feedback */}
        <div className="mb-4">
          <AnswerFeedback feedback={feedback} onDismiss={handleDismissFeedback} dismissDuration={feedbackDuration} />
          <ThoughtSparkAnimation
            isAnimating={isAnimating}
            reducedMotion={reducedMotion}
            onAnimationEnd={handleAnimationEnd}
          />
        </div>

        {/* Badge notification */}
        {newBadgeNotification && (
          <BadgeNotification badge={newBadgeNotification} onDismiss={dismissNotification} />
        )}

        {/* Pause button */}
        {!isPaused && (
          <button
            type="button"
            onClick={handlePause}
            aria-label="Pause Game"
            className="px-6 py-3 bg-yellow-500 text-white font-semibold rounded-xl
              hover:bg-yellow-600 focus:outline-none focus-visible:ring-4 focus-visible:ring-offset-2 focus-visible:ring-yellow-400
              transition-colors min-h-[44px]"
          >
            Pause Game
          </button>
        )}

        {/* Pause overlay */}
        {isPaused && (
          <PauseOverlay gameName={game.name} onResume={handleResume} onQuit={handleQuit} />
        )}
      </main>
    </div>
  );
}

export default function GameplayPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><span className="sr-only">Loading…</span></div>}>
      <GameplayPageInner />
    </Suspense>
  );
}
