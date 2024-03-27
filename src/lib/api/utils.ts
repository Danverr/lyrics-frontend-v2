import axios from 'axios';
import { toast } from 'svelte-sonner';

export const getApiErrorMessage = (e: unknown) => {
	let msg: string = '';

	if (axios.isAxiosError(e)) {
		msg = e?.response?.data?.detail;
	}

	return msg ?? 'Неизвестная ошибка';
};

export const handleApiError = (e: unknown, title: string) => {
	toast.error(title, {
		description: getApiErrorMessage(e)
	});
};
