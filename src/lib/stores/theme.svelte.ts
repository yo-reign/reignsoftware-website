import { browser } from '$app/environment';
import { themes, themeOrder, type ThemeName } from '$lib/themes';

class ThemeState {
	current = $state<ThemeName>('terminal');
	isTransitioning = $state(false);

	constructor() {
		if (browser) {
			const saved = localStorage.getItem('rs-theme') as ThemeName | null;
			if (saved && themes[saved]) {
				this.current = saved;
			}
			// Apply theme immediately
			this.applyTheme(this.current);
		}
	}

	get config() {
		return themes[this.current];
	}

	async set(theme: ThemeName) {
		if (theme === this.current || this.isTransitioning) return;

		this.isTransitioning = true;

		// Trigger transition animation
		if (browser) {
			document.documentElement.classList.add('theme-transitioning');

			// Wait for transition setup
			await new Promise((r) => setTimeout(r, 50));

			this.current = theme;
			this.applyTheme(theme);
			localStorage.setItem('rs-theme', theme);

			// Wait for transition to complete
			await new Promise((r) => setTimeout(r, 500));

			document.documentElement.classList.remove('theme-transitioning');
		} else {
			this.current = theme;
		}

		this.isTransitioning = false;
	}

	cycle() {
		const currentIndex = themeOrder.indexOf(this.current);
		const nextIndex = (currentIndex + 1) % themeOrder.length;
		this.set(themeOrder[nextIndex]);
	}

	private applyTheme(theme: ThemeName) {
		document.documentElement.setAttribute('data-theme', theme);
		document.documentElement.style.setProperty('--font-theme', themes[theme].fontFamily);
	}
}

export const themeState = new ThemeState();
