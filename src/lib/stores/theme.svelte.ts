import { browser } from '$app/environment';

export type ThemeMode = 'dark' | 'light' | 'auto';
export type Theme = 'dark' | 'light';

class ThemeState {
	// The user's preference (dark, light, or auto)
	mode = $state<ThemeMode>('auto');
	// The actual applied theme (dark or light)
	current = $state<Theme>('dark');

	constructor() {
		if (browser) {
			// Check localStorage for saved preference
			const saved = localStorage.getItem('rs-theme-mode') as ThemeMode | null;
			if (saved && (saved === 'dark' || saved === 'light' || saved === 'auto')) {
				this.mode = saved;
			} else {
				this.mode = 'auto';
			}

			// Determine actual theme based on mode
			this.updateCurrentTheme();

			// Apply theme to document
			this.applyTheme();

			// Listen for system preference changes
			window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
				if (this.mode === 'auto') {
					this.updateCurrentTheme();
					this.applyTheme();
				}
			});
		}
	}

	private getSystemTheme(): Theme {
		if (!browser) return 'dark';
		return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
	}

	private updateCurrentTheme() {
		if (this.mode === 'auto') {
			this.current = this.getSystemTheme();
		} else {
			this.current = this.mode;
		}
	}

	private applyTheme() {
		if (!browser) return;

		const root = document.documentElement;
		if (this.current === 'light') {
			root.classList.add('light');
		} else {
			root.classList.remove('light');
		}

		// Update meta theme-color
		const metaTheme = document.querySelector('meta[name="theme-color"]');
		if (metaTheme) {
			metaTheme.setAttribute('content', this.current === 'dark' ? '#1d2021' : '#f9f5d7');
		}
	}

	toggle() {
		// Cycle through: dark -> light -> auto -> dark
		if (this.mode === 'dark') {
			this.mode = 'light';
		} else if (this.mode === 'light') {
			this.mode = 'auto';
		} else {
			this.mode = 'dark';
		}

		if (browser) {
			localStorage.setItem('rs-theme-mode', this.mode);
			this.updateCurrentTheme();
			this.applyTheme();
		}
	}

	setMode(mode: ThemeMode) {
		this.mode = mode;
		if (browser) {
			localStorage.setItem('rs-theme-mode', mode);
			this.updateCurrentTheme();
			this.applyTheme();
		}
	}

	get isDark() {
		return this.current === 'dark';
	}

	get isLight() {
		return this.current === 'light';
	}

	get isAuto() {
		return this.mode === 'auto';
	}
}

export const themeState = new ThemeState();
