import { createContext } from '$lib/trpc/context';
import { router } from '$lib/trpc/router';
import type { PageServerLoad } from './$types';

export const load = ((event) => {
	const { params } = event;
	const { zipcode } = params;

	return {
		streamed: { weather: router.createCaller(createContext(event)).weather({ zipcode }) }
	};
}) satisfies PageServerLoad;
