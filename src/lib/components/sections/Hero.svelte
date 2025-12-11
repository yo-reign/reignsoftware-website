<script lang="ts">
	import { onMount } from 'svelte';
	import RandomWalk from '$lib/components/visualizers/RandomWalk.svelte';
	import { themeState } from '$lib/stores/theme.svelte';
	import { ArrowRight, Terminal, Sparkles } from '@lucide/svelte';

	let heroContent: HTMLElement;
	let mounted = $state(false);

	// Terminal typing effect for gruvbox theme
	let typedText = $state('');
	const fullText = 'Building software that feels like magic_';
	let typeIndex = $state(0);

	$effect(() => {
		if (mounted && themeState.current === 'gruvbox' && typeIndex < fullText.length) {
			const timeout = setTimeout(() => {
				typedText = fullText.slice(0, typeIndex + 1);
				typeIndex++;
			}, 50);
			return () => clearTimeout(timeout);
		}
	});

	onMount(() => {
		mounted = true;

		// Animate hero content with staggered entrance
		const elements = Array.from(heroContent.querySelectorAll('[data-animate]')) as HTMLElement[];
		elements.forEach((el, i) => {
			el.style.opacity = '0';
			el.style.transform = 'translateY(30px)';
			setTimeout(() => {
				el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
				el.style.opacity = '1';
				el.style.transform = 'translateY(0)';
			}, i * 100);
		});
	});
</script>

<section class="relative min-h-screen overflow-hidden">
	<!-- Visualizer Background -->
	<div class="absolute inset-0 opacity-40">
		<RandomWalk />
	</div>

	<!-- Gradient overlay -->
	<div class="absolute inset-0 bg-gradient-to-b from-background/50 via-background/70 to-background"></div>

	<!-- Content -->
	<div
		bind:this={heroContent}
		class="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col items-center justify-center px-4 pt-16 text-center sm:px-6 lg:px-8"
	>
		<!-- Terminal badge for gruvbox -->
		{#if themeState.current === 'gruvbox'}
			<div data-animate class="mb-6 flex items-center gap-2 rounded-full border border-border bg-card/80 px-4 py-2 opacity-0">
				<Terminal class="h-4 w-4 text-primary" />
				<span class="text-sm text-muted-foreground">v1.0.0 | powered by good code</span>
			</div>
		{:else}
			<div data-animate class="mb-6 flex items-center gap-2 rounded-full border border-border bg-card/80 px-4 py-2 opacity-0">
				<Sparkles class="h-4 w-4 text-primary" />
				<span class="text-sm text-muted-foreground">Software done differently</span>
			</div>
		{/if}

		<!-- Main headline -->
		<h1 data-animate class="mb-6 text-4xl font-bold tracking-tight opacity-0 sm:text-5xl md:text-6xl lg:text-7xl">
			{#if themeState.current === 'gruvbox'}
				<span class="text-muted-foreground">$ </span>
				<span class="text-foreground">{typedText}</span>
				<span class="animate-pulse text-primary">|</span>
			{:else}
				<span class="text-foreground">Software that </span>
				<span class="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
					feels like magic
				</span>
			{/if}
		</h1>

		<!-- Subheadline -->
		<p data-animate class="mb-8 max-w-2xl text-lg text-muted-foreground opacity-0 sm:text-xl">
			{#if themeState.current === 'gruvbox'}
				<span class="text-gruvbox-green">// </span>
				Fast, robust, and visually stunning solutions for businesses and consumers.
				<span class="text-gruvbox-green"> We don't just write code—we craft experiences.</span>
			{:else}
				Fast, robust, and visually stunning solutions for businesses and consumers.
				We don't just write code—we craft experiences.
			{/if}
		</p>

		<!-- CTA Buttons -->
		<div data-animate class="flex flex-col gap-4 opacity-0 sm:flex-row">
			<a
				href="/contact"
				class="group inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 font-medium text-primary-foreground transition-all hover:opacity-90"
			>
				{#if themeState.current === 'gruvbox'}
					<span>./start_project</span>
				{:else}
					<span>Start a Project</span>
				{/if}
				<ArrowRight class="h-4 w-4 transition-transform group-hover:translate-x-1" />
			</a>
			<a
				href="/products/importdoc"
				class="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-card px-6 py-3 font-medium transition-all hover:border-primary hover:bg-card/80"
			>
				{#if themeState.current === 'gruvbox'}
					<span>cat products/importdoc</span>
				{:else}
					<span>View importDoc</span>
				{/if}
			</a>
		</div>

		<!-- Scroll indicator -->
		<div data-animate class="absolute bottom-8 left-1/2 -translate-x-1/2 opacity-0">
			<div class="flex flex-col items-center gap-2 text-muted-foreground">
				<span class="text-xs">
					{#if themeState.current === 'gruvbox'}
						scroll --down
					{:else}
						Scroll to explore
					{/if}
				</span>
				<div class="h-8 w-5 rounded-full border-2 border-current p-1">
					<div class="h-2 w-1 animate-bounce rounded-full bg-current"></div>
				</div>
			</div>
		</div>
	</div>
</section>

<style>
	/* Gruvbox-specific text colors */
	:global([data-theme='gruvbox']) .text-gruvbox-green {
		color: var(--gruvbox-bright-green);
	}
</style>
