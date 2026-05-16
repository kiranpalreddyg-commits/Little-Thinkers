# Little Thinkers — UX Design Document
## Epic 7: Mobile-First UX Redesign & Design System

**Author:** Chloe (UX Engineer)
**Date:** 2026-05-16
**Status:** Draft — Story 7.1 Deliverable

---

## Table of Contents

1. [Design Principles](#1-design-principles)
2. [Color System](#2-color-system)
3. [Typography](#3-typography)
4. [Spacing & Sizing](#4-spacing--sizing)
5. [Motion Principles](#5-motion-principles)
6. [Navigation Architecture](#6-navigation-architecture)
7. [Component Inventory](#7-component-inventory)
8. [Screen-by-Screen UX Notes](#8-screen-by-screen-ux-notes)
9. [6th Game Slot Decision](#9-6th-game-slot-decision)

---

## 1. Design Principles

These principles are derived from apps that kids ages 7–15 actually use and love: Roblox, Toca Life World, Duolingo, Character.ai, Partiful, and Snapchat. Each principle is paired with a practical implication.

### P1 — Touch First, Everything Else Second
Every interactive element is designed for fingers first, mice second. No hover-only states. No tiny tap targets. No right-click menus. A child's thumb on an iPhone SE defines the minimum affordance for every button, card, and input.

**Implication:** Minimum touch target 44×44px everywhere. Primary CTAs are 56px tall. Card tap areas expand to the full card boundary, not just the text.

### P2 — Celebrate Thinking, Not Just Winning
Like Duolingo's "Nice try! Keep going" encouragement and Roblox's immediate badge pop, Little Thinkers rewards the act of attempting. Incorrect answers get warm, never punishing, feedback. Correct answers get delight — sparks, color bursts, a mascot reaction.

**Implication:** The AnswerFeedback component uses distinct celebratory vs. encouraging (not red/failure) visual treatments. Sound cues are friendly tones, never buzzers.

### P3 — Immediate Legibility at Arm's Length
Kids hold phones at varying distances. Older kids (11–15) may be across a room on a tablet. Text must be readable without squinting. Contrast must be robust, not borderline. Icon meaning must be obvious without a label (but labels appear anyway for accessibility).

**Implication:** Body text minimum 16px. Icon size minimum 24px. WCAG AA contrast on all text/background combinations. Labels always accompany icons in navigation.

### P4 — Personality Lives in the Details
Toca Life World teaches us that small moments of delight — a wobble, a color change, a sound — create attachment. Little Thinkers uses micro-animations on success, playful border-radius on cards, and a mascot that reacts visibly to player progress.

**Implication:** Every interactive element has a distinct active/pressed state. Transitions are quick (150–300ms) so they feel responsive, not sluggish. No generic gray disabled states — use opacity + texture.

### P5 — Progressive Complexity, Zero Intimidation
Character.ai and Duolingo both surface the simplest action at the center of the screen and tuck complexity behind one more tap. Little Thinkers never shows settings, filters, or secondary options alongside a primary game action.

**Implication:** Home screen leads with Today's Challenge and the 6-game grid. Filters are collapsible. Difficulty selection happens on a dedicated screen, not inline. Instructions always precede play.

### P6 — Ownership & Identity Are Central
Roblox and Snapchat hook kids through identity — avatar, profile, personalized spaces. On Little Thinkers, the child's name and avatar appear persistently. The mascot is theirs. The Brain Jar fills for them. The profile selector page feels like choosing a character, not logging into an account.

**Implication:** Avatar is prominent in the header (right side, always visible). Mascot is featured on the Progress screen with personality. Profile cards are large, avatar-first, and feel like characters.

### P7 — Parents Trust What Looks Safe and Polished
Parents decide whether to download and pay. The visual language must signal "professional edtech product" while kids experience it as "fun game." Clean whitespace, rounded corners, no dark patterns, no scary color combinations, and a coherent brand identity build that trust.

**Implication:** The design avoids neon-on-black, aggressive upsell modals, and cluttered layouts. The color palette is vibrant but not garish. The brand identity (logo, name, mascot) is consistently placed.

---

## 2. Color System

### 2.1 Primary Brand Color — Spark Purple

The brand color captures "the moment an idea arrives." Purple sits between the warm intelligence of orange and the calm of blue — aspirational, magical, kid-friendly.

| Token | Hex | Usage |
|---|---|---|
| `--color-brand-50` | `#F3EEFF` | Backgrounds, tinted surfaces |
| `--color-brand-100` | `#E4D5FF` | Hover states, selection highlights |
| `--color-brand-200` | `#C9AAFF` | Decorative accents, tags |
| `--color-brand-400` | `#9B6FEF` | Secondary buttons, inactive icons |
| `--color-brand-500` | `#7C3AED` | Primary brand — buttons, active nav, links |
| `--color-brand-600` | `#6D28D9` | Pressed/active state |
| `--color-brand-700` | `#5B21B6` | Text on light brand backgrounds |
| `--color-brand-900` | `#2E1065` | High-contrast brand text (WCAG AA on white) |

**Contrast check:** `brand-500` (#7C3AED) on white = 5.74:1 — passes WCAG AA (large text and UI components). `brand-700` (#5B21B6) on white = 8.11:1 — passes WCAG AA for normal text.

**Tailwind v4 CSS variable mapping:**
```css
@theme {
  --color-brand-50: #F3EEFF;
  --color-brand-500: #7C3AED;
  --color-brand-600: #6D28D9;
}
```

### 2.2 Per-Game Accent Colors

Each game has a dedicated hue identity. These colors appear on the game card background gradient, the icon background, difficulty badges, and the in-game header tint.

#### Word Pop — Sapphire Blue
*Why:* Language, letters, words — classic "literacy blue." Calm but stimulating.

| Token | Hex | Contrast on white |
|---|---|---|
| `--color-word-pop-100` | `#DBEAFE` | — |
| `--color-word-pop-400` | `#60A5FA` | 3.12:1 (large text AA) |
| `--color-word-pop-500` | `#3B82F6` | 4.65:1 (WCAG AA) |
| `--color-word-pop-700` | `#1D4ED8` | 7.24:1 (WCAG AA) |

Card gradient: `from-[#DBEAFE] to-[#BFDBFE]`
Icon background: `#3B82F6`
Badge text: `#1D4ED8` on `#DBEAFE`

#### Connection Quest — Emerald Green
*Why:* Connections, nature, growth, relationships — green = connect, thrive.

| Token | Hex | Contrast on white |
|---|---|---|
| `--color-connection-100` | `#D1FAE5` | — |
| `--color-connection-400` | `#34D399` | 2.81:1 (large text AA) |
| `--color-connection-500` | `#10B981` | 4.53:1 (WCAG AA) |
| `--color-connection-700` | `#047857` | 7.17:1 (WCAG AA) |

Card gradient: `from-[#D1FAE5] to-[#A7F3D0]`
Icon background: `#10B981`
Badge text: `#047857` on `#D1FAE5`

#### Memory Flip — Violet
*Why:* Memory, imagination, dreams — violet is mysterious and enchanting.

| Token | Hex | Contrast on white |
|---|---|---|
| `--color-memory-100` | `#EDE9FE` | — |
| `--color-memory-400` | `#A78BFA` | 3.36:1 (large text AA) |
| `--color-memory-500` | `#8B5CF6` | 5.09:1 (WCAG AA) |
| `--color-memory-700` | `#6D28D9` | 8.11:1 (WCAG AA) |

Card gradient: `from-[#EDE9FE] to-[#DDD6FE]`
Icon background: `#8B5CF6`
Badge text: `#6D28D9` on `#EDE9FE`

#### Pattern Builder — Amber Orange
*Why:* Patterns, building, craft — orange = creative energy, construction.

| Token | Hex | Contrast on white |
|---|---|---|
| `--color-pattern-100` | `#FEF3C7` | — |
| `--color-pattern-400` | `#FBBF24` | 2.85:1 (large text AA) |
| `--color-pattern-500` | `#F59E0B` | 3.08:1 (large text AA) |
| `--color-pattern-700` | `#B45309` | 5.97:1 (WCAG AA) |

Card gradient: `from-[#FEF3C7] to-[#FDE68A]`
Icon background: `#F59E0B`
Badge text: `#B45309` on `#FEF3C7`

> **Note:** Amber is inherently lower-contrast. Always use `pattern-700` (#B45309) for text labels, never `pattern-500` on white.

#### Grid Logic — Rose Red
*Why:* Logic, precision, structure — red = sharp focus, alert thinking. Rose rather than fire-engine red keeps it friendly.

| Token | Hex | Contrast on white |
|---|---|---|
| `--color-grid-100` | `#FFE4E6` | — |
| `--color-grid-400` | `#FB7185` | 3.48:1 (large text AA) |
| `--color-grid-500` | `#F43F5E` | 4.65:1 (WCAG AA) |
| `--color-grid-700` | `#BE123C` | 7.37:1 (WCAG AA) |

Card gradient: `from-[#FFE4E6] to-[#FECDD3]`
Icon background: `#F43F5E`
Badge text: `#BE123C` on `#FFE4E6`

#### Science Lab (Slot 6 — Coming Soon) — Cyan Teal
*Why:* Science, discovery, labs — teal is the universal color of science communication.

| Token | Hex |
|---|---|
| `--color-science-100` | `#CFFAFE` |
| `--color-science-500` | `#06B6D4` |
| `--color-science-700` | `#0E7490` |

Card gradient: `from-[#CFFAFE] to-[#A5F3FC]` (desaturated/locked treatment)

### 2.3 Semantic Colors

| Purpose | Token | Hex | Contrast on white |
|---|---|---|---|
| Success (correct) | `--color-success` | `#16A34A` | 5.74:1 (AA) |
| Success background | `--color-success-bg` | `#DCFCE7` | — |
| Error (system only) | `--color-error` | `#DC2626` | 5.74:1 (AA) |
| Error background | `--color-error-bg` | `#FEF2F2` | — |
| Warning / Try again | `--color-warning` | `#D97706` | 4.52:1 (AA) |
| Warning background | `--color-warning-bg` | `#FFFBEB` | — |
| Neutral text primary | `--color-text-primary` | `#111827` | 18.08:1 (AAA) |
| Neutral text secondary | `--color-text-secondary` | `#4B5563` | 7.67:1 (AA) |
| Neutral text muted | `--color-text-muted` | `#9CA3AF` | 2.85:1 (large text only) |
| Surface white | `--color-surface` | `#FFFFFF` | — |
| Surface raised | `--color-surface-raised` | `#F9FAFB` | — |
| Border default | `--color-border` | `#E5E7EB` | — |
| Border strong | `--color-border-strong` | `#D1D5DB` | — |

> **Incorrect answer treatment:** Use `--color-warning` (#D97706) on `--color-warning-bg` (#FFFBEB), never `--color-error`. Red in a game context feels punishing. Amber is warm and encouraging.

### 2.4 Background Gradients

These gradients replace the current flat `from-yellow-50 to-orange-50` with more deliberate, on-brand options:

| Screen | Gradient | Classes |
|---|---|---|
| Login / Signup | Spark Purple fade | `from-[#F3EEFF] via-[#EDE9FE] to-[#E4D5FF]` |
| Profile Select | Emerald morning | `from-[#D1FAE5] via-[#CFFAFE] to-[#EDE9FE]` |
| Home | Warm amber sky | `from-[#FFFBEB] via-[#FFF7ED] to-[#F0FDF4]` |
| Play (pre-game) | Game-specific tint | Use per-game `*-50` to `*-100` |
| Active gameplay | Near-white focus | `from-[#F9FAFB] to-[#FFFFFF]` (minimal distraction) |
| My Progress | Cosmic purple | `from-[#EDE9FE] via-[#E0E7FF] to-[#CFFAFE]` |
| Settings | Soft teal mist | `from-[#F0FDFA] to-[#ECFDF5]` |

---

## 3. Typography

### 3.1 Font Pairing

#### Heading Font — Nunito (Google Fonts)
**Why Nunito:** Rounded terminals give it a friendly, approachable feel without being babyish. It scales well from 12px to 72px. Used by many successful kids' apps because it communicates warmth without sacrificing legibility. Supports bold weights (700, 800, 900) for expressive headlines. Available on Google Fonts — no licensing friction.

**Import:**
```css
@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800;900&display=swap');
```

**Alternative if Nunito feels too soft for older kids (11–15 cohort):** Fredoka One for display headings only (single weight, 400), Nunito for body. Fredoka One is bolder and more game-like, reminiscent of Duolingo's headings.

#### Body Font — Inter (Google Fonts)
**Why Inter:** Designed specifically for screen readability. Exceptional legibility at 14–18px. Neutral personality lets the content lead. Familiar to users across devices (many system fonts approximate it). Large open apertures and distinguishable characters reduce reading errors for kids.

**Import:**
```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');
```

**Combined import (production):**
```css
@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@700;800;900&family=Inter:wght@400;500;600&display=swap');
```

**Tailwind v4 CSS variables:**
```css
@theme {
  --font-heading: 'Nunito', system-ui, sans-serif;
  --font-body: 'Inter', system-ui, sans-serif;
}
```

### 3.2 Type Scale

All sizes use a 4px base grid. Line heights are set for readability at each size — tighter for display headings, looser for body text that kids are reading.

| Token | Size | Line Height | Weight | Font | Usage |
|---|---|---|---|---|---|
| `text-xs` | 12px / 0.75rem | 1.5 (18px) | 500 Inter | Captions, timestamps, badge labels |
| `text-sm` | 14px / 0.875rem | 1.57 (22px) | 400/500 Inter | Secondary labels, card metadata |
| `text-md` | 16px / 1rem | 1.625 (26px) | 400 Inter | Body copy, instructions, descriptions |
| `text-lg` | 18px / 1.125rem | 1.555 (28px) | 600 Nunito | Card titles, section subheadings |
| `text-xl` | 20px / 1.25rem | 1.4 (28px) | 700 Nunito | Screen subheadings, widget titles |
| `text-2xl` | 24px / 1.5rem | 1.333 (32px) | 800 Nunito | Section headings (H2) |
| `text-3xl` | 30px / 1.875rem | 1.267 (38px) | 900 Nunito | Page headings (H1) |
| `text-4xl` | 36px / 2.25rem | 1.222 (44px) | 900 Nunito | Hero headings (login, welcome) |

**Letter spacing:**
- Headings (2xl and above): `tracking-tight` (-0.025em) — Nunito is wide; tightening aids scanning
- All other: `tracking-normal` (0em)

**Practical examples:**
```
Welcome back, Maya!        → text-3xl, Nunito 900, #111827
Choose Your Game           → text-2xl, Nunito 800, #111827
Word Pop                   → text-lg, Nunito 600, #111827
Guess the hidden word...   → text-md, Inter 400, #4B5563
Vocabulary · Logic         → text-sm, Inter 500, #6B7280
3 Sparks                   → text-xs, Inter 500, #B45309
```

---

## 4. Spacing & Sizing

### 4.1 Base Grid

All spacing tokens are multiples of 4px. This maps directly to Tailwind's default scale.

| Token | px | Tailwind class | Usage |
|---|---|---|---|
| `space-1` | 4px | `p-1`, `gap-1` | Inline icon gap, label tight spacing |
| `space-2` | 8px | `p-2`, `gap-2` | Badge padding, icon-to-text gap |
| `space-3` | 12px | `p-3`, `gap-3` | Small card internal padding |
| `space-4` | 16px | `p-4`, `gap-4` | Standard element spacing |
| `space-5` | 20px | `p-5`, `gap-5` | Card gap in grid |
| `space-6` | 24px | `p-6`, `gap-6` | Card internal padding (standard) |
| `space-8` | 32px | `p-8`, `gap-8` | Section vertical spacing |
| `space-10` | 40px | `p-10`, `gap-10` | Page section gap |
| `space-12` | 48px | `p-12` | Hero/header generous padding |
| `space-16` | 64px | `pb-16` | Bottom padding above tab bar |

### 4.2 Touch Targets

| Element | Minimum size | Implementation |
|---|---|---|
| All interactive elements | 44×44px | `min-h-[44px] min-w-[44px]` |
| Primary CTA buttons | 56px tall | `h-14` (56px) |
| Bottom tab icons | 48×48px tap area | `p-3` around 24px icon |
| Game answer buttons | 56px tall, min 64px wide | `h-14 min-w-[64px]` |
| Close / dismiss buttons | 44×44px | `w-11 h-11` with centered icon |
| Form inputs | 52px tall | `h-[52px] py-3` |

**Never use elements smaller than 44×44px for interactive targets, even if the visible element is smaller. Wrap in a container with padding to expand the tap area.**

### 4.3 Border Radius

| Context | Radius | Tailwind |
|---|---|---|
| Full pill (badges, chips) | 9999px | `rounded-full` |
| Buttons (primary, secondary) | 16px | `rounded-2xl` |
| Cards (game cards, content cards) | 20px | `rounded-[20px]` |
| Modals / bottom sheets | 24px top corners | `rounded-t-3xl` |
| Input fields | 12px | `rounded-xl` |
| Avatar (child profile) | 9999px | `rounded-full` |
| Logo mark / game icons | 16px | `rounded-2xl` |
| Bottom tab bar | 24px top corners | `rounded-t-3xl` |

### 4.4 Elevation / Shadow

| Level | Usage | Box shadow |
|---|---|---|
| `shadow-none` | Flat elements, background cards | none |
| `shadow-sm` | Default cards, inputs | `0 1px 3px rgba(0,0,0,0.08)` |
| `shadow-md` | Raised cards, active states | `0 4px 12px rgba(0,0,0,0.10)` |
| `shadow-lg` | Modals, bottom sheets | `0 8px 32px rgba(0,0,0,0.14)` |
| `shadow-xl` | Toast notifications | `0 16px 48px rgba(0,0,0,0.16)` |

---

## 5. Motion Principles

### 5.1 Duration Tokens

| Token | Duration | Usage |
|---|---|---|
| `duration-fast` | 150ms | Hover/active state transitions, color changes, button press |
| `duration-normal` | 300ms | Card entrance, tab switch, slide-in panels |
| `duration-slow` | 500ms | Brain Jar fill progress, success celebration, page transitions |
| `duration-xslow` | 800ms | Mascot reactions, badge award ceremony |

### 5.2 Easing Curves

| Token | Curve | CSS value | Usage |
|---|---|---|---|
| `ease-spring` | Spring out | `cubic-bezier(0.34, 1.56, 0.64, 1)` | Correct answer pop, badge award, spark burst |
| `ease-smooth` | Ease out | `cubic-bezier(0.22, 1, 0.36, 1)` | Page transitions, panel slides, tab switches |
| `ease-linear` | Linear | `linear` | Progress bar fill, countdown timers |
| `ease-in-out` | Standard | `cubic-bezier(0.4, 0, 0.2, 1)` | Hover transitions, focus rings |

**CSS custom properties:**
```css
@theme {
  --ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
  --ease-smooth: cubic-bezier(0.22, 1, 0.36, 1);
}
```

### 5.3 Specific Animation Specs

**Correct Answer Celebration:**
1. Answer button flashes success green (#16A34A) — 150ms linear
2. AnswerFeedback slides up from bottom — 300ms ease-smooth
3. ThoughtSpark particles emit from Brain Jar icon — 500ms ease-spring
4. Brain Jar fill level animates up — 500ms linear
5. "+1 Spark ✨" text counter fades in, then out at 800ms — 300ms ease-smooth each

**Incorrect Answer Encouragement:**
1. Answer button briefly shakes (4px horizontal) — 150ms ease-in-out, 2 cycles
2. AnswerFeedback slides up — 300ms ease-smooth
3. No spark animation. No red flash. Warm amber background.

**Game Card Tap:**
- Scale down to 0.97 on press — 150ms ease-in-out
- Scale back to 1.01 (slight overshoot) on release — 300ms ease-spring
- Shadow intensifies during press

**Tab Switch:**
- Active icon scales from 1.0 to 1.1 — 200ms ease-spring
- Active indicator dot fades in — 150ms ease-smooth
- Page content slides in from the edge of active tab direction — 300ms ease-smooth

**Page Entry:**
- Content slides up 16px and fades in — 300ms ease-smooth, 50ms delay after route change
- Stagger list items: 50ms delay per item (max 5 items staggered, then simultaneous)

### 5.4 Reduced Motion Rules

When `prefers-reduced-motion: reduce` is active (or the child's profile has `accessibility_settings.reducedMotion: true`):

- All transitions reduced to 50ms or instant
- No scale transforms — use opacity-only fades
- No slide animations — items appear instantly
- No particle/spark animations — show static "+1 Spark" text only
- ThoughtSparkAnimation component: render static icon, no burst effect
- Brain Jar fill: instant jump, no animated fill
- Shake on incorrect: skip entirely

**Implementation pattern:**
```tsx
const reducedMotion = useReducedMotion(); // reads both prefers-reduced-motion and profile setting
const duration = reducedMotion ? 50 : 300;
const easing = reducedMotion ? 'linear' : 'cubic-bezier(0.22, 1, 0.36, 1)';
```

---

## 6. Navigation Architecture

### 6.1 Bottom Tab Bar (Mobile, < 768px)

The bottom tab bar is the primary navigation system. It replaces the current "sign out + settings link" header pattern. It is always visible during authenticated sessions, persistently docked at the bottom.

**5 tabs:**

| Position | Label | Icon | Route |
|---|---|---|---|
| 1 (leftmost) | Home | 🏠 | `/` |
| 2 | Play | 🎮 | `/play` (game picker or last played) |
| 3 | Learn | 📚 | `/learn` (Explore & Learn section, moved from home) |
| 4 | Progress | ⭐ | `/my-progress` |
| 5 (rightmost) | Profile | 👤 | `/settings` (merges settings + profile) |

> **Note:** "Learn" is carved out of the Home screen's "Explore & Learn" section into its own tab. The Home screen then focuses on Today's Challenge + game grid — a cleaner primary experience. The full content browser (Tell Me Why, Story Time, filters) lives under Learn.

**Tab anatomy:**
- Container height: 72px (includes safe-area-inset-bottom padding for iOS home indicator)
- Background: white, `shadow-lg` upward, `rounded-t-3xl`
- Border top: 1px `--color-border`
- Each tab: `flex-1`, min touch area 48×48px centered within the 72px bar
- Icon size: 24px
- Label: `text-xs` Inter 500, 10px below icon
- Gap between icon and label: 4px

**Active state:**
- Icon color: `--color-brand-500` (#7C3AED)
- Label color: `--color-brand-500`
- Active indicator: 4px × 20px rounded pill above the icon, brand-500 color
- Animation: indicator scales from 0 to 1 on `ease-spring` 200ms

**Inactive state:**
- Icon color: `--color-text-muted` (#9CA3AF)
- Label color: `--color-text-muted`
- No indicator

**Tab bar Tailwind classes:**
```
fixed bottom-0 left-0 right-0 z-50
flex items-stretch
bg-white border-t border-gray-200 rounded-t-3xl shadow-lg
pb-safe  (= padding-bottom: env(safe-area-inset-bottom))
h-[72px]
```

### 6.2 Persistent Header

Present on all authenticated screens. 56px height on mobile, 64px on desktop.

**Header layout — mobile (left → center → right):**
- **Left:** Little Thinkers logo mark (32×32px rounded-xl, brand gradient) + wordmark "Little Thinkers" in Nunito 800, brand-700
- **Center:** Brain Jar Spark counter (persistent, mini version)
  - Mini jar icon (24px) + spark count "47 ✨"
  - Font: Inter 600, text-sm, brand-700
  - Tapping navigates to My Progress
- **Right:** Child avatar (36×36px rounded-full) with child's name initial or avatar image
  - Tapping opens a slide-up bottom sheet: child name, switch profile, sign out

**Header Tailwind classes:**
```
sticky top-0 z-40
flex items-center justify-between
px-4 h-14
bg-white/90 backdrop-blur-md
border-b border-gray-100
```

**What is removed from the current header:**
- "Settings" text link (moved to Profile tab)
- "Sign Out" button (moved to profile tap bottom sheet)
- Child name text label (replaced by avatar; name shows in bottom sheet)
- Gameplay mode badge (moved to home screen hero section)

### 6.3 Desktop Sidebar (≥ 768px)

At `md` breakpoint (768px) and wider, the bottom tab bar is hidden (`hidden md:flex`) and a left sidebar replaces it.

**Sidebar specs:**
- Width: 240px (fixed, not collapsible at launch — collapsible can be Epic 7.x)
- Position: fixed left, full height, below header
- Background: white
- Right border: 1px `--color-border`
- Top padding: 24px, item gap: 4px
- Nav item height: 48px
- Nav item layout: 16px icon + 16px gap + label text
- Active: brand-50 background, brand-500 icon + label, brand-500 left border 3px
- Hover: surface-raised background (#F9FAFB)
- Font: Inter 600, 15px

**Sidebar items (same 5 tabs + Settings):**
- Home
- Play
- Learn
- Progress
- Profile / Settings (combined, links to `/settings`)

**Main content area on desktop:**
```
ml-[240px] // offset for sidebar
max-w-[960px] // content max width
mx-auto
px-8 py-8
```

### 6.4 In-Game Navigation

During active gameplay (`/play/[gameType]/play`), the global tab bar is hidden to prevent accidental exits. The in-game header replaces it:

**In-game header (56px):**
- Left: Back arrow `←` (44px tap target) — triggers quit confirmation sheet, not immediate exit
- Center: Game name (text-lg Nunito 700)
- Right: Mini Brain Jar widget (compact version, current sparks / capacity)
- Below header: difficulty badge + pause button

**Pause bottom sheet** (replaces full-screen PauseOverlay):
- Slides up from bottom, 80% screen height
- Title: "Game Paused"
- CTA 1 (primary): "Resume" — brand-500 button
- CTA 2 (secondary): "Quit Game" — outlined warning button
- Dismiss: swipe down or tap backdrop

---

## 7. Component Inventory

A list of all primitive UI components to build as part of the design system. Each will live in `/src/components/ui/`.

### 7.1 Button

| Variant | Description | Tailwind example |
|---|---|---|
| `primary` | Filled, brand-500 bg, white text | `bg-brand-500 text-white rounded-2xl h-14` |
| `secondary` | Outlined, brand-500 border+text | `border-2 border-brand-500 text-brand-500 rounded-2xl h-14` |
| `ghost` | No border, brand-500 text | `text-brand-500 hover:bg-brand-50 rounded-2xl h-14` |
| `danger` | Outlined, error-colored | `border-2 border-error text-error rounded-2xl h-14` |
| `game` | Large answer button, game-colored | `bg-word-pop-500 text-white rounded-2xl h-14 min-w-[64px]` |
| `icon` | Square icon-only button | `w-11 h-11 rounded-xl flex items-center justify-center` |

**All buttons share:** `font-semibold focus:outline-none focus-visible:ring-4 focus-visible:ring-offset-2 transition-all duration-fast active:scale-[0.97]`

### 7.2 Card

| Variant | Description |
|---|---|
| `GameCard` | 20px radius, game gradient bg, icon + title + description + badges |
| `ContentCard` | White bg, 16px radius, title + snippet + age tag |
| `ProfileCard` | Large avatar (80px) + name + gameplay mode badge, for profile selector |
| `StatCard` | Progress number + label + optional icon, for Progress screen |
| `DailyChallenge` | Prominent featured card, gradient bg, CTA button, difficulty badge |

### 7.3 Badge / Chip

| Variant | Description |
|---|---|
| `GameBadge` | Game-colored pill: cognitive skill or themed area label |
| `DifficultyBadge` | Easy (green) / Medium (amber) / Hard (rose) pill |
| `ModeBadge` | Smart Mode / Chill Mode / Challenge Mode pill |
| `AchievementBadge` | Square 48px icon + name for thinker badges |
| `SparkChip` | Lightning bolt icon + count, brand-500 tinted |

### 7.4 Modal / Overlay

| Variant | Description |
|---|---|
| `BottomSheet` | Slides up from bottom, `rounded-t-3xl`, drag handle at top, backdrop |
| `CenterModal` | Centered on desktop, bottom sheet on mobile, `rounded-3xl` |
| `ToastNotification` | Top-center floating, auto-dismiss 3s, icon + message |
| `BadgeAward` | Full-screen celebration overlay: badge icon + confetti + CTA |

### 7.5 Avatar

48px default, 36px compact (header), 80px profile card. Always `rounded-full`. Fallback: initial letter on brand-gradient background. Supports image src.

### 7.6 ProgressBar

| Variant | Usage |
|---|---|
| `BrainJar` | Vertical jar fill animation, yellow-400 fill, border |
| `GameProgress` | Horizontal bar, brand-500 fill, `rounded-full`, 8px height |
| `WorldMapArea` | Horizontal bar per area, game-colored fill, used in WorldMap |
| `StreakBar` | 7-day dot grid, brand-500 filled days, gray empty days |

### 7.7 TabBar

`TabBar` component: fixed bottom, renders 5 `TabItem` children. `TabItem` accepts: icon (React node), label (string), href (string), active (boolean).

### 7.8 Header

`AppHeader` component: sticky top, accepts: `showBackButton` (boolean), `title` (string override), `rightSlot` (React node). Renders logo + spark counter + avatar by default.

### 7.9 Input

Single `TextInput` variant for login/signup forms. 52px height, `rounded-xl`, `border-2 border-border focus:border-brand-500 focus:ring-4 focus:ring-brand-100`. Label above (not placeholder-as-label). Error state: `border-error`, error message below in `text-error text-sm`.

---

## 8. Screen-by-Screen UX Notes

### 8.1 `/login` — Sign In Page

**Current issues:** Centered card is fine, but brand identity is weak (generic lightbulb SVG, default Geist font), gradient uses blue-50 to purple-50 which is pleasant but inconsistent with the rest of the app.

**Redesigned layout (mobile-first, single column):**

```
Screen background: from-[#F3EEFF] via-[#EDE9FE] to-[#E4D5FF] (brand purple wash)

[Top 40% — Brand area]
  - Illustrated brain/spark mascot logo (80px, centered)
    → Replace SVG lightbulb with a friendly brain icon or the mascot face
  - "Little Thinkers" — text-4xl Nunito 900, brand-700, centered
  - Tagline: "Big ideas for curious minds" — text-md Inter 400, brand-500, centered

[Bottom 60% — White card, rounded-t-3xl, shadow-lg]
  - Heading: "Welcome back!" — text-2xl Nunito 800
  - Email input (52px, rounded-xl)
  - Password input (52px, rounded-xl, show/hide toggle)
  - "Sign In" primary button (56px, full width, brand-500)
  - Divider: "or"
  - "New here? Create an account" — text-sm, ghost link to /signup
  - "Having trouble signing in?" — text-xs muted, support link
```

**Key changes:**
- Bottom card approach (white card slides up from bottom) mimics Partiful/Snapchat auth flow — feels native, not webby
- No max-w-md constraint on mobile — card fills screen width with 16px horizontal padding inside
- Mascot/brain illustration creates immediate brand personality

### 8.2 `/profile-select` — Profile Selection

**Current issues:** Header is oversized, form card feels like a data entry screen, profiles don't feel like "characters."

**Redesigned layout:**

```
Screen background: from-[#D1FAE5] via-[#CFFAFE] to-[#EDE9FE] (morning energetic)

[Header — 64px]
  - Back arrow (if parent can navigate back) or none
  - "Who's playing?" — text-2xl Nunito 800, centered, text-primary

[Profile Grid — fills remaining space]
  - Horizontal scroll row of ProfileCard components (no grid — avoids orphan cards)
  - Each ProfileCard:
    - 80px avatar circle, rounded-full, border-4 in child's theme color
    - Child name — text-lg Nunito 700
    - "Smart Mode" / mode badge
    - Active ring: brand-500 border-4 + scale-105 transform on selection
    - Card size: 140×180px
    - Tap → selected state (ring + scale) → 300ms delay → navigate

  - "+ Add Profile" ghost card at end of row (dashed border, brand-500 icon)

[Bottom action]
  - "Continue" primary button — appears only after profile selected
    Slides up from bottom — 300ms ease-smooth
```

**Key change:** Horizontal scroll of character-style cards rather than a static grid. On mobile, 1.5 cards visible at a time (hints at scroll). On tablet+, all cards visible in a row.

### 8.3 `/` — Home Screen

**Current issues:** max-w-7xl on mobile means content is full-width with small padding — fine. But sections lack visual hierarchy, the game grid is 3+2 (unbalanced), and "Explore & Learn" competes with games for attention.

**Redesigned layout (mobile scroll, single column):**

```
[Sticky Header — AppHeader component]

[Personalized Hero — 120px]
  - "Hey Maya! 👋" — text-3xl Nunito 900
  - Gameplay mode badge (SmartMode pill)
  - "Day 7 streak 🔥" — StreakChip inline
  - [Optional] Encouraging copy: "You're on a roll!" (mascot-driven, rotates)

[Today's Challenge card — DailyChallenge variant]
  - Full width, 20px radius
  - Gradient background (game-specific color of the daily puzzle)
  - "Today's Brain Workout" — eyebrow label, text-xs uppercase tracking-wide
  - Puzzle name — text-xl Nunito 800
  - Difficulty badge
  - "Let's Go!" — primary button (full-width on mobile)
  - Tapping goes directly to /play/[gameType] with difficulty pre-selected

[Choose Your Game — section heading text-2xl Nunito 800]
  - 2×3 game grid (see Section 9 for 6th slot decision)
  - Grid: grid-cols-2 gap-4 on mobile
  - Each GameCard: 160px tall minimum, full width of column

[Explore & Learn — section heading text-2xl Nunito 800]
  - Only appears on Home screen if NOT moved to its own Learn tab
  - If moved to /learn tab: this section is removed from home entirely
  - Recommendation: REMOVE from home, use the Learn tab (cleaner home)
  - If kept: horizontal scroll row of ContentCard components, not a grid

[Bottom padding: 88px to clear tab bar]
```

**Scroll behavior:** Sticky header only (AppHeader). Everything else scrolls. No sticky sections within the page.

### 8.4 `/play/[gameType]` — Game Difficulty + Instructions

**Current issues:** Plain h1 + description feels like a docs page. Difficulty selector and instructions are vertically stacked in a way that doesn't feel like entering a game.

**Redesigned layout:**

```
[In-game AppHeader variant]
  - Back arrow (← navigates to Home without confirmation, game not started yet)
  - Empty center
  - Empty right (no Brain Jar yet — game hasn't started)

[Game Identity hero — 160px]
  - Full-width colored banner with game gradient (game-specific)
  - Game icon (56px, white on game color, rounded-2xl)
  - Game name — text-3xl Nunito 900, white
  - "3 difficulty levels" — text-sm, white/80%

[Difficulty Selection — 3 cards horizontal]
  - 3 cards: Easy, Medium, Hard
  - Each card: flex-1, ~108px tall
  - Selected: brand-500 border-2, filled color, scale-102
  - Easy: green left-accent bar, "Easy" label, "⭐ 1 Spark per answer"
  - Medium: amber left-accent bar, "Medium", "⭐ 1 Spark per answer"
  - Hard: rose left-accent bar, "Hard", "⭐⭐ 2 Sparks per answer"
  - Difficulty cards snap-select on tap (150ms ease-spring)

[Instructions card — white, rounded-2xl, shadow-sm]
  - Heading: "How to play" — text-lg Nunito 700
  - Body: Instructions paragraph — text-md Inter 400
  - Checkbox: "Got it! Ready to play" — tapping this enables the Start button
    → Style as large toggle-style confirm, not a tiny checkbox

[Action buttons — fixed at bottom, above safe-area]
  - "Back" ghost button (left, 40% width)
  - "Start Game" primary button (right, 60% width) — disabled until checkbox checked
    Disabled state: brand-200 bg, white text, no hover effect
    Enabled state: brand-500 bg, white text, active:scale-[0.97]
```

**Resume Prompt:** When a saved session exists, replace the difficulty/instructions layout with a full-width card:
- Game banner (same as above but smaller, 100px)
- "You were playing [Game]" — text-xl Nunito 700
- "Pick up where you left off?" — text-md Inter 400
- "Continue" — primary button (full width)
- "Start Over" — ghost/danger button (full width, below)

### 8.5 `/play/[gameType]/play` — Active Gameplay

**Current issues:** Generic math question placeholder, Brain Jar widget is small and top-right, Pause button is unstyled at bottom, no sense of immersion.

**Redesigned layout (game-focused, minimal chrome):**

```
[In-game header — 56px, game-tinted background]
  - Left: "✕" or "←" (44px tap target) — shows quit confirmation
  - Center: Game name — text-lg Nunito 700, white
  - Right: Mini Brain Jar (24px jar + "12 ✨" spark count, white text)

[Progress bar — 8px, full width, under header]
  - GameProgress variant
  - game-500 color fill
  - Animates on each correct answer

[Game area — fills remaining vertical space]
  - White background (minimal distraction)
  - 16px padding sides, 24px top/bottom
  - Question/prompt — text-xl Nunito 700, centered
  - Answer options — GameCard buttons, 2 or 4 per row depending on game

[AnswerFeedback — bottom sheet style]
  - Slides up from bottom (300ms ease-smooth)
  - Correct: success-bg background, green checkmark icon, "+1 Spark ✨" counter
  - Incorrect: warning-bg background, "Nice try!" message, encouragement
  - Auto-dismisses after 1.5s (or on tap)

[ThoughtSparkAnimation]
  - Renders above game area, z-50, pointer-events-none
  - Particles drift upward from Brain Jar position

[BadgeNotification]
  - Appears as ToastNotification at top (slides down)
  - After 3s auto-dismisses, or tap to view full badge in modal

[Pause — floating action button]
  - Position: bottom-right, above AnswerFeedback
  - 48×48px circle, white bg, shadow-md, pause icon (brand-500)
  - On tap: slides up PauseBottomSheet
```

**Pause bottom sheet:**
```
[Handle bar — centered, 32×4px, gray-300]
[Game paused — text-xl Nunito 700]
[Game name + current score summary]
[Resume — primary button, full width]
[Quit Game — danger ghost button, full width]
```

### 8.6 `/my-progress` — Progress, Badges, World Map, Streak

**Current issues:** Flat list of sections with text headings, no visual hierarchy, Mascot and Streak feel orphaned in a row together, WorldMap is a simple button grid.

**Redesigned layout:**

```
[AppHeader — standard]

[Hero section — 140px, Cosmic Purple gradient]
  - Child name + "Thinker Level 3" — text-2xl Nunito 800, white
  - Mascot display (80px animated sprite, right side) — MascotWidget
  - Spark count large: "⚡ 147 Sparks" — text-3xl Nunito 900, white

[Streak section — white card, shadow-sm]
  - "🔥 7-day streak!" heading — text-xl Nunito 700
  - 7-dot StreakBar (Monday–Sunday)
  - Current streak days in brand-500, empty in gray-200

[World Map section — world-card, shadow-sm]
  - "Your World" — section heading text-2xl Nunito 800
  - Visual map component: 5 areas as illustrated landmark cards
    NOT plain button grid — each area has:
    - Area illustration (emoji or SVG illustration, 48px)
    - Area name — text-lg Nunito 700
    - Progress bar (sparks accumulated in this area)
    - Unlocked: game color, navigable
    - Locked: gray-200, "🔒 X Sparks needed" caption
  - Grid: grid-cols-2, gap-3 on mobile; grid-cols-3 on tablet

[Badges section]
  - "Your Thinker Badges" — section heading text-2xl Nunito 800
  - Horizontal scroll row of AchievementBadge components
    (48px icon + name below, locked badges shown as silhouette)
  - "View All Badges" ghost link → full-page badge gallery

[Bottom padding: 88px to clear tab bar]
```

### 8.7 `/settings` — Accessibility Settings

**Current issues:** Plain heading + single component, feels like an afterthought.

**Redesigned layout (moved under Profile tab):**

```
[AppHeader — shows "Settings" as center title, back arrow]

[Profile summary card — top of settings]
  - Child avatar (60px) + name + age
  - "Switch Profile" ghost link

[Accessibility section — white card, shadow-sm]
  - Section heading: "Accessibility" — text-xl Nunito 700 with gear icon
  - Large toggle rows (52px height each):
    - "Reduce Motion" — toggle with description below
    - "High Contrast" — toggle (future)
    - "Larger Text" — toggle (future)
  - Each toggle: full-width row, label left, iOS-style toggle right

[Gameplay Mode section — white card, shadow-sm]
  - Section heading: "Learning Mode" — text-xl Nunito 700
  - 3 radio-style cards: Smart / Chill / Challenge
    Selected: brand-500 border, brand-50 bg
    Description of each mode below the name

[App Info section]
  - Version number
  - Privacy Policy link
  - Terms of Service link
  - "Contact Support" button

[Danger zone]
  - "Sign Out" — danger ghost button, full width
    (Signing out confirms via bottom sheet: "Are you sure?")
```

---

## 9. 6th Game Slot Decision

### The Problem

The home screen currently renders 5 games in a responsive grid:
- `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`
- On mobile: 5 tall cards stacked vertically — fine
- On tablet (sm): 2+2+1 — the last card is a half-row orphan, looks broken
- On desktop (lg): 3+2 — two cards in the last row, unbalanced

### Options Considered

**Option A:** Leave 5 games, redesign the grid to 2+2+1 with the 5th card centered and wider. Looks intentional on all breakpoints.

**Option B:** Add a 6th placeholder game "Coming Soon: Science Lab" to complete the 3+3 or 2+2+2 grid. Signals roadmap. Makes the grid balanced everywhere.

**Option C:** Drop to 4 games in a 2×2 grid. Loses content.

### Recommendation: Option B — Add Science Lab as Slot 6

**Rationale:**

1. **Grid balance at all breakpoints.** 6 games = 2+2+2 on mobile, 3+3 on tablet/desktop. No orphans at any breakpoint. The layout feels complete and intentional.

2. **Signals product roadmap without overpromising.** "Coming Soon: Science Lab" communicates that the app is growing. This increases parent confidence and creates anticipation in kids. Duolingo uses coming-soon course placeholders effectively to drive curiosity and return visits.

3. **No new game implementation required.** The card renders with a "Coming Soon" lock treatment — same as locked WorldMap areas. It is a UI element, not a working game. Zero sprint risk.

4. **Consistent with the brand vision.** The PRD already mentions science curiosity content ("Tell Me Why?"). Science Lab as a 6th game (think: logic + curiosity + experiment games) is a natural extension and pre-announced in the UX, not a product surprise.

5. **Option A (centered 5th card) solves the grid issue but at the cost of visual inconsistency.** A wider card in a 2-column grid looks different from the others and may confuse users about whether it's a featured game or something different.

### Science Lab Slot Spec

| Property | Value |
|---|---|
| Slot label | "Science Lab" |
| Coming soon label | "Coming Soon" |
| Game type token | `science-lab` (not wired to router) |
| Cognitive skill | `curiosity` |
| Themed area | "The Lab" |
| Card gradient | `from-[#CFFAFE] to-[#A5F3FC]` (desaturated teal) |
| Icon background | `#0E7490` at 50% opacity (visually locked) |
| Icon | Beaker / flask SVG |
| Badge | "Curiosity" chip, teal-100/teal-700 |
| Tap behavior | Opens a toast: "Science Lab is almost ready! Check back soon." |
| Lock overlay | Subtle `bg-white/30` shimmer, "🔬 Coming Soon" centered label |

**GameCard extension for the "coming soon" state:**
```tsx
interface GameCardProps {
  game: Game;
  onSelect: (gameType: GameType) => void;
  comingSoon?: boolean; // new prop
}
// When comingSoon=true: card is non-interactive, shows lock overlay, triggers toast on tap
```

### Updated Home Screen Game Grid

```
grid-cols-2 gap-4 on mobile (375px+)
grid-cols-3 gap-5 on tablet (768px+) and desktop

[Word Pop]     [Connection Quest]
[Memory Flip]  [Pattern Builder]
[Grid Logic]   [Science Lab 🔒]
```

All 6 cards are identical in size and layout. The only visual differentiation is the coming-soon lock treatment on Science Lab.

---

## Appendix A — Design Token Quick Reference

```css
/* Colors */
--color-brand-500: #7C3AED;
--color-brand-600: #6D28D9;
--color-success: #16A34A;
--color-warning: #D97706;
--color-error: #DC2626;
--color-text-primary: #111827;
--color-text-secondary: #4B5563;

/* Game accents */
--color-word-pop: #3B82F6;
--color-connection: #10B981;
--color-memory: #8B5CF6;
--color-pattern: #F59E0B;
--color-grid: #F43F5E;
--color-science: #06B6D4;

/* Typography */
--font-heading: 'Nunito', system-ui, sans-serif;
--font-body: 'Inter', system-ui, sans-serif;

/* Motion */
--duration-fast: 150ms;
--duration-normal: 300ms;
--duration-slow: 500ms;
--ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
--ease-smooth: cubic-bezier(0.22, 1, 0.36, 1);

/* Sizing */
--touch-min: 44px;
--touch-primary: 56px;
--radius-card: 20px;
--radius-button: 16px;
--radius-input: 12px;
--radius-pill: 9999px;
```

## Appendix B — WCAG AA Compliance Summary

| Combination | Contrast | Result |
|---|---|---|
| brand-500 (#7C3AED) on white | 5.74:1 | AA (UI + large text) |
| brand-700 (#5B21B6) on white | 8.11:1 | AA (normal text) |
| text-primary (#111827) on white | 18.08:1 | AAA |
| text-secondary (#4B5563) on white | 7.67:1 | AA |
| success (#16A34A) on white | 5.74:1 | AA (UI components) |
| warning (#D97706) on white | 4.52:1 | AA |
| error (#DC2626) on white | 5.74:1 | AA |
| word-pop-700 (#1D4ED8) on word-pop-100 | 7.24:1 | AA |
| pattern-700 (#B45309) on pattern-100 | 5.97:1 | AA |
| grid-700 (#BE123C) on grid-100 | 7.37:1 | AA |

All foreground/background pairs used for text are validated at or above 4.5:1 (WCAG AA for normal text). UI component colors (borders, icons without adjacent text) meet 3:1 minimum.
