import { createContext } from '$lib/trpc/context';
import { router } from '$lib/trpc/router';
import type { Actions } from './$types';
import type { PageServerLoad } from './$types';

export const load = ((event) => {
	const { url } = event;
	const zipcode = url.searchParams.get('zipcode');
	const lat = url.searchParams.get('lat');
	const lon = url.searchParams.get('lon');

	if (lat && lon) {
		return {
			coords: { lat, lon },
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

export const actions: Actions = {
	// This action is called when the user clicks the theme button
	setTheme: async ({ cookies, request }) => {
		const formData = await request.formData();
		const theme = formData.get('theme')?.toString() ?? 'skeleton';
		// Sets the selected theme to the cookie
		cookies.set('theme', theme, { path: '/' });
		return { theme };
	}
};
