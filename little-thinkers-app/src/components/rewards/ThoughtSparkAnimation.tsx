'use client';

import { useEffect } from 'react';

interface Props {
  isAnimating: boolean;
  reducedMotion: boolean;
  onAnimationEnd: () => void;
}

export function ThoughtSparkAnimation({ isAnimating, reducedMotion, onAnimationEnd }: Props) {
  // If reduced motion is on, skip animation and immediately signal completion.
  useEffect(() => {
    if (isAnimating && reducedMotion) {
      onAnimationEnd();
    }
  }, [isAnimating, reducedMotion, onAnimationEnd]);

  if (!isAnimating || reducedMotion) return null;

  return (
    <div
      aria-hidden="true"
      data-testid="spark-animation"
      onAnimationEnd={onAnimationEnd}
      className="pointer-events-none select-none flex justify-center animate-spark-float"
      style={{
        animation: 'sparkFloat 0.6s ease-out forwards',
      }}
    >
      <style>{`
        @keyframes sparkFloat {
          0%   { opacity: 1; transform: translateY(0) scale(1); }
          100% { opacity: 0; transform: translateY(-48px) scale(1.4); }
        }
      `}</style>
      <span className="text-3xl">✨</span>
    </div>
  );
}
