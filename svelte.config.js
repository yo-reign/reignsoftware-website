import adapter from '@sveltejs/adapter-vercel';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { mdsvex } from 'mdsvex';

// Cached highlighter singleton (created once, reused for all code blocks)
let highlighterPromise = null;

async function getHighlighter() {
	if (!highlighterPromise) {
		const { createHighlighter } = await import('shiki');
		highlighterPromise = createHighlighter({
			themes: ['gruvbox-dark-hard', 'gruvbox-light-hard'],
			langs: [] // Load languages on demand for better performance
		});
	}
	return highlighterPromise;
}

/** @type {import('mdsvex').MdsvexOptions} */
const mdsvexOptions = {
	extensions: ['.md'],
	highlight: {
		highlighter: async (code, lang = 'text') => {
			const highlighter = await getHighlighter();

			// Load the language if not already loaded
			const loadedLangs = highlighter.getLoadedLanguages();
			if (!loadedLangs.includes(lang)) {
				try {
					await highlighter.loadLanguage(lang);
				} catch {
					// Fallback to plaintext if language not supported
					lang = 'text';
				}
			}

			// Generate HTML with dual themes using CSS variables
			const html = highlighter.codeToHtml(code, {
				lang,
				themes: {
					dark: 'gruvbox-dark-hard',
					light: 'gruvbox-light-hard'
				},
				defaultColor: false
			});

			// Escape special characters for Svelte's {@html}
			const escaped = html
				.replace(/\{/g, '&#123;')
				.replace(/\}/g, '&#125;')
				.replace(/`/g, '&#96;')
				.replace(/\$/g, '&#36;');

			return `{@html \`${escaped}\`}`;
		}
	}
};

/** @type {import('@sveltejs/kit').Config} */
const config = {
	extensions: ['.svelte', '.md'],
	preprocess: [vitePreprocess(), mdsvex(mdsvexOptions)],
	kit: { adapter: adapter() }
};

export default config;
