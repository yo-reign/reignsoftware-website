// Visualizer definitions - different background visual experiences
export type VisualizerName =
	| 'grid-walk'
	| 'random-walk'
	| 'matrix-rain'
	| 'particle-swarm'
	| 'starfield'
	| 'ripples';

// Parameter definitions
export interface ParamConfig {
	label: string;
	min: number;
	max: number;
	step: number;
	default: number;
	color: string; // Terminal color variable
}

export interface VisualizerConfig {
	name: VisualizerName;
	displayName: string;
	tagline: string;
	description: string;
	interactive: boolean;
	params: Record<string, ParamConfig>;
}

export const visualizers: Record<VisualizerName, VisualizerConfig> = {
	'grid-walk': {
		name: 'grid-walk',
		displayName: 'Grid Walk',
		tagline: 'Structured chaos',
		description: 'Agents traverse a grid, leaving colorful trails behind.',
		interactive: false,
		params: {
			agents: {
				label: '--agents',
				min: 1,
				max: 100,
				step: 1,
				default: 8,
				color: 'var(--term-blue)'
			},
			trailLength: {
				label: '--trail',
				min: 5,
				max: 100,
				step: 5,
				default: 40,
				color: 'var(--term-purple)'
			}
		}
	},
	'random-walk': {
		name: 'random-walk',
		displayName: 'Random Walk',
		tagline: 'Free flowing',
		description: 'Organic, free-flowing paths that wind across the canvas.',
		interactive: false,
		params: {
			agents: {
				label: '--agents',
				min: 1,
				max: 100,
				step: 1,
				default: 8,
				color: 'var(--term-blue)'
			},
			thickness: {
				label: '--thickness',
				min: 1,
				max: 8,
				step: 1,
				default: 2,
				color: 'var(--term-aqua)'
			}
		}
	},
	'matrix-rain': {
		name: 'matrix-rain',
		displayName: 'Matrix Rain',
		tagline: 'Digital rain',
		description: 'Falling characters cascade down the screen.',
		interactive: false,
		params: {
			density: {
				label: '--density',
				min: 5,
				max: 50,
				step: 5,
				default: 20,
				color: 'var(--term-green)'
			},
			charset: {
				label: '--charset',
				min: 0,
				max: 2,
				step: 1,
				default: 0,
				color: 'var(--term-aqua)'
			}
		}
	},
	'particle-swarm': {
		name: 'particle-swarm',
		displayName: 'Particle Swarm',
		tagline: 'Follow the cursor',
		description: 'Particles attracted to your mouse cursor.',
		interactive: true,
		params: {
			particles: {
				label: '--particles',
				min: 50,
				max: 500,
				step: 50,
				default: 200,
				color: 'var(--term-yellow)'
			},
			attraction: {
				label: '--attraction',
				min: 1,
				max: 10,
				step: 1,
				default: 5,
				color: 'var(--term-red)'
			}
		}
	},
	starfield: {
		name: 'starfield',
		displayName: 'Starfield',
		tagline: 'Warp speed',
		description: 'Fly through an endless field of stars.',
		interactive: false,
		params: {
			stars: {
				label: '--stars',
				min: 100,
				max: 1000,
				step: 100,
				default: 400,
				color: 'var(--term-blue)'
			},
			depth: {
				label: '--depth',
				min: 1,
				max: 10,
				step: 1,
				default: 5,
				color: 'var(--term-purple)'
			}
		}
	},
	ripples: {
		name: 'ripples',
		displayName: 'Ripples',
		tagline: 'Click to create',
		description: 'Click anywhere to create expanding ripples.',
		interactive: true,
		params: {
			decay: {
				label: '--decay',
				min: 1,
				max: 10,
				step: 1,
				default: 5,
				color: 'var(--term-aqua)'
			},
			maxRipples: {
				label: '--max',
				min: 5,
				max: 50,
				step: 5,
				default: 20,
				color: 'var(--term-yellow)'
			}
		}
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

// Visualizer order for UI
export const visualizerOrder: VisualizerName[] = [
	'grid-walk',
	'random-walk',
	'matrix-rain',
	'particle-swarm',
	'starfield',
	'ripples'
];

// Get default params for a visualizer
export function getDefaultParams(name: VisualizerName): Record<string, number> {
	const config = visualizers[name];
	const params: Record<string, number> = {};
	for (const [key, param] of Object.entries(config.params)) {
		params[key] = param.default;
	}
	return params;
}
