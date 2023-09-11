<script lang="ts">
	import Search from '$lib/components/Search.svelte';
	import ThemeSwitch from '$lib/components/ThemeSwitch.svelte';
	import { arrow, autoUpdate, computePosition, flip, offset, shift } from '@floating-ui/dom';
	import { AppShell, storePopup } from '@skeletonlabs/skeleton';
	import Geolocation from 'svelte-geolocation';
	import type { GeolocationCoords } from 'svelte-geolocation/types/Geolocation.svelte';
	import '../app.css';

	storePopup.set({ computePosition, autoUpdate, offset, shift, flip, arrow });

	let coords: GeolocationCoords;
	let success: boolean;
	let notSupported: boolean;
</script>

<svelte:head>
	<title>Easy Weather</title>
	<meta name="description" content="Weather, but easy." />
</svelte:head>

<Geolocation getPosition bind:notSupported bind:success bind:coords />
<AppShell slotPageContent="p-4" slotPageHeader="p-4">
	<svelte:fragment slot="header">
		<div class="flex justify-between items-center">
			<h1 class="text-4xl font-bold p-4">
				<a href="/">Easy Weather ⛅</a>
			</h1>

			<div class="flex items-center">
				<h1 class="font-bold p-4">
					<a href="/trucking">Trucking</a>
				</h1>
				<ThemeSwitch />
			</div>
		</div>
	</svelte:fragment>
	<svelte:fragment slot="pageHeader">
		<div class="flex gap-4 flex-col">
			<Search />
			{#if success && !notSupported}
				<a
					href={`/weather?lat=${coords[1]}&lon=${coords[0]}`}
					class="btn variant-soft-primary max-w-xs font-bold">🌍 Use Location</a
				>
			{/if}
		</div>
	</svelte:fragment>
	<slot />
</AppShell>
