import { PUBLIC_FE_BASE_URL, PUBLIC_BE_BASE_URL } from '$env/dynamic/public';

export const FE_BASE_URL = PUBLIC_FE_BASE_URL;
export const FE_AUTH_PAGE = FE_BASE_URL + '/auth';
export const FE_PROJECTS_PAGE = FE_BASE_URL + '/projects';
export const FE_YANDEX_ID_PAGE = FE_BASE_URL + '/yandex_id';

export const BE_BASE_URL = PUBLIC_BE_BASE_URL;
