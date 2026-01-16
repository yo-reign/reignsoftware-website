<script lang="ts">
	import SectionHeader from '$lib/components/ui/SectionHeader.svelte';
	import ContentCard from '$lib/components/ui/ContentCard.svelte';
</script>

<section class="min-h-screen">
	<SectionHeader mainTitle="Privacy Policy" subTitle="Last updated: January 2026" />

	<div class="px-4 pb-24 sm:px-6 lg:px-8">
		<ContentCard>
			<h2>Introduction</h2>
			<p>
				ReignSoftware ("we", "our", or "us") respects your privacy and is committed to protecting
				your personal data. This privacy policy explains how we collect, use, and safeguard your
				information when you visit our website or use our services.
			</p>

			<h2>Information We Collect</h2>
			<p>We may collect the following types of information:</p>
			<ul>
				<li>Contact information (name, email address) when you reach out to us</li>
				<li>Usage data (pages visited, time spent, browser type) through analytics</li>
				<li>Any information you voluntarily provide through forms or communications</li>
			</ul>

			<h2>How We Use Your Information</h2>
			<p>We use the information we collect to:</p>
			<ul>
				<li>Respond to your inquiries and provide customer support</li>
				<li>Improve our website and services</li>
				<li>Send relevant communications (with your consent)</li>
				<li>Comply with legal obligations</li>
			</ul>

			<h2>Data Security</h2>
			<p>
				We implement appropriate technical and organizational measures to protect your personal data
				against unauthorized access, alteration, disclosure, or destruction.
			</p>

			<h2>Third-Party Services</h2>
			<p>
				We may use third-party services for analytics and hosting. These services have their own
				privacy policies governing the use of your information.
			</p>

			<h2>Your Rights</h2>
			<p>You have the right to:</p>
			<ul>
				<li>Access the personal data we hold about you</li>
				<li>Request correction of inaccurate data</li>
				<li>Request deletion of your data</li>
				<li>Opt out of marketing communications</li>
			</ul>

			<h2>Contact Us</h2>
			<p>
				If you have questions about this privacy policy, please contact us at
				<a href="mailto:privacy@reignsoftware.com">privacy@reignsoftware.com</a>.
			</p>
		</ContentCard>
	</div>
</section>
