import { isBrowser } from '../components/novel-editor/utils.js';
import { writable } from 'svelte/store';

export const createLocalStorageStore = <T>(key: string, initialValue: T) => {
	const store = writable<T>(initialValue);

	try {
		store.set(
			isBrowser() && localStorage.getItem(key)
				? JSON.parse(localStorage.getItem(key) as string)
				: initialValue
		);
	} catch (e) {
		// Do nothing
	}

	store.subscribe((v) => {
		if (!isBrowser()) return;
		localStorage.setItem(key, JSON.stringify(v));
	});

	return store;
};
