// hooks.server.ts
import { createContext } from '$lib/trpc/context';
import { router } from '$lib/trpc/router';
import type { Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { createTRPCHandle } from 'trpc-sveltekit';

const trpcHandle: Handle = createTRPCHandle({ router, createContext });

const themeHandler: Handle = async ({ event, resolve }) => {
	let theme = '';

	const cookieTheme = event.cookies.get('theme');

	if (cookieTheme) {
		theme = cookieTheme;
	} else {
		event.cookies.set('theme', 'skeleton');
		theme = 'skeleton';
	}

	return await resolve(event, {
		transformPageChunk: ({ html }) => html.replace('data-theme=""', `data-theme="${theme}"`)
	});
};

export const handle = sequence(trpcHandle, themeHandler);
