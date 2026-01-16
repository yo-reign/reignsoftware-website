<script lang="ts">
	import { onMount } from 'svelte';
	import { themeColors } from './config';
	import { themeState } from '$lib/stores/theme.svelte';

	interface Props {
		class?: string;
		speedMultiplier?: number;
		density?: number;
		charset?: number;
		restartSignal?: number;
	}

	let {
		class: className = '',
		speedMultiplier = 1.0,
		density = 20,
		charset = 0,
		restartSignal = 0
	}: Props = $props();

	let canvas: HTMLCanvasElement;
	let animationId: number;
	let ctx: CanvasRenderingContext2D;
	let columns: Column[] = [];
	let lastTime = 0;

	// Theme-reactive colors
	let bgColors = $derived(themeState.isDark ? themeColors.dark : themeColors.light);
	const COLORS_DARK = ['#b8bb26', '#8ec07c', '#83a598']; // green, aqua, blue
	const COLORS_LIGHT = ['#98971a', '#689d6a', '#458588']; // green, aqua, blue
	let matrixColors = $derived(themeState.isDark ? COLORS_DARK : COLORS_LIGHT);
	let headColor = $derived(themeState.isDark ? '#ebdbb2' : '#3c3836');

	// Character sets
	const CHARSETS = [
		'0123456789ABCDEF', // Hex
		'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン', // Katakana
		'01' // Binary
	];

	const FONT_SIZE = 14;
	const BASE_DROP_SPEED = 0.15;

	interface Column {
		x: number;
		y: number;
		speed: number;
		chars: string[];
		length: number;
		color: string;
	}

	function getCharset(): string {
		return CHARSETS[Math.min(Math.max(0, Math.floor(charset)), CHARSETS.length - 1)];
	}

	function randomChar(): string {
		const chars = getCharset();
		return chars[Math.floor(Math.random() * chars.length)];
	}

	function createColumn(x: number, immediate = false): Column {
		const length = 10 + Math.floor(Math.random() * 20);
		const chars: string[] = [];
		for (let i = 0; i < length; i++) {
			chars.push(randomChar());
		}
		return {
			x,
			y: immediate ? Math.random() * -500 : -length * FONT_SIZE,
			speed: BASE_DROP_SPEED + Math.random() * 0.1,
			chars,
			length,
			color: matrixColors[Math.floor(Math.random() * matrixColors.length)]
		};
	}

	function initColumns() {
		if (!canvas) return;
		const rect = canvas.getBoundingClientRect();
		const numColumns = Math.ceil(rect.width / FONT_SIZE);
		columns = [];

		// Create columns based on density
		for (let i = 0; i < numColumns; i++) {
			if (Math.random() < density / 100) {
				columns.push(createColumn(i * FONT_SIZE, true));
			}
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
		initColumns();
	}

	function animate(timestamp: number) {
		const deltaTime = Math.min(timestamp - lastTime, 50);
		lastTime = timestamp;

		const rect = canvas.getBoundingClientRect();

		// Fade effect - higher opacity for sharper text
		const fadeColor = themeState.isDark ? 'rgba(29, 32, 33, 0.15)' : 'rgba(249, 245, 215, 0.15)';
		ctx.fillStyle = fadeColor;
		ctx.fillRect(0, 0, rect.width, rect.height);

		ctx.font = `${FONT_SIZE}px monospace`;

		const moveSpeed = deltaTime * speedMultiplier;

		columns.forEach((col, index) => {
			col.y += col.speed * moveSpeed;

			// Draw characters
			for (let i = 0; i < col.chars.length; i++) {
				const charY = col.y - i * FONT_SIZE;
				if (charY < -FONT_SIZE || charY > rect.height + FONT_SIZE) continue;

				// Calculate alpha based on position in trail
				const alpha = i === 0 ? 1 : Math.max(0.1, 1 - i / col.chars.length);
				ctx.globalAlpha = alpha;

				// First char is brightest
				if (i === 0) {
					ctx.fillStyle = headColor;
				} else {
					ctx.fillStyle = col.color;
				}

				ctx.fillText(col.chars[i], col.x, charY);

				// Randomly change characters
				if (Math.random() < 0.02) {
					col.chars[i] = randomChar();
				}
			}

			// Reset column when off screen
			if (col.y - col.length * FONT_SIZE > rect.height) {
				columns[index] = createColumn(col.x);
			}
		});

		// Occasionally add new columns based on density
		if (Math.random() < (density / 1000) * speedMultiplier) {
			const numColumns = Math.ceil(rect.width / FONT_SIZE);
			const x = Math.floor(Math.random() * numColumns) * FONT_SIZE;
			// Check if column exists at this x
			const exists = columns.some((c) => Math.abs(c.x - x) < FONT_SIZE);
			if (!exists) {
				columns.push(createColumn(x));
			}
		}

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
			initColumns();
		}
	});

	// React to density changes
	$effect(() => {
		void density; // Track density changes
		initColumns();
	});

	// React to theme changes
	$effect(() => {
		void themeState.current;
		if (ctx && canvas) {
			const rect = canvas.getBoundingClientRect();
			ctx.fillStyle = bgColors.bg0;
			ctx.fillRect(0, 0, rect.width, rect.height);
			// Re-assign colors to existing columns
			columns.forEach((col) => {
				col.color = matrixColors[Math.floor(Math.random() * matrixColors.length)];
			});
		}
	});
</script>

<canvas bind:this={canvas} class="absolute inset-0 h-full w-full {className}"></canvas>
