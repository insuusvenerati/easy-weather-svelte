// lib/trpc/router.ts
import { env } from '$env/dynamic/private';
import type { Root } from '$lib/types/geographies';
import type { WeatherResponse } from '$lib/types/weather';
import { z } from 'zod';
import { t } from './trpc';

const latLonSchema = z.object({
	lat: z.string(),
	lon: z.string()
});

const zipcodeSchema = z.object({
	zipcode: z.string()
});

const locationSchema = z.union([latLonSchema, zipcodeSchema]);

export const router = t.router({
	weather: t.procedure.input(locationSchema).query(async (opts) => {
		const { input } = opts;

		// input can be either lat/lon or zipcode, handle accordingly
		const isLatLon = 'lat' in input && 'lon' in input;
		const isZipcode = 'zipcode' in input;

		let weather, location;
		if (isLatLon) {
			const url = `${env.API_URL}/forecast/${env.API_KEY}/${input.lat},${input.lon}?exclude=minutely,currently`;
			const geoUrl = `${env.GEO_URL}&x=${input.lon}&y=${input.lat}`;

			[weather, location] = await Promise.all([
				fetch(url).then((res) => res.json()),
				fetch(geoUrl).then((res) => res.json())
			]);

			location = location.result.geographies['County Subdivisions'][0].BASENAME;
		} else if (isZipcode) {
			const locationResponse = await fetch(
				`https://api.zippopotam.us/us/${input.zipcode}?units=us`
			);
			const locationData = await locationResponse.json();

			const response = await fetch(
				`${env.API_URL}/forecast/${env.API_KEY}/${locationData.places[0].latitude},${locationData.places[0].longitude}?exclude=minutely,currently`
			);
			weather = await response.json();

			location = locationData.places[0]['place name'];
		}

		return {
			weather: weather,
			location: location
		};
	})
});

export type Router = typeof router;
