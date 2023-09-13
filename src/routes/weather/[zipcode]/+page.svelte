<script lang="ts">
	import Alerts from '$lib/components/Alerts.svelte';
	import Card from '$lib/components/Card.svelte';
	import HurricaneRadar from '$lib/components/HurricaneRadar.svelte';
	import WeatherRadar from '$lib/components/WeatherRadar.svelte';
	import { getWeatherIconUrl } from '$lib/util';
	import { Accordion, AccordionItem, ProgressRadial } from '@skeletonlabs/skeleton';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

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

		<!-- Hourly -->
		<section>
			{#if weather?.weather.hourly.data}
				<div class="card p-4">
					<header class="card-header text-2xl font-bold mb-4">
						Today's forecast for {weather.location}
					</header>
					<section class="flex flex-row justify-between text-center">
						{#each weather?.weather.hourly.data.slice(0, 7) as time}
							<div class="flex flex-col gap-1">
								<span class="text-tertiary-500">
									{new Date(time.time * 1000).toLocaleTimeString()}
								</span>
								<span class="text-xl">
									{time.temperature.toFixed(0)}°F
								</span>
								<img class="w-28 h-3w-28" src={getWeatherIconUrl(time.icon)} alt={time.summary} />
								<span>
									{time.precipProbability > 0
										? `⛈️ ${Math.round(time.precipProbability * 100)}%`
										: '--'}
								</span>
							</div>
						{/each}
					</section>
				</div>
			{/if}
		</section>

		<!-- Currently -->
		<!-- Displays feels like temperature, high / low temp, humidity, wind speed, sunrise / sunset, moon phase, pressure, visibility, UV Index, dew point, and cloud cover -->
		<section>
			{#if weather?.weather.currently}
				<div class="card p-4">
					<header class="card-header text-2xl font-bold mb-4">
						Currently in {weather.location}
					</header>
					<div class="flex flex-wrap max-w-lg min-w-[500px]">
						<div class="flex flex-col gap-1 grow shrink">
							<span class="text-tertiary-500"> Feels like </span>
							<span class="text-xl">
								{weather?.weather.currently.apparentTemperature.toFixed(0)}°F
							</span>
						</div>
						<div class="flex flex-col gap-1 grow shrink">
							<span class="text-tertiary-500"> High </span>
							<span class="text-xl">
								{weather?.weather.daily.data[0].temperatureMax.toFixed(0)}°F
							</span>
						</div>
						<div class="flex flex-col gap-1 grow shrink">
							<span class="text-tertiary-500"> Low </span>
							<span class="text-xl">
								{weather?.weather.daily.data[0].temperatureMin.toFixed(0)}°F
							</span>
						</div>
						<div class="flex flex-col gap-1 grow shrink">
							<span class="text-tertiary-500"> Humidity </span>
							<span class="text-xl">
								{(weather?.weather.currently.humidity * 100).toPrecision(2)}%
							</span>
						</div>
						<div class="flex flex-col gap-1 grow shrink">
							<span class="text-tertiary-500"> Wind Speed </span>
							<span class="text-xl">
								{weather?.weather.currently.windSpeed} m/s
							</span>
						</div>
						<div class="flex flex-col gap-1 grow shrink">
							<span class="text-tertiary-500"> Sunrise </span>
							<span class="text-xl">
								{new Date(weather?.weather.daily.data[0].sunriseTime * 1000).toLocaleTimeString()}
							</span>
						</div>
						<div class="flex flex-col gap-1 grow shrink">
							<span class="text-tertiary-500"> Sunset </span>
							<span class="text-xl">
								{new Date(weather?.weather.daily.data[0].sunsetTime * 1000).toLocaleTimeString()}
							</span>
						</div>
						<div class="flex flex-col gap-1 grow shrink">
							<span class="text-tertiary-500"> Moon Phase </span>
							<span class="text-xl">
								{weather?.weather.daily.data[0].moonPhase}
							</span>
						</div>
						<div class="flex flex-col gap-1 grow shrink">
							<span class="text-tertiary-500"> Pressure </span>
							<span class="text-xl">
								{weather?.weather.currently.pressure} hPa
							</span>
						</div>
						<div class="flex flex-col gap-1 grow shrink">
							<span class="text-tertiary-500"> Visibility </span>
							<span class="text-xl">
								{weather?.weather.currently.visibility} miles
							</span>
						</div>
						<div class="flex flex-col gap-1 grow shrink">
							<span class="text-tertiary-500"> UV Index </span>
							<span class="text-xl">
								{weather?.weather.currently.uvIndex}
							</span>
						</div>
						<div class="flex flex-col gap-1 grow shrink">
							<span class="text-tertiary-500"> Dew Point </span>
							<span class="text-xl">
								{weather?.weather.currently.dewPoint}°F
							</span>
						</div>
						<div class="flex flex-col gap-1 grow shrink">
							<span class="text-tertiary-500"> Cloud Cover </span>
							<span class="text-xl">
								{(weather?.weather.currently.cloudCover * 100).toPrecision(2)}%
							</span>
						</div>
					</div>
				</div>
			{/if}
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
