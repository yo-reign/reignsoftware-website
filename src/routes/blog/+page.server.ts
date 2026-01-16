import type { BlogPost, BlogPostMeta } from '$lib/types/blog';

export async function load() {
	const posts: BlogPost[] = [];

	// Import all markdown files from the content/blog directory
	const modules = import.meta.glob<{
		metadata: BlogPostMeta;
	}>('/src/content/blog/*.md', { eager: true });

	for (const [path, module] of Object.entries(modules)) {
		const slug = path.split('/').pop()?.replace('.md', '') ?? '';
		const meta = module.metadata;

		// Only include published posts
		if (meta.published) {
			posts.push({ slug, meta });
		}
	}

	// Sort by date (newest first)
	posts.sort((a, b) => new Date(b.meta.date).getTime() - new Date(a.meta.date).getTime());

	return { posts };
}
