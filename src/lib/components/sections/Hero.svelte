<script lang="ts">
	import { onMount } from 'svelte';
	import { fade, fly } from 'svelte/transition';
	import GridWalk from '$lib/components/visualizers/GridWalk.svelte';
	import { themeState } from '$lib/stores/theme.svelte';
	import { themes, themeOrder, type ThemeName } from '$lib/themes';
	import { ArrowRight, ChevronRight, ChevronUp, ChevronDown, Minus, Plus, RotateCcw } from '@lucide/svelte';

	let heroContent: HTMLElement;
	let themeSelectorEl: HTMLElement;
	let mounted = $state(false);
	let showControls = $state(true);

	// Visualizer controls
	let agentSpeed = $state(100);
	let agentCount = $state(8);
	let restartSignal = $state(0);

	// Scroll tracking for theme selector
	let themeSelectorVisible = $state(true);
	let themeSelectorRect = $state({ top: 0, left: 0, width: 0 });

	// Terminal typing effect
	let typedText = $state('');
	const fullText = 'Building software that feels like magic';
	let typeIndex = $state(0);

	// Track previous theme for transitions
	let previousTheme = $state<ThemeName | null>(null);

	// Export scroll state for header
	export function getThemeSelectorState() {
		return { visible: themeSelectorVisible, rect: themeSelectorRect };
	}

	$effect(() => {
		if (mounted && themeState.current === 'terminal' && typeIndex < fullText.length) {
			const timeout = setTimeout(() => {
				typedText = fullText.slice(0, typeIndex + 1);
				typeIndex++;
			}, 50);
			return () => clearTimeout(timeout);
		}
	});

	// Reset typing when theme changes to terminal
	$effect(() => {
		if (themeState.current === 'terminal' && previousTheme !== 'terminal') {
			typeIndex = 0;
			typedText = '';
		}
		previousTheme = themeState.current;
	});

	onMount(() => {
		mounted = true;
		previousTheme = themeState.current;

		// Scroll observer for theme selector
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					themeSelectorVisible = entry.isIntersecting;
					if (themeSelectorEl) {
						const rect = themeSelectorEl.getBoundingClientRect();
						themeSelectorRect = { top: rect.top, left: rect.left, width: rect.width };
					}
				});
			},
			{ threshold: 0.1 }
		);

		if (themeSelectorEl) {
			observer.observe(themeSelectorEl);
		}

		// Dispatch custom event for header to listen to
		const updateHeaderState = () => {
			window.dispatchEvent(
				new CustomEvent('theme-selector-visibility', {
					detail: { visible: themeSelectorVisible }
				})
			);
		};

		$effect(() => {
			updateHeaderState();
		});

		return () => observer.disconnect();
	});

	function selectTheme(theme: ThemeName) {
		themeState.set(theme);
	}

	function adjustSpeed(delta: number) {
		agentSpeed = Math.max(20, Math.min(300, agentSpeed + delta));
	}

	function adjustAgents(delta: number) {
		agentCount = Math.max(1, Math.min(20, agentCount + delta));
	}

	function restartVisualizer() {
		restartSignal++;
	}
</script>

<section class="relative min-h-screen overflow-hidden">
	<!-- Visualizer Background (only for terminal) -->
	{#if themeState.current === 'terminal'}
		<div class="absolute inset-0 opacity-50">
			<GridWalk speed={agentSpeed} agentCount={agentCount} restartSignal={restartSignal} />
		</div>
	{/if}

	<!-- Gradient overlay -->
	<div
		class="absolute inset-0 bg-gradient-to-b from-background/20 via-background/50 to-background"
	></div>

	<!-- Content - Better vertical centering -->
	<div
		bind:this={heroContent}
		class="relative z-10 mx-auto flex min-h-screen max-w-6xl flex-col px-4 sm:px-6 lg:px-8"
	>
		<!-- Spacer to push content to center -->
		<div class="flex-1"></div>

		<!-- Main content area - centered -->
		<div class="py-8">
			<!-- Use keyed block to properly transition between themes -->
			{#key themeState.current}
				<!-- Terminal-style layout -->
				{#if themeState.current === 'terminal'}
					<div class="max-w-3xl" in:fly={{ y: 30, duration: 400, delay: 100 }} out:fade={{ duration: 200 }}>
						<!-- Terminal window header -->
						<div class="mb-4 flex items-center gap-2">
							<div class="flex gap-1.5">
								<div class="h-3 w-3 rounded-full bg-[var(--term-red)]"></div>
								<div class="h-3 w-3 rounded-full bg-[var(--term-yellow)]"></div>
								<div class="h-3 w-3 rounded-full bg-[var(--term-green)]"></div>
							</div>
							<span class="ml-2 text-sm text-muted-foreground">reign@software:~</span>
						</div>

						<!-- Main headline -->
						<div class="mb-6">
							<div class="mb-2 text-sm text-muted-foreground">
								<span class="text-primary">$</span> cat ./mission.txt
							</div>
							<h1 class="text-3xl font-bold leading-tight sm:text-4xl md:text-5xl">
								{typedText}<span class="animate-pulse text-primary">█</span>
							</h1>
						</div>

						<!-- Description -->
						<div class="mb-8">
							<p class="text-lg text-muted-foreground">
								<span class="text-[var(--term-bright-green)]"># </span>
								Fast, robust, and visually stunning solutions.<br />
								<span class="text-[var(--term-bright-green)]"># </span>
								We don't just write code — we craft experiences.
							</p>
						</div>

						<!-- CTA -->
						<div class="mb-8 flex flex-col gap-3 sm:flex-row">
							<a
								href="/contact"
								class="group inline-flex items-center gap-2 rounded border border-primary bg-primary/10 px-4 py-2 font-mono text-sm text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
							>
								<span>./start_project</span>
								<ChevronRight class="h-4 w-4 transition-transform group-hover:translate-x-1" />
							</a>
							<a
								href="/products/importdoc"
								class="inline-flex items-center gap-2 rounded border border-border px-4 py-2 font-mono text-sm text-foreground transition-colors hover:border-primary"
							>
								<span>cat ./products/importdoc</span>
							</a>
						</div>

						<!-- Terminal Controls Panel -->
						<div>
							<button
								onclick={() => (showControls = !showControls)}
								class="mb-2 flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
							>
								<span class="text-primary">$</span>
								<span>visualizer --config</span>
								{#if showControls}
									<ChevronUp class="h-3 w-3" />
								{:else}
									<ChevronDown class="h-3 w-3" />
								{/if}
							</button>

							{#if showControls}
								<div
									class="rounded border border-border bg-card/80 p-4 backdrop-blur-sm"
									transition:fly={{ y: -10, duration: 200 }}
								>
									<div class="mb-3 text-xs text-muted-foreground">
										# Adjust visualizer parameters
									</div>
									<div class="flex flex-wrap items-center gap-6">
										<!-- Speed control -->
										<div class="flex items-center gap-3">
											<span class="text-sm text-muted-foreground">--speed</span>
											<div class="flex items-center gap-1">
												<button
													onclick={() => adjustSpeed(20)}
													class="rounded border border-border p-1 transition-colors hover:border-primary hover:text-primary"
												>
													<Minus class="h-3 w-3" />
												</button>
												<span class="w-12 text-center font-mono text-sm text-primary"
													>{agentSpeed}ms</span
												>
												<button
													onclick={() => adjustSpeed(-20)}
													class="rounded border border-border p-1 transition-colors hover:border-primary hover:text-primary"
												>
													<Plus class="h-3 w-3" />
												</button>
											</div>
										</div>

										<!-- Agent count control -->
										<div class="flex items-center gap-3">
											<span class="text-sm text-muted-foreground">--agents</span>
											<div class="flex items-center gap-1">
												<button
													onclick={() => adjustAgents(-1)}
													class="rounded border border-border p-1 transition-colors hover:border-primary hover:text-primary"
												>
													<Minus class="h-3 w-3" />
												</button>
												<span class="w-8 text-center font-mono text-sm text-primary">{agentCount}</span
												>
												<button
													onclick={() => adjustAgents(1)}
													class="rounded border border-border p-1 transition-colors hover:border-primary hover:text-primary"
												>
													<Plus class="h-3 w-3" />
												</button>
											</div>
										</div>

										<!-- Restart button -->
										<button
											onclick={restartVisualizer}
											class="flex items-center gap-2 rounded border border-border px-3 py-1 text-sm text-muted-foreground transition-colors hover:border-primary hover:text-primary"
										>
											<RotateCcw class="h-3 w-3" />
											<span>--restart</span>
										</button>
									</div>
								</div>
							{/if}
						</div>
					</div>
				{:else}
					<!-- Other themes - centered layout -->
					<div class="mx-auto max-w-3xl text-center" in:fly={{ y: 30, duration: 400, delay: 100 }} out:fade={{ duration: 200 }}>
						<h1 class="mb-6 text-4xl font-bold sm:text-5xl md:text-6xl">
							Software that <span class="text-primary">feels like magic</span>
						</h1>
						<p class="mb-8 text-lg text-muted-foreground">
							Fast, robust, and visually stunning solutions for businesses and consumers.
						</p>
						<div class="flex justify-center gap-4">
							<a
								href="/contact"
								class="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-medium text-primary-foreground transition-opacity hover:opacity-90"
							>
								Start a Project
								<ArrowRight class="h-4 w-4" />
							</a>
						</div>
					</div>
				{/if}
			{/key}
		</div>

		<!-- Spacer -->
		<div class="flex-1"></div>

		<!-- Theme Selector - anchored to bottom -->
		<div bind:this={themeSelectorEl} class="pb-8">
			<div class="border-t border-border pt-6">
				{#if themeState.current === 'terminal'}
					<div class="mb-4 text-sm text-muted-foreground" in:fade={{ duration: 200 }}>
						<span class="text-primary">$</span> ls ./experiences/
					</div>
				{:else}
					<p class="mb-4 text-sm text-muted-foreground" in:fade={{ duration: 200 }}>Explore different experiences</p>
				{/if}

				<div class="flex flex-wrap gap-3">
					{#each themeOrder as themeName}
						{@const theme = themes[themeName]}
						<button
							onclick={() => selectTheme(themeName)}
							disabled={themeState.isTransitioning}
							class="group relative flex items-center gap-3 rounded border px-4 py-3 text-left transition-all disabled:opacity-50 {themeState.current ===
							themeName
								? 'border-primary bg-primary/10'
								: 'border-border hover:border-primary/50 hover:bg-card/50'}"
						>
							<div
								class="h-3 w-3 rounded-full transition-transform group-hover:scale-110"
								style="background: {themeName === 'terminal'
									? '#fe8019'
									: themeName === 'minimal'
										? '#88c0d0'
										: themeName === 'cyber'
											? '#bd93f9'
											: '#cba6f7'}"
							></div>
							<div>
								<div class="font-medium">
									{#if themeState.current === 'terminal'}
										./{theme.name}/
									{:else}
										{theme.displayName}
									{/if}
								</div>
								<div class="text-xs text-muted-foreground">{theme.tagline}</div>
							</div>
							{#if themeState.current === themeName}
								<span class="ml-2 text-xs text-primary">[active]</span>
							{/if}
						</button>
					{/each}
				</div>
			</div>
		</div>
	</div>
</section>

<style>
	@keyframes slideDown {
		from {
			opacity: 0;
			transform: translateY(-10px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
</style>
