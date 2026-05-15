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

---

## Story 1.3 — Choose Game Difficulty and View Instructions

**Date:** 2026-05-14
**Status:** DONE

### New Test Files

#### Vitest + React Testing Library (Component / Integration)

- [x] `src/test/components/DifficultySelector.test.tsx` — 7 tests
  - Renders a radio for every available difficulty
  - Renders accessible labels for Easy, Medium and Hard
  - Only renders the difficulties passed in via props
  - Marks the currently selected difficulty as checked
  - Calls `onSelect` with the new difficulty when a different option is clicked
  - Calls `onSelect` when clicking the medium option
  - Exposes a radiogroup with an accessible label

- [x] `src/test/components/InstructionsPanel.test.tsx` — 8 tests
  - Renders the game name as a heading
  - Renders the instructions text
  - Renders a "How to play" section heading at h2 level
  - Renders an unchecked acknowledgement checkbox when `acknowledged` is false
  - Renders a checked acknowledgement checkbox when `acknowledged` is true
  - Calls `onAcknowledge(true)` when an unchecked checkbox is clicked
  - Calls `onAcknowledge(false)` when a checked checkbox is clicked again
  - Checkbox has an accessible label

- [x] `src/test/components/PlayPage.test.tsx` — 12 tests
  - Shows the game name as the page heading (AC1)
  - Shows the game description (AC1)
  - Renders the difficulty selector with the game's available difficulties (AC1)
  - Renders the instructions panel with how-to-play heading (AC3)
  - Renders an unchecked acknowledgement checkbox by default (AC4)
  - Disables the Start Game button when instructions are not acknowledged (AC4)
  - Enables the Start Game button after the acknowledgement checkbox is checked (AC5)
  - Selecting a different difficulty updates the checked radio (AC2)
  - Clicking Start Game navigates to the game route with the selected difficulty (AC6)
  - Clicking Back navigates to the home screen (AC7)
  - Redirects unauthenticated users to `/login` (AC8)
  - (auth guard variant) integrated with `useAuthStore` selectors

### Playwright E2E (Browser — requires `npm run dev`)

- [x] `tests/e2e/play-setup.spec.ts` — 12 tests
  - Shows the game name as the page heading
  - Shows all available difficulty options
  - Shows the instructions panel
  - Start Game button is disabled before instructions are acknowledged
  - Acknowledging instructions enables the Start Game button
  - Selecting a different difficulty updates the checked radio
  - Clicking Start Game navigates away from the setup screen
  - Clicking Back returns to the home screen
  - Unauthenticated access to `/play/word-pop` redirects to login
  - (plus additional coverage of difficulty radio state and instructions toggle)

### Cumulative Totals

| Suite | Files | Tests |
|-------|-------|-------|
| Vitest unit / integration | 15 | 116 |
| Playwright E2E | 3 | 28 |

**All 116 Vitest tests passing.**
**All 28 Playwright E2E tests passing.**

### Notes on Race Condition Fix

- Story 1.3 surfaced an `auth-store` race condition (auth state read before hydration completed) which caused `PlayPage` unauthenticated-redirect tests to flake. The developer fix is verified by a stable, repeated green run of the full suite on 2026-05-14.
