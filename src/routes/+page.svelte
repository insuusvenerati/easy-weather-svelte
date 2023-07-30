<script lang="ts">
	import Card from '$lib/components/Card.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

{#if data?.weather?.daily.data && data?.location}
	<div class="grid grid-cols-3 gap-4">
		{#each data.weather.daily.data as day}
			<Card city={data?.location} {day} />
		{/each}
	</div>
{/if}
