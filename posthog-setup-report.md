<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Little Thinkers Next.js (App Router) project. The integration covers client-side initialization via `instrumentation-client.ts`, reverse proxy configuration, user identification on login and signup, 20 event tracking callsites across 12 files, and server-side tracking for the AI hint API.

**Packages installed:** `posthog-js@1.374.2`, `posthog-node@5.34.5` (pre-existing)

**Files created:**
- `little-thinkers-app/instrumentation-client.ts` — PostHog client-side initialization (Next.js 15.3+ pattern)
- `little-thinkers-app/src/lib/posthog-server.ts` — Singleton server-side PostHog client

**Files modified:**
- `little-thinkers-app/next.config.ts` — Reverse proxy rewrites for PostHog ingestion (`/ingest/*`) and `skipTrailingSlashRedirect: true`
- `little-thinkers-app/src/components/auth/LoginForm.tsx` — `user_logged_in` + `posthog.identify()`
- `little-thinkers-app/src/app/(auth)/signup/page.tsx` — `user_signed_up` + `posthog.identify()`
- `little-thinkers-app/src/hooks/useAuth.ts` — `user_logged_out` + `posthog.reset()`
- `little-thinkers-app/src/app/(auth)/signup/child-setup/page.tsx` — `child_profile_created`
- `little-thinkers-app/src/app/(auth)/profile-select/page.tsx` — `child_profile_selected`
- `little-thinkers-app/src/app/(auth)/forgot-password/page.tsx` — `password_reset_requested`
- `little-thinkers-app/src/app/(shell)/page.tsx` — `daily_puzzle_started`, `content_item_viewed`
- `little-thinkers-app/src/app/(shell)/play/[gameType]/page.tsx` — `game_started`
- `little-thinkers-app/src/app/(shell)/play/[gameType]/play/page.tsx` — `game_answer_submitted`, `game_hint_requested`, `game_completed`, `badge_earned`, `game_paused`, `game_quit`
- `little-thinkers-app/src/app/(shell)/parent/settings/page.tsx` — `parent_data_exported`, `parent_certificate_printed`, `parent_account_deletion_requested`, `child_profile_updated`
- `little-thinkers-app/src/app/api/ai/hint/route.ts` — `hint_api_requested` (server-side, tracks AI vs static fallback)

| Event | Description | File |
|-------|-------------|------|
| `user_signed_up` | Parent creates an account | `src/app/(auth)/signup/page.tsx` |
| `user_logged_in` | Parent logs in | `src/components/auth/LoginForm.tsx` |
| `user_logged_out` | Parent logs out | `src/hooks/useAuth.ts` |
| `password_reset_requested` | Parent requests a password reset email | `src/app/(auth)/forgot-password/page.tsx` |
| `child_profile_created` | Parent adds a child profile during onboarding | `src/app/(auth)/signup/child-setup/page.tsx` |
| `child_profile_selected` | Parent selects a child profile to start a session | `src/app/(auth)/profile-select/page.tsx` |
| `child_profile_updated` | Parent saves edits to a child profile | `src/app/(shell)/parent/settings/page.tsx` |
| `daily_puzzle_started` | Child starts the Puzzle of the Day from the home screen | `src/app/(shell)/page.tsx` |
| `content_item_viewed` | Child opens a story or science topic | `src/app/(shell)/page.tsx` |
| `game_started` | Child starts a game after selecting difficulty | `src/app/(shell)/play/[gameType]/page.tsx` |
| `game_paused` | Child pauses an active game session | `src/app/(shell)/play/[gameType]/play/page.tsx` |
| `game_quit` | Child quits from the pause overlay | `src/app/(shell)/play/[gameType]/play/page.tsx` |
| `game_answer_submitted` | Child submits an answer (includes correctness and difficulty level) | `src/app/(shell)/play/[gameType]/play/page.tsx` |
| `game_hint_requested` | Child requests an AI hint | `src/app/(shell)/play/[gameType]/play/page.tsx` |
| `game_completed` | Child completes a full game session | `src/app/(shell)/play/[gameType]/play/page.tsx` |
| `badge_earned` | Child earns a badge milestone | `src/app/(shell)/play/[gameType]/play/page.tsx` |
| `parent_data_exported` | Parent downloads a child progress report | `src/app/(shell)/parent/settings/page.tsx` |
| `parent_certificate_printed` | Parent prints an achievement certificate | `src/app/(shell)/parent/settings/page.tsx` |
| `parent_account_deletion_requested` | Parent requests account deletion | `src/app/(shell)/parent/settings/page.tsx` |
| `hint_api_requested` | Server-side: hint API called, tracks AI vs static fallback | `src/app/api/ai/hint/route.ts` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics dashboard](/dashboard/1601204)
- [Signup to first game funnel](/insights/VcwHTwpn) — conversion funnel from signup through child setup to first game start
- [Game completion rate over time](/insights/6qTcR7tl) — ratio of games completed vs started as a percentage trend
- [In-session churn: game quits over time](/insights/W8DOImUK) — game quits vs starts, a key disengagement signal
- [Hint usage trend](/insights/PvDEuNh0) — hint requests vs answers submitted, indicates content difficulty
- [Parent engagement & account deletion risk](/insights/LmPmg7GW) — data exports and certificates (high engagement) vs deletion requests (churn risk)

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
