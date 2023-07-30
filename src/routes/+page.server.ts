import { env } from '$env/dynamic/private';
import type { LocationData } from '$lib/types/location';
import type { WeatherResponse } from '$lib/types/weather';
import type { PageServerLoad } from './$types';

export const load = (async ({ url, fetch }) => {
	const zipcode = url.searchParams.get('zipcode');

	if (!zipcode) {
		return {};
	}

	const locationResponse = await fetch(`https://api.zippopotam.us/us/${zipcode}?units=us`);

	if(!locationResponse.ok) {
		return {};
	}

	const locationData: LocationData = await locationResponse.json();

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
}) satisfies PageServerLoad;
// lat: 40.7128, lng: -74.0060
