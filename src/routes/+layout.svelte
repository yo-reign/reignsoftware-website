<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import Header from '$lib/components/layout/Header.svelte';
	import Footer from '$lib/components/layout/Footer.svelte';
	import { themeState } from '$lib/stores/theme.svelte';
	import type { Snippet } from 'svelte';
	import { onMount } from 'svelte';

	interface Props {
		children: Snippet;
	}

	let { children }: Props = $props();
	let mounted = $state(false);

	onMount(() => {
		// Initialize theme on mount
		document.documentElement.setAttribute('data-theme', themeState.current);
		mounted = true;
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>ReignSoftware | Software that feels like magic</title>
	<meta
		name="description"
		content="Fast, robust, and visually stunning software solutions for businesses and consumers. We don't just write code—we craft experiences."
	/>
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
</svelte:head>

{#if mounted}
	<div class="flex min-h-screen flex-col">
		<Header />
		<main class="flex-1">
			{@render children()}
		</main>
		<Footer />
	</div>
{:else}
	<!-- Prevent flash of unstyled content -->
	<div class="flex min-h-screen items-center justify-center bg-[#282828]">
		<div class="text-[#ebdbb2]">Loading...</div>
	</div>
{/if}
