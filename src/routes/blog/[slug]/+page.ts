import type { BlogPostMeta } from '$lib/types/blog';
import { error } from '@sveltejs/kit';
import type { Component } from 'svelte';

export async function load({ params }) {
	try {
		const post = await import(`../../../content/blog/${params.slug}.md`);

		return {
			content: post.default as Component,
			meta: post.metadata as BlogPostMeta,
			slug: params.slug
		};
	} catch {
		throw error(404, `Post not found: ${params.slug}`);
	}
}
