<script lang="ts">
	import { page } from '$app/stores';
	import { ArrowLeft } from '@lucide/svelte';
</script>

<section class="flex min-h-screen items-center justify-center px-4">
	<div class="max-w-lg text-center">
		<!-- Error code display -->
		<div class="mb-6 font-mono">
			<span class="text-(--term-red)">error</span><span class="text-(--term-gray)">[</span><span
				class="text-6xl font-bold text-(--term-fg)">{$page.status}</span
			><span class="text-(--term-gray)">]</span>
		</div>

		<!-- Terminal-style error message -->
		<div class="mb-8 border border-border/50 bg-card/80 backdrop-blur-sm">
			<div class="flex items-center gap-2 border-b border-border/50 bg-secondary/50 px-3 py-2">
				<span class="text-(--term-red)">!</span>
				<span class="text-sm text-(--term-gray)">stderr</span>
			</div>
			<div class="p-4 text-left font-mono text-sm">
				<div class="mb-2">
					<span class="text-(--term-gray)">$</span>
					<span class="text-(--term-fg)"> cd {$page.url.pathname}</span>
				</div>
				<div class="text-(--term-red)">
					{#if $page.status === 404}
						bash: cd: {$page.url.pathname}: No such file or directory
					{:else}
						{$page.error?.message || 'An unexpected error occurred'}
					{/if}
				</div>
			</div>
		</div>

		<!-- Back button -->
		<a
			href="/"
			class="group inline-flex items-center border-2 border-(--term-green) px-4 py-2 font-mono text-(--term-green) transition-all hover:bg-(--term-green) hover:text-(--term-bg)"
		>
			<ArrowLeft class="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
			<span>[ cd ~ ]</span>
		</a>
	</div>
</section>
