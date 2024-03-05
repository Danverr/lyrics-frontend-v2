import { BE_BASE_URL } from '$lib/constants';
import { Api } from './api';

const api = new Api({
	baseURL: BE_BASE_URL,
	timeout: 5000
});

export { api };
