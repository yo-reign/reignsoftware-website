import { browser } from '$app/environment';
import { visualizers, visualizerOrder, type VisualizerName } from '$lib/themes';

// Speed multiplier options
export const speedOptions = [0.1, 0.25, 0.5, 1.0, 2.0, 4.0] as const;
export type SpeedMultiplier = (typeof speedOptions)[number];

class VisualizerState {
	current = $state<VisualizerName>('grid-walk');
	isTransitioning = $state(false);

	// Visualizer controls
	speedMultiplier = $state<SpeedMultiplier>(1.0);
	agentCount = $state(8);
	restartSignal = $state(0);

	constructor() {
		if (browser) {
			const saved = localStorage.getItem('rs-visualizer') as VisualizerName | null;
			if (saved && visualizers[saved]) {
				this.current = saved;
			}
		}
	}

	get config() {
		return visualizers[this.current];
	}

	async set(visualizer: VisualizerName) {
		if (visualizer === this.current || this.isTransitioning) return;

		this.isTransitioning = true;

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

	adjustAgents(delta: number) {
		this.agentCount = Math.max(1, Math.min(100, this.agentCount + delta));
	}

	restart() {
		this.restartSignal++;
	}
}

export const visualizerState = new VisualizerState();
