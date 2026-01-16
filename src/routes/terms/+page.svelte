<script lang="ts">
	import SectionHeader from '$lib/components/ui/SectionHeader.svelte';
	import ContentCard from '$lib/components/ui/ContentCard.svelte';
</script>

<section class="min-h-screen">
	<SectionHeader mainTitle="Terms of Service" subTitle="Last updated: January 2026" />

	<div class="px-4 pb-24 sm:px-6 lg:px-8">
		<ContentCard>
			<h2>Agreement to Terms</h2>
			<p>
				By accessing or using the ReignSoftware website and services, you agree to be bound by these
				Terms of Service. If you do not agree to these terms, please do not use our services.
			</p>

			<h2>Use of Services</h2>
			<p>
				You agree to use our services only for lawful purposes and in accordance with these terms.
				You agree not to:
			</p>
			<ul>
				<li>Use our services in any way that violates applicable laws or regulations</li>
				<li>Attempt to gain unauthorized access to our systems or networks</li>
				<li>Interfere with or disrupt the integrity of our services</li>
				<li>Transmit any malicious code or harmful content</li>
			</ul>

			<h2>Intellectual Property</h2>
			<p>
				All content, features, and functionality on our website are owned by ReignSoftware and are
				protected by copyright, trademark, and other intellectual property laws. You may not
				reproduce, distribute, or create derivative works without our express written permission.
			</p>

			<h2>Disclaimer of Warranties</h2>
			<p>
				Our services are provided "as is" without warranties of any kind, either express or implied.
				We do not warrant that our services will be uninterrupted, error-free, or free of harmful
				components.
			</p>

			<h2>Limitation of Liability</h2>
			<p>
				To the fullest extent permitted by law, ReignSoftware shall not be liable for any indirect,
				incidental, special, consequential, or punitive damages arising from your use of our
				services.
			</p>

			<h2>Changes to Terms</h2>
			<p>
				We reserve the right to modify these terms at any time. We will notify users of any material
				changes by updating the "Last updated" date. Continued use of our services after changes
				constitutes acceptance of the modified terms.
			</p>

			<h2>Governing Law</h2>
			<p>
				These terms shall be governed by and construed in accordance with applicable laws, without
				regard to conflict of law principles.
			</p>

			<h2>Contact Us</h2>
			<p>
				If you have questions about these terms, please contact us at
				<a href="mailto:legal@reignsoftware.com">legal@reignsoftware.com</a>.
			</p>
		</ContentCard>
	</div>
</section>
