// lib/trpc/router.ts
import { env } from '$env/dynamic/private';
import type { Root } from '$lib/types/geographies';
import type { WeatherResponse } from '$lib/types/weather';
import delay from 'delay';
import { t } from './trpc';
import { z } from 'zod';

export const router = t.router({
	greeting: t.procedure.query(async () => {
		await delay(500); // 👈 simulate an expensive operation
		return `Hello tRPC v10 @ ${new Date().toLocaleTimeString()}`;
	}),
	weather: t.procedure.input(z.object({ lat: z.string(), lon: z.string() })).query(async (opts) => {
		const { input } = opts;
		const [weather, location] = await Promise.all<[Promise<WeatherResponse>, Promise<Root>]>([
			fetch(
				`${env.API_URL}/forecast/${env.API_KEY}/${input.lat},${input.lon}?exclude=minutely,currently`
			)
				.then((res) => res.json())
				.catch((err) => err),
			fetch(`${env.GEO_URL}&x=${input.lon}&y=${input.lat}`)
				.then((res) => res.json())
				.catch((err) => err)
		]);

		return {
			weather: weather,
			location: location.result.geographies['County Subdivisions'][0].BASENAME
		};
	})
});

export type Router = typeof router;
