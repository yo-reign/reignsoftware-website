<script lang="ts">
	import { onMount } from 'svelte';
	import { visualizerColors, visualizerColorsLight, themeColors } from './config';
	import { themeState } from '$lib/stores/theme.svelte';

	interface Props {
		class?: string;
		speedMultiplier?: number;
		decay?: number;
		frequency?: number;
		restartSignal?: number;
	}

	let {
		class: className = '',
		speedMultiplier = 1.0,
		decay = 5,
		frequency = 5,
		restartSignal = 0
	}: Props = $props();

	let canvas: HTMLCanvasElement;
	let animationId: number;
	let ctx: CanvasRenderingContext2D;
	let rippleList: Ripple[] = [];
	let lastTime = 0;
	let autoRippleTimer = 0;

	// Theme-reactive colors
	let colors = $derived(themeState.isDark ? themeColors.dark : themeColors.light);
	let rippleColors = $derived(themeState.isDark ? visualizerColors : visualizerColorsLight);
	const BASE_EXPANSION_SPEED = 2;

	interface Ripple {
		x: number;
		y: number;
		radius: number;
		maxRadius: number;
		color: string;
		lineWidth: number;
		alpha: number;
	}

	function createRipple(x: number, y: number): Ripple {
		return {
			x,
			y,
			radius: 0,
			maxRadius: 150 + Math.random() * 200,
			color: rippleColors[Math.floor(Math.random() * rippleColors.length)],
			lineWidth: 1 + Math.random() * 2,
			alpha: 0.8
		};
	}

	function addRipple(x: number, y: number) {
		// Cap at 50 ripples to prevent performance issues
		if (rippleList.length >= 50) {
			rippleList.shift();
		}
		rippleList.push(createRipple(x, y));
	}

	function resize() {
		if (!canvas || !ctx) return;
		const dpr = window.devicePixelRatio || 1;
		const rect = canvas.getBoundingClientRect();
		canvas.width = rect.width * dpr;
		canvas.height = rect.height * dpr;
		ctx.setTransform(1, 0, 0, 1, 0, 0);
		ctx.scale(dpr, dpr);
	}

	function handleClick(e: MouseEvent) {
		// Use clientX/Y directly since canvas is full viewport
		addRipple(e.clientX, e.clientY);
	}

	function animate(timestamp: number) {
		const deltaTime = Math.min(timestamp - lastTime, 50);
		lastTime = timestamp;
		const normalizedDelta = deltaTime / 16.67;

		const rect = canvas.getBoundingClientRect();

		// Clear with fade
		const fadeColor = themeState.isDark ? 'rgba(29, 32, 33, 0.08)' : 'rgba(249, 245, 215, 0.08)';
		ctx.fillStyle = fadeColor;
		ctx.fillRect(0, 0, rect.width, rect.height);

		// Decay factor (1-10, higher = faster fade)
		const decayRate = (decay / 5) * 0.01;
		const expansionSpeed = BASE_EXPANSION_SPEED * speedMultiplier * normalizedDelta;

		// Auto-generate ripples based on frequency (1-10, higher = more frequent)
		autoRippleTimer += deltaTime * speedMultiplier;
		const spawnInterval = 3000 / frequency; // Range: 3000ms (freq=1) to 300ms (freq=10)
		if (autoRippleTimer > spawnInterval) {
			autoRippleTimer = 0;
			addRipple(Math.random() * rect.width, Math.random() * rect.height);
		}

		// Update and draw ripples
		rippleList = rippleList.filter((ripple) => {
			// Expand
			ripple.radius += expansionSpeed * 3;
			ripple.alpha -= decayRate * normalizedDelta;

			// Remove if faded or too large
			if (ripple.alpha <= 0 || ripple.radius >= ripple.maxRadius) {
				return false;
			}

			// Draw multiple concentric rings
			const numRings = 3;
			for (let i = 0; i < numRings; i++) {
				const ringRadius = ripple.radius - i * 20;
				if (ringRadius <= 0) continue;

				const ringAlpha = ripple.alpha * (1 - i / numRings);
				ctx.beginPath();
				ctx.arc(ripple.x, ripple.y, ringRadius, 0, Math.PI * 2);
				ctx.strokeStyle = ripple.color;
				ctx.globalAlpha = ringAlpha;
				ctx.lineWidth = ripple.lineWidth * (1 - i * 0.2);
				ctx.stroke();
			}

			return true;
		});

		ctx.globalAlpha = 1;
		animationId = requestAnimationFrame(animate);
	}

	onMount(() => {
		ctx = canvas.getContext('2d')!;
		resize();
		window.addEventListener('resize', resize);
		// Listen on window so clicks work through content layer
		window.addEventListener('click', handleClick);

		// Initial clear
		const rect = canvas.getBoundingClientRect();
		ctx.fillStyle = colors.bg0;
		ctx.fillRect(0, 0, rect.width, rect.height);

		// Add some initial ripples
		for (let i = 0; i < 3; i++) {
			addRipple(Math.random() * rect.width, Math.random() * rect.height);
		}

		lastTime = performance.now();
		animationId = requestAnimationFrame(animate);

		return () => {
			window.removeEventListener('resize', resize);
			window.removeEventListener('click', handleClick);
			cancelAnimationFrame(animationId);
		};
	});

	// React to restart signal
	$effect(() => {
		if (restartSignal > 0) {
			rippleList = [];
			if (canvas) {
				const rect = canvas.getBoundingClientRect();
				for (let i = 0; i < 3; i++) {
					addRipple(Math.random() * rect.width, Math.random() * rect.height);
				}
			}
		}
	});

	// React to theme changes
	$effect(() => {
		const _ = themeState.current;
		if (ctx && canvas) {
			const rect = canvas.getBoundingClientRect();
			ctx.fillStyle = colors.bg0;
			ctx.fillRect(0, 0, rect.width, rect.height);
			// Re-assign colors to existing ripples
			rippleList.forEach((ripple) => {
				ripple.color = rippleColors[Math.floor(Math.random() * rippleColors.length)];
			});
		}
	});
</script>

<canvas bind:this={canvas} class="absolute inset-0 h-full w-full {className}"></canvas>
