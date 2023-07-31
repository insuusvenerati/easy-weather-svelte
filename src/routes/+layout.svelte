<script lang="ts">
	import Search from '$lib/components/Search.svelte';
	import { AppShell } from '@skeletonlabs/skeleton';
	import Geolocation from 'svelte-geolocation';
	import type { GeolocationCoords } from 'svelte-geolocation/types/Geolocation.svelte';
	import '@skeletonlabs/skeleton/styles/skeleton.css';
	import '@skeletonlabs/skeleton/themes/theme-skeleton.css';
	import '../app.postcss';

	let coords: GeolocationCoords;

	function useCoordsRedirect() {
		if (coords) {
			const [longitude, latitude] = coords;
			window.location.href = `/?lat=${latitude}&lon=${longitude}`;
		}
	}
</script>

<Geolocation getPosition bind:coords />
<AppShell slotPageContent="p-4" slotPageHeader="p-4">
	<svelte:fragment slot="pageHeader">
		<div class="flex gap-4 flex-col">
			<h1 class="text-6xl font-bold">
				<a href="/"> Easy Weather ⛅ </a>
			</h1>
			<Search />
			{#if coords}
				<button
					on:click={useCoordsRedirect}
					class="btn variant-soft-primary max-w-xs font-bold"
					type="button">🌍 Use Location</button
				>
			{/if}
		</div>
	</svelte:fragment>
	<slot />
</AppShell>
