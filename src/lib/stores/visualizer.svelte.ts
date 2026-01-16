import { browser } from '$app/environment';
import {
	visualizers,
	visualizerOrder,
	getDefaultParams,
	type VisualizerName
} from '$lib/components/visualizers/config';

// Speed multiplier options
export const speedOptions = [0.1, 0.25, 0.5, 1.0, 2.0, 4.0] as const;
export type SpeedMultiplier = (typeof speedOptions)[number];

class VisualizerState {
	current = $state<VisualizerName>('grid-walk');
	isTransitioning = $state(false);

	// Global controls
	speedMultiplier = $state<SpeedMultiplier>(1.0);
	restartSignal = $state(0);

	// Per-visualizer params
	params = $state<Record<VisualizerName, Record<string, number>>>({
		off: getDefaultParams('off'),
		'grid-walk': getDefaultParams('grid-walk'),
		'random-walk': getDefaultParams('random-walk'),
		'matrix-rain': getDefaultParams('matrix-rain'),
		'particle-swarm': getDefaultParams('particle-swarm'),
		starfield: getDefaultParams('starfield'),
		ripples: getDefaultParams('ripples')
	});

	// Mouse position for interactive visualizers
	mouseX = $state(0);
	mouseY = $state(0);
	mouseActive = $state(false);

	constructor() {
		if (browser) {
			const saved = localStorage.getItem('rs-visualizer') as VisualizerName | null;
			if (saved && visualizers[saved]) {
				this.current = saved;
			}

			// Track mouse position
			window.addEventListener('mousemove', (e) => {
				this.mouseX = e.clientX;
				this.mouseY = e.clientY;
				this.mouseActive = true;
			});

			window.addEventListener('mouseleave', () => {
				this.mouseActive = false;
			});
		}
	}

	get config() {
		return visualizers[this.current];
	}

	get currentParams() {
		return this.params[this.current];
	}

	async set(visualizer: VisualizerName) {
		if (visualizer === this.current || this.isTransitioning) return;

		this.isTransitioning = true;

		// Reset speed to default when switching
		this.speedMultiplier = 1.0;

		if (browser) {
			localStorage.setItem('rs-visualizer', visualizer);

			// Brief transition delay
			await new Promise((r) => setTimeout(r, 50));

			this.current = visualizer;

			await new Promise((r) => setTimeout(r, 300));
		} else {
			this.current = visualizer;
		}

		this.isTransitioning = false;
	}

	cycle() {
		const currentIndex = visualizerOrder.indexOf(this.current);
		const nextIndex = (currentIndex + 1) % visualizerOrder.length;
		this.set(visualizerOrder[nextIndex]);
	}

	// Control methods
	cycleSpeed(direction: 1 | -1) {
		const currentIndex = speedOptions.indexOf(this.speedMultiplier);
		const newIndex = Math.max(0, Math.min(speedOptions.length - 1, currentIndex + direction));
		this.speedMultiplier = speedOptions[newIndex];
	}

	setParam(key: string, value: number) {
		const config = visualizers[this.current];
		const paramConfig = config.params[key];
		if (paramConfig) {
			// Clamp to min/max
			const clamped = Math.max(paramConfig.min, Math.min(paramConfig.max, value));
			this.params[this.current][key] = clamped;
		}
	}

	adjustParam(key: string, delta: number) {
		const currentValue = this.params[this.current][key] ?? 0;
		this.setParam(key, currentValue + delta);
	}

	restart() {
		this.restartSignal++;
	}

	resetParams() {
		this.params[this.current] = getDefaultParams(this.current);
		this.speedMultiplier = 1.0;
	}
}

export const visualizerState = new VisualizerState();
