<script lang="ts">
	import GridWalk from './GridWalk.svelte';
	import RandomWalk from './RandomWalk.svelte';
	import { visualizerState } from '$lib/stores/theme.svelte';
</script>

<!-- Fixed background visualizer layer -->
<div class="fixed inset-0 z-0 opacity-40 pointer-events-none">
	{#if visualizerState.current === 'grid-walk'}
		<GridWalk
			speedMultiplier={visualizerState.speedMultiplier}
			agentCount={visualizerState.agentCount}
			restartSignal={visualizerState.restartSignal}
		/>
	{:else if visualizerState.current === 'random-walk'}
		<RandomWalk
			speedMultiplier={visualizerState.speedMultiplier}
			agentCount={visualizerState.agentCount}
			restartSignal={visualizerState.restartSignal}
		/>
	{/if}
</div>

<!-- Gradient overlay that fades the visualizer -->
<div class="fixed inset-0 z-0 pointer-events-none bg-gradient-to-b from-background/30 via-background/60 to-background/90"></div>
