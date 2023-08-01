import { env } from '$env/dynamic/private';
import type { Root } from '$lib/types/geographies';
import type { LocationData } from '$lib/types/location';
import type { WeatherResponse } from '$lib/types/weather';
import { isValidUSZip } from '$lib/util';
import type { PageServerLoad } from './$types';

export const load = (async ({ url, fetch }) => {
	const zipcode = url.searchParams.get('zipcode');
	const lat = url.searchParams.get('lat');
	const lon = url.searchParams.get('lon');
	const broadcast = new BroadcastChannel('weather-data-channel');

	if (lat && lon) {
		const [weather, location] = await Promise.all<[Promise<WeatherResponse>, Promise<Root>]>([
			fetch(`${env.API_URL}/forecast/${env.API_KEY}/${lat},${lon}?exclude=minutely,currently`)
				.then((res) => res.json())
				.catch((err) => err),
			fetch(`${env.GEO_URL}&x=${lon}&y=${lat}`)
				.then((res) => res.json())
				.catch((err) => err)
		]);

		return {
			weather: weather,
			location: location.result.geographies['County Subdivisions'][0].BASENAME
		};
	}

	if (!zipcode) {
		return;
	}

	if (!isValidUSZip(zipcode)) {
		return { error: '⚠️ Enter a valid US zipcode' };
	}

	broadcast.postMessage({ zipcode });

	const locationResponse = await fetch(`https://api.zippopotam.us/us/${zipcode}?units=us`);
	const locationData: LocationData = await locationResponse.json();

	const response = await fetch(
		`${env.API_URL}/forecast/${env.API_KEY}/${locationData.places[0].latitude},${locationData.places[0].longitude}?exclude=minutely,currently`
	);
	const weatherData: WeatherResponse = await response.json();
	return {
		weather: weatherData,
		location: locationData.places[0]['place name']
	};
}) satisfies PageServerLoad;
