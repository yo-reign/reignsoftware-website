<script lang="ts">
	import { onMount } from 'svelte';
	import { themeColors } from './config';
	import { themeState } from '$lib/stores/theme.svelte';

	interface Props {
		class?: string;
		speedMultiplier?: number;
		stars?: number;
		spread?: number;
		restartSignal?: number;
	}

	let {
		class: className = '',
		speedMultiplier = 1.0,
		stars: starCount = 400,
		spread = 5,
		restartSignal = 0
	}: Props = $props();

	let canvas: HTMLCanvasElement;
	let animationId: number;
	let ctx: CanvasRenderingContext2D;
	let starList: Star[] = [];
	let lastTime = 0;
	let centerX = 0;
	let centerY = 0;

	// Theme-reactive colors
	let bgColors = $derived(themeState.isDark ? themeColors.dark : themeColors.light);
	const STAR_COLORS_DARK = ['#ebdbb2', '#d5c4a1', '#bdae93', '#a89984', '#83a598', '#b8bb26'];
	const STAR_COLORS_LIGHT = ['#3c3836', '#504945', '#665c54', '#7c6f64', '#458588', '#98971a'];
	let starColors = $derived(themeState.isDark ? STAR_COLORS_DARK : STAR_COLORS_LIGHT);

	const MAX_Z = 1000;
	const BASE_SPEED = 1;

	interface Star {
		x: number;
		y: number;
		z: number;
		color: string;
		prevX: number;
		prevY: number;
	}

	// Spread controls the field of view - higher = wider star field
	function getSpreadRange(): number {
		return 500 + spread * 200; // Range from 700 to 2500 based on spread 1-10
	}

	function createStar(randomZ = true): Star {
		const range = getSpreadRange();
		return {
			x: (Math.random() - 0.5) * range,
			y: (Math.random() - 0.5) * range,
			z: randomZ ? Math.random() * MAX_Z : MAX_Z,
			color: starColors[Math.floor(Math.random() * starColors.length)],
			prevX: 0,
			prevY: 0
		};
	}

	function initStars() {
		starList = [];
		for (let i = 0; i < starCount; i++) {
			starList.push(createStar());
		}
	}

	function resize() {
		if (!canvas || !ctx) return;
		const dpr = window.devicePixelRatio || 1;
		const rect = canvas.getBoundingClientRect();
		canvas.width = rect.width * dpr;
		canvas.height = rect.height * dpr;
		ctx.setTransform(1, 0, 0, 1, 0, 0);
		ctx.scale(dpr, dpr);
		centerX = rect.width / 2;
		centerY = rect.height / 2;
		initStars();
	}

	function animate(timestamp: number) {
		const deltaTime = Math.min(timestamp - lastTime, 50);
		lastTime = timestamp;
		const normalizedDelta = deltaTime / 16.67;

		const rect = canvas.getBoundingClientRect();

		// Clear with solid background
		ctx.fillStyle = bgColors.bg0;
		ctx.fillRect(0, 0, rect.width, rect.height);

		const moveSpeed = BASE_SPEED * speedMultiplier * normalizedDelta;

		starList.forEach((star, index) => {
			// Store previous projected position for trail
			const prevK = 128 / star.z;
			star.prevX = star.x * prevK + centerX;
			star.prevY = star.y * prevK + centerY;

			// Move star closer
			star.z -= moveSpeed * 10;

			// Reset star if too close
			if (star.z <= 0) {
				starList[index] = createStar(false);
				return;
			}

			// Project to 2D
			const k = 128 / star.z;
			const projX = star.x * k + centerX;
			const projY = star.y * k + centerY;

			// Skip if outside viewport
			if (projX < 0 || projX > rect.width || projY < 0 || projY > rect.height) {
				starList[index] = createStar(false);
				return;
			}

			// Calculate size based on z-distance
			const size = Math.max(0.5, (1 - star.z / MAX_Z) * 3);
			const alpha = Math.max(0.2, 1 - star.z / MAX_Z);

			// Draw trail (line from prev position)
			if (moveSpeed > 0.5) {
				const trailLength = Math.min(1, moveSpeed / 5);
				ctx.beginPath();
				ctx.moveTo(star.prevX, star.prevY);
				ctx.lineTo(projX, projY);
				ctx.strokeStyle = star.color;
				ctx.globalAlpha = alpha * 0.5 * trailLength;
				ctx.lineWidth = size * 0.5;
				ctx.stroke();
			}

			// Draw star
			ctx.beginPath();
			ctx.arc(projX, projY, size, 0, Math.PI * 2);
			ctx.fillStyle = star.color;
			ctx.globalAlpha = alpha;
			ctx.fill();

			// Add glow for close stars
			if (star.z < MAX_Z * 0.3) {
				ctx.beginPath();
				ctx.arc(projX, projY, size * 2, 0, Math.PI * 2);
				ctx.fillStyle = star.color;
				ctx.globalAlpha = alpha * 0.2;
				ctx.fill();
			}
		});

		ctx.globalAlpha = 1;
		animationId = requestAnimationFrame(animate);
	}

	onMount(() => {
		ctx = canvas.getContext('2d')!;
		resize();
		window.addEventListener('resize', resize);

		// Initial clear
		const rect = canvas.getBoundingClientRect();
		ctx.fillStyle = bgColors.bg0;
		ctx.fillRect(0, 0, rect.width, rect.height);

		lastTime = performance.now();
		animationId = requestAnimationFrame(animate);

		return () => {
			window.removeEventListener('resize', resize);
			cancelAnimationFrame(animationId);
		};
	});

	// React to restart signal
	$effect(() => {
		if (restartSignal > 0) {
			initStars();
		}
	});

	// React to star count changes
	$effect(() => {
		void starCount;
		while (starList.length < starCount) {
			starList.push(createStar());
		}
		if (starList.length > starCount) {
			starList = starList.slice(0, starCount);
		}
	});

	// React to theme changes
	$effect(() => {
		void themeState.current;
		// Re-assign colors to existing stars
		starList.forEach((star) => {
			star.color = starColors[Math.floor(Math.random() * starColors.length)];
		});
	});
</script>

<canvas bind:this={canvas} class="absolute inset-0 h-full w-full {className}"></canvas>
