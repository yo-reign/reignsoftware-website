<script lang="ts">
	import { themeState } from '$lib/stores/theme.svelte';
	import { themes, type ThemeName } from '$lib/themes';
	import { Palette } from '@lucide/svelte';

	let isOpen = $state(false);

	function selectTheme(theme: ThemeName) {
		themeState.set(theme);
		isOpen = false;
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') {
			isOpen = false;
		}
	}
</script>

<svelte:window onkeydown={handleKeydown} />

<div class="relative">
	<button
		onclick={() => (isOpen = !isOpen)}
		class="flex items-center gap-2 rounded-md border border-border bg-card px-3 py-2 text-sm transition-all hover:border-primary hover:bg-card/80"
		aria-label="Toggle theme selector"
	>
		<Palette class="h-4 w-4" />
		<span class="hidden sm:inline">{themes[themeState.current].displayName}</span>
	</button>

	{#if isOpen}
		<!-- Backdrop -->
		<button class="fixed inset-0 z-40" onclick={() => (isOpen = false)} aria-label="Close menu"
		></button>

		<!-- Dropdown -->
		<div
			class="absolute right-0 top-full z-50 mt-2 min-w-[200px] rounded-lg border border-border bg-card p-2 shadow-xl"
		>
			<div class="mb-2 border-b border-border px-2 pb-2 text-xs text-muted-foreground">
				Select Theme
			</div>
			{#each Object.values(themes) as theme}
				<button
					onclick={() => selectTheme(theme.name)}
					class="flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm transition-colors hover:bg-secondary {themeState.current ===
					theme.name
						? 'bg-secondary text-primary'
						: ''}"
				>
					<span
						class="h-3 w-3 rounded-full"
						style="background: {theme.name === 'terminal'
							? '#fe8019'
							: theme.name === 'minimal'
								? '#88c0d0'
								: theme.name === 'cyber'
									? '#bd93f9'
									: '#cba6f7'}"
					></span>
					<div>
						<div class="font-medium">{theme.displayName}</div>
						<div class="text-xs text-muted-foreground">{theme.description}</div>
					</div>
				</button>
			{/each}
		</div>
	{/if}
</div>
