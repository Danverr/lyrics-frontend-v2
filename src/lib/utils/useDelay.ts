import { v4 as uuidv4 } from 'uuid';
import { toast } from 'svelte-sonner';

const lastCalledMap = new Map();

export const useDelay = <T>(
	callback: (args: T) => Promise<any>,
	errorMessage: string = 'Произошла ошибка',
	timeout: number = 2000
) => {
	const id = uuidv4();
	return (args: T) => {
		lastCalledMap.set(id, new Date());
		setTimeout(async () => {
			if (new Date().getTime() - lastCalledMap.get(id).getTime() >= timeout) {
				lastCalledMap.delete(id);
				callback(args).catch(() => {
					toast.error(errorMessage);
				});
			}
		}, timeout);
	};
};
