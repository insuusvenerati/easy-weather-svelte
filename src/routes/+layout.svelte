<script lang="ts">
	import Search from '$lib/components/Search.svelte';
	import { AppShell } from '@skeletonlabs/skeleton';
	import '@skeletonlabs/skeleton/styles/skeleton.css';
	import '@skeletonlabs/skeleton/themes/theme-skeleton.css';
	import Geolocation from 'svelte-geolocation';
	import type { GeolocationCoords } from 'svelte-geolocation/types/Geolocation.svelte';
	import '../app.postcss';

	let coords: GeolocationCoords;
	let success: boolean;
</script>

<Geolocation getPosition bind:success bind:coords />
<AppShell slotPageContent="p-4" slotPageHeader="p-4">
	<svelte:fragment slot="pageHeader">
		<div class="flex gap-4 flex-col">
			<h1 class="text-6xl font-bold">
				<a href="/"> Easy Weather ⛅ </a>
			</h1>
			<Search />
			{#if success}
				<a
					href={`/?lat=${coords[1]}&lon=${coords[0]}`}
					class="btn variant-soft-primary max-w-xs font-bold">🌍 Use Location</a
				>
			{/if}
		</div>
	</svelte:fragment>
	<slot />
</AppShell>
