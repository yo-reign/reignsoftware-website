<script lang="ts">
	import { onMount } from 'svelte';
	import { themeState } from '$lib/stores/theme.svelte';
	import { Globe, Smartphone, Cpu, BrainCircuit, ArrowRight } from '@lucide/svelte';

	const services = [
		{
			icon: Globe,
			title: 'Web Development',
			terminalTitle: 'web.dev',
			description:
				'Modern, performant web applications built with cutting-edge technologies. From landing pages to complex platforms.',
			tags: ['SvelteKit', 'React', 'TypeScript', 'Tailwind']
		},
		{
			icon: Smartphone,
			title: 'Mobile Apps',
			terminalTitle: 'mobile.app',
			description:
				'Native and cross-platform mobile experiences that users love. Beautiful interfaces with smooth performance.',
			tags: ['React Native', 'iOS', 'Android', 'Flutter']
		},
		{
			icon: Cpu,
			title: 'Automation',
			terminalTitle: 'auto.mate',
			description:
				'Streamline your workflows with intelligent automation. Save time, reduce errors, scale efficiently.',
			tags: ['Workflow', 'Integration', 'Scripts', 'CI/CD']
		},
		{
			icon: BrainCircuit,
			title: 'AI Integration',
			terminalTitle: 'ai.solve',
			description:
				'Harness the power of AI in your products. From document analysis to intelligent assistants.',
			tags: ['LLMs', 'Vision', 'NLP', 'ML Ops']
		}
	];

	let sectionEl: HTMLElement;
	let hasAnimated = false;

	onMount(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting && !hasAnimated) {
						hasAnimated = true;
						const cards = Array.from(sectionEl.querySelectorAll('[data-card]')) as HTMLElement[];
						cards.forEach((card, i) => {
							card.style.opacity = '0';
							card.style.transform = 'translateY(40px) scale(0.95)';
							setTimeout(() => {
								card.style.transition = 'opacity 0.5s ease-out, transform 0.5s ease-out';
								card.style.opacity = '1';
								card.style.transform = 'translateY(0) scale(1)';
							}, i * 100);
						});
					}
				});
			},
			{ threshold: 0.1 }
		);
		observer.observe(sectionEl);
		return () => observer.disconnect();
	});
</script>

<section bind:this={sectionEl} class="relative py-24">
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<!-- Section header -->
		<div class="mb-16 text-center">
			{#if themeState.current === 'gruvbox'}
				<p class="mb-2 text-sm text-muted-foreground">
					<span class="text-primary">$</span> ls ./services
				</p>
				<h2 class="text-3xl font-bold sm:text-4xl">
					<span class="text-muted-foreground">drwxr-xr-x</span> What We Build
				</h2>
			{:else}
				<p class="mb-2 text-sm text-primary">Our Expertise</p>
				<h2 class="text-3xl font-bold sm:text-4xl">What We Build</h2>
			{/if}
			<p class="mx-auto mt-4 max-w-2xl text-muted-foreground">
				We specialize in creating software that's not just functional—it's exceptional.
				Every project receives our full attention to detail.
			</p>
		</div>

		<!-- Services grid -->
		<div class="grid gap-6 md:grid-cols-2">
			{#each services as service, i}
				<div
					data-card
					class="group relative overflow-hidden rounded-xl border border-border bg-card p-6 opacity-0 transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5"
				>
					<!-- Terminal header for gruvbox -->
					{#if themeState.current === 'gruvbox'}
						<div class="mb-4 flex items-center gap-2 border-b border-border pb-3">
							<div class="flex gap-1.5">
								<div class="h-3 w-3 rounded-full bg-[var(--gruvbox-red)]"></div>
								<div class="h-3 w-3 rounded-full bg-[var(--gruvbox-yellow)]"></div>
								<div class="h-3 w-3 rounded-full bg-[var(--gruvbox-green)]"></div>
							</div>
							<span class="ml-2 text-xs text-muted-foreground">{service.terminalTitle}</span>
						</div>
					{/if}

					<!-- Icon -->
					<div
						class="mb-4 inline-flex rounded-lg bg-primary/10 p-3 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground"
					>
						<service.icon class="h-6 w-6" />
					</div>

					<!-- Content -->
					<h3 class="mb-2 text-xl font-semibold">
						{#if themeState.current === 'gruvbox'}
							<span class="text-primary">./</span>{/if}{service.title}
					</h3>
					<p class="mb-4 text-muted-foreground">
						{#if themeState.current === 'gruvbox'}
							<span class="text-[var(--gruvbox-bright-green)]"># </span>{/if}{service.description}
					</p>

					<!-- Tags -->
					<div class="flex flex-wrap gap-2">
						{#each service.tags as tag}
							<span
								class="rounded-md bg-secondary px-2 py-1 text-xs text-secondary-foreground"
							>
								{#if themeState.current === 'gruvbox'}--{/if}{tag}
							</span>
						{/each}
					</div>

					<!-- Hover arrow -->
					<div
						class="absolute bottom-6 right-6 opacity-0 transition-all group-hover:opacity-100"
					>
						<ArrowRight class="h-5 w-5 text-primary" />
					</div>
				</div>
			{/each}
		</div>
	</div>
</section>
