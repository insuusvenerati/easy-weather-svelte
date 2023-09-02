<script lang="ts">
	import Alerts from '$lib/components/Alerts.svelte';
	import Card from '$lib/components/Card.svelte';
	import DetailedWeather from '$lib/components/DetailedWeather.svelte';
	import { getWeatherIconUrl } from '$lib/util';
	import { Accordion, AccordionItem, ProgressRadial } from '@skeletonlabs/skeleton';
	import type { PageData } from './$types';
	import WeatherRadar from '$lib/components/WeatherRadar.svelte';
	import HurricaneRadar from '$lib/components/HurricaneRadar.svelte';

	export let data: PageData;
</script>

<svelte:head>
	<title>Easy Weather</title>
	<meta name="description" content="Weather, but easy." />
</svelte:head>

<div class="flex flex-col gap-4">
	{#await data.streamed?.weather}
		<ProgressRadial
			width="w-12"
			stroke={65}
			meter="stroke-primary-500"
			track="stroke-primary-500/30"
		/>
	{:then coords}
		{#if coords}
			<Accordion regionPanel="h-screen">
				<div class="flex flex-col md:flex-row gap-4">
					<AccordionItem>
						<svelte:fragment slot="summary">Weather Radar</svelte:fragment>
						<svelte:fragment slot="content">
							<WeatherRadar coords={coords.coords} />
						</svelte:fragment>
					</AccordionItem>
					<AccordionItem>
						<svelte:fragment slot="summary">Hurricane Radar</svelte:fragment>
						<svelte:fragment slot="content">
							<HurricaneRadar coords={coords.coords} />
						</svelte:fragment>
					</AccordionItem>
				</div>
			</Accordion>
		{/if}
	{/await}
	{#await data.streamed?.weather}
		<ProgressRadial
			width="w-12"
			stroke={65}
			meter="stroke-primary-500"
			track="stroke-primary-500/30"
		/>
	{:then weather}
		<section>
			<Accordion>
				{#if weather?.weather?.alerts}
					<AccordionItem>
						<svelte:fragment slot="lead">⚠️</svelte:fragment>
						<svelte:fragment slot="summary">
							{weather?.weather.alerts.length} active alert{weather?.weather.alerts.length > 1
								? 's'
								: ''}
						</svelte:fragment>
						<svelte:fragment slot="content">
							<Alerts alerts={weather?.weather.alerts} />
						</svelte:fragment>
					</AccordionItem>
				{/if}
			</Accordion>
		</section>

		<section class="flex gap-4 overflow-x-auto overflow-y-hidden">
			<Accordion>
				{#if weather?.weather.hourly.data}
					<div class="flex gap-4">
						{#each weather?.weather.hourly.data.slice(0, 7) as time}
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
			{#if weather?.weather?.daily.data && weather.location}
				<div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
					{#each weather?.weather.daily.data as day}
						<Card city={weather.location} {day} />
					{/each}
				</div>
			{/if}
		</section>
	{:catch error}
		{error.message}
	{/await}
</div>
