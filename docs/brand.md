# brand.md 

Authoritative brand + design system reference.
Derived directly from production CSS variables.

---

## Brand essence

**ai-portfolio** builds modern, production-ready AI and software systems for real businesses.

The brand emphasizes:
- clarity over hype
- restraint over noise
- craftsmanship over speed
- outcomes over experimentation

Visual language supports **focus, confidence, and technical calm**.

---

## Visual identity

### Color system

**Core colors**
- `--color-black` → #000000  
  Primary background. Absolute black establishes seriousness and focus.

- `--color-white` → #FFFFFF  
  Reserved for high-contrast accents and rare emphasis.

**Accent**
- `--color-orange` → #FF6A3D  
  Primary action and highlight color. Used sparingly for CTAs, selections, and emphasis.

- `--color-orange-glow` → rgba(255, 106, 61, 0.15)  
  Soft glow for hover states, ambient accents, and subtle depth.

- `--color-orange-soft` → rgba(255, 106, 61, 0.08)  
  Background tint for low-contrast emphasis areas.

**Neutral grayscale**
- `--color-gray-900` → #0A0A0A  
- `--color-gray-800` → #141414  
- `--color-gray-700` → #1A1A1A  
- `--color-gray-600` → #2A2A2A  

  Used for layered backgrounds, cards, and section separation.

- `--color-gray-400` → #666666  
- `--color-gray-300` → #888888  
- `--color-gray-200` → #AAAAAA  

  Used for body text, secondary text, and muted UI labels.

**Selection behavior**
- Selection background: `--color-orange`
- Selection text: `--color-black`

---

## Typography

### Font families

**Display / headings**
- `--font-display`: **Space Grotesk**, sans-serif  
  Used for headings, hero text, navigation, and emphasis.
  Conveys modernity, precision, and technical confidence.

**Body / long-form**
- `--font-body`: **Source Serif 4**, Georgia, serif  
  Used for paragraphs and long-form content.
  Adds warmth, credibility, and editorial calm.

### Type scale (fluid)

All typography uses `clamp()` for responsive scaling.

- `--text-xs` → 0.75rem → 0.875rem
- `--text-sm` → 0.875rem → 1rem
- `--text-base` → 1rem → 1.125rem *(default body size)*
- `--text-lg` → 1.125rem → 1.375rem
- `--text-xl` → 1.25rem → 1.625rem
- `--text-2xl` → 1.5rem → 2.25rem
- `--text-3xl` → 2rem → 3.5rem
- `--text-4xl` → 2.5rem → 5rem
- `--text-5xl` → 3rem → 7rem

**Line height**
- Body text: `1.7`  
  Optimized for readability and long-form clarity.

---

## Spacing & layout

### Spacing scale (fluid)

- `--space-xs` → 0.5rem → 0.75rem
- `--space-sm` → 0.75rem → 1.25rem
- `--space-md` → 1rem → 1.75rem
- `--space-lg` → 1.5rem → 3rem
- `--space-xl` → 2rem → 4.5rem
- `--space-2xl` → 3rem → 7rem
- `--space-3xl` → 4rem → 10rem

Spacing is generous and deliberate.  
White space is a core part of the brand.

### Width constraints

- `--max-width`: 1440px  
- `--content-width`: `min(90%, 1200px)`

Content is centered, never edge-to-edge, reinforcing focus and legibility.

---

## Motion & interaction

### Easing
- `--ease-out-expo`: `cubic-bezier(0.16, 1, 0.3, 1)`
- `--ease-out-quart`: `cubic-bezier(0.25, 1, 0.5, 1)`

Animations feel **decisive, smooth, and intentional** — never bouncy or playful.

### Durations
- `--duration-fast`: 200ms
- `--duration-normal`: 400ms
- `--duration-slow`: 800ms

Motion is used to clarify state changes, not decorate.

---

## Base UI rules

### Body
- Font: `--font-body`
- Font size: `--text-base`
- Text color: `--color-gray-200`
- Background: `--color-black`
- Minimum height: 100vh
- Horizontal overflow disabled

### Box model
- `box-sizing: border-box` applied globally
- All default margins and paddings reset

### Rendering
- Smooth scrolling enabled
- Font smoothing enabled for macOS and WebKit

---

## Brand personality (translated from design)

- **Confident** — high contrast, restrained palette
- **Modern** — fluid type, precise motion curves
- **Human** — serif body text, generous spacing
- **Serious** — black foundation, no decorative clutter
- **Craft-driven** — everything intentional, nothing loud

---

## Usage rules

Do:
- Use orange sparingly and purposefully
- Respect spacing scale — never collapse sections tightly
- Let typography carry hierarchy, not color
- Prefer fewer elements with more space

Avoid:
- Introducing new colors
- Overusing glow effects
- Tight line heights or compressed layouts
- Decorative animation without meaning

---

## Source of truth

This document is derived from live CSS variables.
If the site CSS changes, update this file first.

This file overrides:
- README visual descriptions
- Marketing copy styling assumptions
- Component-level visual decisions
