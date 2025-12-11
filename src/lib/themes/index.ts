// Visualizer definitions - different background visual experiences
export type VisualizerName = 'grid-walk' | 'random-walk';

export interface VisualizerConfig {
	name: VisualizerName;
	displayName: string;
	tagline: string;
	description: string;
}

export const visualizers: Record<VisualizerName, VisualizerConfig> = {
	'grid-walk': {
		name: 'grid-walk',
		displayName: 'Grid Walk',
		tagline: 'Structured chaos',
		description: 'Agents traverse a grid, leaving colorful trails behind.'
	},
	'random-walk': {
		name: 'random-walk',
		displayName: 'Random Walk',
		tagline: 'Free flowing',
		description: 'Organic, free-flowing paths that wind across the canvas.'
	}
};

// Color palette for visualizers (Gruvbox)
export const visualizerColors: string[] = [
	'#fb4934', // bright red
	'#b8bb26', // bright green
	'#fabd2f', // bright yellow
	'#83a598', // bright blue
	'#d3869b', // bright purple
	'#8ec07c', // bright aqua
	'#928374' // gray
];

// Visualizer order for cycling
export const visualizerOrder: VisualizerName[] = ['grid-walk', 'random-walk'];
