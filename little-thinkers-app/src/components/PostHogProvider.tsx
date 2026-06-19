'use client';

import posthog from 'posthog-js';
import { PostHogProvider as PHProvider } from 'posthog-js/react';
import { useEffect } from 'react';

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const token = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;
    if (!token) return;
    posthog.init(token, {
      api_host: '/ingest',
      ui_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
      capture_pageview: false,  // manual via PostHogPageView
      capture_pageleave: false, // SPA navigation doesn't trigger real page unloads; avoids AbortErrors
      person_profiles: 'identified_only',
      capture_exceptions: false, // prevent PostHog from re-capturing its own network errors
    });
  }, []);

  return <PHProvider client={posthog}>{children}</PHProvider>;
}
