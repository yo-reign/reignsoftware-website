# ReignSoftware Website - Development Plan

## Vision

**<span class="text-red">reign</span>software** is a software company that delivers solutions which are not just functional—they're *experiences*. We build fast, robust software with obsessive attention to design: both how it *works* and how it *looks*. Our website embodies this philosophy with a focused terminal/TUI aesthetic that showcases our technical expertise while maintaining visual appeal.

---

## Project Overview

| Aspect | Details |
|--------|---------|
| Framework | SvelteKit 2.x with Svelte 5 |
| Styling | Tailwind CSS 4.x |
| Icons | Lucide Svelte |
| Animations | CSS transitions + Canvas API |
| Deployment | Vercel |
| Quality | TypeScript + svelte-check |
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
// visualizer.svelte.ts - using class with $state
class VisualizerState {
  current = $state<'grid-walk' | 'random-walk'>('grid-walk');

  set(visualizer: typeof this.current) {
    this.current = visualizer;
  }
}

export const visualizerState = new VisualizerState();
```

---

## Core Concepts

### 1. Terminal-First Design

The website embraces a **terminal/TUI aesthetic** throughout:
- Gruvbox Dark Hard color palette
- JetBrains Mono font everywhere
- Sharp corners, no border radius
- CLI-inspired UI patterns (prompts, commands, box-drawing)
- Authentic retro-hacker feel

### 2. Brand Identity

The brand is displayed as:
```html
<span class="text-[var(--term-red)]">reign</span><span class="text-[var(--term-fg)]">software</span>
```

Key characteristics:
- "reign" in red (`#fb4934`)
- "software" in foreground color (`#ebdbb2`)
- Monospace font throughout
- Often preceded by `$` prompt

### 3. Background Visualizers

Instead of multiple themes, we offer different **background visualizations**:

| Visualizer | Description |
|------------|-------------|
| **Grid Walk** | Agents traverse a 16px grid, leaving colorful trails. Structured, retro feel. |
| **Random Walk** | Organic, free-flowing paths that wind across the canvas. Smooth and flowing. |
| *More to come* | Future visualizers can be added to this system |

The visualizer selector:
- Lives in the hero section at the bottom
- Appears in the header when scrolled past hero
- Features boot/shutdown animations when appearing/disappearing
- Preserves selection in localStorage

### 4. Visualizer Controls

Users can customize the visualizer experience:
- **Speed** (20-300ms) - How fast agents move
- **Agent Count** (1-20) - How many walkers
- **Restart** - Reset the visualization

---

## Site Structure

```
/                       → Landing page (hero + services + product teaser + CTA)
/about                  → About ReignSoftware, philosophy, team
/services               → What we offer (web, mobile, automation, AI)
/products               → Our products
  /products/importdoc   → importDoc showcase
/playground             → Interactive visualization sandbox
/contact                → Contact form + info
```

### Route Details

#### `/` - Landing Page
- Hero with visualizer background and typing animation
- Visualizer controls panel
- Visualizer selector (grid-walk, random-walk)
- Services section (4 TUI-style cards)
- importDoc product teaser (expandable)
- Terminal-style CTA

#### `/about` - About Us (To Build)
- Company story and values
- Design philosophy breakdown
- Future: Team section

#### `/services` - Services (To Build)
- Web Development
- Mobile Applications
- Business Automation
- AI Integration
- TUI-style service cards

#### `/products/importdoc` - importDoc Product Page (To Build)
- Product hero with TUI mockup
- Problem statement (law firm mail chaos)
- Feature breakdown with terminal styling
- Pricing/waitlist CTA
- Integration showcase

#### `/playground` - Visualization Playground (To Build)
- Full-screen visualization canvas
- All visualizer options
- Extended controls
- Export/share features

---

## Color Palette (Gruvbox Dark Hard)

```css
--term-bg: #1d2021;      /* Background */
--term-bg-soft: #282828; /* Card background */
--term-bg1: #3c3836;     /* Secondary */
--term-bg2: #504945;     /* Border */
--term-fg: #ebdbb2;      /* Foreground text */
--term-fg-dim: #928374;  /* Muted text */
--term-gray: #a89984;    /* Gray accent */
--term-red: #fb4934;     /* Red (brand) */
--term-green: #b8bb26;   /* Green (primary) */
--term-yellow: #fabd2f;  /* Yellow */
--term-blue: #83a598;    /* Blue */
--term-purple: #d3869b;  /* Purple */
--term-aqua: #8ec07c;    /* Aqua */
--term-orange: #fe8019;  /* Orange */
```

---

## Component Architecture

```
src/lib/
├── components/
│   ├── layout/
│   │   ├── Header.svelte      # Fixed header with visualizer selector
│   │   └── Footer.svelte      # TUI-style footer
│   ├── visualizers/
│   │   ├── GridWalk.svelte    # Grid-based random walk
│   │   └── RandomWalk.svelte  # Free-flowing random walk
│   └── sections/
│       ├── Hero.svelte        # Landing hero with visualizer
│       ├── Services.svelte    # Service cards grid
│       └── ProductTeaser.svelte  # importDoc teaser
├── stores/
│   └── theme.svelte.ts        # Visualizer state
└── themes/
    └── index.ts               # Visualizer definitions & colors
```

---

## Implementation Progress

### Phase 1: Foundation ✓ Complete
- [x] Theme system (simplified to terminal only)
- [x] Layout components (Header, Footer)
- [x] Base landing page
- [x] Brand identity styling

### Phase 2: Visualizations ✓ Complete
- [x] GridWalk visualizer
- [x] RandomWalk visualizer
- [x] Visualizer selector with animations
- [x] Visualizer controls (speed, agents, restart)

### Phase 3: Content Pages - In Progress
- [ ] About page
- [ ] Services page (content already on landing)
- [ ] Contact page with form
- [ ] Products listing page

### Phase 4: importDoc Showcase
- [ ] Product page design
- [ ] Feature breakdown sections
- [ ] Interactive demo/mockup
- [ ] Waitlist signup form

### Phase 5: Polish & Enhancement
- [ ] Enhanced CSS animations
- [ ] More visualizers (particles, matrix, etc.)
- [ ] Micro-interactions
- [ ] Performance optimization
- [ ] SEO meta tags

### Phase 6: Launch
- [ ] Accessibility audit
- [ ] Lighthouse performance check
- [ ] SEO meta tags finalization
- [ ] Deploy to Vercel

---

## Technical Decisions

| Decision | Reason |
|----------|--------|
| Single terminal theme | Focused brand identity, simpler codebase |
| Visualizer system | Keeps visual interest without multiple themes |
| CSS variables | Native, fast, no runtime JS for styling |
| Svelte 5 runes | Modern, reactive, built-in |
| Canvas for visualizations | Best performance for generative art |
| Tailwind CSS | Rapid development, consistent design system |

### Performance Targets

- **LCP** < 2.5s (Largest Contentful Paint)
- **FID** < 100ms (First Input Delay)
- **CLS** < 0.1 (Cumulative Layout Shift)
- **Canvas** 60fps on mid-range devices

---

## Future Ideas

- **Additional Visualizers**: Matrix rain, particle swarm, perlin noise
- **Blog**: Technical articles, case studies
- **Playground**: Full-screen interactive visualization sandbox
- **Dark/Light**: Could add light variant of terminal theme later
- **Analytics**: Privacy-respecting (Plausible/Fathom)
- **CMS**: For blog and content management

---

## Quick Commands Reference

```bash
# Development
pnpm dev                 # Start dev server (localhost:5173)
pnpm build               # Production build
pnpm preview             # Preview production build

# Code Quality
pnpm lint                # Check formatting + linting
pnpm format              # Auto-format code
pnpm check               # TypeScript + Svelte type checking
```

---

*This plan is a living document. Update as the project evolves.*
