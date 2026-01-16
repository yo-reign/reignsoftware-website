<script lang="ts">
	import { Github, Twitter, Linkedin, Mail } from '@lucide/svelte';

	const currentYear = new Date().getFullYear();

	const footerLinks = {
		product: [
			{ href: '/products/import-doc', label: 'importDoc' },
			{ href: '/products', label: 'All Products' },
			{ href: '/pricing', label: 'Pricing' }
		],
		company: [
			{ href: '/about', label: 'About' },
			{ href: '/services', label: 'Services' },
			{ href: '/contact', label: 'Contact' }
		],
		resources: [
			{ href: '/playground', label: 'Playground' },
			{ href: '/blog', label: 'Blog' },
			{ href: '/docs', label: 'Documentation' }
		]
	};

	const socials = [
		{ icon: Github, href: 'https://github.com/reignsoftware', label: 'GitHub' },
		{ icon: Twitter, href: 'https://twitter.com/reignsoftware', label: 'Twitter' },
		{ icon: Linkedin, href: 'https://linkedin.com/company/reignsoftware', label: 'LinkedIn' },
		{ icon: Mail, href: 'mailto:hello@reignsoftware.com', label: 'Email' }
	];
</script>

<footer class="border-t border-border/50 bg-card/80 backdrop-blur-sm">
	<div class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
		<div class="grid gap-8 md:grid-cols-2 lg:grid-cols-5">
			<!-- Brand column -->
			<div class="lg:col-span-2">
				<a href="/" class="inline-flex items-center gap-2">
					<span class="text-muted-foreground">~/</span>
					<span class="font-mono text-xl text-(--term-red)"
						>reign<span class="text-(--term-fg)">software</span></span
					>
				</a>
				<p class="mt-4 max-w-xs text-sm text-muted-foreground">
					<span class="text-(--term-green)">// </span>
					Building software that is efficient, reliable, and beautiful.
				</p>

				<!-- Social links -->
				<div class="mt-6 flex gap-4">
					{#each socials as social (social.label)}
						<a
							href={social.href}
							target="_blank"
							rel="noopener noreferrer"
							class="flex h-9 w-9 items-center justify-center border border-border/50 bg-secondary/50 text-muted-foreground transition-all hover:border-(--term-green) hover:bg-secondary hover:text-(--term-green)"
							aria-label={social.label}
						>
							<social.icon class="h-4 w-4" />
						</a>
					{/each}
				</div>
			</div>

			<!-- Links columns -->
			<div>
				<h3 class="mb-4 text-sm font-semibold">
					<span class="text-primary">./</span>products
				</h3>
				<ul class="space-y-2">
					{#each footerLinks.product as link (link.href)}
						<li>
							<a
								href={link.href}
								class="text-sm text-muted-foreground transition-colors hover:text-foreground"
							>
								{link.label}
							</a>
						</li>
					{/each}
				</ul>
			</div>

			<div>
				<h3 class="mb-4 text-sm font-semibold">
					<span class="text-primary">./</span>company
				</h3>
				<ul class="space-y-2">
					{#each footerLinks.company as link (link.href)}
						<li>
							<a
								href={link.href}
								class="text-sm text-muted-foreground transition-colors hover:text-foreground"
							>
								{link.label}
							</a>
						</li>
					{/each}
				</ul>
			</div>

			<div>
				<h3 class="mb-4 text-sm font-semibold">
					<span class="text-primary">./</span>resources
				</h3>
				<ul class="space-y-2">
					{#each footerLinks.resources as link (link.href)}
						<li>
							<a
								href={link.href}
								class="text-sm text-muted-foreground transition-colors hover:text-foreground"
							>
								{link.label}
							</a>
						</li>
					{/each}
				</ul>
			</div>
		</div>

		<!-- Bottom bar -->
		<div
			class="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border/50 pt-8 text-sm text-muted-foreground sm:flex-row"
		>
			<p>
				<span class="text-primary">$</span> echo "© {currentYear}
				<span class="text-(--term-red)">reign</span><span class="text-(--term-fg)">software</span>.
				All rights reserved."
			</p>
			<div class="flex gap-6">
				<a href="/privacy" class="hover:text-foreground">Privacy</a>
				<a href="/terms" class="hover:text-foreground">Terms</a>
			</div>
		</div>
	</div>
</footer>
