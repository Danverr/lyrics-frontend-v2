import { BE_BASE_URL, FE_AUTH_PAGE } from '$lib/constants';
import { Api } from './api';
import * as jose from 'jose';
import { authTokenStore } from '$lib/stores/authTokenStore';
import { get } from 'svelte/store';

const api = new Api({
	baseURL: BE_BASE_URL,
	timeout: 10000,
	requestInterceptor: (config) => {
		const jwt: string | null = get(authTokenStore) ? (get(authTokenStore) as string) : null;

		if (jwt !== null && jwt !== '') {
			const claims = jose.decodeJwt(jwt);

			if (claims.exp === undefined || Date.now() / 1000 >= claims.exp) {
				window.location.href = FE_AUTH_PAGE;
			}

			config.headers.setAuthorization(`Bearer ${jwt}`, true);
		} else if (config.url !== undefined && !config.url.startsWith('/auth')) {
			window.location.href = FE_AUTH_PAGE;
		}
		return config;
	}
});

export { api };
