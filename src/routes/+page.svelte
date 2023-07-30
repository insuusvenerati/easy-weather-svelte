<script lang="ts">
	import { ProgressRadial } from '@skeletonlabs/skeleton';
	import type { PageData } from './$types';
	import Card from '$lib/components/Card.svelte';

	export let data: PageData;
</script>

{#await data.streamed?.weather}
	<div class="container mx-auto">
		<ProgressRadial width="w-24" />
	</div>
{:then weather}
	{#if weather?.daily.data && data.streamed?.location}
		<div class="grid grid-cols-3 gap-4">
			{#each weather.daily.data as day}
				<Card city={data.streamed?.location} {day} />
			{/each}
		</div>
	{/if}
{/await}
