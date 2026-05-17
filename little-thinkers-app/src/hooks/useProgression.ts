'use client';
import { useProgressionStore } from '@/lib/stores/progressionStore';

export function useProgression() {
  const store = useProgressionStore();
  return {
    badges: store.badges,
    worldAreas: store.worldAreas,
    mascot: store.mascot,
    streak: store.streak,
    newBadgeNotification: store.newBadgeNotification,
    gameDifficulty: store.gameDifficulty,
    hintsUsed: store.hintsUsed,
    hydrateProgression: store.hydrateProgression,
    updateFromSparks: store.updateFromSparks,
    checkAndAwardBadges: store.checkAndAwardBadges,
    recordActivity: store.recordActivity,
    dismissNotification: store.dismissNotification,
    recordAnswer: store.recordAnswer,
    recordHintUsed: store.recordHintUsed,
    getDifficulty: store.getDifficulty,
  };
}
