import Dexie from 'dexie';
import type { Alert } from './types/weather';

export class DexieAlerts extends Dexie {
	alerts!: Dexie.Table<Alert, number>;

	constructor() {
		super('alerts');
		this.version(1).stores({
			alerts: '++id, title, description, expires, severity, uri, regions, time'
		});
	}
}

export const db = new DexieAlerts();
