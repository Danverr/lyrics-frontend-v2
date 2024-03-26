import { FE_PROJECT_PAGE } from '$lib/constants';

export const getShareLink = (projectId: string, code: string) => {
	return FE_PROJECT_PAGE + `/${projectId}/invite/${code}`;
};
