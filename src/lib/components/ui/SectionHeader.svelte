<script lang="ts">
	interface Props {
		sectionName: string;
		mainTitle: string;
		subTitle?: string;
	}

	let { sectionName, mainTitle, subTitle }: Props = $props();
</script>

<div class="pt-24 mb-8 text-center">
	<div class="mb-4 inline-block border border-border bg-card px-4 py-2">
		<span class="text-(--term-green)">$</span>
		<span class="text-(--term-gray)"> ls -la ./{sectionName}</span>
	</div>
	<h2 class="text-3xl font-bold sm:text-4xl">
		<span class="text-(--term-fg)">## {mainTitle}</span>
	</h2>
	{#if subTitle}
		<p class="mx-auto mt-4 max-w-2xl text-muted-foreground">
			<span class="text-(--term-gray)">- </span>
			{subTitle}
		</p>
	{/if}
</div>
