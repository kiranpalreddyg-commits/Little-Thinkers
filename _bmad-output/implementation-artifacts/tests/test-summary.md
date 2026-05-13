# Test Automation Summary

**Date:** 2026-05-13
**Project:** little-thinkers

## Generated Tests

### Vitest + React Testing Library (Component / Integration)

#### New — Auth Components
- [x] `src/test/components/LoginForm.test.tsx` — 8 tests
  - Renders email & password inputs
  - Submit disabled when fields empty
  - Enables submit when both fields filled
  - Calls `login` with trimmed email on submit
  - Calls `onSuccess` after successful login
  - Shows error message from `useAuth`
  - Shows loading state during submission
  - Toggles password visibility (text ↔ password)
  - Shows signup link

- [x] `src/test/components/ProfileSelector.test.tsx` — 7 tests
  - Shows loading spinner while fetching
  - Shows error state with retry button
  - Calls `refetch` when Try Again is clicked
  - Shows empty state when no profiles exist
  - Renders name, age, and gameplay mode for each profile
  - Calls `onProfileSelected` when a profile is clicked
  - Shows "Continue" button after profile selection

- [x] `src/test/components/AuthGuard.test.tsx` — 6 tests
  - Shows loading spinner while auth initialises
  - Redirects to `/login` when not authenticated
  - Redirects to `/profile-select` when `requireChildProfile=true` and no profile
  - Renders children when authenticated (no profile required)
  - Renders children when authenticated with selected child profile
  - Does not redirect while auth is loading

- [x] `src/test/components/PuzzleOfTheDay.test.tsx` — 8 tests
  - Shows `aria-busy` skeleton when puzzle is null
  - Renders heading and formatted puzzle type
  - Renders medium difficulty badge
  - Renders easy difficulty badge with green colour class
  - Renders hard difficulty badge
  - Shows hint text when hint is present
  - Does not show hint section when hint is absent
  - Calls `onStart` when Play Now is clicked

#### New — Auth API
- [x] `src/test/api/auth.test.ts` — 6 tests
  - `login` returns user and tokens for valid credentials
  - `login` throws for invalid credentials
  - `register` creates new parent account and returns tokens
  - `register` throws when email is already registered
  - `getChildren` returns child profiles for the authenticated parent
  - `getChildren` returns profiles with valid gameplay modes

### Playwright E2E (Browser — requires `npm run dev`)

- [ ] `tests/e2e/auth-flow.spec.ts` — 7 tests
  - Unauthenticated `/` visit redirects to `/login`
  - Login page shows Little Thinkers branding
  - Shows error for invalid credentials
  - Submit disabled with empty fields
  - Parent can log in and reach profile selection
  - Profile selection navigates home on card click
  - Already-authenticated user redirected away from login
  - Password visibility toggle works

- [ ] `tests/e2e/home.spec.ts` — 9 tests
  - Personalised welcome message with child name
  - All 5 game cards visible
  - Puzzle of the Day with Play Now button
  - Educational content sections present
  - Filter controls visible
  - Clicking a game card navigates to play page
  - Puzzle Play Now navigates to game page
  - Sign out returns to login
  - Unauthenticated `/` access redirects to login

## Coverage

| Area | Before | After |
|------|--------|-------|
| Auth components | 0 / 4 | 4 / 4 ✅ |
| Home components | 4 / 5 | 5 / 5 ✅ |
| Auth API | 0 / 3 | 3 / 3 ✅ |
| Content API | 6 tests | 6 tests (unchanged) |
| E2E flows | 0 | 16 specs ready |

**Vitest unit/integration:** 69 / 69 passing ✅

## Running Tests

```bash
# Component + integration tests (fast, no server needed)
npm test

# Watch mode
npm run test:watch

# E2E tests (starts Next.js dev server automatically)
npm run test:e2e

# E2E with interactive UI
npm run test:e2e:ui
```

## Notes

- E2E tests use mock API (`NEXT_PUBLIC_USE_MOCK_API=true`) with seed credentials: `james@example.com` / `password123`
- Playwright requires browser binaries: run `npx playwright install` on first use
- Vitest 4.x `--localstorage-file` warning is harmless for component tests; the auth API test works around it with a stubbed localStorage
