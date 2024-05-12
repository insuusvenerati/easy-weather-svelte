<script lang="ts">
	import Search from '$lib/components/Search.svelte';
	import ThemeSwitch from '$lib/components/ThemeSwitch.svelte';
	import { arrow, autoUpdate, computePosition, flip, offset, shift } from '@floating-ui/dom';
	import {
		AppBar,
		AppShell,
		Drawer,
		getDrawerStore,
		initializeStores,
		storePopup
	} from '@skeletonlabs/skeleton';
	import Geolocation from 'svelte-geolocation';
	import type { GeolocationCoords } from 'svelte-geolocation/types/Geolocation.svelte';
	import '../app.css';
	import Navigation from '$lib/components/Navigation.svelte';
	initializeStores();

	const drawerStore = getDrawerStore();
	function drawerOpen(): void {
		drawerStore.open({});
	}

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

<Drawer>
	<Navigation />
</Drawer>
<AppShell
	slotSidebarLeft="bg-surface-500/5 w-0 lg:w-64"
	slotPageFooter="p-4"
	slotPageContent="p-4"
	slotPageHeader="p-4"
>
	<!-- <svelte:fragment slot="sidebarLeft">
		<Navigation />
	</svelte:fragment> -->
	<svelte:fragment slot="header">
		<AppBar>
			<svelte:fragment slot="lead">
				<div class="flex items-center">
					<button on:click={drawerOpen} class="lg:hidden btn btn-sm mr-4">
						<span>
							<svg viewBox="0 0 100 80" class="fill-token w-4 h-4">
								<rect width="100" height="20" />
								<rect y="30" width="100" height="20" />
								<rect y="60" width="100" height="20" />
							</svg>
						</span>
					</button>
					<a href="/">
						<strong class="text-xl uppercase"> Easy Weather ⛅ </strong>
					</a>
				</div>
			</svelte:fragment>
			<svelte:fragment slot="trail"><ThemeSwitch /></svelte:fragment>
		</AppBar>
	</svelte:fragment>
	<svelte:fragment slot="pageHeader">
		<div class="flex flex-col lg:flex-row gap-4">
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
	<svelte:fragment slot="pageFooter">
		<a target="_blank" rel="noopener noreferrer" href="https://openstreetmap.org/copyright">
			OpenStreetMap
		</a>
	</svelte:fragment>
</AppShell>
