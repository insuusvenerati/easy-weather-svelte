<script lang="ts">
	import Alerts from '$lib/components/Alerts.svelte';
	import Card from '$lib/components/Card.svelte';
	import DetailedWeather from '$lib/components/DetailedWeather.svelte';
	import { getWeatherIconUrl } from '$lib/util';
	import { Accordion, AccordionItem } from '@skeletonlabs/skeleton';
	import { fade } from 'svelte/transition';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<svelte:head>
	<title>Easy Weather {data.location ? `- ${data.location}` : ''}</title>
	<meta name="description" content="Weather, but easy." />
</svelte:head>

{#if data.error}
	<aside transition:fade|local={{ duration: 200 }} class="alert variant-ghost-error max-w-sm">
		<div class="alert-message">
			{data.error}
		</div>
	</aside>
{/if}

<section>
	<Accordion>
		{#if data.weather?.alerts}
			<AccordionItem>
				<svelte:fragment slot="lead">⚠️</svelte:fragment>
				<svelte:fragment slot="summary">
					{data.weather.alerts.length} active alert{data.weather.alerts.length > 1 ? 's' : ''}
				</svelte:fragment>
				<svelte:fragment slot="content">
					<Alerts alerts={data.weather.alerts} />
				</svelte:fragment>
			</AccordionItem>
		{/if}
	</Accordion>
</section>

<section class="flex gap-4 overflow-x-auto overflow-y-hidden">
	<Accordion regionControl="w-[350px]">
		{#if data.weather?.hourly.data}
			<div class="flex gap-4">
				{#each data.weather.hourly.data.slice(0, 7) as time}
					<AccordionItem>
						<svelte:fragment slot="lead">
							<img src={getWeatherIconUrl(time.icon)} alt={time.summary} class="w-10 h-10" />
						</svelte:fragment>
						<svelte:fragment slot="summary">
							<span class="font-bold">
								{time.temperature.toFixed(0)}°F
							</span>
							{new Date(time.time * 1000).toLocaleString()}
						</svelte:fragment>
						<svelte:fragment slot="content">
							<DetailedWeather detailedData={time} />
						</svelte:fragment>
					</AccordionItem>
				{/each}
			</div>
		{/if}
	</Accordion>
</section>

<section>
	{#if data.weather?.daily.data && data.location}
		<div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
			{#each data.weather.daily.data as day}
				<Card city={data.location} {day} />
			{/each}
		</div>
	{/if}
</section>
