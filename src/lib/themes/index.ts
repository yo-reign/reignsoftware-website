// Theme definitions - each theme is a complete design system
export type ThemeName = 'gruvbox' | 'nord' | 'dracula' | 'catppuccin';

export interface ThemeConfig {
	name: ThemeName;
	displayName: string;
	description: string;
	visualizer: 'random-walk' | 'aurora' | 'bat-swarm' | 'pastel-waves';
	fontFamily: string;
	aesthetic: 'terminal' | 'minimal' | 'gothic' | 'soft';
}

export const themes: Record<ThemeName, ThemeConfig> = {
	gruvbox: {
		name: 'gruvbox',
		displayName: 'Gruvbox',
		description: 'Retro terminal vibes with warm, earthy tones',
		visualizer: 'random-walk',
		fontFamily: '"JetBrains Mono", "Fira Code", monospace',
		aesthetic: 'terminal'
	},
	nord: {
		name: 'nord',
		displayName: 'Nord',
		description: 'Arctic, north-bluish color palette',
		visualizer: 'aurora',
		fontFamily: '"Inter", system-ui, sans-serif',
		aesthetic: 'minimal'
	},
	dracula: {
		name: 'dracula',
		displayName: 'Dracula',
		description: 'Dark theme with vibrant accent colors',
		visualizer: 'bat-swarm',
		fontFamily: '"Fira Code", monospace',
		aesthetic: 'gothic'
	},
	catppuccin: {
		name: 'catppuccin',
		displayName: 'Catppuccin',
		description: 'Soothing pastel theme for cozy coding',
		visualizer: 'pastel-waves',
		fontFamily: '"Inter", system-ui, sans-serif',
		aesthetic: 'soft'
	}
};

// Color palettes for visualizers
export const themeColors: Record<ThemeName, string[]> = {
	gruvbox: [
		'#cc241d', // red
		'#98971a', // green
		'#d79921', // yellow
		'#458588', // blue
		'#b16286', // purple
		'#689d6a', // aqua
		'#fe8019', // orange
		'#fabd2f' // bright yellow
	],
	nord: [
		'#8fbcbb', // nord7
		'#88c0d0', // nord8
		'#81a1c1', // nord9
		'#5e81ac', // nord10
		'#bf616a', // nord11
		'#d08770', // nord12
		'#ebcb8b', // nord13
		'#a3be8c' // nord14
	],
	dracula: [
		'#ff79c6', // pink
		'#bd93f9', // purple
		'#8be9fd', // cyan
		'#50fa7b', // green
		'#ffb86c', // orange
		'#ff5555', // red
		'#f1fa8c', // yellow
		'#6272a4' // comment
	],
	catppuccin: [
		'#f5c2e7', // pink
		'#cba6f7', // mauve
		'#f38ba8', // red
		'#eba0ac', // maroon
		'#fab387', // peach
		'#f9e2af', // yellow
		'#a6e3a1', // green
		'#94e2d5' // teal
	]
};
