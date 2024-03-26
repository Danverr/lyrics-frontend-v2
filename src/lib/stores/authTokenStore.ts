import { createLocalStorageStore } from '$lib/stores/localStorage';

export const CURRENT_TOKEN_KEY = 'u';

export const authTokenStore = createLocalStorageStore(CURRENT_TOKEN_KEY, '');
