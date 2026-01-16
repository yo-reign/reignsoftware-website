<script lang="ts">
	import { onMount } from 'svelte';
	import { visualizerColors, visualizerColorsLight, themeColors } from './config';
	import { themeState } from '$lib/stores/theme.svelte';

	interface Props {
		class?: string;
		speedMultiplier?: number;
		agentCount?: number;
		trailLength?: number;
		restartSignal?: number;
	}

	let {
		class: className = '',
		speedMultiplier = 1.0,
		agentCount = 8,
		trailLength = 40,
		restartSignal = 0
	}: Props = $props();

	let canvas: HTMLCanvasElement;
	let animationId: number;
	let ctx: CanvasRenderingContext2D;
	let walkers: Walker[] = [];
	let gridWidth = 0;
	let gridHeight = 0;
	let lastTime = 0;
	let centerX = 0;
	let centerY = 0;

	// Grid settings
	const CELL_SIZE = 16;

	// Theme-reactive colors
	let colors = $derived(themeState.isDark ? themeColors.dark : themeColors.light);
	let walkerColors = $derived(themeState.isDark ? visualizerColors : visualizerColorsLight);

	// Base move interval at 1x speed (in ms)
	const BASE_MOVE_INTERVAL = 100;

	interface Walker {
		x: number;
		y: number;
		color: string;
		trail: { x: number; y: number; age: number }[];
		maxTrail: number;
		moveTimer: number;
	}

	function getColors(): string[] {
		return walkerColors;
	}

	function createWalker(fromCenter = false): Walker {
		const colors = getColors();
		// Use trailLength prop with some variance
		const baseTrail = trailLength;
		const variance = Math.floor(baseTrail * 0.3);
		return {
			x: fromCenter ? centerX : Math.floor(Math.random() * gridWidth),
			y: fromCenter ? centerY : Math.floor(Math.random() * gridHeight),
			color: colors[Math.floor(Math.random() * colors.length)],
			trail: [],
			maxTrail: baseTrail - variance + Math.floor(Math.random() * variance * 2),
			moveTimer: Math.random() * BASE_MOVE_INTERVAL
		};
	}

	function resetWalkers() {
		walkers = [];
		for (let i = 0; i < agentCount; i++) {
			walkers.push(createWalker(true));
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

		gridWidth = Math.floor(rect.width / CELL_SIZE);
		gridHeight = Math.floor(rect.height / CELL_SIZE);
		centerX = Math.floor(gridWidth / 2);
		centerY = Math.floor(gridHeight / 2);

		resetWalkers();
	}

	function drawBackground(width: number, height: number, fade: boolean = false) {
		if (fade) {
			// Subtle fade for dimming effect
			ctx.fillStyle = colors.bgRgba;
			ctx.fillRect(0, 0, width, height);
		} else {
			ctx.fillStyle = colors.bg0;
			ctx.fillRect(0, 0, width, height);
		}
	}

	function drawGrid() {
		ctx.strokeStyle = colors.bg1;
		ctx.lineWidth = 0.5;
		ctx.globalAlpha = 0.15;

		for (let x = 0; x <= gridWidth; x++) {
			ctx.beginPath();
			ctx.moveTo(x * CELL_SIZE, 0);
			ctx.lineTo(x * CELL_SIZE, gridHeight * CELL_SIZE);
			ctx.stroke();
		}

		for (let y = 0; y <= gridHeight; y++) {
			ctx.beginPath();
			ctx.moveTo(0, y * CELL_SIZE);
			ctx.lineTo(gridWidth * CELL_SIZE, y * CELL_SIZE);
			ctx.stroke();
		}

		ctx.globalAlpha = 1;
	}

	function moveWalker(walker: Walker) {
		walker.trail.push({ x: walker.x, y: walker.y, age: 0 });
		if (walker.trail.length > walker.maxTrail) {
			walker.trail.shift();
		}

		const direction = Math.floor(Math.random() * 4);
		switch (direction) {
			case 0:
				walker.y = Math.max(0, walker.y - 1);
				break;
			case 1:
				walker.x = Math.min(gridWidth - 1, walker.x + 1);
				break;
			case 2:
				walker.y = Math.min(gridHeight - 1, walker.y + 1);
				break;
			case 3:
				walker.x = Math.max(0, walker.x - 1);
				break;
		}

		if (Math.random() < 0.02) {
			const colors = getColors();
			walker.color = colors[Math.floor(Math.random() * colors.length)];
		}
	}

	function drawWalker(walker: Walker) {
		const cellPadding = 2;
		const cellInner = CELL_SIZE - cellPadding * 2;

		walker.trail.forEach((pos, i) => {
			const alpha = (i / walker.trail.length) * 0.6;
			ctx.globalAlpha = alpha;
			ctx.fillStyle = walker.color;
			ctx.fillRect(
				pos.x * CELL_SIZE + cellPadding,
				pos.y * CELL_SIZE + cellPadding,
				cellInner,
				cellInner
			);
		});

		ctx.globalAlpha = 0.9;
		ctx.fillStyle = walker.color;
		ctx.fillRect(
			walker.x * CELL_SIZE + cellPadding,
			walker.y * CELL_SIZE + cellPadding,
			cellInner,
			cellInner
		);

		ctx.globalAlpha = 1;
	}

	function animate(timestamp: number) {
		const deltaTime = Math.min(timestamp - lastTime, 50);
		lastTime = timestamp;

		const rect = canvas.getBoundingClientRect();

		// Apply fade effect for dimming
		drawBackground(rect.width, rect.height, true);

		// Redraw grid on top (with low opacity)
		drawGrid();

		// Calculate move interval based on speed multiplier
		const moveInterval = BASE_MOVE_INTERVAL / speedMultiplier;

		walkers.forEach((walker) => {
			walker.moveTimer += deltaTime;
			if (walker.moveTimer >= moveInterval) {
				walker.moveTimer = walker.moveTimer % moveInterval;
				moveWalker(walker);
			}
			drawWalker(walker);
		});

		animationId = requestAnimationFrame(animate);
	}

	onMount(() => {
		ctx = canvas.getContext('2d')!;
		resize();
		window.addEventListener('resize', resize);

		// Initial full draw
		const rect = canvas.getBoundingClientRect();
		drawBackground(rect.width, rect.height, false);
		drawGrid();

		lastTime = performance.now();
		animationId = requestAnimationFrame(animate);

		return () => {
			window.removeEventListener('resize', resize);
			cancelAnimationFrame(animationId);
		};
	});

	// React to agent count changes
	$effect(() => {
		const targetCount = agentCount;
		if (walkers.length > targetCount) {
			walkers = walkers.slice(0, targetCount);
		} else {
			while (walkers.length < targetCount) {
				walkers.push(createWalker(true));
			}
		}
	});

	// React to restart signal
	$effect(() => {
		if (restartSignal > 0) {
			resetWalkers();
		}
	});

	// React to trailLength changes - update existing walkers
	$effect(() => {
		const newTrailLength = trailLength;
		walkers.forEach((walker) => {
			const variance = Math.floor(newTrailLength * 0.3);
			walker.maxTrail = newTrailLength - variance + Math.floor(Math.random() * variance * 2);
			// Trim trail if it exceeds new max
			if (walker.trail.length > walker.maxTrail) {
				walker.trail = walker.trail.slice(-walker.maxTrail);
			}
		});
	});

	// React to theme changes - redraw background
	$effect(() => {
		void themeState.current; // Track theme
		if (ctx && canvas) {
			const rect = canvas.getBoundingClientRect();
			drawBackground(rect.width, rect.height, false);
			drawGrid();
		}
	});
</script>

<canvas bind:this={canvas} class="absolute inset-0 h-full w-full {className}"></canvas>
