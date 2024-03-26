import axios from 'axios';
import { toast } from 'svelte-sonner';

export const getApiErrorMessage = (e: unknown) => {
	if (axios.isAxiosError(e)) {
		return e?.response?.data?.detail ?? null;
	}
	return null;
};

export const handleApiError = (e: unknown, title: string) => {
	toast.error(title, {
		description: getApiErrorMessage(e)
	});
};
