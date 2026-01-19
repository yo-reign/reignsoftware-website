<script lang="ts">
	import SectionHeader from '$lib/components/ui/SectionHeader.svelte';
	import ContentCard from '$lib/components/ui/ContentCard.svelte';
	import { Mail } from '@lucide/svelte';
</script>

<section class="min-h-screen">
	<SectionHeader mainTitle="Contact" subTitle="We'd love to hear from you" />

	<div class="px-4 pb-24 sm:px-6 lg:px-8">
		<ContentCard>
			<div class="text-center">
				<Mail class="mx-auto mb-4 h-12 w-12 text-(--term-blue)" />
				<h2 class="mb-4">Get in Touch</h2>
				<p>For any inquiries, please reach out to us at:</p>
				<p class="mt-4">
					<a href="mailto:contact@reignsoftware.com" class="text-lg font-medium">
						contact@reignsoftware.com
					</a>
				</p>
				<p class="mt-6 text-sm text-(--term-gray)">We'll get back to you as soon as possible.</p>
			</div>
		</ContentCard>
	</div>
</section>
