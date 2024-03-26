import { PUBLIC_FE_BASE_URL, PUBLIC_BE_BASE_URL } from '$env/static/public';

export const FE_BASE_URL = PUBLIC_FE_BASE_URL;
export const FE_AUTH_PAGE = FE_BASE_URL + '/auth';
export const FE_PROJECTS_PAGE = FE_BASE_URL + '/projects';
export const FE_PROJECT_PAGE = FE_BASE_URL + '/project';
export const FE_YANDEX_ID_PAGE = FE_AUTH_PAGE + '/yandex_id';

export const BE_BASE_URL = PUBLIC_BE_BASE_URL;
