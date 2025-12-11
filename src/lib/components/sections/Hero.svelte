<script lang="ts">
	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition';
	import GridWalk from '$lib/components/visualizers/GridWalk.svelte';
	import RandomWalk from '$lib/components/visualizers/RandomWalk.svelte';
	import { visualizerState } from '$lib/stores/theme.svelte';
	import { visualizers, visualizerOrder, type VisualizerName } from '$lib/themes';
	import {
		ChevronRight,
		ChevronDown,
		Minus,
		Plus,
		RotateCcw
	} from '@lucide/svelte';

	let heroContent: HTMLElement;
	let visualSelectorEl: HTMLElement;
	let mounted = $state(false);
	let showControls = $state(true);

	// Visualizer controls
	let agentSpeed = $state(100);
	let agentCount = $state(8);
	let restartSignal = $state(0);

	// Scroll tracking for visual selector
	let visualSelectorVisible = $state(true);

	// Terminal typing effect
	let typedText = $state('');
	const fullText = 'Building software that feels like magic';
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

	onMount(() => {
		mounted = true;

		// Scroll observer for visual selector
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					visualSelectorVisible = entry.isIntersecting;
				});
			},
			{ threshold: 0.1 }
		);

		if (visualSelectorEl) {
			observer.observe(visualSelectorEl);
		}

		// Dispatch custom event for header to listen to
		const updateHeaderState = () => {
			window.dispatchEvent(
				new CustomEvent('visual-selector-visibility', {
					detail: { visible: visualSelectorVisible }
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

	function adjustSpeed(delta: number) {
		agentSpeed = Math.max(20, Math.min(300, agentSpeed + delta));
	}

	function adjustAgents(delta: number) {
		agentCount = Math.max(1, Math.min(20, agentCount + delta));
	}

	function restartVisualizer() {
		restartSignal++;
	}

	function getVisualizerColor(name: VisualizerName): string {
		switch (name) {
			case 'grid-walk':
				return 'var(--term-green)';
			case 'random-walk':
				return 'var(--term-blue)';
			default:
				return 'var(--term-green)';
		}
	}
</script>

<section class="relative min-h-screen overflow-hidden">
	<!-- Visualizer Background -->
	<div class="absolute inset-0 opacity-50">
		{#if visualizerState.current === 'grid-walk'}
			<GridWalk speed={agentSpeed} {agentCount} {restartSignal} />
		{:else if visualizerState.current === 'random-walk'}
			<RandomWalk speed={agentSpeed} {agentCount} {restartSignal} />
		{/if}
	</div>

	<!-- Gradient overlay -->
	<div
		class="absolute inset-0 bg-gradient-to-b from-background/20 via-background/50 to-background"
	></div>

	<!-- Content - Better vertical centering -->
	<div
		bind:this={heroContent}
		class="relative z-10 mx-auto flex min-h-screen max-w-6xl flex-col justify-between px-4 sm:px-6 lg:px-8"
	>
		<!-- Main content area - anchored to top with padding -->
		<div class="pt-24 sm:pt-32">
			<div
				class="max-w-4xl"
				in:fly={{ y: 30, duration: 400, delay: 100 }}
			>
				<!-- Main headline -->
				<div class="mb-6">
					<div class="mb-2 text-sm text-[var(--term-gray)]">
						<span class="text-[var(--term-green)]">$</span> cat ./mission.txt
					</div>
					<h1
						class="text-3xl font-bold leading-tight text-[var(--term-fg)] sm:text-4xl md:text-5xl"
					>
						{typedText}<span class="animate-pulse text-[var(--term-green)]">█</span>
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
				<div class="mb-8 flex flex-col gap-3 sm:flex-row">
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

				<!-- Terminal Controls Panel -->
				<div class="border border-border bg-[var(--term-bg-soft)]">
					<button
						onclick={() => (showControls = !showControls)}
						class="flex w-full items-center justify-between bg-secondary px-3 py-2 text-sm transition-colors hover:bg-[var(--term-bg1)] {showControls
							? 'border-b border-border'
							: ''}"
					>
						<div class="flex items-center gap-2">
							<span class="text-[var(--term-green)]">$</span>
							<span class="text-[var(--term-gray)]">visualizer --config</span>
						</div>
						<ChevronDown
							class="h-3 w-3 text-[var(--term-gray)] transition-transform duration-200 {showControls
								? 'rotate-180'
								: ''}"
						/>
					</button>

					<div
						class="grid transition-[grid-template-rows] duration-200 ease-out {showControls
							? 'grid-rows-[1fr]'
							: 'grid-rows-[0fr]'}"
					>
						<div class="overflow-hidden">
							<div class="p-4">
								<div class="mb-3 text-xs text-[var(--term-gray)]">
									# Adjust visualizer parameters
								</div>
								<div class="flex flex-wrap items-center gap-6">
									<!-- Speed control -->
									<div class="flex items-center gap-3">
										<span class="w-16 text-sm text-[var(--term-purple)]">--speed</span>
										<div class="flex items-center gap-1">
											<button
												onclick={() => adjustSpeed(20)}
												class="flex h-6 w-6 items-center justify-center border border-border transition-colors hover:border-[var(--term-purple)] hover:text-[var(--term-purple)]"
											>
												<Minus class="h-3 w-3" />
											</button>
											<span class="w-14 text-center font-mono text-sm text-[var(--term-purple)]"
												>{agentSpeed}ms</span
											>
											<button
												onclick={() => adjustSpeed(-20)}
												class="flex h-6 w-6 items-center justify-center border border-border transition-colors hover:border-[var(--term-purple)] hover:text-[var(--term-purple)]"
											>
												<Plus class="h-3 w-3" />
											</button>
										</div>
									</div>

									<!-- Agent count control -->
									<div class="flex items-center gap-3">
										<span class="w-16 text-sm text-[var(--term-blue)]">--agents</span>
										<div class="flex items-center gap-1">
											<button
												onclick={() => adjustAgents(-1)}
												class="flex h-6 w-6 items-center justify-center border border-border transition-colors hover:border-[var(--term-blue)] hover:text-[var(--term-blue)]"
											>
												<Minus class="h-3 w-3" />
											</button>
											<span class="w-14 text-center font-mono text-sm text-[var(--term-blue)]"
												>{agentCount}</span
											>
											<button
												onclick={() => adjustAgents(1)}
												class="flex h-6 w-6 items-center justify-center border border-border transition-colors hover:border-[var(--term-blue)] hover:text-[var(--term-blue)]"
											>
												<Plus class="h-3 w-3" />
											</button>
										</div>
									</div>

									<!-- Restart button -->
									<button
										onclick={restartVisualizer}
										class="flex items-center gap-2 border border-[var(--term-red)] px-3 py-1 text-sm text-[var(--term-red)] transition-colors hover:bg-[var(--term-red)] hover:text-[var(--term-bg)]"
									>
										<RotateCcw class="h-3 w-3" />
										<span>--restart</span>
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- Visual Selector - anchored to bottom -->
		<div bind:this={visualSelectorEl} class="pb-8">
			<!-- TUI-style visual selector -->
			<div class="border border-border bg-[var(--term-bg-soft)]">
				<div
					class="flex items-center gap-2 border-b border-border bg-secondary px-3 py-2 text-sm"
				>
					<span class="text-[var(--term-green)]">$</span>
					<span class="text-[var(--term-gray)]">ls ./visuals/</span>
				</div>
				<div class="grid gap-2 p-3 sm:grid-cols-2">
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
							<span style="color: {visualizerColor}">■</span>
							<div class="flex-1">
								<div class="text-sm" style="color: {visualizerColor}">./{visualizer.name}/</div>
								<div class="text-xs text-[var(--term-fg-dim)]">{visualizer.tagline}</div>
							</div>
							{#if visualizerState.current === visualizerName}
								<span class="text-xs text-[var(--term-green)]">*</span>
							{/if}
						</button>
					{/each}
				</div>
			</div>
		</div>
	</div>
</section>
