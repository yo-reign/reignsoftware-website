<script lang="ts">
	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition';
	import { visualizerState, speedOptions } from '$lib/stores/visualizer.svelte';
	import {
		visualizers,
		visualizerOrder,
		type VisualizerName
	} from '$lib/components/visualizers/config';
	import { ChevronRight, ChevronDown, RotateCcw } from '@lucide/svelte';

	let heroContent: HTMLElement;
	let visualPanelEl: HTMLElement;
	let mounted = $state(false);
	let panelExpanded = $state(true);

	// Scroll tracking for visual panel
	let visualPanelVisible = $state(true);

	// Terminal typing effect
	let typedText = $state('');
	const fullText = '# Better software, done right';
	let typeIndex = $state(0);

	$effect(() => {
		if (mounted && typeIndex < fullText.length) {
			const timeout = setTimeout(() => {
				typedText = fullText.slice(0, typeIndex + 1);
				typeIndex++;
			}, 50);
			return () => clearTimeout(timeout);
		}
	});

	// Dispatch custom event for header to listen to when visual panel visibility changes
	$effect(() => {
		if (mounted) {
			window.dispatchEvent(
				new CustomEvent('visual-selector-visibility', {
					detail: { visible: visualPanelVisible }
				})
			);
		}
	});

	onMount(() => {
		mounted = true;

		// Scroll observer for visual panel
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					visualPanelVisible = entry.isIntersecting;
				});
			},
			{ threshold: 0.1 }
		);

		if (visualPanelEl) {
			observer.observe(visualPanelEl);
		}

		return () => observer.disconnect();
	});

	function selectVisualizer(visualizer: VisualizerName) {
		visualizerState.set(visualizer);
	}

	function getVisualizerColor(name: VisualizerName): string {
		switch (name) {
			case 'grid-walk':
				return 'var(--term-red)';
			case 'random-walk':
				return 'var(--term-blue)';
			case 'matrix-rain':
				return 'var(--term-green)';
			case 'particle-swarm':
				return 'var(--term-yellow)';
			case 'starfield':
				return 'var(--term-purple)';
			case 'ripples':
				return 'var(--term-aqua)';
			default:
				return 'var(--term-green)';
		}
	}

	function formatSpeed(multiplier: number): string {
		return multiplier < 1 ? `${multiplier}x` : `${multiplier.toFixed(1)}x`;
	}

	// Cycle param value on tap (for mobile-friendly interaction)
	function cycleParam(key: string, direction: 1 | -1 = 1) {
		const config = visualizers[visualizerState.current].params[key];
		if (!config) return;
		visualizerState.adjustParam(key, config.step * direction);
	}
</script>

<section class="relative min-h-screen">
	<!-- Content -->
	<div
		bind:this={heroContent}
		class="relative z-10 mx-auto flex min-h-screen max-w-6xl flex-col justify-between px-4 sm:px-6 lg:px-8"
	>
		<!-- Main content area - anchored to top with padding -->
		<div class="pt-24 sm:pt-32">
			<div class="max-w-4xl" in:fly={{ y: 30, duration: 400, delay: 100 }}>
				<!-- Main headline -->
				<div class="mb-6">
					<div class="mb-2 text-sm text-(--term-gray)">
						<span class="text-(--term-green)">$</span> cat ./mission.txt
					</div>
					<h1 class="text-3xl font-bold leading-tight text-(--term-fg) sm:text-4xl md:text-5xl">
						{typedText}<span class="animate-pulse text-(--term-green)"></span>
					</h1>
				</div>

				<!-- Description -->
				<div class="mb-8 border-l-2 border-(--term-blue) pl-4">
					<p class="text-lg text-(--term-fg-dim)">
						<span class="text-(--term-aqua)">> </span>
						Fast, robust, and visually stunning applications.<br />
						<span class="text-(--term-aqua)">> </span>
						Created by nerds.
					</p>
				</div>

				<!-- CTA -->
				<div class="flex flex-col gap-3 sm:flex-row">
					<a
						href="/contact"
						class="group inline-flex items-center gap-2 border-2 border-(--term-green) px-4 py-2 font-mono text-sm text-(--term-green) transition-all hover:bg-(--term-green) hover:text-(--term-bg)"
					>
						<span>[ START PROJECT ]</span>
						<ChevronRight class="h-4 w-4 transition-transform group-hover:translate-x-1" />
					</a>
					<a
						href="/products/import-doc"
						class="inline-flex items-center gap-2 border border-border/50 bg-card/50 px-4 py-2 font-mono text-sm text-(--term-fg-dim) transition-all hover:border-(--term-blue) hover:text-(--term-blue)"
					>
						<span>view ./products/import-doc</span>
					</a>
				</div>
			</div>
		</div>

		<!-- Compact Visualizer Panel - anchored to bottom -->
		<div bind:this={visualPanelEl} class="pb-4">
			<div class="border border-border/50 bg-card/80 backdrop-blur-sm">
				<!-- Header - clickable to collapse -->
				<button
					onclick={() => (panelExpanded = !panelExpanded)}
					class="flex w-full items-center justify-between px-3 py-2 text-sm transition-colors hover:bg-secondary/30"
				>
					<div class="flex items-center gap-2">
						<span class="text-(--term-green)">$</span>
						<span class="hidden text-(--term-gray) sm:inline">visualizer</span>
						<span class="text-xs" style="color: {getVisualizerColor(visualizerState.current)}">
							{visualizers[visualizerState.current].displayName}
						</span>
					</div>
					<ChevronDown
						class="h-4 w-4 text-(--term-gray) transition-transform duration-200 {panelExpanded
							? 'rotate-180'
							: ''}"
					/>
				</button>

				<!-- Collapsible content -->
				<div
					class="grid transition-[grid-template-rows] duration-200 ease-out {panelExpanded
						? 'grid-rows-[1fr]'
						: 'grid-rows-[0fr]'}"
				>
					<div class="overflow-hidden">
						<div class="border-t border-border/50">
							<!-- Horizontal scrolling visualizer selector -->
							<div class="flex gap-2 overflow-x-auto p-2 scrollbar-hide">
								{#each visualizerOrder as visualizerName (visualizerName)}
									{@const visualizerColor = getVisualizerColor(visualizerName)}
									<button
										onclick={() => selectVisualizer(visualizerName)}
										disabled={visualizerState.isTransitioning}
										class="shrink-0 px-4 py-2 text-sm transition-all disabled:opacity-50 {visualizerState.current ===
										visualizerName
											? 'border border-(--term-green) bg-secondary/50'
											: 'border border-border/30 hover:border-border hover:bg-secondary/30'}"
										style="color: {visualizerState.current === visualizerName
											? 'var(--term-green)'
											: visualizerColor}"
									>
										{visualizers[visualizerName].displayName}
									</button>
								{/each}
							</div>

							<!-- Controls row - horizontal scroll like visualizers -->
							<div
								class="flex items-center gap-2 overflow-x-auto border-t border-border/50 px-2 py-2 scrollbar-hide"
							>
								<!-- Reset button at front for stability -->
								<button
									onclick={() => {
										visualizerState.resetParams();
										visualizerState.restart();
									}}
									class="flex h-9 w-9 shrink-0 items-center justify-center border border-border/30 text-(--term-red) transition-colors hover:border-(--term-red) hover:bg-(--term-red)/10"
									title="Reset"
								>
									<RotateCcw class="h-4 w-4" />
								</button>

								<!-- Speed control with -/+ buttons -->
								<div class="flex shrink-0 items-center">
									<button
										onclick={() => visualizerState.cycleSpeed(-1)}
										class="flex h-9 w-8 items-center justify-center border border-border/30 text-(--term-purple) transition-colors hover:border-(--term-purple) hover:bg-secondary/30 disabled:opacity-30"
										disabled={speedOptions.indexOf(visualizerState.speedMultiplier) === 0}
									>
										−
									</button>
									<div class="grid h-9 place-items-center border-y border-border/30 px-2">
										<span class="text-xs">
											<span class="text-(--term-gray)">speed</span>
											<span class="ml-1.5 font-mono text-(--term-purple)"
												>{formatSpeed(visualizerState.speedMultiplier)}</span
											>
										</span>
									</div>
									<button
										onclick={() => visualizerState.cycleSpeed(1)}
										class="flex h-9 w-8 items-center justify-center border border-border/30 text-(--term-purple) transition-colors hover:border-(--term-purple) hover:bg-secondary/30 disabled:opacity-30"
										disabled={speedOptions.indexOf(visualizerState.speedMultiplier) ===
											speedOptions.length - 1}
									>
										+
									</button>
								</div>

								<!-- Dynamic params with -/+ buttons -->
								{#each Object.entries(visualizers[visualizerState.current].params) as [key, config] (key)}
									<div class="flex shrink-0 items-center">
										<button
											onclick={() => cycleParam(key, -1)}
											class="flex h-9 w-8 items-center justify-center border border-border/30 transition-colors hover:bg-secondary/30 disabled:opacity-30"
											style="color: {config.color}"
											disabled={visualizerState.currentParams[key] <= config.min}
										>
											−
										</button>
										<div class="grid h-9 place-items-center border-y border-border/30 px-2">
											<span class="text-xs">
												<span class="text-(--term-gray)">{config.label.replace('--', '')}</span>
												<span class="ml-1.5 font-mono" style="color: {config.color}"
													>{visualizerState.currentParams[key]}</span
												>
											</span>
										</div>
										<button
											onclick={() => cycleParam(key, 1)}
											class="flex h-9 w-8 items-center justify-center border border-border/30 transition-colors hover:bg-secondary/30 disabled:opacity-30"
											style="color: {config.color}"
											disabled={visualizerState.currentParams[key] >= config.max}
										>
											+
										</button>
									</div>
								{/each}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</section>

<style>
	/* Hide scrollbar but keep functionality */
	.scrollbar-hide {
		-ms-overflow-style: none;
		scrollbar-width: none;
	}
	.scrollbar-hide::-webkit-scrollbar {
		display: none;
	}
</style>
