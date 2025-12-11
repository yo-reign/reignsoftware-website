<script lang="ts">
	import Hero from '$lib/components/sections/Hero.svelte';
	import Services from '$lib/components/sections/Services.svelte';
	import ProductTeaser from '$lib/components/sections/ProductTeaser.svelte';
	import { ArrowRight } from '@lucide/svelte';
</script>

<svelte:head>
	<title>reignsoftware | Dev</title>
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
		<!-- Terminal-style CTA -->
		<div class="mx-auto max-w-2xl border border-border bg-[var(--term-bg-soft)]">
			<div class="flex items-center gap-2 border-b border-border bg-secondary px-3 py-2 text-sm">
				<span class="text-[var(--term-green)]">$</span>
				<span class="text-[var(--term-gray)]">./start_project --with-<span class="text-[var(--term-red)]">reign</span><span class="text-[var(--term-fg)]">software</span></span>
				<span class="animate-pulse text-[var(--term-green)]">_</span>
			</div>
			<div class="p-8">
				<h2 class="mb-4 text-3xl font-bold">
					<span class="text-[var(--term-green)]">Ready to</span> build something great?
				</h2>
				<p class="mb-6 text-[var(--term-fg-dim)]">
					<span class="text-[var(--term-aqua)]"># </span>
					Let's discuss your project and create something exceptional together.
				</p>
				<a
					href="/contact"
					class="group inline-flex items-center gap-2 border border-[var(--term-green)] bg-[var(--term-bg-soft)] px-8 py-4 font-medium text-[var(--term-green)] transition-colors hover:bg-[var(--term-green)] hover:text-[var(--term-bg)]"
				>
					<span>[ ./contact --init ]</span>
					<ArrowRight class="h-4 w-4 transition-transform group-hover:translate-x-1" />
				</a>
			</div>
		</div>
	</div>
</section>
