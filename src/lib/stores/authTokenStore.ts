import { createLocalStorageStore } from '$lib/stores/localStorage';

export const CURRENT_TOKEN_KEY = 'u';

export const authTokenStore = createLocalStorageStore<string>(CURRENT_TOKEN_KEY, '');
