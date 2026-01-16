<script lang="ts">
	import { Calendar, Tag, ChevronRight, FileText } from '@lucide/svelte';
	import type { BlogPost } from '$lib/types/blog';

	interface Props {
		data: { posts: BlogPost[] };
	}

	let { data }: Props = $props();

	function formatDate(dateStr: string): string {
		return new Date(dateStr).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric'
		});
	}
</script>

<section class="min-h-screen">
	<!-- Header -->
	<div class="pb-8 pt-24 text-center">
		<div class="mb-4 inline-block border border-border bg-card px-4 py-2">
			<span class="text-(--term-green)">$</span>
			<span class="text-(--term-gray)"> ls -la ./blog</span>
		</div>
		<h1 class="text-3xl font-bold sm:text-4xl">
			<span class="text-(--term-fg)">## Blog</span>
		</h1>
		<p class="mx-auto mt-4 max-w-2xl text-muted-foreground">
			<span class="text-(--term-gray)">// </span>
			Thoughts on software, technology, and building things.
		</p>
	</div>

	<!-- Posts list -->
	<div class="mx-auto max-w-4xl px-4 pb-24 sm:px-6 lg:px-8">
		{#if data.posts.length === 0}
			<div class="border border-border/50 bg-card/80 p-8 text-center backdrop-blur-sm">
				<FileText class="mx-auto mb-4 h-12 w-12 text-(--term-gray)" />
				<p class="text-(--term-gray)">No posts yet. Check back soon!</p>
			</div>
		{:else}
			<div class="space-y-4">
				{#each data.posts as post (post.slug)}
					<a
						href="/blog/{post.slug}"
						class="group block border border-border/50 bg-card/80 backdrop-blur-sm transition-all hover:border-(--term-green) hover:bg-card"
					>
						<!-- Terminal-style header -->
						<div
							class="flex items-center gap-2 border-b border-border/50 bg-secondary/50 px-4 py-2"
						>
							<span class="text-(--term-green)">$</span>
							<span class="text-sm text-(--term-gray)">cat ./blog/{post.slug}.md</span>
							<ChevronRight
								class="ml-auto h-4 w-4 text-(--term-gray) transition-transform group-hover:translate-x-1 group-hover:text-(--term-green)"
							/>
						</div>

						<!-- Post content -->
						<div class="p-4">
							<h2
								class="mb-2 text-xl font-semibold text-(--term-fg) transition-colors group-hover:text-(--term-green)"
							>
								{post.meta.title}
							</h2>
							<p class="mb-4 text-sm text-muted-foreground">
								{post.meta.description}
							</p>

							<!-- Meta info -->
							<div class="flex flex-wrap items-center gap-4 text-xs text-(--term-gray)">
								<span class="flex items-center gap-1">
									<Calendar class="h-3 w-3" />
									{formatDate(post.meta.date)}
								</span>
								{#if post.meta.tags && post.meta.tags.length > 0}
									<span class="flex items-center gap-1">
										<Tag class="h-3 w-3" />
										{post.meta.tags.join(', ')}
									</span>
								{/if}
							</div>
						</div>
					</a>
				{/each}
			</div>
		{/if}
	</div>
</section>
