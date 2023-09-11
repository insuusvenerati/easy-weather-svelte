import { getCoordsByZipcode } from '$lib/util';
import { getWeather } from '$lib/util.server';
import type { PageServerLoad } from './$types';

export const load = (async (event) => {
	const { params } = event;
	const { zipcode } = params;
	const { lat, lon } = await getCoordsByZipcode(zipcode);

	return {
		streamed: { weather: getWeather({ lat, lon }) }
	};
}) satisfies PageServerLoad;
