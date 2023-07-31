export interface Root {
	result: Result;
}

export interface Result {
	geographies: Geographies;
	input: Input;
}

export interface Geographies {
	'County Subdivisions': Subdivision[];
}

export interface Subdivision {
	COUSUB: string;
	GEOID: string;
	CENTLAT: string;
	AREAWATER: number;
	STATE: string;
	BASENAME: string;
	OID: string;
	LSADC: string;
	FUNCSTAT: string;
	INTPTLAT: string;
	NAME: string;
	OBJECTID: number;
	CENTLON: string;
	COUSUBCC: string;
	AREALAND: number;
	INTPTLON: string;
	MTFCC: string;
	COUSUBNS: string;
	COUNTY: string;
}

export interface Input {
	vintage: Vintage;
	location: Location;
	benchmark: Benchmark;
}

export interface Vintage {
	isDefault: boolean;
	id: string;
	vintageName: string;
	vintageDescription: string;
}

export interface Location {
	x: number;
	y: number;
}

export interface Benchmark {
	isDefault: boolean;
	benchmarkDescription: string;
	id: string;
	benchmarkName: string;
}
