const CURRENT_TOKEN_KEY = 'u';

const getUserToken = () => {
	return localStorage.getItem(CURRENT_TOKEN_KEY);
};

const setUserToken = (token: string) => {
	localStorage.setItem(CURRENT_TOKEN_KEY, token);
};

export const appStore = {
	getUserToken: getUserToken,
	setUserToken: setUserToken
};
