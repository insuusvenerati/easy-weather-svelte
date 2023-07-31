import { env } from '$env/dynamic/private';
import type { Root } from '$lib/types/geographies';
import type { LocationData } from '$lib/types/location';
import type { WeatherResponse } from '$lib/types/weather';
import type { PageServerLoad } from './$types';

export const load = (async ({ url, fetch }) => {
	const zipcode = url.searchParams.get('zipcode');
	const lat = url.searchParams.get('lat');
	const lon = url.searchParams.get('lon');

	if (lat && lon) {
		const [weather, location] = await Promise.all<[Promise<WeatherResponse>, Promise<Root>]>([
			fetch(`${env.API_URL}/forecast/${env.API_KEY}/${lat},${lon}?exclude=minutely,currently`).then(
				(res) => res.json()
			),
			fetch(`${env.GEO_URL}&x=${lon}&y=${lat}`).then((res) => res.json())
		]);

		return {
			weather: weather,
			location: location.result.geographies['County Subdivisions'][0].BASENAME
		};
	}

	if (!zipcode) {
		return {};
	}

	const locationResponse = await fetch(`https://api.zippopotam.us/us/${zipcode}?units=us`);

	if (!locationResponse.ok) {
		return {};
	}

	const locationData: LocationData = await locationResponse.json();

	if (locationData.places.length) {
		const response = await fetch(
			`${env.API_URL}/forecast/${env.API_KEY}/${locationData.places[0].latitude},${locationData.places[0].longitude}?exclude=minutely,currently`
		);
		if (!response.ok) {
			return {};
		}
		const weatherData: WeatherResponse = await response.json();
		return {
			weather: weatherData,
			location: locationData.places[0]['place name']
		};
	}
}) satisfies PageServerLoad;
