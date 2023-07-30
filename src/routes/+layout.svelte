<script lang="ts">
	import '@skeletonlabs/skeleton/themes/theme-hamlindigo.css';
	import '@skeletonlabs/skeleton/styles/skeleton.css';
	import '../app.postcss';
	import { AppShell } from '@skeletonlabs/skeleton';
	import Search from '$lib/components/Search.svelte';
</script>

<AppShell slotPageContent="p-4" slotPageHeader="p-4">
	<svelte:fragment slot="pageHeader">
		<div class="flex gap-4 flex-col">
			<h1 class="text-6xl font-bold">
				<a href="/"> Easy Weather ⛅ </a>
			</h1>
			<Search />
		</div>
	</svelte:fragment>
	<slot />
	<svelte:fragment slot="pageFooter">Page Footer</svelte:fragment>
</AppShell>
