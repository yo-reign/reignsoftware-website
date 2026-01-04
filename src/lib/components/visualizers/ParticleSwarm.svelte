<script lang="ts">
	import { onMount } from 'svelte';
	import { visualizerColors, visualizerColorsLight, themeColors } from './config';
	import { themeState } from '$lib/stores/theme.svelte';

	interface Props {
		class?: string;
		speedMultiplier?: number;
		particles?: number;
		attraction?: number;
		restartSignal?: number;
		mouseX?: number;
		mouseY?: number;
		mouseActive?: boolean;
	}

	let {
		class: className = '',
		speedMultiplier = 1.0,
		particles: particleCount = 200,
		attraction = 5,
		restartSignal = 0,
		mouseX = 0,
		mouseY = 0,
		mouseActive = false
	}: Props = $props();

	let canvas: HTMLCanvasElement;
	let animationId: number;
	let ctx: CanvasRenderingContext2D;
	let particleList: Particle[] = [];
	let lastTime = 0;
	let centerX = 0;
	let centerY = 0;

	// Theme-reactive colors
	let colors = $derived(themeState.isDark ? themeColors.dark : themeColors.light);
	let particleColors = $derived(themeState.isDark ? visualizerColors : visualizerColorsLight);
	let targetIndicatorColor = $derived(themeState.isDark ? '#ebdbb2' : '#3c3836');

	interface Particle {
		x: number;
		y: number;
		vx: number;
		vy: number;
		size: number;
		color: string;
		baseSpeed: number;
	}

	function createParticle(width: number, height: number): Particle {
		return {
			x: Math.random() * width,
			y: Math.random() * height,
			vx: (Math.random() - 0.5) * 2,
			vy: (Math.random() - 0.5) * 2,
			size: 1 + Math.random() * 3,
			color: particleColors[Math.floor(Math.random() * particleColors.length)],
			baseSpeed: 0.5 + Math.random() * 9.5
		};
	}

	function initParticles() {
		if (!canvas) return;
		const rect = canvas.getBoundingClientRect();
		centerX = rect.width / 2;
		centerY = rect.height / 2;
		particleList = [];
		for (let i = 0; i < particleCount; i++) {
			particleList.push(createParticle(rect.width, rect.height));
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
		initParticles();
	}

	function animate(timestamp: number) {
		const deltaTime = Math.min(timestamp - lastTime, 50);
		lastTime = timestamp;
		const normalizedDelta = deltaTime / 16.67;

		const rect = canvas.getBoundingClientRect();

		// Fade effect
		const fadeColor = themeState.isDark ? 'rgba(29, 32, 33, 0.1)' : 'rgba(249, 245, 215, 0.1)';
		ctx.fillStyle = fadeColor;
		ctx.fillRect(0, 0, rect.width, rect.height);

		// Target point (mouse or center)
		const targetX = mouseActive ? mouseX : centerX;
		const targetY = mouseActive ? mouseY : centerY;

		const attractionForce = attraction / 1000;
		const speedFactor = speedMultiplier * normalizedDelta;

		particleList.forEach((p) => {
			// Calculate direction to target
			const dx = targetX - p.x;
			const dy = targetY - p.y;
			const dist = Math.sqrt(dx * dx + dy * dy);

			if (dist > 1) {
				// Apply attraction force
				const force = attractionForce * p.baseSpeed;
				p.vx += (dx / dist) * force * speedFactor;
				p.vy += (dy / dist) * force * speedFactor;
			}

			// Add some random wandering
			p.vx += (Math.random() - 0.5) * 0.1 * speedFactor;
			p.vy += (Math.random() - 0.5) * 0.1 * speedFactor;

			// Apply friction
			p.vx *= 0.98;
			p.vy *= 0.98;

			// Limit velocity
			const maxSpeed = 5 * speedMultiplier;
			const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
			if (speed > maxSpeed) {
				p.vx = (p.vx / speed) * maxSpeed;
				p.vy = (p.vy / speed) * maxSpeed;
			}

			// Update position
			p.x += p.vx * speedFactor;
			p.y += p.vy * speedFactor;

			// Wrap around edges
			if (p.x < 0) p.x = rect.width;
			if (p.x > rect.width) p.x = 0;
			if (p.y < 0) p.y = rect.height;
			if (p.y > rect.height) p.y = 0;

			// Draw particle
			ctx.beginPath();
			ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
			ctx.fillStyle = p.color;
			ctx.globalAlpha = 0.7;
			ctx.fill();

			// Draw glow effect for larger particles
			if (p.size > 2) {
				ctx.beginPath();
				ctx.arc(p.x, p.y, p.size * 2, 0, Math.PI * 2);
				ctx.fillStyle = p.color;
				ctx.globalAlpha = 0.1;
				ctx.fill();
			}
		});

		// Draw target indicator when mouse is active
		if (mouseActive) {
			ctx.beginPath();
			ctx.arc(targetX, targetY, 8, 0, Math.PI * 2);
			ctx.strokeStyle = targetIndicatorColor;
			ctx.globalAlpha = 0.3;
			ctx.lineWidth = 1;
			ctx.stroke();
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
		ctx.fillStyle = colors.bg0;
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
			initParticles();
		}
	});

	// React to particle count changes
	$effect(() => {
		const _ = particleCount;
		if (canvas) {
			const rect = canvas.getBoundingClientRect();
			while (particleList.length < particleCount) {
				particleList.push(createParticle(rect.width, rect.height));
			}
			if (particleList.length > particleCount) {
				particleList = particleList.slice(0, particleCount);
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
			// Re-assign colors to existing particles
			particleList.forEach((p) => {
				p.color = particleColors[Math.floor(Math.random() * particleColors.length)];
			});
		}
	});
</script>

<canvas bind:this={canvas} class="absolute inset-0 h-full w-full {className}"></canvas>
