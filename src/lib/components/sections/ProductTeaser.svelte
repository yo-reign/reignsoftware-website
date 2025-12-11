<script lang="ts">
	import { onMount } from 'svelte';
	import { themeState } from '$lib/stores/theme.svelte';
	import { Mail, FileSearch, FolderTree, Zap, ArrowRight, CheckCircle } from '@lucide/svelte';

	const features = [
		{ icon: Mail, text: 'Automated mail intake' },
		{ icon: FileSearch, text: 'AI document analysis' },
		{ icon: FolderTree, text: 'Smart categorization' },
		{ icon: Zap, text: 'Action triggers' }
	];

	let sectionEl: HTMLElement;
	let hasAnimated = false;

	onMount(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting && !hasAnimated) {
						hasAnimated = true;
						const content = sectionEl.querySelector('[data-content]') as HTMLElement | null;
						const visual = sectionEl.querySelector('[data-visual]') as HTMLElement | null;

						if (content) {
							content.style.opacity = '0';
							content.style.transform = 'translateX(-30px)';
							setTimeout(() => {
								content.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
								content.style.opacity = '1';
								content.style.transform = 'translateX(0)';
							}, 0);
						}
						if (visual) {
							visual.style.opacity = '0';
							visual.style.transform = 'translateX(30px)';
							setTimeout(() => {
								visual.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
								visual.style.opacity = '1';
								visual.style.transform = 'translateX(0)';
							}, 200);
						}
					}
				});
			},
			{ threshold: 0.1 }
		);
		observer.observe(sectionEl);
		return () => observer.disconnect();
	});
</script>

<section bind:this={sectionEl} class="relative overflow-hidden py-24">
	<!-- Background accent -->
	<div class="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-accent/5"></div>

	<div class="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<div class="grid items-center gap-12 lg:grid-cols-2">
			<!-- Content -->
			<div data-content class="opacity-0">
				{#if themeState.current === 'gruvbox'}
					<div class="mb-4 inline-flex items-center gap-2 rounded-md border border-border bg-card px-3 py-1">
						<span class="text-xs text-muted-foreground">~/products $</span>
						<span class="text-xs text-primary">cat importdoc/README.md</span>
					</div>
				{:else}
					<span class="mb-4 inline-block rounded-full bg-primary/10 px-3 py-1 text-sm text-primary">
						Featured Product
					</span>
				{/if}

				<h2 class="mb-4 text-3xl font-bold sm:text-4xl">
					{#if themeState.current === 'gruvbox'}
						<span class="text-muted-foreground"># </span>
					{/if}
					importDoc
				</h2>

				<p class="mb-6 text-lg text-muted-foreground">
					{#if themeState.current === 'gruvbox'}
						<span class="text-[var(--gruvbox-bright-green)]">/**</span><br />
						<span class="text-[var(--gruvbox-bright-green)]"> * </span>
					{/if}
					Mail intake automation for law firms. Transform the chaos of incoming documents
					into organized, actionable case files—automatically.
					{#if themeState.current === 'gruvbox'}
						<br /><span class="text-[var(--gruvbox-bright-green)]"> */</span>
					{/if}
				</p>

				<!-- Features list -->
				<ul class="mb-8 space-y-3">
					{#each features as feature}
						<li class="flex items-center gap-3">
							<div class="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
								<feature.icon class="h-4 w-4" />
							</div>
							<span>
								{#if themeState.current === 'gruvbox'}
									<span class="text-muted-foreground">-></span>
								{/if}
								{feature.text}
							</span>
						</li>
					{/each}
				</ul>

				<!-- CTA -->
				<a
					href="/products/importdoc"
					class="group inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-medium text-primary-foreground transition-all hover:opacity-90"
				>
					{#if themeState.current === 'gruvbox'}
						<span>./learn_more --verbose</span>
					{:else}
						<span>Learn More</span>
					{/if}
					<ArrowRight class="h-4 w-4 transition-transform group-hover:translate-x-1" />
				</a>
			</div>

			<!-- Visual mockup -->
			<div data-visual class="relative opacity-0">
				<div class="rounded-xl border border-border bg-card p-4 shadow-2xl">
					{#if themeState.current === 'gruvbox'}
						<!-- Terminal-style header -->
						<div class="mb-4 flex items-center gap-2 border-b border-border pb-3">
							<div class="flex gap-1.5">
								<div class="h-3 w-3 rounded-full bg-[var(--gruvbox-red)]"></div>
								<div class="h-3 w-3 rounded-full bg-[var(--gruvbox-yellow)]"></div>
								<div class="h-3 w-3 rounded-full bg-[var(--gruvbox-green)]"></div>
							</div>
							<span class="ml-2 text-xs text-muted-foreground">importdoc --process</span>
						</div>
					{/if}

					<!-- Mock dashboard content -->
					<div class="space-y-3">
						<!-- Stats row -->
						<div class="grid grid-cols-3 gap-3">
							{#each [{ label: 'Processed', value: '1,247' }, { label: 'Pending', value: '23' }, { label: 'Cases', value: '89' }] as stat}
								<div class="rounded-lg bg-secondary p-3 text-center">
									<div class="text-2xl font-bold text-primary">{stat.value}</div>
									<div class="text-xs text-muted-foreground">{stat.label}</div>
								</div>
							{/each}
						</div>

						<!-- Recent items -->
						<div class="rounded-lg bg-secondary p-3">
							<div class="mb-2 text-xs text-muted-foreground">
								{#if themeState.current === 'gruvbox'}
									$ tail -3 ./recent_docs.log
								{:else}
									Recent Documents
								{/if}
							</div>
							{#each [{ name: 'Motion_Response.pdf', case: 'Smith v. Jones', status: 'Filed' }, { name: 'Discovery_Request.docx', case: 'Estate of Williams', status: 'Pending' }, { name: 'Settlement_Agreement.pdf', case: 'Garcia Corp', status: 'Review' }] as doc}
								<div class="flex items-center justify-between border-b border-border py-2 last:border-0">
									<div class="flex items-center gap-2">
										<CheckCircle class="h-4 w-4 text-[var(--gruvbox-green,#98971a)]" />
										<span class="text-sm">{doc.name}</span>
									</div>
									<span class="text-xs text-muted-foreground">{doc.case}</span>
								</div>
							{/each}
						</div>
					</div>
				</div>

				<!-- Decorative elements -->
				<div class="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-primary/20 blur-2xl"></div>
				<div class="absolute -bottom-4 -left-4 h-32 w-32 rounded-full bg-accent/20 blur-2xl"></div>
			</div>
		</div>
	</div>
</section>
