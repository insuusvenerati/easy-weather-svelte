import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from '../$types';
import { getZipcodeByCoords } from '$lib/util.server';
import invariant from 'tiny-invariant';

export const load = (async ({ url, fetch }) => {
	const lat = url.searchParams.get('lat');
	const lon = url.searchParams.get('lon');

	invariant(lat && lon, 'Missing lat/lon');

	const zipcode = await getZipcodeByCoords({ lat, lon, fetch });

	throw redirect(307, `/weather/${zipcode}`);
}) satisfies PageServerLoad;
