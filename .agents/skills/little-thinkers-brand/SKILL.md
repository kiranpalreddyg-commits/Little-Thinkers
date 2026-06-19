---
name: little-thinkers-brand
description: Little Thinkers brand guidelines — colors, typography, spacing, motion, and component rules for all UI work on this project. Use this instead of the generic brand-guidelines skill.
license: Project-internal
---

# Little Thinkers — Brand & Design System

**Audience:** Any agent generating UI code, reviewing components, or making visual decisions.
**Source of truth:** `_bmad-output/planning-artifacts/ux-design.md` (Epic 7, Story 7.1)

---

## 7 Design Principles (commit these to every UI decision)

| # | Principle | Key rule |
|---|---|---|
| P1 | Touch First | Min touch target 44×44px. Primary CTAs 56px tall. Full-card tap areas. |
| P2 | Celebrate Thinking | Incorrect = warm amber (never red/punishing). Correct = delight — sparks, color burst, mascot. |
| P3 | Immediate Legibility | Body text min 16px. Icons min 24px. WCAG AA contrast everywhere. Labels always accompany icons. |
| P4 | Personality in Details | Micro-animations on success. Transitions 150–300ms. Distinct pressed states. Never generic gray disabled. |
| P5 | Progressive Complexity | Primary action at screen center. Filters collapsible. Difficulty on a dedicated screen, not inline. |
| P6 | Ownership & Identity | Child avatar always visible in header. Mascot is theirs. Profile cards = character select, not login. |
| P7 | Parent Trust | Clean whitespace, rounded corners, no dark patterns. Vibrant not garish. Coherent brand placement. |

---

## Colors

### Brand — Spark Purple

| Token | Hex | Usage |
|---|---|---|
| `--color-brand-50` | `#F3EEFF` | Tinted backgrounds, surfaces |
| `--color-brand-100` | `#E4D5FF` | Hover states, selection highlights |
| `--color-brand-200` | `#C9AAFF` | Decorative accents, tags |
| `--color-brand-400` | `#9B6FEF` | Secondary buttons, inactive nav icons |
| `--color-brand-500` | `#7C3AED` | **Primary** — buttons, active nav, links |
| `--color-brand-600` | `#6D28D9` | Pressed / active state |
| `--color-brand-700` | `#5B21B6` | Text on light brand backgrounds |
| `--color-brand-900` | `#2E1065` | High-contrast brand text (AAA on white) |

Contrast: `brand-500` on white = **5.74:1** (AA). `brand-700` on white = **8.11:1** (AA).

### Per-Game Accents

| Game | Base | Surface | Text | Gradient classes |
|---|---|---|---|---|
| Word Pop | `#3B82F6` | `#DBEAFE` | `#1D4ED8` | `from-[#DBEAFE] to-[#BFDBFE]` |
| Connection Quest | `#10B981` | `#D1FAE5` | `#047857` | `from-[#D1FAE5] to-[#A7F3D0]` |
| Memory Flip | `#8B5CF6` | `#EDE9FE` | `#6D28D9` | `from-[#EDE9FE] to-[#DDD6FE]` |
| Pattern Builder | `#F59E0B` | `#FEF3C7` | `#B45309`* | `from-[#FEF3C7] to-[#FDE68A]` |
| Grid Logic | `#F43F5E` | `#FFE4E6` | `#BE123C` | `from-[#FFE4E6] to-[#FECDD3]` |
| Science Lab (coming) | `#06B6D4` | `#CFFAFE` | `#0E7490` | `from-[#CFFAFE] to-[#A5F3FC]` |

\* Amber text must always use `#B45309` — never `#F59E0B` directly on white.

### Semantic Colors

| Purpose | Token | Hex | Rule |
|---|---|---|---|
| Correct answer | `--color-success` | `#16A34A` | bg: `#DCFCE7` |
| **Wrong answer** | `--color-warning` | `#D97706` | bg: `#FFFBEB` — **never red for incorrect** |
| System error | `--color-error` | `#DC2626` | bg: `#FEF2F2` — system errors only, not game state |
| Text primary | `--color-text-primary` | `#111827` | 18.08:1 (AAA) |
| Text secondary | `--color-text-secondary` | `#4B5563` | 7.67:1 (AA) |
| Text muted | `--color-text-muted` | `#9CA3AF` | Large text only |
| Surface | `--color-surface` | `#FFFFFF` | — |
| Surface raised | `--color-surface-raised` | `#F9FAFB` | — |
| Border | `--color-border` | `#E5E7EB` | — |

### Screen Background Gradients

| Screen | Tailwind classes |
|---|---|
| Login / Signup | `from-[#F3EEFF] via-[#EDE9FE] to-[#E4D5FF]` |
| Profile Select | `from-[#D1FAE5] via-[#CFFAFE] to-[#EDE9FE]` |
| Home | `from-[#FFFBEB] via-[#FFF7ED] to-[#F0FDF4]` |
| Active gameplay | `from-[#F9FAFB] to-[#FFFFFF]` |
| My Progress | `from-[#EDE9FE] via-[#E0E7FF] to-[#CFFAFE]` |
| Settings | `from-[#F0FDFA] to-[#ECFDF5]` |

---

## Typography

**Heading font:** Nunito (Google Fonts) — rounded, warm, legible. Weights: 700/800/900.
**Body font:** Inter (Google Fonts) — screen-optimised, neutral, highly legible at 14–18px.

```css
/* Combined import */
@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@700;800;900&family=Inter:wght@400;500;600&display=swap');

@theme {
  --font-heading: 'Nunito', system-ui, sans-serif;
  --font-body: 'Inter', system-ui, sans-serif;
}
```

### Type Scale

| Token | Size | Weight | Font | Usage |
|---|---|---|---|---|
| `text-xs` | 12px | 500 | Inter | Captions, badge labels, timestamps |
| `text-sm` | 14px | 400/500 | Inter | Secondary labels, card metadata |
| `text-md` / `text-base` | 16px | 400 | Inter | Body copy, instructions (**minimum body size**) |
| `text-lg` | 18px | 600 | Nunito | Card titles, section subheadings |
| `text-xl` | 20px | 700 | Nunito | Widget titles, screen subheadings |
| `text-2xl` | 24px | 800 | Nunito | H2 section headings |
| `text-3xl` | 30px | 900 | Nunito | H1 page headings |
| `text-4xl` | 36px | 900 | Nunito | Hero headings (login, welcome) |

Headings 2xl+: `tracking-tight`. All others: `tracking-normal`.

---

## Spacing & Touch Targets

Base grid: **4px**. All spacing is multiples of 4.

| Element | Min size | Tailwind |
|---|---|---|
| All interactive elements | 44×44px | `min-h-[44px] min-w-[44px]` |
| Primary CTA buttons | 56px tall | `h-14` |
| Game answer buttons | 56px tall, 64px min-width | `h-14 min-w-[64px]` |
| Bottom tab icons | 48×48px tap area | `p-3` around 24px icon |
| Form inputs | 52px tall | `h-[52px] py-3` |

---

## Border Radius

| Context | Radius | Tailwind |
|---|---|---|
| Pill badges / chips | 9999px | `rounded-full` |
| Buttons | 16px | `rounded-2xl` |
| Cards | 20px | `rounded-[20px]` |
| Modals / bottom sheets | 24px top | `rounded-t-3xl` |
| Input fields | 12px | `rounded-xl` |
| Avatar circles | 9999px | `rounded-full` |

---

## Elevation (Shadows)

| Level | Usage | Value |
|---|---|---|
| `shadow-none` | Flat / background cards | none |
| `shadow-sm` | Default cards, inputs | `0 1px 3px rgba(0,0,0,0.08)` |
| `shadow-md` | Raised cards, active states | `0 4px 12px rgba(0,0,0,0.10)` |
| `shadow-lg` | Modals, bottom sheets | `0 8px 32px rgba(0,0,0,0.14)` |
| `shadow-xl` | Toast notifications | `0 16px 48px rgba(0,0,0,0.16)` |

---

## Motion

### Duration Tokens

| Token | Duration | Usage |
|---|---|---|
| `duration-fast` | 150ms | Hover/pressed, color change, button press |
| `duration-normal` | 300ms | Card entrance, tab switch, slide-in panels |
| `duration-slow` | 500ms | Brain Jar fill, success celebration, page transitions |
| `duration-xslow` | 800ms | Mascot reactions, badge ceremony |

### Easing Curves

| Token | Curve | CSS value | Usage |
|---|---|---|---|
| `ease-spring` | Spring out | `cubic-bezier(0.34, 1.56, 0.64, 1)` | Correct answer pop, badge award, spark burst |
| `ease-smooth` | Ease out | `cubic-bezier(0.22, 1, 0.36, 1)` | Page transitions, panel slides, tab switches |
| `ease-linear` | Linear | `linear` | Progress bar fill, countdown timers |

### Animation Sequences

**Correct answer:**
1. Button flashes `#16A34A` — 150ms linear
2. AnswerFeedback slides up — 300ms ease-smooth
3. ThoughtSpark particles from Brain Jar — 500ms ease-spring
4. Brain Jar fill animates — 500ms linear
5. "+1 Spark ✨" fades in then out at 800ms — 300ms ease-smooth each

**Incorrect answer:**
1. Button shakes ±4px horizontal — 150ms ease-in-out, 2 cycles
2. AnswerFeedback slides up (amber, never red) — 300ms ease-smooth
3. **No spark animation. No red flash.**

**Game card tap:**
- Scale to 0.97 on press — 150ms ease-in-out
- Scale to 1.01 on release (overshoot) — 300ms ease-spring

**Always respect `reducedMotion` from `useAccessibilityStore` — skip all animations when true.**

---

## Anti-Patterns (never do these)

- Red (`#DC2626` / `bg-red-*`) for incorrect game answers — use amber warning palette
- Hover-only interactive states — touch devices have no hover
- Touch targets smaller than 44×44px
- `#F59E0B` (amber-500) for text on white — fails WCAG AA; use `#B45309`
- Neon-on-black color schemes
- Animated content that ignores `reducedMotion` setting
- Generic gray disabled states — use `opacity-50` with texture instead

---

## Tailwind Custom Properties (globals.css)

```css
@theme {
  --color-brand: #7C3AED;
  --color-brand-50: #F3EEFF;
  --color-brand-500: #7C3AED;
  --color-brand-600: #6D28D9;
  --font-heading: 'Nunito', system-ui, sans-serif;
  --font-body: 'Inter', system-ui, sans-serif;
  --ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
  --ease-smooth: cubic-bezier(0.22, 1, 0.36, 1);
}
```

Reference: `little-thinkers-app/src/app/globals.css` for live values.
