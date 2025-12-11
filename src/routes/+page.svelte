<script lang="ts">
	import Hero from '$lib/components/sections/Hero.svelte';
	import Services from '$lib/components/sections/Services.svelte';
	import ProductTeaser from '$lib/components/sections/ProductTeaser.svelte';
	import { themeState } from '$lib/stores/theme.svelte';
	import { ArrowRight, Sparkles } from '@lucide/svelte';
</script>

<svelte:head>
	<title>ReignSoftware | Software that feels like magic</title>
</svelte:head>

<!-- Hero Section -->
<Hero />

<!-- Services Section -->
<Services />

<!-- Product Teaser (importDoc) -->
<ProductTeaser />

<!-- CTA Section -->
<section class="relative py-24">
	<div class="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
		{#if themeState.current === 'terminal'}
			<!-- Terminal-style CTA -->
			<div class="mx-auto max-w-2xl rounded-xl border border-border bg-card p-8">
				<div class="mb-4 flex items-center justify-center gap-2 text-sm text-muted-foreground">
					<span class="text-primary">$</span>
					<span>./start_project --with-reignsoftware</span>
					<span class="animate-pulse text-primary">_</span>
				</div>
				<h2 class="mb-4 text-3xl font-bold">
					<span class="text-[var(--gruvbox-bright-green)]">Ready to</span> build something great?
				</h2>
				<p class="mb-6 text-muted-foreground">
					<span class="text-[var(--gruvbox-bright-aqua)]"># </span>
					Let's discuss your project and create something exceptional together.
				</p>
				<a
					href="/contact"
					class="group inline-flex items-center gap-2 rounded-lg bg-primary px-8 py-4 font-medium text-primary-foreground transition-all hover:opacity-90"
				>
					<span>./contact --init</span>
					<ArrowRight class="h-4 w-4 transition-transform group-hover:translate-x-1" />
				</a>
			</div>
		{:else}
			<!-- Modern CTA -->
			<div class="mx-auto max-w-2xl">
				<div class="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm text-primary">
					<Sparkles class="h-4 w-4" />
					<span>Let's create together</span>
				</div>
				<h2 class="mb-4 text-3xl font-bold sm:text-4xl">
					Ready to build something <span class="text-primary">great</span>?
				</h2>
				<p class="mb-8 text-lg text-muted-foreground">
					Let's discuss your project and create something exceptional together.
				</p>
				<a
					href="/contact"
					class="group inline-flex items-center gap-2 rounded-lg bg-primary px-8 py-4 font-medium text-primary-foreground transition-all hover:opacity-90"
				>
					<span>Get in Touch</span>
					<ArrowRight class="h-4 w-4 transition-transform group-hover:translate-x-1" />
				</a>
			</div>
		{/if}
	</div>
</section>
