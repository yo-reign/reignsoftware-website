<script lang="ts">
	import { onMount } from 'svelte';
	import { Globe, Smartphone, Cpu, BrainCircuit } from '@lucide/svelte';

	const services = [
		{
			icon: Globe,
			title: 'Web Development',
			terminalTitle: 'web.dev',
			description:
				'Modern, performant web applications built with cutting-edge technologies. From landing pages to complex platforms.',
			tags: ['SvelteKit', 'React', 'TypeScript', 'Tailwind'],
			color: 'var(--term-blue)'
		},
		{
			icon: Smartphone,
			title: 'Mobile Apps',
			terminalTitle: 'mobile.app',
			description:
				'Native and cross-platform mobile experiences that users love. Beautiful interfaces with smooth performance.',
			tags: ['React Native', 'iOS', 'Android', 'Flutter'],
			color: 'var(--term-purple)'
		},
		{
			icon: Cpu,
			title: 'Automation',
			terminalTitle: 'auto.mate',
			description:
				'Streamline your workflows with intelligent automation. Save time, reduce errors, scale efficiently.',
			tags: ['Workflow', 'Integration', 'Scripts', 'CI/CD'],
			color: 'var(--term-aqua)'
		},
		{
			icon: BrainCircuit,
			title: 'AI Integration',
			terminalTitle: 'ai.solve',
			description:
				'Harness the power of AI in your products. From document analysis to intelligent assistants.',
			tags: ['LLMs', 'Vision', 'NLP', 'ML Ops'],
			color: 'var(--term-yellow)'
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
							card.style.transform = 'translateY(40px)';
							setTimeout(() => {
								card.style.transition = 'opacity 0.5s ease-out, transform 0.5s ease-out';
								card.style.opacity = '1';
								card.style.transform = 'translateY(0)';
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
			<div class="mb-4 inline-block border border-border bg-card px-4 py-2">
				<span class="text-[var(--term-green)]">$</span>
				<span class="text-[var(--term-gray)]"> ls -la ./services/</span>
			</div>
			<h2 class="text-3xl font-bold sm:text-4xl">
				<span class="text-[var(--term-gray)]">total 4</span>
			</h2>
			<p class="mx-auto mt-4 max-w-2xl text-muted-foreground">
				<span class="text-[var(--term-gray)]"># </span>
				We specialize in creating software that's not just functional—it's exceptional.
			</p>
		</div>

		<!-- Services grid -->
		<div class="grid gap-6 md:grid-cols-2">
			{#each services as service, i}
				<!-- TUI-style card -->
				<div
					data-card
					class="group border border-border bg-[var(--term-bg-soft)] opacity-0 transition-colors hover:border-[var(--term-gray)]"
				>
					<!-- TUI header -->
					<div class="flex items-center justify-between border-b border-border bg-secondary px-3 py-2">
						<div class="flex items-center gap-2">
							<span style="color: {service.color}">■</span>
							<span class="text-[var(--term-gray)]">{service.terminalTitle}</span>
						</div>
						<span class="text-xs text-[var(--term-gray)]">[{String(i + 1).padStart(2, '0')}]</span>
					</div>

					<!-- Content -->
					<div class="p-4">
						<!-- Icon and title -->
						<div class="mb-3 flex items-center gap-3">
							<div class="flex h-8 w-8 items-center justify-center border border-border" style="color: {service.color}">
								<service.icon class="h-5 w-5" />
							</div>
							<h3 class="text-lg font-semibold" style="color: {service.color}">
								./{service.title.toLowerCase().replace(' ', '_')}/
							</h3>
						</div>

						<!-- Description -->
						<p class="mb-4 text-[var(--term-fg-dim)]">
							{service.description}
						</p>

						<!-- Tags as TUI list -->
						<div class="flex flex-wrap gap-2">
							{#each service.tags as tag}
								<span class="border border-border bg-secondary px-2 py-0.5 text-xs text-[var(--term-gray)]">
									--{tag.toLowerCase()}
								</span>
							{/each}
						</div>
					</div>

					<!-- Footer -->
					<div class="border-t border-border bg-secondary px-3 py-1 text-xs text-[var(--term-gray)] opacity-0 transition-opacity group-hover:opacity-100">
						<span style="color: {service.color}">→</span> Press ENTER to explore
					</div>
				</div>
			{/each}
		</div>
	</div>
</section>
