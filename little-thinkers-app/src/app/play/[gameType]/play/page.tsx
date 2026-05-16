'use client';

import { Suspense, useEffect, useState, useCallback } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useContent } from '@/hooks/useContent';
import { useGameSession } from '@/hooks/useGameSession';
import { useRewards } from '@/hooks/useRewards';
import { useProgression } from '@/hooks/useProgression';
import { useAuthStore } from '@/lib/stores/authStore';
import { useAppShell } from '@/components/navigation/AppShellContext';
import { PauseOverlay } from '@/components/game/PauseOverlay';
import { BrainJarWidget } from '@/components/rewards/BrainJarWidget';
import { AnswerFeedback } from '@/components/rewards/AnswerFeedback';
import { ThoughtSparkAnimation } from '@/components/rewards/ThoughtSparkAnimation';
import { BadgeNotification } from '@/components/progression/BadgeNotification';

// Spark amounts by difficulty
const SPARK_AMOUNTS: Record<string, number> = {
  easy: 1,
  medium: 1,
  hard: 2,
};

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
  const difficulty = (searchParams.get('difficulty') ?? 'medium') as
    | 'easy'
    | 'medium'
    | 'hard';

  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { games } = useContent();
  const { session, startSession, pauseSession, resumeSession, clearSession, loadSession } =
    useGameSession();
  const {
    brainJar,
    feedback,
    isAnimating,
    hydrateRewards,
    earnSpark,
    completionBonus,
    setFeedback,
    clearFeedback,
    setAnimating,
  } = useRewards();
  const {
    newBadgeNotification,
    checkAndAwardBadges,
    updateFromSparks,
    recordActivity,
    dismissNotification,
  } = useProgression();
  const { childProfile } = useAuthStore();

  const game = games.find((g) => g.type === gameType);

  const [isPaused, setIsPaused] = useState<boolean>(session?.isPaused ?? false);
  const [completionBonusAwarded, setCompletionBonusAwarded] = useState<boolean>(() => {
    if (typeof window === 'undefined' || !childProfile?.id) return false;
    return sessionStorage.getItem(`lt_bonus_${childProfile.id}_${gameType}`) === 'true';
  });
  const [totalCorrect, setTotalCorrect] = useState<number>(0);

  // Keep local isPaused in sync whenever the store session changes
  useEffect(() => {
    setIsPaused(session?.isPaused ?? false);
  }, [session?.isPaused]);

  // On mount: resume saved session or start fresh
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

  // Hydrate rewards when child profile is known
  useEffect(() => {
    if (childProfile?.id) {
      hydrateRewards(childProfile.id);
    }
  }, [childProfile?.id, hydrateRewards]);

  // Record activity and check for streak badges
  useEffect(() => {
    if (childProfile?.id) {
      const today = new Date().toISOString().split('T')[0];
      recordActivity(childProfile.id, today);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [childProfile?.id]);

  // Keep world map + mascot in sync with the authoritative spark total from
  // the rewards store. Driving this off brainJar.totalSparks (rather than
  // recomputing inside the answer handler) avoids a stale/duplicated spark
  // calculation and also covers the case where rewards hydrate after the
  // first correct answer.
  useEffect(() => {
    if (childProfile?.id && brainJar) {
      updateFromSparks(childProfile.id, brainJar.totalSparks);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [childProfile?.id, brainJar?.totalSparks]);

  // Award completion bonus when progress reaches 100%
  useEffect(() => {
    if (session?.progress === 100 && !completionBonusAwarded && childProfile?.id) {
      setCompletionBonusAwarded(true);
      if (typeof window !== 'undefined') {
        sessionStorage.setItem(`lt_bonus_${childProfile.id}_${gameType}`, 'true');
      }
      completionBonus(childProfile.id, gameType);
      checkAndAwardBadges(childProfile.id, { type: 'game-complete' });
    }
  }, [session?.progress, completionBonusAwarded, childProfile?.id, gameType, completionBonus, checkAndAwardBadges]);

  // Auth guard
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, authLoading, router]);

  const handleDismissFeedback = useCallback(() => {
    clearFeedback();
  }, [clearFeedback]);

  const handleAnimationEnd = useCallback(() => {
    setAnimating(false);
  }, [setAnimating]);

  if (!isAuthenticated) {
    return null;
  }

  if (!game) {
    return null;
  }

  const handlePause = () => {
    pauseSession();
    setIsPaused(true);
  };

  const handleResume = () => {
    resumeSession();
    setIsPaused(false);
  };

  const handleQuit = () => {
    clearSession();
    router.push('/');
  };

  const handleAnswer = (isCorrect: boolean) => {
    const sparkAmount = SPARK_AMOUNTS[difficulty] ?? 1;
    if (isCorrect) {
      if (childProfile?.id) {
        earnSpark(childProfile.id, 'correct-answer', sparkAmount, gameType);
        const newTotal = totalCorrect + 1;
        setTotalCorrect(newTotal);
        // Award badges here; world-map / mascot sync happens in the
        // brainJar.totalSparks effect once the rewards store updates.
        checkAndAwardBadges(childProfile.id, { type: 'correct-answer', totalCorrect: newTotal });
      }
      setFeedback({
        type: 'correct',
        message: `Great thinking! +${sparkAmount} Spark ✨`,
        sparksAwarded: sparkAmount,
      });
    } else {
      setFeedback({
        type: 'incorrect',
        message: 'Nice try! Keep going 💪',
        sparksAwarded: 0,
      });
    }
  };

  const settings = childProfile?.accessibility_settings;
  const reducedMotion =
    typeof settings === 'object' && settings !== null && 'reducedMotion' in settings
      ? (settings as { reducedMotion?: unknown }).reducedMotion === true
      : false;

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50">
      <main className="max-w-2xl mx-auto px-4 py-8">
        {/* Header: game title + brain jar */}
        <div className="flex items-start justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900">{game.name}</h1>
          <BrainJarWidget brainJar={brainJar} />
        </div>

        {/* Simulated gameplay area */}
        <div
          data-testid="game-area"
          className="bg-white rounded-2xl shadow-sm border border-gray-200 p-10 mb-6 text-center"
        >
          <p className="text-gray-600 mb-6 text-lg">Answer this question: What is 3 + 4?</p>
          <div className="flex gap-3 justify-center flex-wrap">
            {['6', '7', '8', '9'].map((opt) => (
              <button
                key={opt}
                onClick={() => handleAnswer(opt === '7')}
                className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-xl
                  hover:bg-blue-600 focus:outline-none focus-visible:ring-4 focus-visible:ring-offset-2
                  focus-visible:ring-blue-400 transition-colors min-h-[44px] min-w-[56px]"
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        {/* Answer feedback */}
        <div className="mb-4">
          <AnswerFeedback feedback={feedback} onDismiss={handleDismissFeedback} />
          <ThoughtSparkAnimation
            isAnimating={isAnimating}
            reducedMotion={reducedMotion}
            onAnimationEnd={handleAnimationEnd}
          />
        </div>

        {/* Badge notification */}
        {newBadgeNotification && (
          <BadgeNotification
            badge={newBadgeNotification}
            onDismiss={dismissNotification}
          />
        )}

        {/* Pause button — hidden when paused */}
        {!isPaused && (
          <button
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
          <PauseOverlay
            gameName={game.name}
            onResume={handleResume}
            onQuit={handleQuit}
          />
        )}
      </main>
    </div>
  );
}

export default function GameplayPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <span className="sr-only">Loading…</span>
        </div>
      }
    >
      <GameplayPageInner />
    </Suspense>
  );
}
