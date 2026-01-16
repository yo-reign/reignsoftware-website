<script lang="ts">
	import GridWalk from './GridWalk.svelte';
	import RandomWalk from './RandomWalk.svelte';
	import MatrixRain from './MatrixRain.svelte';
	import ParticleSwarm from './ParticleSwarm.svelte';
	import Starfield from './Starfield.svelte';
	import Ripples from './Ripples.svelte';
	import { visualizerState } from '$lib/stores/visualizer.svelte';
</script>

<!-- Fixed background visualizer layer -->
<div
	class="pointer-events-none fixed inset-0 z-0 opacity-40"
	class:pointer-events-auto={visualizerState.config.interactive}
>
	{#if visualizerState.current === 'off'}
		<!-- No visualizer -->
	{:else if visualizerState.current === 'grid-walk'}
		<GridWalk
			speedMultiplier={visualizerState.speedMultiplier}
			agentCount={visualizerState.currentParams.agents}
			trailLength={visualizerState.currentParams.trailLength}
			restartSignal={visualizerState.restartSignal}
		/>
	{:else if visualizerState.current === 'random-walk'}
		<RandomWalk
			speedMultiplier={visualizerState.speedMultiplier}
			agentCount={visualizerState.currentParams.agents}
			thickness={visualizerState.currentParams.thickness}
			restartSignal={visualizerState.restartSignal}
		/>
	{:else if visualizerState.current === 'matrix-rain'}
		<MatrixRain
			speedMultiplier={visualizerState.speedMultiplier}
			density={visualizerState.currentParams.density}
			charset={visualizerState.currentParams.charset}
			restartSignal={visualizerState.restartSignal}
		/>
	{:else if visualizerState.current === 'particle-swarm'}
		<ParticleSwarm
			speedMultiplier={visualizerState.speedMultiplier}
			particles={visualizerState.currentParams.particles}
			attraction={visualizerState.currentParams.attraction}
			restartSignal={visualizerState.restartSignal}
			mouseX={visualizerState.mouseX}
			mouseY={visualizerState.mouseY}
			mouseActive={visualizerState.mouseActive}
		/>
	{:else if visualizerState.current === 'starfield'}
		<Starfield
			speedMultiplier={visualizerState.speedMultiplier}
			stars={visualizerState.currentParams.stars}
			spread={visualizerState.currentParams.spread}
			restartSignal={visualizerState.restartSignal}
		/>
	{:else if visualizerState.current === 'ripples'}
		<Ripples
			speedMultiplier={visualizerState.speedMultiplier}
			decay={visualizerState.currentParams.decay}
			frequency={visualizerState.currentParams.frequency}
			restartSignal={visualizerState.restartSignal}
		/>
	{/if}
</div>

<!-- Gradient overlay that fades the visualizer -->
<div
	class="pointer-events-none fixed inset-0 z-0 bg-gradient-to-b from-background/30 via-background/60 to-background/90"
></div>
