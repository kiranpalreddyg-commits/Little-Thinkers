'use client';

import { useRewardsStore } from '@/lib/stores/rewardsStore';

export function useRewards() {
  const store = useRewardsStore();
  return {
    brainJar: store.brainJar,
    feedback: store.feedback,
    isAnimating: store.isAnimating,
    hydrateRewards: store.hydrateRewards,
    loadRewards: store.loadRewards,
    earnSpark: store.earnSpark,
    completionBonus: store.completionBonus,
    setFeedback: store.setFeedback,
    clearFeedback: store.clearFeedback,
    setAnimating: store.setAnimating,
  };
}
