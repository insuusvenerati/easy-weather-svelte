import { env } from '$env/dynamic/private';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from '../$types';

export const load = (async ({ url, fetch }) => {
	const lat = url.searchParams.get('lat');
	const lon = url.searchParams.get('lon');

	const geoUrl = `${env.NOMINATIM_API_URL}&lon=${lon}&lat=${lat}`;

	const locationResponse = await fetch(geoUrl).then((res) => res.json());

	const zipcode = locationResponse.address.postcode;

	throw redirect(307, `/weather/${zipcode}`);
}) satisfies PageServerLoad;
