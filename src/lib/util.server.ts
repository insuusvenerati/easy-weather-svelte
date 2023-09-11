import { env } from '$env/dynamic/private';
import type { Root } from './types/geographies';
import type { NominatimResponse } from './types/nominatim';
import type { WeatherResponse } from './types/weather';

export const getWeather = async ({ lat, lon }: { lat: string | number; lon: string | number }) => {
	const url = `${env.API_URL}/forecast/${env.API_KEY}/${lat},${lon}?exclude=minutely,currently`;
	const geoUrl = `${env.GEO_URL}&x=${lon}&y=${lat}`;

	const [weather, location]: [WeatherResponse, Root] = await Promise.all([
		fetch(url).then((res) => res.json()),
		fetch(geoUrl).then((res) => res.json())
	]);

	return {
		coords: { lat: Number(lat), lon: Number(lon) },
		weather,
		location: location.result.geographies['County Subdivisions'][0].BASENAME
	};
};

export const getZipcodeByCoords = async ({
	lat,
	lon,
	fetch
}: {
	lat: string | number;
	lon: string | number;
	fetch: typeof window.fetch;
}) => {
	const geoUrl = `${env.NOMINATIM_API_URL}&lon=${lon}&lat=${lat}`;

	const locationResponse: NominatimResponse = await fetch(geoUrl).then((res) => res.json());

	return locationResponse.address.postcode;
};
