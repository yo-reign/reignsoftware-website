<script lang="ts">
	import './layout.css';
	import Header from '$lib/components/layout/Header.svelte';
	import Footer from '$lib/components/layout/Footer.svelte';
	import VisualizerBackground from '$lib/components/visualizers/VisualizerBackground.svelte';
	import { themeState } from '$lib/stores/theme.svelte';
	import type { Snippet } from 'svelte';
	import { onMount } from 'svelte';

	interface Props {
		children: Snippet;
	}

	let { children }: Props = $props();
	let mounted = $state(false);

	onMount(() => {
		mounted = true;
		// Theme is auto-initialized in the store constructor
	});
</script>

<svelte:head>
	<title>reignsoftware | Dev</title>
	<meta
		name="description"
		content="Fast, robust, and visually stunning software solutions for businesses and consumers."
	/>
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
</svelte:head>

{#if mounted}
	<!-- Fixed visualizer background -->
	<VisualizerBackground />

	<!-- Main content layer -->
	<div class="relative z-10 flex min-h-screen flex-col">
		<Header />
		<main class="flex-1">
			{@render children()}
		</main>
		<Footer />
	</div>
{:else}
	<!-- Prevent flash of unstyled content -->
	<div class="flex min-h-screen items-center justify-center bg-[#1d2021]">
		<div class="font-mono text-[#ebdbb2]">
			<span class="text-[#b8bb26]">$</span> loading...
		</div>
	</div>
{/if}
