import { createLocalStorageStore } from '$lib/stores/localStorage';
import type { UserOut } from '$lib/api/api';

export const userInfoStore = createLocalStorageStore<UserOut | null>('user_info', null);
