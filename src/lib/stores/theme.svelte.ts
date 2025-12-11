import { browser } from '$app/environment';
import { themes, type ThemeName } from '$lib/themes';

class ThemeState {
	current = $state<ThemeName>('gruvbox');

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

	set(theme: ThemeName) {
		this.current = theme;
		if (browser) {
			this.applyTheme(theme);
			localStorage.setItem('rs-theme', theme);
		}
	}

	cycle() {
		const themeNames = Object.keys(themes) as ThemeName[];
		const currentIndex = themeNames.indexOf(this.current);
		const nextIndex = (currentIndex + 1) % themeNames.length;
		this.set(themeNames[nextIndex]);
	}

	private applyTheme(theme: ThemeName) {
		document.documentElement.setAttribute('data-theme', theme);
		// Update font family based on theme
		document.documentElement.style.setProperty('--font-theme', themes[theme].fontFamily);
	}
}

export const themeState = new ThemeState();
