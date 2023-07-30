/// <reference types="@sveltejs/kit" />
/// <reference no-default-lib="true"/>
/// <reference lib="esnext" />
/// <reference lib="webworker" />

import { build, files, version } from '$service-worker';

const sw = self as unknown as ServiceWorkerGlobalScope;

// Create a unique cache name for this deployment
const CACHE = `cache-${version}`;

const ASSETS = [
	...build, // the app itsw
	...files // everything in `static`
];

sw.addEventListener('install', (event) => {
	console.log('Installing service worker');
	async function addFilesToCache() {
		const cache = await caches.open(CACHE);
		await cache.addAll(ASSETS);
	}

	event.waitUntil(addFilesToCache());
});

sw.addEventListener('activate', (event) => {
	console.log('Activating service worker');

	async function deleteOldCaches() {
		for (const key of await caches.keys()) {
			if (key !== CACHE) await caches.delete(key);
		}
	}

	async function registerPeriodicSync() {
		try {
			// Register a periodic sync with a minimum interval of one day
			await sw.registration.periodicSync.register('my-sync', {
				minInterval: 24 * 60 * 60 * 1000 // One day
			});
			console.log('Periodic sync registered');
		} catch (error) {
			console.error(`Periodic sync could not be registered: ${error}`);
		}
	}

	event.waitUntil(deleteOldCaches().then(registerPeriodicSync));
});

sw.addEventListener('fetch', (event) => {
	// ignore POST requests etc
	if (event.request.method !== 'GET') return;

	async function respond() {
		const url = new URL(event.request.url);
		const cache = await caches.open(CACHE);

		// `build`/`files` can always be served from the cache
		if (ASSETS.includes(url.pathname)) {
			console.log('Serving from cache', event.request.url);
			return cache.match(url.pathname);
		}

		// for everything else, try the network first, but
		// fall back to the cache if we're offline
		try {
			const response = await fetch(event.request);

			if (response.status === 200) {
				console.log('Caching', event.request.url);
				cache.put(event.request, response.clone());
			}

			return response;
		} catch {
			console.log('Serving from cache', event.request.url);
			return cache.match(event.request);
		}
	}

	event.respondWith(respond());
});

sw.addEventListener('periodicsync', (event) => {
	if (event.tag === 'my-sync') {
		event.waitUntil(
			(async () => {
				const bgFetch = await self.registration.backgroundFetch.fetch(
					'my-fetch',
					[
						'https://api.pirateweather.net/forecast/1btBnNtfn05w3b3p4LU8d1wJfnJxuKnj60oHhkIO/30.5559368,-87.2839719'
					],
					{
						title: 'Background Fetch',
						icons: [{ sizes: '192x192', src: '/icon.png', type: 'image/png' }],
						downloadTotal: 15000
					}
				);
				console.log(`Background Fetch successful with ID ${bgFetch.id}`);
			})()
		);
	}
});
