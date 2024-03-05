<script lang="ts">
	import TextEditor from '$lib/components/ui/text-editor/TextEditor.svelte';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import type { ProjectOut } from '$lib/api/api';
	import { api } from '$lib/api';

	const project_id = $page.url.searchParams.get('id') ?? '';
	let project: ProjectOut;

	onMount(async () => {
		try {
			project = await api.projects.getProject(project_id);
		} catch (e) {}
	});
</script>

{#if project !== undefined}
	<div>
		<div class="h3">{project.name}</div>
		<TextEditor />
	</div>
{/if}
