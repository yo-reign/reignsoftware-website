<script lang="ts">
	import { onMount } from 'svelte';
	import { themeState } from '$lib/stores/theme.svelte';
	import { themes, themeOrder, type ThemeName } from '$lib/themes';
	import { Menu, X, Palette } from '@lucide/svelte';

	let mobileMenuOpen = $state(false);
	let showThemeSelector = $state(false);
	let themeDropdownOpen = $state(false);

	// Terminal boot animation state
	let bootPhase = $state<'hidden' | 'booting' | 'ready' | 'shutdown'>('hidden');
	let bootText = $state('');
	let showCursor = $state(true);
	let glitchActive = $state(false);

	const navItems = [
		{ href: '/', label: 'Home' },
		{ href: '/services', label: 'Services' },
		{ href: '/products', label: 'Products' },
		{ href: '/about', label: 'About' },
		{ href: '/contact', label: 'Contact' }
	];

	let terminalPrefix = $derived(themeState.current === 'terminal' ? '~/reign $' : '');

	// Boot sequence text
	const bootSequence = '> theme.init()';
	const shutdownSequence = '> exit(0)';
	const glitchChars = '!@#$%^&*()_+-=[]{}|;:,.<>?/~`01';

	async function runBootAnimation() {
		bootPhase = 'booting';
		bootText = '';
		glitchActive = true;

		// Glitch scramble phase
		for (let i = 0; i < 6; i++) {
			bootText = Array(bootSequence.length)
				.fill(0)
				.map(() => glitchChars[Math.floor(Math.random() * glitchChars.length)])
				.join('');
			await sleep(50);
		}

		// Type out the real text
		bootText = '';
		for (let i = 0; i <= bootSequence.length; i++) {
			bootText = bootSequence.slice(0, i);
			await sleep(30);
		}

		glitchActive = false;
		await sleep(200);

		// Flash effect
		for (let i = 0; i < 2; i++) {
			showCursor = false;
			await sleep(80);
			showCursor = true;
			await sleep(80);
		}

		bootPhase = 'ready';
	}

	async function runShutdownAnimation() {
		bootPhase = 'shutdown';
		themeDropdownOpen = false;

		// Quick type the shutdown command
		bootText = '';
		for (let i = 0; i <= shutdownSequence.length; i++) {
			bootText = shutdownSequence.slice(0, i);
			await sleep(25);
		}

		await sleep(150);

		// Scramble decay effect - text corrupts character by character
		glitchActive = true;
		const chars = shutdownSequence.split('');
		for (let i = chars.length - 1; i >= 0; i--) {
			// Scramble remaining characters
			for (let j = 0; j < 2; j++) {
				bootText = chars
					.map((c, idx) => (idx >= i ? glitchChars[Math.floor(Math.random() * glitchChars.length)] : c))
					.join('');
				await sleep(30);
			}
			chars[i] = ' ';
			bootText = chars.join('');
			await sleep(20);
		}

		// Final flicker out
		for (let i = 0; i < 3; i++) {
			showCursor = !showCursor;
			await sleep(50);
		}

		glitchActive = false;
		bootPhase = 'hidden';
		showThemeSelector = false;
	}

	function sleep(ms: number): Promise<void> {
		return new Promise((resolve) => setTimeout(resolve, ms));
	}

	onMount(() => {
		// Cursor blink
		const cursorInterval = setInterval(() => {
			if (bootPhase === 'ready') {
				showCursor = !showCursor;
			}
		}, 530);

		// Listen for theme selector visibility from hero
		const handleVisibility = (e: CustomEvent<{ visible: boolean }>) => {
			const shouldShow = !e.detail.visible;

			if (shouldShow && !showThemeSelector && bootPhase === 'hidden') {
				showThemeSelector = true;
				runBootAnimation();
			} else if (!shouldShow && showThemeSelector && bootPhase === 'ready') {
				runShutdownAnimation();
			}
		};

		window.addEventListener('theme-selector-visibility', handleVisibility as EventListener);

		return () => {
			clearInterval(cursorInterval);
			window.removeEventListener('theme-selector-visibility', handleVisibility as EventListener);
		};
	});

	function selectTheme(theme: ThemeName) {
		themeState.set(theme);
		themeDropdownOpen = false;
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') {
			themeDropdownOpen = false;
		}
	}
</script>

<svelte:window onkeydown={handleKeydown} />

<header
	class="fixed left-0 right-0 top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md"
>
	<nav class="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
		<!-- Logo -->
		<a href="/" class="flex items-center gap-2">
			{#if themeState.current === 'terminal'}
				<span class="text-muted-foreground">{terminalPrefix}</span>
			{/if}
			<span class="text-xl font-bold text-primary">ReignSoftware</span>
			{#if themeState.current === 'terminal'}
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
					{#if themeState.current === 'terminal'}
						<span class="text-muted-foreground">./</span>{/if}{item.label}
				</a>
			{/each}
		</div>

		<!-- Right side - Fixed width container to prevent layout shift -->
		<div class="flex items-center gap-3">
			<!-- Theme Selector Container - Always reserves space -->
			<div class="relative h-10 w-[180px] sm:w-[200px]">
				{#if showThemeSelector}
					<!-- Boot animation / Shutdown animation -->
					{#if bootPhase === 'booting' || bootPhase === 'shutdown'}
						<div
							class="absolute inset-0 flex items-center justify-end font-mono text-sm {glitchActive ? 'text-primary' : 'text-muted-foreground'}"
						>
							<span class="terminal-text {glitchActive ? 'glitch' : ''}">{bootText}</span>
							<span class="ml-0.5 {showCursor ? 'opacity-100' : 'opacity-0'} text-primary">█</span>
						</div>
					{:else if bootPhase === 'ready'}
						<div class="absolute inset-0 flex items-center justify-end">
							<button
								onclick={() => (themeDropdownOpen = !themeDropdownOpen)}
								class="theme-button flex items-center gap-2 rounded-md border border-border bg-card px-3 py-2 text-sm transition-all hover:border-primary hover:bg-card/80"
								aria-label="Toggle theme selector"
							>
								<div
									class="theme-dot h-3 w-3 rounded-full"
									style="background: {themeState.current === 'terminal'
										? '#fe8019'
										: themeState.current === 'minimal'
											? '#88c0d0'
											: themeState.current === 'cyber'
												? '#bd93f9'
												: '#cba6f7'}"
								></div>
								<span class="hidden sm:inline">{themes[themeState.current].displayName}</span>
								<Palette class="h-4 w-4 sm:hidden" />
							</button>
						</div>
					{/if}

					{#if themeDropdownOpen && bootPhase === 'ready'}
						<!-- Backdrop -->
						<button
							class="fixed inset-0 z-40"
							onclick={() => (themeDropdownOpen = false)}
							aria-label="Close menu"
						></button>

						<!-- Dropdown -->
						<div
							class="absolute right-0 top-full z-50 mt-2 min-w-[220px] overflow-hidden rounded-lg border border-border bg-card shadow-xl dropdown-enter"
						>
							<div class="border-b border-border bg-card/50 px-3 py-2 text-xs text-muted-foreground">
								{#if themeState.current === 'terminal'}
									<span class="text-primary">$</span> select --experience
								{:else}
									Select Experience
								{/if}
							</div>
							<div class="p-2">
								{#each themeOrder as themeName, i}
									{@const theme = themes[themeName]}
									<button
										onclick={() => selectTheme(themeName)}
										disabled={themeState.isTransitioning}
										class="dropdown-item flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm transition-colors hover:bg-secondary disabled:opacity-50 {themeState.current ===
										themeName
											? 'bg-secondary text-primary'
											: ''}"
										style="animation-delay: {i * 50}ms"
									>
										<span
											class="h-3 w-3 rounded-full"
											style="background: {themeName === 'terminal'
												? '#fe8019'
												: themeName === 'minimal'
													? '#88c0d0'
													: themeName === 'cyber'
														? '#bd93f9'
														: '#cba6f7'}"
										></span>
										<div class="flex-1">
											<div class="font-medium">{theme.displayName}</div>
											<div class="text-xs text-muted-foreground">{theme.tagline}</div>
										</div>
										{#if themeState.current === themeName}
											<span class="text-xs text-primary">[active]</span>
										{/if}
									</button>
								{/each}
							</div>
						</div>
					{/if}
				{/if}
			</div>

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

<style>
	/* Terminal glitch effect */
	.glitch {
		animation: glitch 0.1s infinite;
	}

	@keyframes glitch {
		0% {
			transform: translate(0);
			opacity: 1;
		}
		20% {
			transform: translate(-2px, 1px);
			opacity: 0.8;
		}
		40% {
			transform: translate(2px, -1px);
			opacity: 0.9;
		}
		60% {
			transform: translate(-1px, -1px);
			opacity: 0.7;
		}
		80% {
			transform: translate(1px, 1px);
			opacity: 0.85;
		}
		100% {
			transform: translate(0);
			opacity: 1;
		}
	}

	/* Theme button appear animation */
	.theme-button {
		animation: buttonMaterialize 0.4s cubic-bezier(0.16, 1, 0.3, 1);
	}

	@keyframes buttonMaterialize {
		0% {
			opacity: 0;
			transform: scale(0.8);
			filter: blur(4px);
		}
		50% {
			filter: blur(0);
		}
		100% {
			opacity: 1;
			transform: scale(1);
			filter: blur(0);
		}
	}

	/* Theme dot pulse on appear */
	.theme-button .theme-dot {
		animation: dotPulse 0.6s cubic-bezier(0.16, 1, 0.3, 1);
	}

	@keyframes dotPulse {
		0% {
			transform: scale(0);
		}
		50% {
			transform: scale(1.5);
		}
		100% {
			transform: scale(1);
		}
	}

	/* Dropdown animation */
	.dropdown-enter {
		animation: dropdownSlide 0.25s cubic-bezier(0.16, 1, 0.3, 1);
	}

	@keyframes dropdownSlide {
		from {
			opacity: 0;
			transform: translateY(-8px) scaleY(0.95);
		}
		to {
			opacity: 1;
			transform: translateY(0) scaleY(1);
		}
	}

	/* Staggered dropdown items */
	.dropdown-item {
		animation: itemSlideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) backwards;
	}

	@keyframes itemSlideIn {
		from {
			opacity: 0;
			transform: translateX(-10px);
		}
		to {
			opacity: 1;
			transform: translateX(0);
		}
	}
</style>
