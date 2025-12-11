<script lang="ts">
	import { onMount } from 'svelte';
	import { themeColors } from '$lib/themes';
	import { themeState } from '$lib/stores/theme.svelte';

	interface Props {
		class?: string;
	}

	let { class: className = '' }: Props = $props();

	let canvas: HTMLCanvasElement;
	let animationId: number;

	interface Walker {
		x: number;
		y: number;
		color: string;
		angle: number;
		speed: number;
		life: number;
		maxLife: number;
		thickness: number;
	}

	onMount(() => {
		const ctx = canvas.getContext('2d')!;
		let walkers: Walker[] = [];
		let lastSpawn = 0;

		function resize() {
			const dpr = window.devicePixelRatio || 1;
			const rect = canvas.getBoundingClientRect();
			canvas.width = rect.width * dpr;
			canvas.height = rect.height * dpr;
			ctx.scale(dpr, dpr);
			// Fade existing content on resize
			ctx.fillStyle = 'rgba(40, 40, 40, 0.3)';
			ctx.fillRect(0, 0, rect.width, rect.height);
		}

		function getColors(): string[] {
			return themeColors[themeState.current] || themeColors.gruvbox;
		}

		function createWalker(): Walker {
			const rect = canvas.getBoundingClientRect();
			const colors = getColors();
			return {
				x: Math.random() * rect.width,
				y: Math.random() * rect.height,
				color: colors[Math.floor(Math.random() * colors.length)],
				angle: Math.random() * Math.PI * 2,
				speed: 1 + Math.random() * 2,
				life: 0,
				maxLife: 200 + Math.random() * 300,
				thickness: 1 + Math.random() * 2
			};
		}

		function updateWalker(walker: Walker): boolean {
			const rect = canvas.getBoundingClientRect();

			// Random angle deviation (the "walk")
			walker.angle += (Math.random() - 0.5) * 0.5;

			// Occasionally make sharper turns
			if (Math.random() < 0.02) {
				walker.angle += (Math.random() - 0.5) * Math.PI;
			}

			const prevX = walker.x;
			const prevY = walker.y;

			walker.x += Math.cos(walker.angle) * walker.speed;
			walker.y += Math.sin(walker.angle) * walker.speed;
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

			// Return true if walker should continue
			return walker.life < walker.maxLife;
		}

		function animate(timestamp: number) {
			const rect = canvas.getBoundingClientRect();

			// Very subtle fade for trail effect
			ctx.fillStyle = 'rgba(40, 40, 40, 0.01)';
			ctx.fillRect(0, 0, rect.width, rect.height);

			// Spawn new walkers periodically
			if (timestamp - lastSpawn > 100 && walkers.length < 50) {
				walkers.push(createWalker());
				lastSpawn = timestamp;

				// Chance to spawn a branching walker near an existing one
				if (walkers.length > 5 && Math.random() < 0.3) {
					const parent = walkers[Math.floor(Math.random() * walkers.length)];
					const child = createWalker();
					child.x = parent.x + (Math.random() - 0.5) * 20;
					child.y = parent.y + (Math.random() - 0.5) * 20;
					child.angle = parent.angle + (Math.random() - 0.5) * Math.PI;
					walkers.push(child);
				}
			}

			// Update all walkers
			walkers = walkers.filter(updateWalker);

			animationId = requestAnimationFrame(animate);
		}

		resize();
		window.addEventListener('resize', resize);

		// Initial background
		ctx.fillStyle = '#282828';
		ctx.fillRect(0, 0, canvas.getBoundingClientRect().width, canvas.getBoundingClientRect().height);

		// Start with some walkers
		for (let i = 0; i < 15; i++) {
			walkers.push(createWalker());
		}

		animationId = requestAnimationFrame(animate);

		return () => {
			window.removeEventListener('resize', resize);
			cancelAnimationFrame(animationId);
		};
	});
</script>

<canvas bind:this={canvas} class="absolute inset-0 h-full w-full {className}"></canvas>
