<script lang="ts">
	import Hero from '$lib/components/sections/Hero.svelte';
	import ProductTeaser from '$lib/components/sections/ProductTeaser.svelte';
	import { ArrowRight } from '@lucide/svelte';
	import SectionHeader from '$lib/components/ui/SectionHeader.svelte';
</script>

<!-- Hero Section -->
<Hero />

<!-- Product Teaser Section -->
<section>
	<SectionHeader sectionName="products" mainTitle="Software in Production" />
	<!-- importDoc -->
	<ProductTeaser />
</section>

<!-- CTA Section -->
<section class="relative py-24">
	<div class="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
		<!-- Terminal-style CTA -->
		<div class="mx-auto max-w-2xl border border-border/50 bg-card/80 backdrop-blur-sm">
			<div
				class="flex items-center gap-2 border-b border-border/50 bg-secondary/50 px-3 py-2 text-sm"
			>
				<span class="text-(--term-green)">$</span>
				<span class="text-(--term-gray)"
					>./start_project --with-<span class="text-(--term-red)">reign</span><span
						class="text-(--term-fg)">software</span
					></span
				>
				<span class="animate-pulse text-(--term-green)">_</span>
			</div>
			<div class="p-8">
				<h2 class="mb-4 text-3xl font-bold">
					<span class="text-(--term-green)">Ready to</span> build something great?
				</h2>
				<p class="mb-6 text-(--term-fg-dim)">
					<span class="text-(--term-aqua)"># </span>
					Let's discuss your project and create something together.
				</p>
				<a
					href="/contact"
					class="group inline-flex items-center gap-2 border-2 border-(--term-green) px-8 py-4 font-medium text-(--term-green) transition-all hover:bg-(--term-green) hover:text-(--term-bg)"
				>
					<span>[ ./contact --init ]</span>
					<ArrowRight class="h-4 w-4 transition-transform group-hover:translate-x-1" />
				</a>
			</div>
		</div>
	</div>
</section>
