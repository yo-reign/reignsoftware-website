<script lang="ts">
	import ThemeToggle from './ThemeToggle.svelte';
	import { themeState } from '$lib/stores/theme.svelte';
	import { Menu, X } from '@lucide/svelte';

	let mobileMenuOpen = $state(false);

	const navItems = [
		{ href: '/', label: 'Home' },
		{ href: '/services', label: 'Services' },
		{ href: '/products', label: 'Products' },
		{ href: '/about', label: 'About' },
		{ href: '/contact', label: 'Contact' }
	];

	// Terminal-style prompt for gruvbox theme
	let terminalPrefix = $derived(themeState.current === 'gruvbox' ? '~/reign $' : '');
</script>

<header class="fixed left-0 right-0 top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
	<nav class="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
		<!-- Logo -->
		<a href="/" class="flex items-center gap-2">
			{#if themeState.current === 'gruvbox'}
				<span class="text-muted-foreground">{terminalPrefix}</span>
			{/if}
			<span class="text-xl font-bold text-primary">ReignSoftware</span>
			{#if themeState.current === 'gruvbox'}
				<span class="animate-pulse text-primary">_</span>
			{/if}
		</a>

		<!-- Desktop Navigation -->
		<div class="hidden items-center gap-1 md:flex">
			{#each navItems as item}
				<a
					href={item.href}
					class="rounded-md px-3 py-2 text-sm text-foreground/80 transition-colors hover:bg-secondary hover:text-foreground"
				>
					{#if themeState.current === 'gruvbox'}
						<span class="text-muted-foreground">./</span>{/if}{item.label}
				</a>
			{/each}
		</div>

		<!-- Right side -->
		<div class="flex items-center gap-3">
			<ThemeToggle />

			<!-- Mobile menu button -->
			<button
				class="rounded-md p-2 md:hidden"
				onclick={() => (mobileMenuOpen = !mobileMenuOpen)}
				aria-label="Toggle menu"
			>
				{#if mobileMenuOpen}
					<X class="h-5 w-5" />
				{:else}
					<Menu class="h-5 w-5" />
				{/if}
			</button>
		</div>
	</nav>

	<!-- Mobile Navigation -->
	{#if mobileMenuOpen}
		<div class="border-t border-border bg-background md:hidden">
			<div class="space-y-1 px-4 py-3">
				{#each navItems as item}
					<a
						href={item.href}
						class="block rounded-md px-3 py-2 text-foreground/80 transition-colors hover:bg-secondary"
						onclick={() => (mobileMenuOpen = false)}
					>
						{item.label}
					</a>
				{/each}
			</div>
		</div>
	{/if}
</header>
