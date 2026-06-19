'use client';

import { useEffect } from 'react';
import { usePostHog } from 'posthog-js/react';

export default function ShellError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const posthog = usePostHog();

  useEffect(() => {
    posthog?.capture('$exception', {
      $exception_message: error.message,
      $exception_type: error.name,
      $exception_stack_trace: error.stack,
      digest: error.digest,
    });
  }, [error, posthog]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 p-8">
      <p className="text-4xl">😵</p>
      <h2 className="text-2xl font-black text-white drop-shadow-md text-center">
        Something went wrong!
      </h2>
      <button
        onClick={reset}
        className="px-6 py-3 bg-white font-black rounded-2xl shadow-lg text-purple-700 active:scale-95 transition-transform"
      >
        Try again
      </button>
    </div>
  );
}
