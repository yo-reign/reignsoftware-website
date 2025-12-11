# ReignSoftware Website - Development Plan

## Vision

**ReignSoftware** is a software company that delivers solutions which are not just functional—they're *experiences*. We build fast, robust software with obsessive attention to design: both how it *works* and how it *looks*. Our website should be a living portfolio of this philosophy—a playground where visitors can explore different visual themes, interact with stunning visualizations, and immediately understand what sets us apart.

---

## Project Overview

| Aspect | Details |
|--------|---------|
| Framework | SvelteKit 2.x with Svelte 5 |
| UI Components | shadcn-svelte |
| Styling | Tailwind CSS 4.x |
| Animations | motion.dev |
| 3D (optional) | Three.js |
| Deployment | Vercel |
| Testing | Vitest (unit) + Playwright (e2e) |
| Package Manager | pnpm |

---

## Svelte 5 & SvelteKit Conventions

This project uses **Svelte 5** with runes. All code must follow these patterns:

### Component Props
```svelte
<!-- Use $props() instead of export let -->
<script lang="ts">
  interface Props {
    title: string;
    count?: number;
    onclick?: () => void;
  }
  let { title, count = 0, onclick }: Props = $props();
</script>
```

### State Management
```svelte
<script lang="ts">
  // Reactive state with $state
  let count = $state(0);
  let items = $state<string[]>([]);

  // Derived values with $derived
  let doubled = $derived(count * 2);
  let total = $derived(items.length);

  // Side effects with $effect
  $effect(() => {
    console.log('Count changed:', count);
  });
</script>
```

### Children/Slots
```svelte
<!-- Use {@render children()} instead of <slot> -->
<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    children: Snippet;
    header?: Snippet;
  }
  let { children, header }: Props = $props();
</script>

{#if header}
  <header>{@render header()}</header>
{/if}
<main>{@render children()}</main>
```

### Event Handlers
```svelte
<!-- Use callback props, not createEventDispatcher -->
<script lang="ts">
  interface Props {
    onchange?: (value: string) => void;
  }
  let { onchange }: Props = $props();
</script>

<input onchange={(e) => onchange?.(e.currentTarget.value)} />
```

### Global State (Module-level)
```typescript
// theme.svelte.ts - using class with $state
class ThemeState {
  current = $state<'gruvbox' | 'nord'>('gruvbox');

  set(theme: typeof this.current) {
    this.current = theme;
  }
}

export const themeState = new ThemeState();
```

### Bindings
```svelte
<script lang="ts">
  // Two-way binding with $bindable
  interface Props {
    value?: string;
  }
  let { value = $bindable('') }: Props = $props();
</script>

<input bind:value />
```

---

## Core Concepts

### 1. The "Playground" Philosophy

The website should feel interactive and explorable. Visitors can:
- Toggle between different visual themes (Gruvbox, Nord, Dracula, Catppuccin, etc.)
- Watch generative art/visualizations that respond to their theme choice
- Experience micro-interactions and smooth animations everywhere
- Feel like they're exploring a crafted digital space, not reading a brochure

### 2. Theme System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Theme Context                         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐     │
│  │   Colors    │  │    Fonts    │  │  Visualizer │     │
│  │  (CSS vars) │  │  (families) │  │  (component)│     │
│  └─────────────┘  └─────────────┘  └─────────────┘     │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│                   Theme Definitions                      │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐   │
│  │ Gruvbox  │ │   Nord   │ │ Dracula  │ │Catppuccin│   │
│  │ +random  │ │ +aurora  │ │ +bats    │ │ +pastel  │   │
│  │  walk    │ │ particles│ │ swarm    │ │  waves   │   │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘   │
└─────────────────────────────────────────────────────────┘
```

Each theme includes:
- **Color palette** (CSS custom properties)
- **Typography** (font families, weights)
- **Signature visualization** (unique per theme)

---

## Site Structure

```
/                       → Landing page (hero + theme showcase)
/about                  → About ReignSoftware, philosophy, team
/services               → What we offer (web, mobile, automation, AI)
/products               → Our products
  /products/importdoc   → importDoc showcase
/playground             → Interactive theme/visualization sandbox
/contact                → Contact form + info
```

### Route Details

#### `/` - Landing Page
- Hero section with animated typography
- Theme selector (floating or in header)
- Background visualization that changes with theme
- Brief "what we do" cards
- Featured product teaser (importDoc)
- Call-to-action

#### `/about` - About Us
- Company story and values
- Design philosophy breakdown
- Future: Team section (when you expand)

#### `/services` - Services
- Web Development
- Mobile Applications
- Business Automation
- AI Integration
- Each service card with hover effects

#### `/products/importdoc` - importDoc Product Page
- Product hero with mockup/demo
- Problem statement (law firm mail chaos)
- Feature breakdown:
  - Mail intake automation
  - AI document analysis
  - Smart categorization
  - Auto-filing to case folders
  - Action triggers
- Pricing/waitlist CTA
- Integration showcase

#### `/playground` - Theme Playground
- Full-screen visualization canvas
- Theme picker with previews
- Controls for visualization parameters
- "Export as wallpaper" fun feature
- Code snippets showing how effects work

---

## Theme System Implementation

### CSS Custom Properties Strategy

```css
/* In src/lib/styles/themes.css */
:root {
  /* Base semantic tokens */
  --color-bg-primary: var(--theme-bg-primary);
  --color-bg-secondary: var(--theme-bg-secondary);
  --color-text-primary: var(--theme-text-primary);
  --color-text-secondary: var(--theme-text-secondary);
  --color-accent: var(--theme-accent);
  --color-accent-secondary: var(--theme-accent-secondary);
  /* ... more tokens */
}

/* Gruvbox Dark */
[data-theme="gruvbox"] {
  --theme-bg-primary: #282828;
  --theme-bg-secondary: #3c3836;
  --theme-text-primary: #ebdbb2;
  --theme-text-secondary: #a89984;
  --theme-accent: #fe8019;
  --theme-accent-secondary: #fabd2f;
  /* Gruvbox full palette */
  --gruvbox-red: #cc241d;
  --gruvbox-green: #98971a;
  --gruvbox-yellow: #d79921;
  --gruvbox-blue: #458588;
  --gruvbox-purple: #b16286;
  --gruvbox-aqua: #689d6a;
}
```

### Theme Store (Svelte 5 Runes)

```typescript
// src/lib/stores/theme.svelte.ts
import { browser } from '$app/environment';

export type ThemeName = 'gruvbox' | 'nord' | 'dracula' | 'catppuccin' | 'light';

class ThemeState {
  current = $state<ThemeName>('gruvbox');

  constructor() {
    if (browser) {
      const saved = localStorage.getItem('theme') as ThemeName;
      if (saved) this.current = saved;
    }
  }

  set(theme: ThemeName) {
    this.current = theme;
    if (browser) {
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem('theme', theme);
    }
  }
}

export const theme = new ThemeState();
```

---

## Visualizations

### 1. Random Walk (Gruvbox Theme)

A retro-styled random walk algorithm creating organic, growing patterns using the Gruvbox color palette.

```typescript
// src/lib/visualizers/random-walk.ts
interface WalkConfig {
  colors: string[];      // From theme
  stepSize: number;
  branchProbability: number;
  fadeSpeed: number;
}

export function createRandomWalk(canvas: HTMLCanvasElement, config: WalkConfig) {
  // Implementation using Canvas 2D API
  // Multiple "walkers" that branch and fade
  // Colors cycle through Gruvbox palette
}
```

### 2. Planned Visualizations

| Theme | Visualization | Description |
|-------|--------------|-------------|
| Gruvbox | Random Walk | Retro terminals meets generative art |
| Nord | Aurora Particles | Flowing northern lights effect |
| Dracula | Bat Swarm | Particle system with flocking behavior |
| Catppuccin | Pastel Waves | Smooth, flowing gradient waves |
| Light | Minimal Dots | Clean, subtle dot grid animation |

### 3. Technology Options

- **Canvas 2D** - Best for 2D generative art (random walk, particles)
- **Three.js** - 3D scenes, WebGL shaders
- **motion.dev** - DOM animations, page transitions

---

## Animation Strategy (motion.dev)

### Installation
```bash
pnpm add motion
```

### Usage in Svelte

```svelte
<script>
  import { animate, stagger } from 'motion';
  import { onMount } from 'svelte';

  let items: HTMLElement[] = [];

  onMount(() => {
    animate(items,
      { opacity: [0, 1], y: [20, 0] },
      { delay: stagger(0.1) }
    );
  });
</script>

{#each services as service, i}
  <div bind:this={items[i]} class="service-card">
    {service.name}
  </div>
{/each}
```

### Animation Principles
- **Purposeful** - Every animation should guide attention or provide feedback
- **Fast** - Keep durations under 300ms for UI, longer only for showcases
- **Consistent** - Same easing curves throughout (ease-out for enters, ease-in for exits)

---

## Component Architecture

```
src/lib/
├── components/
│   ├── layout/
│   │   ├── Header.svelte
│   │   ├── Footer.svelte
│   │   ├── Navigation.svelte
│   │   └── ThemeToggle.svelte
│   ├── ui/                      # shadcn-svelte components (auto-generated)
│   │   ├── button/
│   │   ├── card/
│   │   ├── input/
│   │   ├── badge/
│   │   └── ...
│   ├── visualizers/
│   │   ├── VisualizerCanvas.svelte
│   │   ├── RandomWalk.svelte
│   │   ├── AuroraParticles.svelte
│   │   └── index.ts
│   └── sections/
│       ├── Hero.svelte
│       ├── Services.svelte
│       ├── ProductTeaser.svelte
│       └── ContactForm.svelte
├── stores/
│   ├── theme.svelte.ts
│   └── visualizer.svelte.ts
├── styles/
│   ├── themes.css
│   └── typography.css
├── utils/
│   ├── cn.ts                    # shadcn class merge utility
│   ├── canvas.ts
│   └── math.ts
└── visualizers/
    ├── random-walk.ts
    ├── aurora.ts
    └── types.ts
```

---

## Implementation Phases

### Phase 1: Foundation
- [ ] Initialize shadcn-svelte and add base components
- [ ] Set up theme system (CSS variables + store)
- [ ] Create base layout components (Header, Footer, Navigation)
- [ ] Implement theme toggle UI
- [ ] Set up typography system
- [ ] Create landing page structure

### Phase 2: Visualizations
- [ ] Build VisualizerCanvas component
- [ ] Implement Random Walk for Gruvbox theme
- [ ] Create visualizer-to-theme mapping system
- [ ] Add canvas performance optimizations
- [ ] Build Playground page

### Phase 3: Content Pages
- [ ] About page
- [ ] Services page with service cards
- [ ] Contact page with form + server action
- [ ] Products listing page

### Phase 4: importDoc Showcase
- [ ] Product page design
- [ ] Feature breakdown sections
- [ ] Interactive demo/mockup
- [ ] Waitlist signup form

### Phase 5: Polish & Additional Themes
- [ ] Add motion.dev page transitions
- [ ] Implement Nord theme + aurora visualization
- [ ] Add Dracula + Catppuccin themes
- [ ] Micro-interactions and hover states
- [ ] Performance optimization
- [ ] SEO meta tags

### Phase 6: Testing & Launch
- [ ] Unit tests for utilities and stores
- [ ] Component tests for UI elements
- [ ] E2E tests for critical flows
- [ ] Accessibility audit
- [ ] Lighthouse performance check
- [ ] Deploy to Vercel

---

## Technical Decisions

### Why These Choices?

| Decision | Reason |
|----------|--------|
| shadcn-svelte | Accessible, customizable components with Tailwind |
| CSS Variables for themes | Native, fast, no JS needed for color changes |
| Svelte 5 Runes for stores | Modern, reactive, built-in |
| Canvas for visualizations | Best performance for generative art |
| motion.dev over GSAP | Lighter, modern API, great for Svelte |
| Tailwind CSS | Rapid prototyping, design system ready |

### Performance Targets

- **LCP** < 2.5s (Largest Contentful Paint)
- **FID** < 100ms (First Input Delay)
- **CLS** < 0.1 (Cumulative Layout Shift)
- **Canvas** 60fps on mid-range devices

---

## Notes for Future

- Consider adding a blog for SEO and thought leadership
- Dark/light mode preference detection (`prefers-color-scheme`)
- Internationalization if expanding markets
- CMS integration for easier content updates
- Analytics (privacy-respecting: Plausible/Fathom)

---

## Quick Commands Reference

```bash
# Development
pnpm dev                 # Start dev server (localhost:5173)
pnpm build               # Production build
pnpm preview             # Preview production build

# Testing
pnpm test:unit           # Run unit tests (watch mode)
pnpm test:unit --run     # Run unit tests once
pnpm test:e2e            # Run e2e tests
pnpm exec playwright test --ui  # Interactive test UI

# Code Quality
pnpm lint                # Check formatting + linting
pnpm format              # Auto-format code
pnpm check               # TypeScript type checking
```

---

*This plan is a living document. Update as the project evolves.*
