<script lang="ts">
	import Alerts from '$lib/components/Alerts.svelte';
	import Card from '$lib/components/Card.svelte';
	import HurricaneRadar from '$lib/components/HurricaneRadar.svelte';
	import WeatherRadar from '$lib/components/WeatherRadar.svelte';
	import { getMoonphaseIconUrl, getWeatherIconUrl } from '$lib/util';
	import { Accordion, AccordionItem, ProgressRadial } from '@skeletonlabs/skeleton';
	import type { PageData } from './$types';
	import Temperature from '$lib/components/icons/Temperature.svelte';
	import Humidity from '$lib/components/icons/Humidity.svelte';
	import Wind from '$lib/components/icons/Wind.svelte';
	import Dew from '$lib/components/icons/Dew.svelte';
	import Pressure from '$lib/components/icons/Pressure.svelte';
	import UvIndex from '$lib/components/icons/UVIndex.svelte';
	import Visibility from '$lib/components/icons/Visibility.svelte';
	import MoonPhase from '$lib/components/icons/MoonPhase.svelte';
	import Cloud from '$lib/components/icons/Cloud.svelte';
	import Sunset from '$lib/components/icons/Sunset.svelte';
	import Sunrise from '$lib/components/icons/Sunrise.svelte';

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
					<section class="grid grid-cols-2 lg:flex lg:flex-row justify-between text-center">
						{#each weather?.weather.hourly.data.slice(0, 7) as time}
							<div class="flex flex-col items-center gap-1">
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
		<section>
			{#if weather?.weather.currently}
				<div class="card p-4">
					<header class="card-header text-2xl font-bold mb-4">
						Currently in {weather.location}
						<div class="flex flex-col gap-1">
							<span class="text-tertiary-500"> Feels like </span>
							<span class="text-4xl">
								{weather?.weather.currently.apparentTemperature.toFixed(0)}°F
							</span>
						</div>
					</header>
					<div class="grid grid-cols-1 gap-x-4 lg:grid-cols-2">
						<div class="flex items-center gap-1 justify-between">
							<Temperature />
							<span class="weather-item_label">High / Low</span>
							<span class="text-xl">
								{weather?.weather.daily.data[0].temperatureMax.toFixed(0)}°F /
								<span class="text-xl">
									{weather?.weather.daily.data[0].temperatureMin.toFixed(0)}°F
								</span>
							</span>
						</div>
						<div class="flex items-center gap-1 justify-between">
							<Humidity />
							<span class="weather-item_label"> Humidity </span>
							<span class="text-xl">
								{(weather?.weather.currently.humidity * 100).toPrecision(2)}%
							</span>
						</div>
						<div class="flex items-center gap-1 justify-between">
							<Wind />
							<span class="weather-item_label"> Wind Speed </span>
							<span class="text-xl">
								{weather?.weather.currently.windSpeed} m/s
							</span>
						</div>
						<div class="flex items-center gap-1 justify-between">
							<Sunrise />
							<span class="weather-item_label"> Sunrise </span>
							<span class="text-xl">
								{new Date(weather?.weather.daily.data[0].sunriseTime * 1000).toLocaleTimeString()}
							</span>
						</div>
						<div class="flex items-center gap-1 justify-between">
							<Sunset />
							<span class="weather-item_label"> Sunset </span>
							<span class="text-xl">
								{new Date(weather?.weather.daily.data[0].sunsetTime * 1000).toLocaleTimeString()}
							</span>
						</div>
						<div class="flex items-center gap-1 justify-between">
							<MoonPhase />
							<span class="weather-item_label"> Moon Phase </span>
							<img
								src={getMoonphaseIconUrl(weather?.weather.daily.data[0].moonPhase)}
								alt="moon phase"
								class="w-8 h-8"
							/>
						</div>
						<div class="flex items-center gap-1 justify-between">
							<Pressure />
							<span class="weather-item_label"> Pressure </span>
							<span class="text-xl">
								{weather?.weather.currently.pressure} hPa
							</span>
						</div>
						<div class="flex items-center gap-1 justify-between">
							<Visibility />
							<span class="weather-item_label"> Visibility </span>
							<span class="text-xl">
								{weather?.weather.currently.visibility} miles
							</span>
						</div>
						<div class="flex items-center gap-1 justify-between">
							<UvIndex />
							<span class="weather-item_label"> UV Index </span>
							<span class="text-xl">
								{weather?.weather.currently.uvIndex}
							</span>
						</div>
						<div class="flex items-center gap-1 justify-between">
							<Dew />
							<span class="weather-item_label"> Dew Point </span>
							<span class="text-xl">
								{weather?.weather.currently.dewPoint}°F
							</span>
						</div>
						<div class="flex items-center gap-1 justify-between">
							<Cloud />
							<span class="weather-item_label"> Cloud Cover </span>
							<span class="text-xl">
								{(weather?.weather.currently.cloudCover * 100).toPrecision(2)}%
							</span>
						</div>
					</div>
				</div>
			{/if}
		</section>

		<!-- Radar -->
		<section>
			{#if weather?.coords}
				<WeatherRadar coords={weather.coords} />
			{/if}
		</section>

		<!-- Hurricane Radar -->
		<section>
			{#if weather?.coords}
				<HurricaneRadar coords={weather.coords} />
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

<style lang="postcss">
	.weather-item_label {
		@apply text-tertiary-500 grow;
	}
</style>
