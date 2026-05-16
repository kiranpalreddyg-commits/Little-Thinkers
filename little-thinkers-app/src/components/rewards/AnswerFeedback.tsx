'use client';

import { useEffect } from 'react';
import type { AnswerFeedback as AnswerFeedbackType } from '@/lib/types/rewards';

interface Props {
  feedback: AnswerFeedbackType | null;
  onDismiss: () => void;
}

export function AnswerFeedback({ feedback, onDismiss }: Props) {
  useEffect(() => {
    if (!feedback) return;
    const timer = setTimeout(onDismiss, 2000);
    return () => clearTimeout(timer);
  }, [feedback, onDismiss]);

  const isCorrect = feedback?.type === 'correct';

  return (
    <div
      role="status"
      aria-live="polite"
      aria-atomic="true"
      className={
        feedback
          ? `flex items-center gap-3 rounded-xl px-5 py-4 min-h-[44px] font-semibold text-lg ${
              isCorrect
                ? 'bg-green-100 text-green-800 border border-green-300'
                : 'bg-amber-100 text-amber-800 border border-amber-300'
            }`
          : 'h-0 overflow-hidden'
      }
    >
      {feedback && (
        <>
          <span aria-hidden="true" className="text-2xl">
            {isCorrect ? '✓' : '✗'}
          </span>
          <span>{feedback.message}</span>
        </>
      )}
    </div>
  );
}
