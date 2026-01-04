import { browser } from '$app/environment';

export type Theme = 'dark' | 'light';

class ThemeState {
	current = $state<Theme>('dark');

	constructor() {
		if (browser) {
			// Check localStorage first
			const saved = localStorage.getItem('rs-theme') as Theme | null;
			if (saved && (saved === 'dark' || saved === 'light')) {
				this.current = saved;
			} else {
				// Check system preference
				const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
				this.current = prefersDark ? 'dark' : 'dark'; // Default to dark regardless
			}

			// Apply theme to document
			this.applyTheme();

			// Listen for system preference changes
			window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
				// Only auto-switch if user hasn't explicitly set a preference
				if (!localStorage.getItem('rs-theme')) {
					this.current = e.matches ? 'dark' : 'light';
					this.applyTheme();
				}
			});
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
		this.current = this.current === 'dark' ? 'light' : 'dark';
		if (browser) {
			localStorage.setItem('rs-theme', this.current);
			this.applyTheme();
		}
	}

	set(theme: Theme) {
		this.current = theme;
		if (browser) {
			localStorage.setItem('rs-theme', theme);
			this.applyTheme();
		}
	}

	get isDark() {
		return this.current === 'dark';
	}

	get isLight() {
		return this.current === 'light';
	}
}

export const themeState = new ThemeState();
