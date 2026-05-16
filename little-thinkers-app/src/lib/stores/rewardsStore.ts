import { create } from 'zustand';
import type { BrainJar, AnswerFeedback, SparkSource } from '@/lib/types/rewards';
import { BRAIN_JAR_CAPACITY } from '@/lib/types/rewards';

const COMPLETION_BONUS = 5;

// Spark value per difficulty — 'hard' awards 2, everything else awards 1.
// Callers pass the pre-resolved amount so this store stays difficulty-agnostic.

const storageKey = (childId: string) => `lt_rewards_${childId}`;

interface StoredJar {
  totalSparks: number;
  capacity: number;
}

function computeBrainJar(childId: string, totalSparks: number, capacity: number): BrainJar {
  const safeTotalSparks = Math.max(0, totalSparks);
  const safeCapacity = capacity > 0 ? capacity : BRAIN_JAR_CAPACITY;
  const remainder = safeTotalSparks % safeCapacity;
  const fillPercent = remainder === 0 && safeTotalSparks > 0 ? 100 : (remainder / safeCapacity) * 100;
  return { childId, totalSparks: safeTotalSparks, capacity: safeCapacity, fillPercent };
}

function readStoredJar(childId: string): StoredJar | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(storageKey(childId));
    if (!raw) return null;
    return JSON.parse(raw) as StoredJar;
  } catch {
    return null;
  }
}

function writeStoredJar(childId: string, jar: StoredJar): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(storageKey(childId), JSON.stringify(jar));
  } catch {
    // Safari private mode or quota exceeded — continue without persistence
  }
}

interface RewardsState {
  brainJar: BrainJar | null;
  feedback: AnswerFeedback | null;
  isAnimating: boolean;
  hydrateRewards: (childId: string) => void;
  loadRewards: (childId: string) => BrainJar | null;
  earnSpark: (childId: string, source: SparkSource, amount: number, gameType?: string) => void;
  completionBonus: (childId: string, gameType: string) => void;
  setFeedback: (feedback: AnswerFeedback) => void;
  clearFeedback: () => void;
  setAnimating: (value: boolean) => void;
}

export const useRewardsStore = create<RewardsState>((set, get) => ({
  brainJar: null,
  feedback: null,
  isAnimating: false,

  /** Reads localStorage and hydrates store state. Call only from useEffect. */
  hydrateRewards: (childId: string) => {
    const stored = readStoredJar(childId);
    const totalSparks = stored?.totalSparks ?? 0;
    const capacity = stored?.capacity ?? BRAIN_JAR_CAPACITY;
    set({ brainJar: computeBrainJar(childId, totalSparks, capacity) });
  },

  /** Pure read — never calls set(). Safe to call during render. */
  loadRewards: (childId: string): BrainJar | null => {
    const stored = readStoredJar(childId);
    if (!stored) return null;
    return computeBrainJar(childId, stored.totalSparks, stored.capacity);
  },

  earnSpark: (childId: string, source: SparkSource, amount: number, gameType?: string) => {
    if (typeof window === 'undefined') return;
    if (amount <= 0) return;
    const current = get().brainJar;
    const prev = current ?? computeBrainJar(childId, 0, BRAIN_JAR_CAPACITY);
    const totalSparks = prev.totalSparks + amount;
    const capacity = prev.capacity;
    const updated = computeBrainJar(childId, totalSparks, capacity);
    writeStoredJar(childId, { totalSparks, capacity });
    set({ brainJar: updated, isAnimating: true });
    // gameType / source available for future analytics — not stored in this story
    void source;
    void gameType;
  },

  completionBonus: (childId: string, gameType: string) => {
    if (typeof window === 'undefined') return;
    const current = get().brainJar;
    const prev = current ?? computeBrainJar(childId, 0, BRAIN_JAR_CAPACITY);
    const totalSparks = prev.totalSparks + COMPLETION_BONUS;
    const capacity = prev.capacity;
    const updated = computeBrainJar(childId, totalSparks, capacity);
    writeStoredJar(childId, { totalSparks, capacity });
    set({ brainJar: updated, isAnimating: true });
    void gameType;
  },

  setFeedback: (feedback: AnswerFeedback) => set({ feedback }),

  clearFeedback: () => set({ feedback: null }),

  setAnimating: (value: boolean) => set({ isAnimating: value }),
}));
