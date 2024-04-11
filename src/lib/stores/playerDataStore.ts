import { createLocalStorageStore } from '$lib/stores/localStorage';

type PlayerData = {
	region: {
		start: number;
		end: number;
	} | null;
};

export const getPlayerDataStore = (id: string) =>
	createLocalStorageStore<PlayerData>(`playerData_${id}`, {
		region: null
	});
