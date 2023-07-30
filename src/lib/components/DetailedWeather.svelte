<script lang="ts">
	import type { Currently } from '$lib/types/weather';
	import { getPrecipIntensity, getWeatherIconUrl } from '$lib/util';

	export let detailedData: Currently;
</script>

<article>
	<section class="bg-surface-900 p-4">
		<p>Rain: {getPrecipIntensity(detailedData.precipIntensity)}</p>
		<p>Rain Chance: {Math.round(detailedData.precipProbability * 100)}%</p>
		<p>Temp: {detailedData.temperature} °F</p>
		<p>Apparent Temp: {detailedData.apparentTemperature} °F</p>
		<p>Dew Point: {detailedData.dewPoint} °F</p>
		<p>Humidity: {Math.round(detailedData.humidity * 100)} %</p>
		<p>Pressure: {detailedData.pressure} hPa</p>
		<p>Wind Speed: {detailedData.windSpeed} mph</p>
		<p>Wind Gust: {detailedData.windGust} mph</p>
		<p>Wind Bearing: {detailedData.windBearing} °</p>
		<p>Cloud Cover: {Math.round(detailedData.cloudCover * 100)} %</p>
		<p>UV Index: {detailedData.uvIndex}</p>
		<p>Visibility: {detailedData.visibility} miles</p>
	</section>
</article>
