import { getCoordsByZipcode } from '$lib/util';
import { getWeather } from '$lib/util.server';
import invariant from 'tiny-invariant';
import type { PageServerLoad } from './$types';

export const load = (async (event) => {
	const { params } = event;
	const { zipcode } = params;
	const coords = await getCoordsByZipcode(zipcode);

	invariant(coords, 'No coordinates found for zipcode');
	const { lat, lon } = coords;

	return {
		streamed: { weather: getWeather({ lat, lon }) }
	};
}) satisfies PageServerLoad;
