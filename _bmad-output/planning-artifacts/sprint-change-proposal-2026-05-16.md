# Sprint Change Proposal — 2026-05-16
# Little Thinkers: Mobile-First UX Redesign, Design System & AI Integration

---

## Section 1: Issue Summary

### Problem Statement
After completing Epic 1 (all 7 stories, 289 unit tests, 70 E2E tests — all passing), the first live browser review at `localhost:3000` revealed a critical gap: **the application reads and feels like a traditional desktop website, not a mobile-first kids' game app.** Specifically:

- Navigation is a header bar — no bottom tab bar that mobile users expect
- Color palette is muted (warm yellows/oranges) — not the vibrant, saturated aesthetic kids expect from Roblox, Toca Life World, or Minecraft
- Game card grid (5 cards in 3+2) looks unbalanced on desktop
- Typography and spacing read as a content website, not a game app
- No design system or UX document existed when Epic 1 was built — functionality was correctly implemented but against no visual or interaction spec

### Discovery Context
Discovered 2026-05-16, immediately after Epic 1 completion. Kiran reviewed the app on desktop (Chrome) and mobile viewport (DevTools 430x932). No UX design artifacts existed in `_bmad-output/planning-artifacts/` — this was flagged in the epics.md as "No UX design document found."

### Reference Apps (2026 Benchmark)
- **Roblox / Minecraft**: World-based navigation, vibrant colors, avatar/mascot prominence, large playful UI
- **Toca Life World**: Tactile, colorful, no heavy text, exploratory by nature
- **Character.ai**: Character-driven, conversational AI integration, modern Gen-Z aesthetic
- **Partiful**: Fun, modern, emoji-forward, delightful micro-interactions
- **Instagram / Snapchat**: Bottom tab navigation, stories, profile-centric, persistent status indicators
- **Duolingo (benchmark for edtech)**: Streak prominently displayed, mascot personality, gamified progression, celebration moments

### Supporting Evidence
Screenshots 1–7 attached to the conversation (2026-05-16 7:45–7:47 AM). Key observations:
- Header-style nav (website pattern) vs. bottom tab bar (app pattern)
- "Challenge Mode" button without visual hierarchy context
- 5-game grid creates orphaned bottom row on desktop
- "Explore & Learn" section reads like a blog/website content feed

---

## Section 2: Impact Analysis

### Epic Impact

| Epic | Status | Impact |
|------|--------|--------|
| Epic 1 | Done | Functionality preserved. UI components need visual redesign (no rollback). |
| Epic 2 | Backlog | BLOCKED until design system exists — building parent zone on old design doubles rework. |
| Epic 3–6 | Backlog | All benefit from design system foundation being set now. |
| **Epic 7 (NEW)** | Backlog → **DO NEXT** | Mobile-First UX Redesign & Design System |
| **Epic 8 (NEW)** | Backlog | AI-Powered Adaptive Learning Integration |

### Story Impact (Epic 1 — rework only, no functional rollback)

| Story | Rework Needed |
|-------|---------------|
| 1.1 (Sign In) | Redesign login page to app-style, on-brand |
| 1.2 (Browse Content) | Redesign home screen with bottom tabs, vibrant game cards |
| 1.3 (Difficulty/Instructions) | Redesign game detail screen — more immersive, kid-friendly |
| 1.4 (Pause/Resume) | Redesign pause overlay — more game-like |
| 1.5 (Sparks/Brain Jar) | BrainJar widget visual upgrade — more celebration, animation |
| 1.6 (Badges/Map/Mascot) | Mascot needs personality; badge notifications need more delight |
| 1.7 (Accessibility/Settings) | Settings page needs app-style redesign |

### Artifact Conflicts

**PRD:**
- Missing: UX Design Principles section (mobile-first, kid-first)
- Missing: Design language constraints (typography, color, motion)
- Add: AI integration as a new FR set (FR62+)

**Architecture:**
- Missing: Navigation architecture (bottom tabs, route structure)
- Missing: Design token system specification
- Missing: Component library pattern (shared primitive components)
- Missing: AI integration architecture (adaptive engine, recommendation layer)

**UX Document:**
- Does not exist → Must be created as deliverable of Epic 7

**Tests:**
- Vitest component snapshot tests will need updates after visual redesign
- Playwright E2E tests use semantic locators (roles/labels) — will largely survive
- New visual regression tests should be added (Playwright screenshots)

---

## Section 3: Recommended Approach

### Hybrid Direct Adjustment

**Do NOT roll back Epic 1.** All business logic, state management, API layer, accessibility implementation, and tests are correct and represent significant value. The UI shell needs to be replaced, not the internals.

**Recommended sequence:**
1. **Epic 7: Mobile-First UX Redesign & Design System** — Execute NOW before Epic 2
2. **Epic 8: AI-Powered Adaptive Learning** — Execute after Epic 7, before Epic 3
3. Continue Epic 2 → 3 → 4 → 5 → 6 as planned, but built on the new design system

**Rationale:**
- Building Epic 2 (parent zone) on the current design means reworking it twice
- The design system is a foundation — every future story benefits from it being set now
- AI integration surfaces in child gameplay (Epic 1 area) AND parent dashboards (Epic 2) — planning it early prevents architectural conflicts
- Estimated cost of doing design system now vs. retrofitting after 5 more epics: 1x now vs. 3–4x later

**Effort estimate:** Medium (Epic 7: 3–4 stories, 2 sprints); Low (Epic 8 planning: 2 stories)
**Risk level:** Low — no rollback, additive only, tests guide regressions

---

## Section 4: Detailed Change Proposals

### 4A: New Epic 7 — Mobile-First UX Redesign & Design System

**Epic 7 Goal:** Establish a mobile-first, kid-friendly design system and apply it across all existing Epic 1 screens.

#### Story 7.1: Create Design System and UX Specification
Create a UX design document, design token system (colors, typography, spacing, motion), and shared primitive components.

**Acceptance Criteria:**
- UX Design document created at `_bmad-output/planning-artifacts/ux-design.md`
- Design tokens defined (brand colors, typography scale, spacing scale, animation durations)
- Tailwind v4 CSS variables configured for design tokens
- Primitive components: `Button`, `Card`, `Badge`, `Modal`, `Avatar` — all kid-friendly, min 44px touch targets
- Color palette: vibrant, high-contrast, WCAG AA compliant, inspired by Roblox/Toca Life World palette analysis
- Typography: Rounded, playful font (e.g., Nunito or Fredoka) for headings; readable for body text

#### Story 7.2: Implement Bottom Tab Navigation and App Shell
Replace header-nav website pattern with mobile app shell: bottom tab bar, status bar, no browser-style navigation.

**Acceptance Criteria:**
- Bottom tab bar with 5 tabs: **Home** (🏠), **Play** (🎮), **Learn** (📚), **Progress** (⭐), **Profile** (👤)
- Tab bar fixed at bottom, respects safe area insets (iOS notch/home indicator)
- Active tab highlighted with color + label; inactive tabs muted
- Header simplified to: app logo (left) + Spark counter (center) + profile avatar (right)
- No "Sign Out" in header — moved to Profile tab
- Smooth tab transitions (≤300ms)
- Desktop: sidebar navigation replaces bottom tabs at ≥768px breakpoint

#### Story 7.3: Redesign Home Screen and Game Cards
Redesign the home screen to feel like a kid's game portal, not a website. Fix game card grid.

**Acceptance Criteria:**
- Hero section: personalized greeting with mascot prominently displayed (not just text)
- "Today's Challenge" card: visually prominent, full-width, exciting — not a plain card
- Game cards: vibrant color per game type, large icon, bold name, no muted grays
- Grid: 2-column on mobile, 3-column on tablet, **add 6th game slot** OR redesign to 2+2+1 centered layout that looks intentional
- Brain Jar progress visible in the persistent header (always-on reward status)
- Streak counter visible in header alongside Sparks

#### Story 7.4: Redesign Gameplay, Progress, and Settings Screens
Apply the new design system to all remaining Epic 1 screens.

**Acceptance Criteria:**
- Game difficulty/instructions page: full-screen immersive card, large game icon, animated start button
- Gameplay page: game content takes 80% of screen; Brain Jar widget fixed at top; answer buttons large and vibrant
- My Progress page: World Map dominates; mascot shown large; badges in a celebratory grid
- Settings page: app-style list UI with toggle switches, no plain HTML checkboxes
- All screens: consistent padding/spacing from design token system
- Badge notification: full-screen celebration overlay with confetti animation

---

### 4B: New Epic 8 — AI-Powered Adaptive Learning

**Epic 8 Goal:** Integrate AI to personalize difficulty, provide hints, and surface insights for children and parents.

#### Story 8.1: AI Integration Architecture and Design Plan
Define the AI architecture, select models/services, and design the adaptive learning engine.

**Acceptance Criteria:**
- AI architecture document created
- Adaptive difficulty engine designed: tracks per-child performance patterns, adjusts question difficulty in real time
- AI hint system designed: "Think about it" prompt system that guides without giving answers
- AI-powered "Brain Report" designed: narrative progress summaries for parents
- Technology choice: Claude API (claude-haiku-4-5 for real-time hints, claude-sonnet-4-6 for reports)
- Privacy: AI receives anonymized child IDs only, no PII — COPPA compliant

#### Story 8.2: Implement AI Adaptive Difficulty and Hint System
Wire up the adaptive engine to gameplay and add the AI hint feature.

**Acceptance Criteria:**
- Gameplay adjusts difficulty after 3 consecutive correct/incorrect answers
- "Need a hint?" button appears after 10 seconds of no answer
- Hint is contextual, age-appropriate, uses Socratic method ("What do you know about X?")
- Hint generation uses Claude API with child's age range as context
- Hint usage tracked for parent reports
- Fallback to static hints if API unavailable

---

### 4C: Team Expansion

Add 4 new permanent named agents to the 12-agent team (total: 16 agents):

| Name | Role | Model | Responsibility |
|------|------|-------|----------------|
| **Chloe** | UX Engineer | Sonnet | Mobile-first UX design, user flows, interaction patterns, wireframes |
| **Theo** | UI Engineer | Sonnet | Design token implementation, component library, visual polish |
| **Aria** | AI Engineer | Opus | AI integration architecture, Claude API integration, adaptive learning design |
| **Jordan** | Marketing Lead | Opus | Mobile/gaming market analysis, engagement patterns, competitive benchmarking vs. Roblox/Duolingo/Toca |

**Additional roles (optional — add if needed):**
| Name | Role | Model | Responsibility |
|------|------|-------|----------------|
| **Zara** | Game Designer | Sonnet | Game mechanics, progression tuning, reward psychology |
| **Luca** | Motion Designer | Haiku | Micro-animations, celebration moments, transition specs |

**Updated TDD pipeline for Epic 7+ stories:**
`Chloe (UX) → Theo (UI) → Amara+Søren (QE parallel) → Anika (team meeting) → Mei+Marcus (Dev parallel) → Priya+Fatima+Mateus+Aria (review parallel) → QE validate → Alejandro BAT → Lindiwe sign-off → commit`

---

### 4D: Sprint Status Changes

**Add to `sprint-status.yaml`:**
```yaml
epic-7: backlog  # DO NEXT — before epic-2
7-1-create-design-system-and-ux-specification: backlog
7-2-implement-bottom-tab-navigation-and-app-shell: backlog
7-3-redesign-home-screen-and-game-cards: backlog
7-4-redesign-gameplay-progress-and-settings-screens: backlog
epic-7-retrospective: optional

epic-8: backlog  # DO AFTER EPIC 7 — before epic-2
8-1-ai-integration-architecture-and-design-plan: backlog
8-2-implement-ai-adaptive-difficulty-and-hint-system: backlog
epic-8-retrospective: optional
```

**Priority order update:**
Epic 7 → Epic 8 → Epic 2 → Epic 3 → Epic 4 → Epic 5 → Epic 6

---

### 4E: PRD Additions (New FRs)

```
FR62: The app uses a bottom tab navigation bar on mobile (Home, Play, Learn, Progress, Profile)
FR63: A persistent header displays the child's current Spark count and streak at all times during child sessions
FR64: All screens use a unified design token system (colors, typography, spacing, motion) for visual consistency
FR65: The app uses AI to adapt game difficulty in real time based on per-child performance patterns
FR66: The app provides AI-generated contextual hints during gameplay that guide without revealing answers
FR67: Parent Brain Reports include AI-generated narrative summaries of cognitive skill development
FR68: AI features use anonymized child IDs only and never transmit PII — fully COPPA compliant
```

---

## Section 5: Implementation Handoff

### Scope Classification: **MAJOR**

This change requires:
- New UX design artifacts (Chloe leads)
- New design token system implementation (Theo leads)
- Visual redesign of 7+ existing screens (Theo + Mei + Marcus execute)
- 2 new epics added to sprint-status.yaml
- PRD updated with 7 new FRs
- Architecture document updated with navigation and AI sections
- Team expanded by 4 agents

### Handoff Plan

| Agent | Responsibility |
|-------|---------------|
| **Lindiwe (PM)** | Approve this proposal and update priority order |
| **Yuki (Architect)** | Update architecture.md with navigation + AI + design token sections |
| **Chloe (UX)** | Lead Story 7.1 — UX Design Document + wireframes |
| **Theo (UI)** | Lead Story 7.2 — App shell and design tokens |
| **Aria (AI)** | Lead Story 8.1 — AI architecture design |
| **Alejandro (BA)** | Update PRD with FR62–FR68 |
| **Anika (Scrum)** | Update sprint-status.yaml with Epic 7 and Epic 8 entries |

### Success Criteria

- [ ] UX Design document committed to planning-artifacts
- [ ] Bottom tab navigation live and tested
- [ ] Home screen redesign passes all existing E2E tests + new visual regression tests
- [ ] All Epic 1 screens visually consistent with new design system
- [ ] AI hint system functional in gameplay with fallback
- [ ] 289+ existing Vitest tests still passing
- [ ] 70+ existing E2E tests still passing

---

## Approvals Required

- [ ] **Kiran (Product Owner)**: Approves Epic 7 and Epic 8 addition, team expansion, and priority reorder
- [ ] **Lindiwe (PM)**: Signs off on sprint scope change
- [ ] **Priya (Tech Lead)**: Confirms no architectural blockers

---

*Generated by bmad-correct-course workflow — 2026-05-16*
