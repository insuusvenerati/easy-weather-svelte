import type { LocationData } from './types/location';

export const WEATHER_ICON_URL =
	'https://raw.githubusercontent.com/basmilius/weather-icons/dev/production/line/svg/';

export const MOON_ICON_URL =
	'https://raw.githubusercontent.com/basmilius/weather-icons/dev/production/fill/svg/';

export const getWeatherIconUrl = (iconName: string) => {
	if (iconName === 'clear-day') return `${WEATHER_ICON_URL}clear-day.svg`;
	if (iconName === 'clear-night') return `${WEATHER_ICON_URL}clear-night.svg`;
	if (iconName === 'rain') return `${WEATHER_ICON_URL}rain.svg`;
	if (iconName === 'snow') return `${WEATHER_ICON_URL}snow.svg`;
	if (iconName === 'sleet') return `${WEATHER_ICON_URL}sleet.svg`;
	if (iconName === 'wind') return `${WEATHER_ICON_URL}wind.svg`;
	if (iconName === 'fog') return `${WEATHER_ICON_URL}fog.svg`;
	if (iconName === 'cloudy') return `${WEATHER_ICON_URL}cloudy.svg`;
	if (iconName === 'partly-cloudy-day') return `${WEATHER_ICON_URL}partly-cloudy-day.svg`;
	if (iconName === 'partly-cloudy-night') return `${WEATHER_ICON_URL}partly-cloudy-night.svg`;

	return '';
};

export const getMoonphaseIconUrl = (moonphase: number, url: string = MOON_ICON_URL) => {
	if (moonphase >= 0.875 && moonphase < 1) return `${url}moon-waning-crescent.svg`;
	if (moonphase >= 0.75) return `${url}moon-last-quarter.svg`;
	if (moonphase >= 0.625) return `${url}moon-waning-gibbous.svg`;
	if (moonphase >= 0.5) return `${url}moon-full.svg`;
	if (moonphase >= 0.375) return `${url}moon-waxing-gibbous.svg`;
	if (moonphase >= 0.25) return `${url}moon-waxing-crescent.svg`;
	if (moonphase >= 0.125) return `${url}moon-first-quarter.svg`;
	return `${url}moon-new.svg`;
};

export const getPrecipIntensity = (intensity: number) => {
	if (intensity === 0) {
		return 'No precipitation';
	} else if (intensity < 0.002) {
		return 'Very light precipitation';
	} else if (intensity < 0.017) {
		return 'Light precipitation';
	} else if (intensity < 0.1) {
		return 'Moderate precipitation';
	} else {
		return 'Heavy precipitation';
	}
};

export const isValidUSZip = (sZip: string) => {
	return /^\d{5}(?:[-\s]\d{4})?$/.test(sZip);
};

export const getCoordsByZipcode = async (zipcode: string | number) => {
	const locationResponse = await fetch(`https://api.zippopotam.us/us/${zipcode}?units=us`);
	const locationData: LocationData = await locationResponse.json();

	return {
		lat: Number(locationData.places[0].latitude),
		lon: Number(locationData.places[0].longitude)
	};
};
