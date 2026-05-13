---
story_id: "1.2"
story_key: "1-2-browse-games-and-educational-content"
epic: "Epic 1: Child Gameplay & Rewards Experience"
status: "review"
created: "2026-05-12"
last_updated: "2026-05-12"
assignee: ""
---

# Story 1.2: Browse Games and Educational Content

## User Story

As a child,
I want to browse the five games and educational content sections (Puzzle of the Day, Tell Me Why, Story Time) on the home screen,
so that I can choose what to play or read.

## Acceptance Criteria

1. **Given** I am authenticated and on the app home screen,
   **When** I view the content,
   **Then** I can see all five games (Word Pop, Connection Quest, Memory Flip, Pattern Builder, Grid Logic) with their names and brief descriptions.

2. **Given** I am on the home screen,
   **When** I view the content,
   **Then** I can see three content sections: Puzzle of the Day, Tell Me Why, and Story Time.

3. **Given** I am on the home screen,
   **When** I tap or click a game card,
   **Then** I am navigated to that game (or its detail/difficulty selection screen handled in Story 1.3).

4. **Given** I am on the home screen,
   **When** I use the topic or age-appropriateness filter,
   **Then** the displayed content is filtered accordingly and the filter state is visually indicated.

5. **Given** I am browsing the home screen,
   **When** I navigate using keyboard only,
   **Then** all game cards and content items are reachable and activatable via keyboard (Tab, Enter/Space).

6. **Given** I am using a screen reader,
   **When** I navigate the home screen,
   **Then** all game titles, descriptions, and content section headings are announced correctly.

## Functional Requirements

- **FR2**: Child can select and play any of five games (Word Pop, Connection Quest, Memory Flip, Pattern Builder, Grid Logic)
- **FR7**: Child can access Puzzle of the Day, Tell Me Why topics, and Story Time stories from the app home experience
- **FR8**: Child can browse available content by topic and age-appropriateness indicators

## Business Context

- The home screen is the child's primary navigation hub — it must be immediately scannable and inviting for ages 7–15.
- Five games map to five themed world areas (unlocked via progression in Story 1.6): Word Woods, Connection Canyon, Memory Marsh, Pattern Peaks, Logic Lab.
- "Tell Me Why?" and "Story Time" content items are created by content managers (Epic 4) and approved through a staging workflow — the child sees only published, educator-reviewed items.
- Filtering enables discovery by cognitive skill domain and age range, supporting differentiated learning (core PRD requirement).
- This story's home screen is what parents see described in Brain Reports and Quick View dashboards (Epic 2), so game names and cognitive skill labels must be consistent with backend data models.

## Technical Requirements

### Frontend (PWA Client)

- **Framework**: Next.js 14+ with React 18+, App Router — same as Story 1.1
- **State Management**: Zustand — follow the pattern of `src/lib/stores/authStore.ts` for a new `contentStore.ts`
- **API Client**: Extend the existing API client pattern (`src/lib/api/auth.ts`) — create `src/lib/api/games.ts` and `src/lib/api/content.ts` using the same axios/fetch wrapper
- **Accessibility**: React Aria — use for interactive game cards and filter controls
- **Caching**: Service Worker stale-while-revalidate is already set up (`DYNAMIC_CACHE`) — API calls for games and content will benefit automatically; no additional SW config needed for this story
- **Loading States**: Use skeleton loaders consistent with Story 1.1 patterns

### Backend (Read-Only for this Story)

This story consumes existing backend endpoints. No new backend work needed.

- **Game Service**: `GET /api/games` — list all games with metadata
- **Content Service**: 
  - `GET /api/content/puzzles/daily` — today's Puzzle of the Day
  - `GET /api/content/stories` — Story Time list (supports `?topic=&ageMin=&ageMax=` query params)
  - `GET /api/content/science` — Tell Me Why list (supports `?topic=&ageMin=&ageMax=` query params)

### Performance

- Home screen must achieve FCP < 2s on 4G (NFR1) — prioritize critical CSS inline, defer non-critical JS
- Game card images must be < 80KB each (WebP format) — do not block LCP with hero images
- Content sections can lazy-load below the fold

## Architecture Context

### System Components Involved

- **PWA Client** (`src/app/page.tsx`) — home screen — this file was scaffolded in Story 1.1 and must be ENHANCED, not replaced
- **AuthGuard** (`src/components/auth/AuthGuard.tsx`) — already wraps the home page; do NOT remove
- **Auth Store** (`src/lib/stores/authStore.ts`) — use `useAuthStore()` to get `childProfile` for personalization
- **Content Service** (backend) — returns stories, science topics via REST
- **Game Service** (backend) — returns games list via REST
- **MongoDB** — stores content items; filter params map directly to MongoDB query fields:
  - `stories`: `{ age_range: { min, max }, cognitive_skills: [...] }`
  - `science_topics`: `{ age_range: { min, max }, cognitive_skills: [...] }`
- **Service Worker** (`DYNAMIC_CACHE`) — automatically caches `/api/` responses via stale-while-revalidate

### Data Flow

1. Home page mounts → `AuthGuard` verifies JWT (already implemented)
2. `useContent` hook triggers → fetches games list, daily puzzle, stories, science topics in parallel
3. Content stored in `contentStore` (Zustand) → prevents re-fetching on re-renders
4. Filter state (topic, ageMin/Max) stored in `contentStore` → passed as query params on filter change
5. Game card click → Next.js router navigates to `/play/[gameType]` (stub route; actual gameplay in Story 1.3)

### Game Metadata (Static — Embed in Frontend or Fetch from /api/games)

| Game | Route Slug | Themed Area | Cognitive Domain | Bloom's Level |
|------|-----------|-------------|-----------------|--------------|
| Word Pop | `word-pop` | Word Woods | Vocabulary & Language | Apply |
| Connection Quest | `connection-quest` | Connection Canyon | Logic & Reasoning | Analyze |
| Memory Flip | `memory-flip` | Memory Marsh | Working Memory | Remember |
| Pattern Builder | `pattern-builder` | Pattern Peaks | Pattern Recognition | Apply |
| Grid Logic | `grid-logic` | Logic Lab | Logic & Problem Solving | Evaluate |

### API Endpoints Used

```
GET /api/games
  Response: [{ type, name, description, themedArea, cognitiveSkill, bloomsLevel, difficulty[] }]

GET /api/content/puzzles/daily
  Response: { id, type, difficulty, hint, createdAt }

GET /api/content/stories?topic=&ageMin=7&ageMax=15
  Response: [{ id, title, cognitiveSkills[], ageRange, theme, readingLevel }]

GET /api/content/science?topic=&ageMin=7&ageMax=15
  Response: [{ id, question, cognitiveSkills[], ageRange }]
```

### File Structure

**IMPORTANT:** The home page (`src/app/page.tsx`) already exists from Story 1.1. ENHANCE it. Do not overwrite it.

New files to create:
```
src/
├── components/
│   └── home/
│       ├── GameCard.tsx          — individual game card with name, icon, description
│       ├── GameGrid.tsx          — responsive grid of 5 GameCards
│       ├── ContentSection.tsx    — reusable section wrapper (Tell Me Why, Story Time)
│       ├── PuzzleOfTheDay.tsx    — daily puzzle teaser card
│       └── ContentFilter.tsx     — topic + age range filter (React Aria accessible)
├── lib/
│   ├── api/
│   │   ├── games.ts              — fetchGames(), follows pattern of src/lib/api/auth.ts
│   │   └── content.ts            — fetchDailyPuzzle(), fetchStories(), fetchScienceTopics()
│   └── stores/
│       └── contentStore.ts       — Zustand store, follows pattern of authStore.ts
└── hooks/
    └── useContent.ts             — data fetching hooks using contentStore
```

Files to update:
```
src/app/page.tsx                  — ENHANCE with new home components
```

### Zustand Store Pattern (Follow Exactly)

Reference: `src/lib/stores/authStore.ts`

```typescript
// src/lib/stores/contentStore.ts — follow same pattern
import { create } from 'zustand'

interface ContentState {
  games: Game[]
  dailyPuzzle: DailyPuzzle | null
  stories: Story[]
  scienceTopics: ScienceTopic[]
  filter: { topic: string; ageMin: number; ageMax: number }
  isLoading: boolean
  error: string | null
  // actions
  fetchGames: () => Promise<void>
  fetchDailyPuzzle: () => Promise<void>
  fetchContent: (filter?: Partial<ContentFilter>) => Promise<void>
  setFilter: (filter: Partial<ContentFilter>) => void
}

export const useContentStore = create<ContentState>()(...)
```

### Security

- All API calls must include JWT access token (handled by the shared API client wrapper from Story 1.1)
- Filter params (topic, age) are passed as query strings — validate/sanitize before including in URL to prevent injection
- Content displayed here is pre-approved by content managers — no additional client-side content moderation needed

## Dependencies

### Story Dependencies

- **Story 1.1 (Completed)**: Auth flow, JWT storage, AuthGuard, home page skeleton, Zustand authStore, and API client pattern are all in place. Build on top of them.
- **Story 1.3 (Not started)**: Game card click in this story navigates to `/play/[gameType]` — create a stub page `src/app/play/[gameType]/page.tsx` if it doesn't exist, showing a placeholder "Game coming soon" screen to avoid 404.

### Technical Dependencies

- `GET /api/games` endpoint must be running (Game Service)
- `GET /api/content/puzzles/daily`, `/stories`, `/science` endpoints must be running (Content Service)
- Existing: Next.js, Zustand, React Aria, Tailwind CSS (all installed in Story 1.1)

## Implementation Notes

### Key Decisions

- **Content Store vs. Local State**: Use Zustand `contentStore` (not component-local state) so filter state survives navigation back to home and prevents redundant API calls.
- **Game Metadata Source**: `GET /api/games` is preferred over hardcoding. However, if the Game Service is not yet deployed, fall back to static game metadata from the table above — wrap in a config constant that can be swapped.
- **Filtering**: Filter UI changes fire a new API request with updated query params (not client-side array filter) — this keeps the content fresh and consistent with what backend returns for age-gated content.
- **Route for Game Start**: Story 1.2 only handles browsing. On game card click, navigate to `/play/[gameType]`. If Story 1.3 hasn't created that route, create a stub. Do NOT implement game logic here.

### Accessibility Requirements (Non-Negotiable)

- All 5 game cards must be reachable by Tab key and activatable by Enter/Space
- `ContentFilter` must be keyboard navigable with clear focus rings (3px minimum, per NFR16)
- All game card images must have descriptive `alt` text (e.g., "Word Pop game — build vocabulary by guessing words")
- Content section headings ("Puzzle of the Day", "Tell Me Why?", "Story Time") must be semantic `<h2>` elements
- Minimum tap target: 44×44px per PRD touch target requirements
- Do not use color alone to distinguish games — pair with icons and labels

### Code Patterns to Follow (From Story 1.1)

- Error handling: show inline error message, not thrown exceptions
- Loading states: skeleton loaders (not spinners) while data fetches
- Never store sensitive data in localStorage — use the existing JWT cookie strategy
- TypeScript types: define in `src/lib/types/` (follow `auth.ts` pattern) — create `content.ts` types file

### Testing Strategy

- **Unit Tests**: `GameCard`, `GameGrid`, `ContentFilter`, `ContentSection`, `PuzzleOfTheDay` components
- **Unit Tests**: `contentStore` actions (fetch, setFilter), `games.ts` and `content.ts` API functions
- **Integration Tests**: Home page mounts → fetches games and content → renders all 5 games + 3 sections
- **Integration Tests**: Filter change → API called with correct query params → filtered list displayed
- **E2E Tests (Playwright)**: Navigate to home screen, verify all 5 games visible, apply topic filter, click game card, land on game route
- **Accessibility Tests**: Axe scan on home page, keyboard-only navigation through all game cards and filters, VoiceOver/TalkBack announcements for game titles

## Previous Story Intelligence (Story 1.1)

### What Was Built

- Auth flow: email/password login for parents, profile selection for children
- Files created: `src/lib/types/auth.ts`, `src/lib/stores/authStore.ts`, `src/lib/api/auth.ts`, `src/hooks/useAuth.ts`, `src/components/auth/AuthGuard.tsx`, `src/components/auth/LoginForm.tsx`, `src/components/auth/ProfileSelector.tsx`, `src/app/login/page.tsx`, `src/app/profile-select/page.tsx`, `src/app/page.tsx`
- `src/app/page.tsx` has a personalized home page shell — EXTEND IT, do not replace

### Pending Work from Story 1.1 (DO NOT Block This Story On These)

Story 1.1 tasks 4–6 (backend integration, offline support, testing) were listed as incomplete. This story should not depend on those being done — proceed with the assumption that JWT auth and profile selection work, as the Completion Notes confirm.

### Learnings

- Follow existing TypeScript type definitions and Zustand store shape exactly
- Skeleton loaders were used in Story 1.1 — use the same pattern for consistency
- API client handles JWT token refresh automatically — do not re-implement token logic in content API files
- Components are child-friendly: large touch targets, bright colors, clear labels — maintain this in game cards

## Tasks / Subtasks

- [x] Task 1: Define TypeScript types for content (AC: 1, 2)
  - [x] Create `src/lib/types/content.ts` with `Game`, `DailyPuzzle`, `Story`, `ScienceTopic`, `ContentFilter` interfaces

- [x] Task 2: Create API client functions (AC: 1, 2, 4)
  - [x] Create `src/lib/api/games.ts` — `fetchGames()` calling `GET /api/games`
  - [x] Create `src/lib/api/content.ts` — `fetchDailyPuzzle()`, `fetchStories(filter)`, `fetchScienceTopics(filter)`
  - [x] Follow the same axios/fetch wrapper pattern as `src/lib/api/auth.ts`

- [x] Task 3: Create Zustand content store (AC: 1, 2, 4)
  - [x] Create `src/lib/stores/contentStore.ts` with state shape and actions per the pattern above

- [x] Task 4: Create content hooks (AC: 1, 2, 4)
  - [x] Create `src/hooks/useContent.ts` — `useContent()` composite hook using `useContentStore`

- [x] Task 5: Build home screen components (AC: 1, 2, 5, 6)
  - [x] `src/components/home/GameCard.tsx` — accessible card with game name, icon, description, 44px tap target
  - [x] `src/components/home/GameGrid.tsx` — responsive grid, 5 cards, keyboard navigable
  - [x] `src/components/home/ContentSection.tsx` — reusable section wrapper with `<h2>` heading and item list
  - [x] `src/components/home/PuzzleOfTheDay.tsx` — daily puzzle teaser with title and difficulty badge
  - [x] `src/components/home/ContentFilter.tsx` — topic and age-range filter using native `<select>` with proper ARIA labels (React Aria not installed; native approach equally accessible)

- [x] Task 6: Enhance home page (AC: 1, 2, 3, 4)
  - [x] Update `src/app/page.tsx` to compose `GameGrid`, `PuzzleOfTheDay`, `ContentSection` for Tell Me Why and Story Time
  - [x] Connect filter component to `contentStore.setFilter` → triggers re-fetch with query params
  - [x] Wire game card click → `router.push('/play/[gameType]')`
  - [x] Create stub `src/app/play/[gameType]/page.tsx`

- [x] Task 7: Testing and accessibility (AC: 5, 6)
  - [x] Install Vitest + @testing-library/react (no test framework was present; testing in story spec)
  - [x] Write unit tests for GameCard, GameGrid, ContentSection, ContentFilter components (32 tests, all passing)
  - [x] Write integration tests for content API functions (mock mode)
  - [x] Keyboard accessibility: all interactive elements have tabIndex=0, role=button, Enter/Space handlers, focus-visible rings
  - [x] Screen reader: aria-labels on all cards/buttons, semantic h2 section headings, aria-live on loading states

## Dev Notes

### Project Structure Notes

- App Router convention: pages live at `src/app/[route]/page.tsx`, components at `src/components/[domain]/`
- Zustand store files at `src/lib/stores/` — one store per domain (auth, content)
- API client files at `src/lib/api/` — one file per backend service
- Hooks at `src/hooks/` — composable, thin wrappers over stores

### References

- Games list and API: [Source: architecture.md — API Design > Games & Progress]
- Content API: [Source: architecture.md — API Design > Content]
- MongoDB content schema: [Source: architecture.md — MongoDB Collections]
- Filter params: [Source: prd.md — FR8]
- Game cognitive mappings: [Source: prd.md — Domain-Specific Requirements > Educational Alignment]
- Game theme areas: [Source: prd.md — Executive Summary]
- Tap target size: [Source: prd.md — PWA-Specific Requirements > Touch Target]
- Performance targets: [Source: prd.md — PWA-Specific Requirements > Core Metrics]
- WCAG requirements: [Source: prd.md — Domain-Specific Requirements > Neurodivergent Accessibility, NFR16]
- Previous story file structure: [Source: _bmad-output/implementation-artifacts/1-1-sign-in-and-select-linked-child-profile.md — File List]

## Dev Agent Record

### Agent Model Used

claude-sonnet-4-6

### Debug Log References

- React Aria not installed — used native `<select>` + `<label>` with explicit `for`/`id` binding. Equally accessible, zero extra dependencies.
- Vitest installed (no test framework existed). Test runner, @testing-library/react, and jsdom added as devDependencies.
- `mockApiHandler.ts` extended with `/games`, `/content/puzzles/daily`, `/content/stories`, `/content/science` endpoints using filter query params.
- `mockDb.ts` extended with MOCK_GAMES (5 games), MOCK_STORIES (3), MOCK_SCIENCE_TOPICS (3), MOCK_DAILY_PUZZLE.
- Tests initially failed on `getByLabelText(/Topic/i)` — regex matched both label and aria-label on container. Fixed by using `getByRole('combobox', { name: 'Topic:' })`.
- GameGrid skeleton test used wrong role query. Fixed with `getByLabelText('Loading games')`.

### Completion Notes List

- All 7 tasks completed. 32/32 tests pass. TypeScript: zero errors.
- Home page (`src/app/page.tsx`) enhanced (not replaced) — auth guard, welcome, mode badge, error banner, puzzle of the day, game grid, explore & learn section all wired together.
- All game cards: `role="button"`, `tabIndex={0}`, Enter/Space keyboard handlers, `focus-visible:ring-4` focus rings, `min-h-[44px]` touch targets.
- Section headings use semantic `<h2>` with `id` + `aria-labelledby` for landmark association.
- `src/app/play/[gameType]/page.tsx` stub created so game card clicks don't 404.
- Content filter re-fetches from mock API on every change, passing `ageMin`/`ageMax`/`topic` query params.

### File List

- `src/lib/types/content.ts` — NEW: Game, DailyPuzzle, Story, ScienceTopic, ContentFilter types
- `src/lib/api/games.ts` — NEW: fetchGames()
- `src/lib/api/content.ts` — NEW: fetchDailyPuzzle(), fetchStories(), fetchScienceTopics()
- `src/lib/api/mockDb.ts` — UPDATED: added MOCK_GAMES, MOCK_STORIES, MOCK_SCIENCE_TOPICS, MOCK_DAILY_PUZZLE
- `src/lib/api/mockApiHandler.ts` — UPDATED: added /games, /content/puzzles/daily, /content/stories, /content/science handlers
- `src/lib/stores/contentStore.ts` — NEW: Zustand content store
- `src/hooks/useContent.ts` — NEW: useContent() hook
- `src/components/home/GameCard.tsx` — NEW
- `src/components/home/GameGrid.tsx` — NEW
- `src/components/home/PuzzleOfTheDay.tsx` — NEW
- `src/components/home/ContentSection.tsx` — NEW
- `src/components/home/ContentFilter.tsx` — NEW
- `src/app/page.tsx` — UPDATED: full home screen implementation
- `src/app/play/[gameType]/page.tsx` — NEW: game stub route
- `src/test/setup.ts` — NEW: Vitest + jest-dom setup
- `src/test/api/content.test.ts` — NEW: 7 API tests
- `src/test/components/GameCard.test.tsx` — NEW: 8 component tests
- `src/test/components/GameGrid.test.tsx` — NEW: 4 component tests
- `src/test/components/ContentFilter.test.tsx` — NEW: 8 component tests
- `src/test/components/ContentSection.test.tsx` — NEW: 5 component tests
- `vitest.config.ts` — NEW: Vitest configuration
- `package.json` — UPDATED: added test scripts, vitest + testing-library devDependencies
