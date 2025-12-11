// Theme definitions - each theme is a complete EXPERIENCE, not just colors
export type ThemeName = 'terminal' | 'minimal' | 'cyber' | 'soft';

export interface ThemeConfig {
	name: ThemeName;
	displayName: string;
	tagline: string;
	description: string;
	visualizer: 'grid-walk' | 'aurora' | 'glitch-particles' | 'flowing-blobs';
	fontFamily: string;
	fontMono: string;
}

export const themes: Record<ThemeName, ThemeConfig> = {
	terminal: {
		name: 'terminal',
		displayName: 'Terminal',
		tagline: 'Enter the command line',
		description: 'Retro hacker aesthetic. CLI-inspired, monospace everything.',
		visualizer: 'grid-walk',
		fontFamily: '"JetBrains Mono", "Fira Code", monospace',
		fontMono: '"JetBrains Mono", monospace'
	},
	minimal: {
		name: 'minimal',
		displayName: 'Minimal',
		tagline: 'Less is more',
		description: 'Clean Scandinavian design. Whitespace, elegance, calm.',
		visualizer: 'aurora',
		fontFamily: '"Inter", system-ui, sans-serif',
		fontMono: '"JetBrains Mono", monospace'
	},
	cyber: {
		name: 'cyber',
		displayName: 'Cyber',
		tagline: 'Welcome to the grid',
		description: 'Neon futuristic. Bold, high-contrast, electric.',
		visualizer: 'glitch-particles',
		fontFamily: '"Inter", system-ui, sans-serif',
		fontMono: '"JetBrains Mono", monospace'
	},
	soft: {
		name: 'soft',
		displayName: 'Soft',
		tagline: 'Cozy and warm',
		description: 'Pastel comfort. Friendly, approachable, inviting.',
		visualizer: 'flowing-blobs',
		fontFamily: '"Inter", system-ui, sans-serif',
		fontMono: '"JetBrains Mono", monospace'
	}
};

// Color palettes for visualizers (internal use)
export const themeColors: Record<ThemeName, string[]> = {
	terminal: [
		'#cc241d', // red
		'#98971a', // green
		'#d79921', // yellow
		'#458588', // blue
		'#b16286', // purple
		'#689d6a', // aqua
		'#fe8019', // orange
		'#fabd2f' // bright yellow
	],
	minimal: [
		'#8fbcbb',
		'#88c0d0',
		'#81a1c1',
		'#5e81ac',
		'#a3be8c',
		'#ebcb8b',
		'#d08770',
		'#bf616a'
	],
	cyber: [
		'#ff79c6',
		'#bd93f9',
		'#8be9fd',
		'#50fa7b',
		'#ffb86c',
		'#ff5555',
		'#f1fa8c',
		'#6272a4'
	],
	soft: [
		'#f5c2e7',
		'#cba6f7',
		'#f38ba8',
		'#eba0ac',
		'#fab387',
		'#f9e2af',
		'#a6e3a1',
		'#94e2d5'
	]
};

// Theme order for cycling
export const themeOrder: ThemeName[] = ['terminal', 'minimal', 'cyber', 'soft'];
