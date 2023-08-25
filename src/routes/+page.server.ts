import { createContext } from '$lib/trpc/context';
import { router } from '$lib/trpc/router';
import type { PageServerLoad } from './$types';

export const load = (async (event) => {
	const { url } = event;
	const zipcode = url.searchParams.get('zipcode');
	const lat = url.searchParams.get('lat');
	const lon = url.searchParams.get('lon');

	if (lat && lon) {
		return await router.createCaller(await createContext(event)).weather({ lat, lon });
	}

	if (!zipcode) {
		return;
	}

	return await router.createCaller(await createContext(event)).weather({ zipcode });
}) satisfies PageServerLoad;
