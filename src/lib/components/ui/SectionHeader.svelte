<script lang="ts">
	interface Props {
		mainTitle: string;
		subTitle?: string;
	}

	let { mainTitle, subTitle }: Props = $props();
</script>

<div class="pb-8 pt-24 text-center">
	<h2 class="text-3xl font-bold text-(--term-fg) sm:text-4xl">
		{mainTitle}
	</h2>
	{#if subTitle}
		<p class="mx-auto mt-4 max-w-2xl text-(--term-fg-dim)">
			{subTitle}
		</p>
	{/if}
</div>
