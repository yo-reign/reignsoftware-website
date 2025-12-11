<script lang="ts">
	import { onMount } from 'svelte';
	import { visualizerColors } from '$lib/themes';

	interface Props {
		class?: string;
		speed?: number;
		agentCount?: number;
		restartSignal?: number;
	}

	let { class: className = '', speed = 100, agentCount = 8, restartSignal = 0 }: Props = $props();

	let canvas: HTMLCanvasElement;
	let animationId: number;
	let ctx: CanvasRenderingContext2D;
	let walkers: Walker[] = [];
	let currentSpeed = speed;
	let currentAgentCount = agentCount;

	interface Walker {
		x: number;
		y: number;
		color: string;
		angle: number;
		walkSpeed: number;
		life: number;
		maxLife: number;
		thickness: number;
		moveTimer: number;
		moveInterval: number;
	}

	function getColors(): string[] {
		return visualizerColors;
	}

	function createWalker(fromCenter = false): Walker {
		const rect = canvas.getBoundingClientRect();
		const colors = getColors();
		return {
			x: fromCenter ? rect.width / 2 : Math.random() * rect.width,
			y: fromCenter ? rect.height / 2 : Math.random() * rect.height,
			color: colors[Math.floor(Math.random() * colors.length)],
			angle: Math.random() * Math.PI * 2,
			walkSpeed: 2 + Math.random() * 3,
			life: 0,
			maxLife: 400 + Math.random() * 400,
			thickness: 1 + Math.random() * 2,
			moveTimer: Math.random() * currentSpeed,
			moveInterval: currentSpeed + Math.random() * (currentSpeed * 0.5)
		};
	}

	function resetWalkers() {
		walkers = [];
		for (let i = 0; i < currentAgentCount; i++) {
			walkers.push(createWalker(true));
		}
		// Clear canvas
		if (ctx && canvas) {
			const rect = canvas.getBoundingClientRect();
			ctx.fillStyle = '#1d2021';
			ctx.fillRect(0, 0, rect.width, rect.height);
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

		// Initial background
		ctx.fillStyle = '#1d2021';
		ctx.fillRect(0, 0, rect.width, rect.height);

		resetWalkers();
	}

	function updateWalker(walker: Walker, deltaTime: number): boolean {
		const rect = canvas.getBoundingClientRect();

		walker.moveTimer += deltaTime;
		if (walker.moveTimer < walker.moveInterval) {
			return walker.life < walker.maxLife;
		}
		walker.moveTimer = 0;

		// Random angle deviation (the "walk")
		walker.angle += (Math.random() - 0.5) * 0.5;

		// Occasionally make sharper turns
		if (Math.random() < 0.02) {
			walker.angle += (Math.random() - 0.5) * Math.PI;
		}

		const prevX = walker.x;
		const prevY = walker.y;

		walker.x += Math.cos(walker.angle) * walker.walkSpeed;
		walker.y += Math.sin(walker.angle) * walker.walkSpeed;
		walker.life++;

		// Wrap around edges
		if (walker.x < 0) walker.x = rect.width;
		if (walker.x > rect.width) walker.x = 0;
		if (walker.y < 0) walker.y = rect.height;
		if (walker.y > rect.height) walker.y = 0;

		// Draw the line segment
		const alpha = 1 - walker.life / walker.maxLife;
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
			walker.life = 0;
			walker.maxLife = 400 + Math.random() * 400;
		}

		return true;
	}

	let lastTime = 0;

	function animate(timestamp: number) {
		const deltaTime = timestamp - lastTime;
		lastTime = timestamp;

		const rect = canvas.getBoundingClientRect();

		// Very subtle fade for trail effect
		ctx.fillStyle = 'rgba(29, 32, 33, 0.01)';
		ctx.fillRect(0, 0, rect.width, rect.height);

		// Update all walkers
		walkers.forEach((walker) => updateWalker(walker, deltaTime));

		animationId = requestAnimationFrame(animate);
	}

	onMount(() => {
		ctx = canvas.getContext('2d')!;
		resize();
		window.addEventListener('resize', resize);
		animationId = requestAnimationFrame(animate);

		return () => {
			window.removeEventListener('resize', resize);
			cancelAnimationFrame(animationId);
		};
	});

	// React to speed changes
	$effect(() => {
		if (speed !== currentSpeed) {
			currentSpeed = speed;
			walkers.forEach((walker) => {
				walker.moveInterval = currentSpeed + Math.random() * (currentSpeed * 0.5);
			});
		}
	});

	// React to agent count changes
	$effect(() => {
		if (agentCount !== currentAgentCount) {
			currentAgentCount = agentCount;
			if (walkers.length > currentAgentCount) {
				walkers = walkers.slice(0, currentAgentCount);
			} else {
				while (walkers.length < currentAgentCount) {
					walkers.push(createWalker(false));
				}
			}
		}
	});

	// React to restart signal
	$effect(() => {
		if (restartSignal > 0) {
			resetWalkers();
		}
	});
</script>

<canvas bind:this={canvas} class="absolute inset-0 h-full w-full {className}"></canvas>
