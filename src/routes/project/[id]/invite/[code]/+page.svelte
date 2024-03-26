<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { FE_PROJECT_PAGE, FE_PROJECTS_PAGE } from '$lib/constants';
	import { api } from '$lib/api';
	import { Spinner } from '$lib/components/ui/spinner';
	import { H4 } from '$lib/components/ui/typography';

	const inviteCode = $page.params['code'] ?? '';
	const projectId = $page.params['id'] ?? '';

	onMount(async () => {
		if (inviteCode === '' || projectId === '') {
			document.location.href = FE_PROJECTS_PAGE;
			return;
		}

		try {
			await api.grant.activateProjectShareCode(inviteCode);
			document.location.href = `${FE_PROJECT_PAGE}/${projectId}`;
		} catch (e) {
			document.location.href = FE_PROJECTS_PAGE;
		}
	});
</script>

<div class="absolute-center flex flex-col items-center gap-4">
	<Spinner class="h-16 w-16" />
	<H4>Переходим на нужный проект...</H4>
</div>
