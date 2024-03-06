<script lang="ts">
	import TextEditor from '$lib/components/ui/text-editor/TextEditor.svelte';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import type { ProjectOut } from '$lib/api/api';
	import { api } from '$lib/api';
	import { Toaster } from '$lib/components/ui/sonner';
	import { toast } from 'svelte-sonner';
	import { H3 } from '$lib/components/ui/typography';

	const project_id = $page.url.searchParams.get('id') ?? '';
	let project: ProjectOut;

	onMount(async () => {
		try {
			project = await api.projects.getProject(project_id);
		} catch (e) {
			toast('Ошибка во время загрузки проектов');
		}
	});
</script>

<Toaster />
{#if project !== undefined}
	<div class="flex h-screen w-screen flex-col items-center justify-center">
		<div class="flex w-[44rem] flex-col gap-2">
			<H3>{project.name}</H3>
		</div>
	</div>
{/if}
