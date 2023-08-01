/// <reference types="@sveltejs/kit" />
/// <reference no-default-lib="true"/>
/// <reference lib="esnext" />
/// <reference lib="webworker" />

import { build, files, version } from '$service-worker';
import type { WeatherResponse } from './lib/types/weather';

const sw = self as unknown as ServiceWorkerGlobalScope;

// Create a unique cache name for this deployment
const CACHE = `cache-${version}`;

const ASSETS = [
	...build, // the app itsw
	...files // everything in `static`
];

const broadcast = new BroadcastChannel('location');
broadcast.onmessage = (event) => {
	console.log(event.data.coords);
};

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
			await sw.registration.periodicSync.register('sync-weather-data', {
				minInterval: 60 * 1000
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
			// console.log('Serving from cache', event.request.url);
			return cache.match(url.pathname);
		}

		// for everything else, try the network first, but
		// fall back to the cache if we're offline
		try {
			const response = await fetch(event.request);

			if (response.status === 200) {
				// console.log('Caching', event.request.url);
				cache.put(event.request, response.clone());
			}

			return response;
		} catch {
			// console.log('Serving from cache', event.request.url);
			return cache.match(event.request);
		}
	}

	event.respondWith(respond());
});

// In the service worker
async function fetchAndCacheWeatherData() {
	const response = await fetch(
		`https://api.pirateweather.net/forecast/1btBnNtfn05w3b3p4LU8d1wJfnJxuKnj60oHhkIO/30.5559368,-87.2839719`
	);
	const data: WeatherResponse = await response.json();
	if (data.alerts && data.alerts.length > 0) {
		sw.registration.showNotification('Weather Alert', {
			body: data.alerts[0].description,
			icon: '⛅',
			tag: 'weather-alert'
		});
	}
	// const cache = await caches.open('weather-data');
	// cache.put(
	// 	`https://api.pirateweather.net/forecast/1btBnNtfn05w3b3p4LU8d1wJfnJxuKnj60oHhkIO/30.5559368,-87.2839719`,
	// 	response.clone()
	// );
}

sw.addEventListener('periodicsync', (event) => {
	if (event.tag === 'sync-weather-data') {
		event.waitUntil(fetchAndCacheWeatherData());
	}
});

// In the service worker
sw.addEventListener('notificationclick', (event) => {
	event.notification.close();
	event.waitUntil(sw.clients.openWindow('https://easy-weather-svelte.pages.dev/'));
});

// (async () => {
// 	const bgFetch = await sw.registration.backgroundFetch.fetch(
// 		'my-fetch',
// 		[
// 			'https://api.pirateweather.net/forecast/1btBnNtfn05w3b3p4LU8d1wJfnJxuKnj60oHhkIO/30.5559368,-87.2839719'
// 		],
// 		{
// 			title: 'Background Fetch',
// 			icons: [{ sizes: '192x192', src: '/icon.png', type: 'image/png' }],
// 			downloadTotal: 15000
// 		}
// 	);
// 	console.log(`Background Fetch successful with ID ${bgFetch.id}`);
// })()
// In the service worker
