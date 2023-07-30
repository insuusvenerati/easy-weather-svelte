<script lang="ts">
	import Search from '$lib/components/Search.svelte';
	import { AppShell } from '@skeletonlabs/skeleton';
	import '@skeletonlabs/skeleton/styles/skeleton.css';
	import '@skeletonlabs/skeleton/themes/theme-skeleton.css';
	import '../app.postcss';
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
</AppShell>
