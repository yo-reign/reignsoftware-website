<script lang="ts">
	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition';
	import { visualizerState, speedOptions } from '$lib/stores/theme.svelte';
	import { visualizers, visualizerOrder, type VisualizerName } from '$lib/themes';
	import { ChevronRight, ChevronDown, Minus, Plus, RotateCcw } from '@lucide/svelte';

	let heroContent: HTMLElement;
	let visualPanelEl: HTMLElement;
	let mounted = $state(false);
	let panelExpanded = $state(true);

	// Scroll tracking for visual panel
	let visualPanelVisible = $state(true);

	// Terminal typing effect
	let typedText = $state('');
	const fullText = 'Better software, done right';
	let typeIndex = $state(0);

	// Track which param input is focused
	let focusedParam = $state<string | null>(null);

	$effect(() => {
		if (mounted && typeIndex < fullText.length) {
			const timeout = setTimeout(() => {
				typedText = fullText.slice(0, typeIndex + 1);
				typeIndex++;
			}, 50);
			return () => clearTimeout(timeout);
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

		// Dispatch custom event for header to listen to
		const updateHeaderState = () => {
			window.dispatchEvent(
				new CustomEvent('visual-selector-visibility', {
					detail: { visible: visualPanelVisible }
				})
			);
		};

		$effect(() => {
			updateHeaderState();
		});

		return () => observer.disconnect();
	});

	function selectVisualizer(visualizer: VisualizerName) {
		visualizerState.set(visualizer);
	}

	function getVisualizerColor(name: VisualizerName): string {
		switch (name) {
			case 'grid-walk':
				return 'var(--term-green)';
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

	// Check if we can decrease/increase speed
	function canDecreaseSpeed(): boolean {
		return speedOptions.indexOf(visualizerState.speedMultiplier) > 0;
	}

	function canIncreaseSpeed(): boolean {
		return speedOptions.indexOf(visualizerState.speedMultiplier) < speedOptions.length - 1;
	}

	// Handle keyboard input for params
	function handleParamKeydown(e: KeyboardEvent, key: string) {
		const config = visualizers[visualizerState.current].params[key];
		if (!config) return;

		if (e.key === 'ArrowUp' || e.key === 'ArrowRight') {
			e.preventDefault();
			visualizerState.adjustParam(key, config.step);
		} else if (e.key === 'ArrowDown' || e.key === 'ArrowLeft') {
			e.preventDefault();
			visualizerState.adjustParam(key, -config.step);
		}
	}

	function handleParamInput(e: Event, key: string) {
		const input = e.target as HTMLInputElement;
		const value = parseInt(input.value, 10);
		if (!isNaN(value)) {
			visualizerState.setParam(key, value);
		}
	}

	function handleParamBlur(e: Event, key: string) {
		focusedParam = null;
		// Ensure value is clamped on blur
		const config = visualizers[visualizerState.current].params[key];
		if (config) {
			const currentValue = visualizerState.currentParams[key];
			visualizerState.setParam(key, currentValue);
		}
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
					<div class="mb-2 text-sm text-[var(--term-gray)]">
						<span class="text-[var(--term-green)]">$</span> cat ./mission.txt
					</div>
					<h1
						class="text-3xl font-bold leading-tight text-[var(--term-fg)] sm:text-4xl md:text-5xl"
					>
						{typedText}<span class="animate-pulse text-[var(--term-green)]"></span>
					</h1>
				</div>

				<!-- Description -->
				<div class="mb-8 border-l-2 border-[var(--term-blue)] pl-4">
					<p class="text-lg text-[var(--term-fg-dim)]">
						<span class="text-[var(--term-aqua)]"># </span>
						Fast, robust, and visually stunning solutions.<br />
						<span class="text-[var(--term-aqua)]"># </span>
						We don't just write code — we craft experiences.
					</p>
				</div>

				<!-- CTA -->
				<div class="flex flex-col gap-3 sm:flex-row">
					<a
						href="/contact"
						class="group inline-flex items-center gap-2 border border-[var(--term-green)] bg-[var(--term-bg-soft)] px-4 py-2 font-mono text-sm text-[var(--term-green)] transition-colors hover:bg-[var(--term-green)] hover:text-[var(--term-bg)]"
					>
						<span>[ START PROJECT ]</span>
						<ChevronRight class="h-4 w-4 transition-transform group-hover:translate-x-1" />
					</a>
					<a
						href="/products/importdoc"
						class="inline-flex items-center gap-2 border border-border bg-[var(--term-bg-soft)] px-4 py-2 font-mono text-sm text-[var(--term-fg-dim)] transition-colors hover:border-[var(--term-blue)] hover:text-[var(--term-blue)]"
					>
						<span>view ./products/importdoc</span>
					</a>
				</div>
			</div>
		</div>

		<!-- Combined Visualizer Panel - anchored to bottom -->
		<div bind:this={visualPanelEl} class="pb-8">
			<div class="border border-border bg-[var(--term-bg-soft)]">
				<!-- Header - clickable to collapse -->
				<button
					onclick={() => (panelExpanded = !panelExpanded)}
					class="flex w-full items-center justify-between bg-secondary px-3 py-2 text-sm transition-colors hover:bg-[var(--term-bg1)]"
				>
					<div class="flex items-center gap-2">
						<span class="text-[var(--term-green)]">$</span>
						<span class="text-[var(--term-gray)]">visualizer --interactive</span>
					</div>
					<div class="flex items-center gap-3">
						<span class="text-xs text-[var(--term-fg-dim)]">
							{visualizers[visualizerState.current].displayName}
						</span>
						<ChevronDown
							class="h-3 w-3 text-[var(--term-gray)] transition-transform duration-200 {panelExpanded
								? 'rotate-180'
								: ''}"
						/>
					</div>
				</button>

				<!-- Collapsible content -->
				<div
					class="grid transition-[grid-template-rows] duration-200 ease-out {panelExpanded
						? 'grid-rows-[1fr]'
						: 'grid-rows-[0fr]'}"
				>
					<div class="overflow-hidden">
						<div class="border-t border-border">
							<!-- Two column layout: selector on left, controls on right -->
							<div class="grid md:grid-cols-2">
								<!-- Visualizer Selector -->
								<div class="border-b border-border p-3 md:border-b-0 md:border-r">
									<div class="mb-2 text-xs text-[var(--term-gray)]"># Select visualizer</div>
									<div class="grid gap-2 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2">
										{#each visualizerOrder as visualizerName}
											{@const visualizer = visualizers[visualizerName]}
											{@const visualizerColor = getVisualizerColor(visualizerName)}
											<button
												onclick={() => selectVisualizer(visualizerName)}
												disabled={visualizerState.isTransitioning}
												class="group flex items-center gap-3 border px-3 py-2 text-left transition-all disabled:opacity-50 {visualizerState.current ===
												visualizerName
													? 'border-[var(--term-green)] bg-[var(--term-bg1)]'
													: 'border-border hover:border-[var(--term-gray)]'}"
											>
												<span style="color: {visualizerColor}"></span>
												<div class="flex-1">
													<div class="text-sm" style="color: {visualizerColor}">
														./{visualizer.name}/
													</div>
													<div class="text-xs text-[var(--term-fg-dim)]">{visualizer.tagline}</div>
												</div>
												{#if visualizerState.current === visualizerName}
													<span class="text-xs text-[var(--term-green)]">*</span>
												{/if}
											</button>
										{/each}
									</div>
								</div>

								<!-- Controls -->
								<div class="p-3">
									<div class="mb-2 text-xs text-[var(--term-gray)]">
										# Adjust parameters
										{#if visualizers[visualizerState.current].interactive}
											<span class="ml-2 text-[var(--term-yellow)]">(interactive)</span>
										{/if}
									</div>
									<div class="flex flex-col gap-3">
										<!-- Speed control -->
										<div class="flex items-center justify-between gap-3">
											<span class="text-sm text-[var(--term-purple)]">--speed</span>
											<div class="flex items-center gap-1">
												<button
													onclick={() => visualizerState.cycleSpeed(-1)}
													disabled={!canDecreaseSpeed()}
													class="flex h-7 w-7 items-center justify-center border border-border transition-colors hover:border-[var(--term-purple)] hover:text-[var(--term-purple)] disabled:opacity-30 disabled:hover:border-border disabled:hover:text-current"
												>
													<Minus class="h-3 w-3" />
												</button>
												<span
													class="w-16 text-center font-mono text-sm text-[var(--term-purple)]"
												>
													{formatSpeed(visualizerState.speedMultiplier)}
												</span>
												<button
													onclick={() => visualizerState.cycleSpeed(1)}
													disabled={!canIncreaseSpeed()}
													class="flex h-7 w-7 items-center justify-center border border-border transition-colors hover:border-[var(--term-purple)] hover:text-[var(--term-purple)] disabled:opacity-30 disabled:hover:border-border disabled:hover:text-current"
												>
													<Plus class="h-3 w-3" />
												</button>
											</div>
										</div>

										<!-- Dynamic params for current visualizer -->
										{#each Object.entries(visualizers[visualizerState.current].params) as [key, config]}
											<div class="flex items-center justify-between gap-3">
												<span class="text-sm" style="color: {config.color}">{config.label}</span>
												<div class="flex items-center gap-1">
													<button
														onclick={() => visualizerState.adjustParam(key, -config.step)}
														disabled={visualizerState.currentParams[key] <= config.min}
														class="flex h-7 w-7 items-center justify-center border border-border transition-colors disabled:opacity-30 disabled:hover:border-border disabled:hover:text-current"
														style="--hover-color: {config.color}"
														onmouseenter={(e) =>
															(e.currentTarget.style.borderColor = config.color)}
														onmouseleave={(e) => (e.currentTarget.style.borderColor = '')}
													>
														<Minus class="h-3 w-3" />
													</button>
													<input
														type="number"
														value={visualizerState.currentParams[key]}
														min={config.min}
														max={config.max}
														step={config.step}
														onfocus={() => (focusedParam = key)}
														onblur={(e) => handleParamBlur(e, key)}
														onkeydown={(e) => handleParamKeydown(e, key)}
														oninput={(e) => handleParamInput(e, key)}
														class="w-16 border border-border bg-transparent text-center font-mono text-sm transition-colors focus:border-[var(--term-fg)] focus:outline-none"
														style="color: {config.color}"
													/>
													<button
														onclick={() => visualizerState.adjustParam(key, config.step)}
														disabled={visualizerState.currentParams[key] >= config.max}
														class="flex h-7 w-7 items-center justify-center border border-border transition-colors disabled:opacity-30 disabled:hover:border-border disabled:hover:text-current"
														style="--hover-color: {config.color}"
														onmouseenter={(e) =>
															(e.currentTarget.style.borderColor = config.color)}
														onmouseleave={(e) => (e.currentTarget.style.borderColor = '')}
													>
														<Plus class="h-3 w-3" />
													</button>
												</div>
											</div>
										{/each}

										<!-- Action button -->
										<div class="pt-1">
											<button
												onclick={() => {
													visualizerState.resetParams();
													visualizerState.restart();
												}}
												class="flex w-full items-center justify-center gap-2 border border-[var(--term-red)] px-3 py-2 text-sm text-[var(--term-red)] transition-colors hover:bg-[var(--term-red)] hover:text-[var(--term-bg)]"
											>
												<RotateCcw class="h-3 w-3" />
												<span>--reset</span>
											</button>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</section>

<style>
	/* Hide number input spinners */
	input[type='number']::-webkit-inner-spin-button,
	input[type='number']::-webkit-outer-spin-button {
		-webkit-appearance: none;
		margin: 0;
	}

	input[type='number'] {
		-moz-appearance: textfield;
		appearance: textfield;
	}
</style>
