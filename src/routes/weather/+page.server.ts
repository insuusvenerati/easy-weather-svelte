import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from '../$types';
import { getZipcodeByCoords } from '$lib/util.server';
import invariant from 'tiny-invariant';

export const load = (async ({ url, fetch, setHeaders }) => {
	const lat = url.searchParams.get('lat');
	const lon = url.searchParams.get('lon');

	invariant(lat && lon, 'Missing lat/lon');

	const zipcode = await getZipcodeByCoords({ lat, lon, fetch });
	setHeaders({
		age: '31536000',
		'cache-control': 'max-age=31536000',
		'User-Agent': 'weather-app'
	});
	invariant(zipcode, 'No zipcode found for coordinates');

	throw redirect(307, `/weather/${zipcode}`);
}) satisfies PageServerLoad;
