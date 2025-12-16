<script lang="ts">
	import { onMount } from 'svelte';
	import { Mail, FileSearch, FolderTree, Zap, ArrowRight, ChevronDown } from '@lucide/svelte';

	let importDocExpanded = $state(true);

	const features = [
		{ icon: Mail, text: 'Automated mail intake', color: 'var(--term-blue)' },
		{ icon: FileSearch, text: 'AI document analysis', color: 'var(--term-purple)' },
		{ icon: FolderTree, text: 'Smart categorization', color: 'var(--term-aqua)' },
		{ icon: Zap, text: 'Action triggers', color: 'var(--term-yellow)' }
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

<section bind:this={sectionEl} class="relative overflow-hidden pb-24">
	<div class="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<!-- TUI-style section header - clickable -->
		<div class="mb-8 border border-[var(--term-aqua)] bg-[var(--term-bg-soft)]">
			<button
				onclick={() => (importDocExpanded = !importDocExpanded)}
				class="flex w-full items-center justify-between px-3 py-2 transition-colors hover:bg-[var(--term-bg1)]"
			>
				<div class="flex items-center gap-2">
					<span class="text-[var(--term-aqua)]">FEATURED</span>
					<span class="text-[var(--term-gray)]">│</span>
					<span class="text-[var(--term-fg-dim)]">~/products/importdoc</span>
				</div>
				<div class="flex items-center gap-2">
					<span class="text-xs text-[var(--term-gray)]"
						>{importDocExpanded ? 'EXPANDED' : 'COLLAPSED'}</span
					>
					<ChevronDown
						class="h-4 w-4 text-[var(--term-gray)] transition-transform duration-200 {importDocExpanded
							? 'rotate-180'
							: ''}"
					/>
				</div>
			</button>
		</div>

		<!-- Collapsible wrapper -->
		<div
			class="grid transition-[grid-template-rows] duration-300 ease-out {importDocExpanded
				? 'grid-rows-[1fr]'
				: 'grid-rows-[0fr]'}"
		>
			<div class="overflow-hidden">
				<h2 class="mb-6 text-3xl font-bold sm:text-4xl">
					<span class="text-[var(--term-green)]">$&nbsp;</span><span class="text-[var(--term-fg)]"
						>importDoc</span
					>
				</h2>

				<div class="grid items-start gap-8 lg:grid-cols-2 lg:gap-12">
					<!-- Content -->
					<div data-content class="opacity-0">
						<!-- TUI description box -->
						<div class="mb-6 border border-border bg-[var(--term-bg-soft)] p-4">
							<div class="mb-2 text-[var(--term-gray)]">/* README.md */</div>
							<p class="text-[var(--term-fg)]">
								Mail intake automation for law firms. Transform the chaos of incoming documents into
								organized, actionable case files—automatically.
							</p>
						</div>

						<!-- Features list -->
						<div class="mb-8 border border-border bg-[var(--term-bg-soft)]">
							<div
								class="border-b border-border bg-secondary px-3 py-1 text-xs text-[var(--term-gray)]"
							>
								FEATURES
							</div>
							<div class="p-3">
								{#each features as feature, i}
									<div class="flex items-center gap-3 py-1">
										<span class="text-[var(--term-gray)]">{String(i + 1).padStart(2, '0')}</span>
										<span class="text-[var(--term-gray)]">│</span>
										<div
											class="flex h-6 w-6 items-center justify-center"
											style="color: {feature.color}"
										>
											<feature.icon class="h-4 w-4" />
										</div>
										<span style="color: {feature.color}">{feature.text}</span>
									</div>
								{/each}
							</div>
						</div>

						<!-- CTA -->
						<a
							href="/products/importdoc"
							class="group inline-flex items-center gap-2 border border-[var(--term-green)] bg-[var(--term-bg-soft)] px-4 py-2 text-[var(--term-green)] transition-colors hover:bg-[var(--term-green)] hover:text-[var(--term-bg)]"
						>
							<span>[ LEARN MORE ]</span>
							<ArrowRight class="h-4 w-4 transition-transform group-hover:translate-x-1" />
						</a>
					</div>

					<!-- Visual mockup -->
					<div data-visual class="relative opacity-0">
						<!-- TUI-style dashboard mockup -->
						<div class="border border-border bg-[var(--term-bg-soft)]">
							<!-- Window title bar -->
							<div
								class="flex items-center justify-between border-b border-border bg-secondary px-3 py-2"
							>
								<div class="flex items-center gap-2">
									<span class="text-[var(--term-red)]">■</span>
									<span class="text-[var(--term-yellow)]">■</span>
									<span class="text-[var(--term-green)]">■</span>
								</div>
								<span class="text-xs text-[var(--term-gray)]">importdoc v2.1.0</span>
								<span class="text-[var(--term-gray)]">─</span>
							</div>

							<!-- Stats row -->
							<div class="grid grid-cols-3 border-b border-border">
								{#each [{ label: 'PROCESSED', value: '1,247', color: 'var(--term-green)' }, { label: 'PENDING', value: '23', color: 'var(--term-yellow)' }, { label: 'CASES', value: '89', color: 'var(--term-blue)' }] as stat}
									<div class="border-r border-border p-4 text-center last:border-r-0">
										<div class="text-2xl font-bold" style="color: {stat.color}">{stat.value}</div>
										<div class="text-xs text-[var(--term-gray)]">{stat.label}</div>
									</div>
								{/each}
							</div>

							<!-- Recent items table -->
							<div class="p-3">
								<div class="mb-2 flex items-center gap-2 text-xs">
									<span class="text-[var(--term-green)]">$</span>
									<span class="text-[var(--term-gray)]">tail -f ./logs/recent.log</span>
								</div>
								<div class="border border-border">
									<!-- Table header -->
									<div
										class="grid grid-cols-3 border-b border-border bg-secondary text-xs text-[var(--term-gray)]"
									>
										<div class="border-r border-border px-2 py-1">FILE</div>
										<div class="border-r border-border px-2 py-1">CASE</div>
										<div class="px-2 py-1">STATUS</div>
									</div>
									<!-- Table rows -->
									{#each [{ name: 'Motion_Response.pdf', case: 'Smith v. Jones', status: 'FILED', statusColor: 'var(--term-green)' }, { name: 'Discovery_Req.docx', case: 'Estate Williams', status: 'PENDING', statusColor: 'var(--term-yellow)' }, { name: 'Settlement.pdf', case: 'Garcia Corp', status: 'REVIEW', statusColor: 'var(--term-blue)' }] as doc}
										<div class="grid grid-cols-3 border-b border-border text-sm last:border-b-0">
											<div class="border-r border-border px-2 py-2 text-[var(--term-fg)]">
												{doc.name}
											</div>
											<div class="border-r border-border px-2 py-2 text-[var(--term-fg-dim)]">
												{doc.case}
											</div>
											<div class="px-2 py-2" style="color: {doc.statusColor}">{doc.status}</div>
										</div>
									{/each}
								</div>
							</div>

							<!-- Footer -->
							<div
								class="border-t border-border bg-secondary px-3 py-1 text-xs text-[var(--term-gray)]"
							>
								<span class="text-[var(--term-green)]">●</span> Connected │ Last sync: 2m ago
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</section>
