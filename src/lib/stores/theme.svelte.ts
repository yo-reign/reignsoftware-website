import { browser } from '$app/environment';
import { visualizers, visualizerOrder, type VisualizerName } from '$lib/themes';

class VisualizerState {
	current = $state<VisualizerName>('grid-walk');
	isTransitioning = $state(false);

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
}

export const visualizerState = new VisualizerState();
