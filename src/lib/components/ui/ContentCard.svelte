<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		children: Snippet;
	}

	let { children }: Props = $props();
</script>

<div class="mx-auto max-w-3xl border border-border/50 bg-card/80 backdrop-blur-sm">
	<div class="p-6 sm:p-8">
		<div class="prose">
			{@render children()}
		</div>
	</div>
</div>

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

	.prose :global(h1) {
		font-size: 1.875rem;
	}

	.prose :global(h2) {
		font-size: 1.5rem;
	}

	.prose :global(h3) {
		font-size: 1.25rem;
	}

	.prose :global(h2:not(:first-child)) {
		margin-top: 2.5rem;
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

	.prose :global(ul),
	.prose :global(ol) {
		margin: 1rem 0;
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
</style>
