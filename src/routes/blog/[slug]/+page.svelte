<script lang="ts">
	import { Calendar, Tag, ArrowLeft } from '@lucide/svelte';
	import type { BlogPostMeta } from '$lib/types/blog';
	import type { Component } from 'svelte';

	interface Props {
		data: {
			content: Component;
			meta: BlogPostMeta;
			slug: string;
		};
	}

	let { data }: Props = $props();

	function formatDate(dateStr: string): string {
		return new Date(dateStr).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	}
</script>

<article class="min-h-screen px-4 py-24 sm:px-6 lg:px-8">
	<!-- Translucent container -->
	<div class="mx-auto max-w-3xl border border-border/50 bg-card/80 backdrop-blur-sm">
		<!-- Header -->
		<div class="border-b border-border/50 p-6 sm:p-8">
			<!-- Back link -->
			<a
				href="/blog"
				class="mb-6 inline-flex items-center gap-2 text-sm text-(--term-gray) transition-colors hover:text-(--term-green)"
			>
				<ArrowLeft class="h-4 w-4" />
				<span>cd ../blog</span>
			</a>

			<!-- Terminal header -->
			<div class="mb-6 border border-border/50 bg-secondary/30">
				<div class="flex items-center gap-2 border-b border-border/50 bg-secondary/50 px-4 py-2">
					<span class="text-(--term-green)">$</span>
					<span class="text-sm text-(--term-gray)">cat ./blog/{data.slug}.md</span>
				</div>
				<div class="p-4">
					<h1 class="text-3xl font-bold text-(--term-fg) sm:text-4xl">
						{data.meta.title}
					</h1>
					<p class="mt-4 text-lg text-muted-foreground">
						{data.meta.description}
					</p>
				</div>
			</div>

			<!-- Meta info -->
			<div class="flex flex-wrap items-center gap-4 text-sm text-(--term-gray)">
				<span class="flex items-center gap-1.5">
					<Calendar class="h-4 w-4" />
					{formatDate(data.meta.date)}
				</span>
				{#if data.meta.author}
					<span>by {data.meta.author}</span>
				{/if}
				{#if data.meta.tags && data.meta.tags.length > 0}
					<span class="flex items-center gap-1.5">
						<Tag class="h-4 w-4" />
						{data.meta.tags.join(', ')}
					</span>
				{/if}
			</div>
		</div>

		<!-- Content -->
		<div class="p-6 sm:p-8">
			<div class="prose">
				<data.content />
			</div>
		</div>

		<!-- Footer navigation -->
		<div class="border-t border-border/50 p-6 sm:p-8">
			<a
				href="/blog"
				class="inline-flex items-center gap-2 border-2 border-(--term-green) px-4 py-2 font-mono text-(--term-green) transition-all hover:bg-(--term-green) hover:text-(--term-bg)"
			>
				<ArrowLeft class="h-4 w-4" />
				<span>[ cd ../blog ]</span>
			</a>
		</div>
	</div>
</article>

<style>
	/* Terminal-themed prose styling */
	.prose :global(h1),
	.prose :global(h2),
	.prose :global(h3),
	.prose :global(h4) {
		color: var(--term-fg);
		font-weight: 700;
		margin-top: 2rem;
		margin-bottom: 1rem;
	}

	.prose :global(h1)::before,
	.prose :global(h2)::before {
		content: '## ';
		color: var(--term-green);
	}

	.prose :global(h3)::before {
		content: '### ';
		color: var(--term-blue);
	}

	.prose :global(h1) {
		font-size: 1.875rem;
	}

	.prose :global(h2) {
		font-size: 1.5rem;
	}

	.prose :global(h3) {
		font-size: 1.25rem;
	}

	.prose :global(p) {
		color: var(--term-fg-dim);
		line-height: 1.75;
		margin-bottom: 1.25rem;
	}

	.prose :global(a) {
		color: var(--term-blue);
		text-decoration: underline;
		text-underline-offset: 2px;
		transition: color 0.15s;
	}

	.prose :global(a:hover) {
		color: var(--term-green);
	}

	.prose :global(strong) {
		color: var(--term-fg);
		font-weight: 600;
	}

	.prose :global(em) {
		color: var(--term-yellow);
		font-style: italic;
	}

	.prose :global(code:not(pre code)) {
		background: var(--term-bg1);
		color: var(--term-aqua);
		padding: 0.125rem 0.375rem;
		border-radius: 0;
		font-size: 0.875em;
		font-family: 'JetBrains Mono', monospace;
	}

	.prose :global(pre) {
		border: 1px solid var(--term-bg2);
		padding: 1rem;
		overflow-x: auto;
		margin: 1.5rem 0;
		font-size: 0.875rem;
	}

	.prose :global(pre code) {
		background: transparent !important;
		padding: 0;
		font-family: 'JetBrains Mono', monospace;
	}

	/* Shiki code blocks inherit theme colors */
	.prose :global(.shiki) {
		border: 1px solid var(--term-bg2);
	}

	.prose :global(blockquote) {
		border-left: 3px solid var(--term-green);
		padding-left: 1rem;
		margin: 1.5rem 0;
		color: var(--term-gray);
		font-style: italic;
	}

	.prose :global(blockquote p) {
		color: var(--term-gray);
	}

	.prose :global(ul),
	.prose :global(ol) {
		margin: 1.25rem 0;
		padding-left: 1.5rem;
		color: var(--term-fg-dim);
	}

	.prose :global(ul) {
		list-style: none;
	}

	.prose :global(ul li)::before {
		content: '- ';
		color: var(--term-green);
		font-weight: bold;
	}

	.prose :global(ol) {
		list-style: decimal;
	}

	.prose :global(ol li)::marker {
		color: var(--term-green);
	}

	.prose :global(li) {
		margin-bottom: 0.5rem;
	}

	.prose :global(hr) {
		border: none;
		border-top: 1px solid var(--term-bg2);
		margin: 2rem 0;
	}

	.prose :global(img) {
		max-width: 100%;
		border: 1px solid var(--term-bg2);
		margin: 1.5rem 0;
	}

	.prose :global(table) {
		width: 100%;
		border-collapse: collapse;
		margin: 1.5rem 0;
		font-size: 0.875rem;
	}

	.prose :global(th),
	.prose :global(td) {
		border: 1px solid var(--term-bg2);
		padding: 0.5rem 0.75rem;
		text-align: left;
	}

	.prose :global(th) {
		background: var(--term-bg1);
		color: var(--term-fg);
		font-weight: 600;
	}

	.prose :global(td) {
		color: var(--term-fg-dim);
	}
</style>
