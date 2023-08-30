import { createContext } from '$lib/trpc/context';
import { router } from '$lib/trpc/router';
import type { PageServerLoad } from './$types';

export const load = ((event) => {
	const { url } = event;
	const zipcode = url.searchParams.get('zipcode');
	const lat = url.searchParams.get('lat');
	const lon = url.searchParams.get('lon');

	if (lat && lon) {
		return {
			streamed: {
				weather: router.createCaller(createContext(event)).weather({ lat, lon })
			}
		};
	}

	if (!zipcode) {
		return;
		// throw new Error('Missing zipcode');
	}

	return {
		streamed: { weather: router.createCaller(createContext(event)).weather({ zipcode }) }
	};
}) satisfies PageServerLoad;
