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

	// async function registerPeriodicSync() {
	// 	try {
	// 		// Register a periodic sync with a minimum interval of one day
	// 		await sw.registration.periodicSync.register('sync-weather-data', {
	// 			minInterval: 60 * 1000
	// 		});
	// 		console.log('Periodic sync registered');
	// 	} catch (error) {
	// 		console.error(`Periodic sync could not be registered: ${error}`);
	// 	}
	// }

	event.waitUntil(deleteOldCaches());
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

// async function fetchAndCacheWeatherData() {
// 	// const response = await fetch(
// 	// 	`https://api.pirateweather.net/forecast/1btBnNtfn05w3b3p4LU8d1wJfnJxuKnj60oHhkIO/36.1961049,-95.9340291`
// 	// );
// 	// const data: WeatherResponse = await response.json();

// 	// get alerts from index db and show notification if there is a new alert
// 	const db = indexedDB.open('alerts', 3);
// 	db.onsuccess = function () {
// 		const db = this.result;
// 		const transaction = db.transaction(['alerts'], 'readwrite');
// 		const objectStore = transaction.objectStore('alerts');
// 		const request = objectStore.getAll();

// 		request.onsuccess = function () {
// 			const alerts = this.result;
// 			const newAlerts = alerts.filter((alert) => alert.time > Date.now());
// 			if (newAlerts.length > 0) {
// 				const title = 'Weather Alert';
// 				const options = {
// 					body: newAlerts[0].description,
// 					icon: '/icon.png',
// 					badge: '/badge.png'
// 				};
// 				sw.registration.showNotification(title, options);
// 			}
// 		};
// 	};
// }

// sw.addEventListener('periodicsync', (event) => {
// 	if (event.tag === 'sync-weather-data') {
// 		event.waitUntil(fetchAndCacheWeatherData());
// 	}
// });

// In the service worker
// sw.addEventListener('notificationclick', (event) => {
// 	event.notification.close();
// 	// Get the zipcode from the latest alert and open the window to that zipcode
// 	const db = indexedDB.open('alerts', 3);
// 	db.onsuccess = function () {
// 		const db = this.result;
// 		const transaction = db.transaction(['alerts'], 'readwrite');
// 		const objectStore = transaction.objectStore('alerts');
// 		const request = objectStore.getAll();

// 		request.onsuccess = function () {
// 			const alerts = this.result;
// 			const newAlerts = alerts.filter((alert) => alert.time > Date.now());
// 			if (newAlerts.length > 0) {
// 				const zipcode = newAlerts[0].zipcode;
// 				const url = `https://${sw.origin}/?zipcode=${zipcode}`;
// 				sw.clients.openWindow(url);
// 			}
// 		};
// 	};
// });

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
