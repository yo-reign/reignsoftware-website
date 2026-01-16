<script lang="ts">
	import { onMount } from 'svelte';
	import { visualizerColors, visualizerColorsLight, themeColors } from './config';
	import { themeState } from '$lib/stores/theme.svelte';
	import { createCanvasResizeHandler } from '$lib/utils/canvasResize';

	interface Props {
		class?: string;
		speedMultiplier?: number;
		agentCount?: number;
		thickness?: number;
		restartSignal?: number;
	}

	let {
		class: className = '',
		speedMultiplier = 1.0,
		agentCount = 8,
		thickness: baseThickness = 2,
		restartSignal = 0
	}: Props = $props();

	let canvas: HTMLCanvasElement;
	let animationId: number;
	let ctx: CanvasRenderingContext2D;
	let walkers: Walker[] = [];

	// Theme-reactive colors
	let colors = $derived(themeState.isDark ? themeColors.dark : themeColors.light);
	let walkerColors = $derived(themeState.isDark ? visualizerColors : visualizerColorsLight);

	interface Walker {
		x: number;
		y: number;
		color: string;
		angle: number;
		baseSpeed: number;
		life: number;
		maxLife: number;
		thickness: number;
		// For smooth angle changes
		targetAngle: number;
		angleVelocity: number;
	}

	function getColors(): string[] {
		return walkerColors;
	}

	function createWalker(fromCenter = false): Walker {
		const rect = canvas.getBoundingClientRect();
		const colors = getColors();
		const angle = Math.random() * Math.PI * 2;
		// Use baseThickness prop with some variance
		const thicknessVariance = baseThickness * 0.5;
		return {
			x: fromCenter ? rect.width / 2 : Math.random() * rect.width,
			y: fromCenter ? rect.height / 2 : Math.random() * rect.height,
			color: colors[Math.floor(Math.random() * colors.length)],
			angle: angle,
			targetAngle: angle,
			angleVelocity: 0,
			baseSpeed: 1 + Math.random() * 2,
			life: 0,
			maxLife: 400 + Math.random() * 400,
			thickness: baseThickness - thicknessVariance / 2 + Math.random() * thicknessVariance
		};
	}

	function resetWalkers() {
		walkers = [];
		for (let i = 0; i < agentCount; i++) {
			walkers.push(createWalker(true));
		}
		// Clear canvas
		if (ctx && canvas) {
			const rect = canvas.getBoundingClientRect();
			ctx.fillStyle = colors.bg0;
			ctx.fillRect(0, 0, rect.width, rect.height);
		}
	}

	// Resize handler that prevents restarts on minor height changes (mobile browser chrome)
	const resizeHandler = createCanvasResizeHandler(
		() => canvas,
		() => ctx,
		() => {}, // No dimension-dependent state to update
		resetWalkers
	);

	function updateWalker(walker: Walker, deltaTime: number, currentSpeedMultiplier: number) {
		const rect = canvas.getBoundingClientRect();

		// Normalize deltaTime to 60fps baseline (16.67ms)
		const normalizedDelta = deltaTime / 16.67;
		const speedFactor = currentSpeedMultiplier * normalizedDelta;

		// Smoothly interpolate angle toward target
		const angleDiff = walker.targetAngle - walker.angle;
		walker.angle += angleDiff * 0.1 * speedFactor;

		// Randomly adjust target angle for organic movement
		if (Math.random() < 0.05 * speedFactor) {
			walker.targetAngle += (Math.random() - 0.5) * 0.8;
		}

		// Occasionally make sharper turns
		if (Math.random() < 0.005 * speedFactor) {
			walker.targetAngle += (Math.random() - 0.5) * Math.PI;
		}

		const prevX = walker.x;
		const prevY = walker.y;

		// Move based on speed multiplier
		const moveDistance = walker.baseSpeed * speedFactor;
		walker.x += Math.cos(walker.angle) * moveDistance;
		walker.y += Math.sin(walker.angle) * moveDistance;
		walker.life += speedFactor;

		// Wrap around edges
		if (walker.x < 0) walker.x = rect.width;
		if (walker.x > rect.width) walker.x = 0;
		if (walker.y < 0) walker.y = rect.height;
		if (walker.y > rect.height) walker.y = 0;

		// Draw the line segment
		const alpha = Math.max(0, 1 - walker.life / walker.maxLife);
		ctx.beginPath();
		ctx.strokeStyle = walker.color;
		ctx.globalAlpha = alpha * 0.8;
		ctx.lineWidth = walker.thickness;
		ctx.lineCap = 'round';

		// Only draw if we didn't wrap
		if (Math.abs(walker.x - prevX) < 50 && Math.abs(walker.y - prevY) < 50) {
			ctx.moveTo(prevX, prevY);
			ctx.lineTo(walker.x, walker.y);
			ctx.stroke();
		}

		ctx.globalAlpha = 1;

		// Respawn walker if dead
		if (walker.life >= walker.maxLife) {
			const colors = getColors();
			walker.x = Math.random() * rect.width;
			walker.y = Math.random() * rect.height;
			walker.color = colors[Math.floor(Math.random() * colors.length)];
			walker.angle = Math.random() * Math.PI * 2;
			walker.targetAngle = walker.angle;
			walker.life = 0;
			walker.maxLife = 400 + Math.random() * 400;
		}
	}

	let lastTime = 0;

	function animate(timestamp: number) {
		const deltaTime = Math.min(timestamp - lastTime, 50); // Cap delta to prevent jumps
		lastTime = timestamp;

		const rect = canvas.getBoundingClientRect();

		// Subtle fade for trail effect (this creates the dimming)
		ctx.fillStyle = colors.bgRgba;
		ctx.fillRect(0, 0, rect.width, rect.height);

		// Update all walkers with current speed multiplier
		walkers.forEach((walker) => updateWalker(walker, deltaTime, speedMultiplier));

		animationId = requestAnimationFrame(animate);
	}

	onMount(() => {
		ctx = canvas.getContext('2d')!;
		resizeHandler.init();
		window.addEventListener('resize', resizeHandler.handleResize);
		lastTime = performance.now();
		animationId = requestAnimationFrame(animate);

		return () => {
			window.removeEventListener('resize', resizeHandler.handleResize);
			resizeHandler.destroy();
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
				walkers.push(createWalker(false));
			}
		}
	});

	// React to restart signal
	$effect(() => {
		if (restartSignal > 0) {
			resetWalkers();
		}
	});

	// React to thickness changes - update existing walkers
	$effect(() => {
		const newThickness = baseThickness;
		walkers.forEach((walker) => {
			const thicknessVariance = newThickness * 0.5;
			walker.thickness = newThickness - thicknessVariance / 2 + Math.random() * thicknessVariance;
		});
	});

	// React to theme changes - redraw background
	$effect(() => {
		void themeState.current;
		if (ctx && canvas) {
			const rect = canvas.getBoundingClientRect();
			ctx.fillStyle = colors.bg0;
			ctx.fillRect(0, 0, rect.width, rect.height);
		}
	});
</script>

<canvas bind:this={canvas} class="absolute inset-0 h-full w-full {className}"></canvas>
