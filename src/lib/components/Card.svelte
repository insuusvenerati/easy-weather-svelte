<script lang="ts">
	import type { DailyDatum } from '$lib/types/weather';
	import { getMoonphaseIconUrl, getWeatherIconUrl } from '$lib/util';

	const formatTime = (time: number) => {
		const date = new Date(time * 1000);
		const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' });
		const hours = date.getHours();
		const minutes = date.getMinutes();
		return { time: `${hours}:${minutes < 10 ? '0' + minutes : minutes}`, dayOfWeek };
	};

	export let day: DailyDatum;
	export let city: string;
	const {
		icon,
		summary,
		temperatureMax,
		temperatureMin,
		humidity,
		windSpeed,
		sunriseTime,
		sunsetTime,
		moonPhase,
		precipProbability
	} = day;
</script>

<div class="card card-hover variant-glass-surface p-4">
	<header class="card-header">
		<h2 class="text-2xl font-bold">{formatTime(day.time).dayOfWeek}</h2>
		<h3 class="text-xl font-medium">{city}</h3>
		<img src={getWeatherIconUrl(icon)} alt={summary} class="w-36 h-36" />
	</header>
	<section class="flex items-center gap-10">
		<div class="flex flex-col">
			<span class="text-gray-300">High</span>
			<span class="text-3xl font-bold">{temperatureMax}&deg;F</span>
		</div>
		<div class="flex flex-col">
			<span class="text-gray-300">Low</span>
			<span class="text-3xl">{temperatureMin}&deg;F</span>
		</div>
	</section>
	<footer class="card-footer flex items-center text-center justify-between mt-4">
		<div class="flex flex-col">
			<span class="text-gray-300">Humidity</span>
			<span class="text-lg font-medium">{(humidity * 100).toPrecision(2)}%</span>
		</div>
		<div class="flex flex-col">
			<span class="text-gray-300">Wind Speed</span>
			<span class="text-lg font-medium">{windSpeed} m/s</span>
		</div>
		<div class="flex flex-col">
			<span class="text-gray-300">Sunrise</span>
			<span class="text-lg font-medium">{formatTime(sunriseTime).time}</span>
		</div>
		<div class="flex flex-col">
			<span class="text-gray-300">Sunset</span>
			<span class="text-lg font-medium">{formatTime(sunsetTime).time}</span>
		</div>
		<div class="flex flex-col">
			<span>Rain</span>
			{precipProbability > 0 ? `⛈️ ${Math.round(precipProbability * 100)}%` : '--'}
		</div>
		<div class="flex flex-col">
			<span>Moon</span>
			<img class="w-10 h-10" src={getMoonphaseIconUrl(moonPhase)} alt={moonPhase.toString()} />
		</div>
	</footer>
</div>
