# ReignSoftware Website

A SvelteKit website with a distinctive terminal/TUI aesthetic using the Gruvbox color palette.

## Tech Stack

- **Framework**: SvelteKit 2.x with Svelte 5 (runes)
- **Styling**: Tailwind CSS 4.x
- **Icons**: Lucide Svelte
- **Markdown**: mdsvex with Shiki syntax highlighting
- **Package Manager**: pnpm

## Commands

```bash
pnpm dev          # Start dev server (localhost:5173)
pnpm build        # Production build
pnpm preview      # Preview production build
pnpm check        # TypeScript + Svelte type checking
pnpm lint         # Check formatting + linting
pnpm format       # Auto-format code
```

## Svelte 5 Patterns

This project uses Svelte 5 runes. Follow these patterns:

```svelte
<!-- Props: Use $props() not export let -->
<script lang="ts">
  interface Props {
    title: string;
    count?: number;
  }
  let { title, count = 0 }: Props = $props();
</script>

<!-- State: Use $state, $derived, $effect -->
<script lang="ts">
  let count = $state(0);
  let doubled = $derived(count * 2);

  $effect(() => {
    console.log('Count changed:', count);
  });
</script>

<!-- Slots: Use Snippet and {@render} -->
<script lang="ts">
  import type { Snippet } from 'svelte';
  let { children }: { children: Snippet } = $props();
</script>
{@render children()}
```

## Design System

### Brand Identity

**Logo**: `$ reignsoftware_`

- `$` prompt in gray (#928374)
- "reign" in red (#fb4934), italic
- "software" in foreground (#ebdbb2)
- `_` cursor in green (#b8bb26), animated pulse

### Terminal/TUI Aesthetic

- JetBrains Mono font throughout
- Sharp corners (no border radius)
- CLI-inspired UI patterns (`$`, `./`, `--flags`)
- Gruvbox Hard color palette (dark and light modes)
- Glassmorphism effects (backdrop-blur, transparent cards)

### Color Palette (Gruvbox)

**Dark Mode**:

- Background: #1d2021
- Foreground: #ebdbb2
- Primary (green): #b8bb26
- Accent colors: red (#fb4934), blue (#83a598), yellow (#fabd2f), purple (#d3869b), aqua (#8ec07c)

**Light Mode**:

- Background: #f9f5d7
- Foreground: #3c3836
- Uses muted versions of accent colors

### UI Components

- `SectionHeader` - Page section headers with title and optional subtitle
- `ContentCard` - Translucent card with prose styling for text content
- Transparent backgrounds with `bg-card/80 backdrop-blur-sm`
- Lighter border opacity: `border-border/50`
- Theme toggle dropdown (Auto/Dark/Light)
- Visualizer selector with invert hover effects

## Project Structure

```
src/
├── content/
│   └── blog/                # Markdown blog posts
├── lib/
│   ├── components/
│   │   ├── layout/          # Header, Footer
│   │   ├── visualizers/     # Canvas background effects
│   │   ├── sections/        # Hero, ProductTeaser
│   │   └── ui/              # SectionHeader, ContentCard
│   ├── stores/
│   │   ├── theme.svelte.ts  # Theme state (auto/dark/light)
│   │   └── visualizer.svelte.ts
│   └── types/
│       └── blog.ts          # Blog post types
└── routes/
    ├── +layout.svelte
    ├── +page.svelte         # Landing page
    ├── layout.css           # Global styles, Gruvbox palette
    ├── about/
    ├── services/
    ├── contact/             # Temporary email contact
    ├── products/
    │   └── importdoc/
    ├── blog/                # Blog listing and posts
    │   └── [slug]/
    ├── privacy/             # Privacy policy
    ├── terms/               # Terms of service
    └── playground/
```

## Background Visualizers

Interactive canvas backgrounds selectable by user:

- Off (disable visualizer)
- Grid Walk, Random Walk, Matrix Rain
- Particle Swarm, Starfield, Ripples

Each visualizer has its own accent color. Selection persisted in localStorage. Default for new users: grid-walk.

### Visualizer Button Styling

- Buttons show in their visualizer's color
- Hover effect: fills with color, inverts text (like START PROJECT button)
- Selected state uses visualizer's own color (not green)

## Blog System

Blog posts are written in Markdown in `src/content/blog/`. Syntax highlighting uses Shiki with dual theme support (gruvbox-dark-hard / gruvbox-light-hard).

### Creating a Blog Post

Create a `.md` file in `src/content/blog/`:

```markdown
---
title: Post Title
description: Brief description
date: '2025-01-14'
author: Author Name
tags:
  - tag1
  - tag2
published: true
---

Post content here...
```

## Implementation Phases

### Phase 1: Foundation (DONE)

- [x] Theme system (Gruvbox dark/light)
- [x] Layout components (Header, Footer)
- [x] Base landing page
- [x] Brand identity styling

### Phase 2: Visualizations (DONE)

- [x] GridWalk visualizer
- [x] RandomWalk visualizer
- [x] MatrixRain visualizer
- [x] ParticleSwarm visualizer
- [x] Starfield visualizer
- [x] Ripples visualizer
- [x] Visualizer selector with animations
- [x] Visualizer controls (speed, params, restart)
- [x] Off option to disable visualizer

### Phase 3: Content Pages (IN PROGRESS)

- [ ] About page (placeholder)
- [ ] Services page (placeholder)
- [x] Contact page (temporary email)
- [ ] Products listing page (placeholder)
- [x] Privacy policy page
- [x] Terms of service page
- [x] Blog system with syntax highlighting

### Phase 4: importDoc Showcase

- [ ] Product page design
- [ ] Feature breakdown sections
- [ ] Interactive demo/mockup
- [ ] Waitlist signup form

### Phase 5: Polish & Enhancement

- [x] Theme toggle (Auto/Dark/Light dropdown)
- [x] Glassmorphism UI effects
- [x] Visualizer button hover effects
- [ ] Micro-interactions
- [ ] Performance optimization
- [ ] SEO meta tags

### Phase 6: Launch

- [ ] Accessibility audit
- [ ] Lighthouse performance check
- [ ] SEO meta tags finalization
- [ ] Deploy to Vercel

## Site Structure

```
/                       → Landing page (hero + product teaser + CTA)
/about                  → About ReignSoftware, philosophy
/services               → What we offer
/products               → Products listing
  /products/importdoc   → importDoc showcase
/contact                → Contact (temporary email)
/blog                   → Blog listing
  /blog/[slug]          → Individual blog posts
/privacy                → Privacy policy
/terms                  → Terms of service
/playground             → Playground (coming soon)
```
