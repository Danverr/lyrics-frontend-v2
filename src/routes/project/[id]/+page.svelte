<script lang="ts">
	import { BackIcon } from '$lib/components/ui/icons';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { GrantLevel, type ProjectOut, type TextVariantCompact } from '$lib/api/api';
	import { api } from '$lib/api';
	import { toast } from 'svelte-sonner';
	import { Editor } from '$lib/components/novel-editor/index.js';
	import { Player } from '$lib/components/audio-player';
	import { P } from '$lib/components/ui/typography';
	import { createDebouncedCallback } from '$lib/utils';
	import { Button } from '$lib/components/ui/button';
	import Portal from 'svelte-portal';
	import { FE_PROJECTS_PAGE } from '$lib/constants';
	import { Textarea } from '$lib/components/ui/textarea';
	import ShareButton from './shareButton.svelte';
	import TextsSidebar from './textsSidebar.svelte';
	import { writable } from 'svelte/store';
	import { handleApiError } from '$lib/api/utils';

	const projectId = $page.params['id'] ?? '';
	let project = writable<ProjectOut>();
	let activeText = writable<TextVariantCompact>();
	const textNamePlaceholder = 'Без названия';
	let isEditable: boolean = true;

	$: if ($project) {
		isEditable = $project.grant_level !== GrantLevel.READ_ONLY;
	}

	let handleTextNameUpdate = createDebouncedCallback(async () => {
		try {
			await api.texts.updateText($activeText.text_id, { name: $activeText.name });
			toast.success('Новое название текста сохранено');
		} catch (e) {
			handleApiError(e, 'Не удалось обновить название варианта');
		}
	}, 1000);

	onMount(async () => {
		try {
			$project = await api.projects.getProject(projectId);
			if ($project.texts === undefined) {
				$project.texts = [];
			}
			if ($project.texts.length) {
				$project.texts = $project.texts.sort((a, b) => (a.created_at < b.created_at ? -1 : 1));
				$activeText = $project.texts[$project.texts.length - 1];
			}
		} catch (e) {
			handleApiError(e, 'Не удалось загрузить проект');
		}
	});

	const returnBack = () => {
		document.location.href = FE_PROJECTS_PAGE;
	};
</script>

<Portal target="#appBarLeft">
	<Button variant="ghost" size="icon" on:click={returnBack}><BackIcon class="h-5 w-5" /></Button>
</Portal>
{#if !isEditable}
	<Portal target="#appBarCenter">
		<P class="bg-background text-sm text-muted-foreground">Документ открыт в режиме просмотра</P>
	</Portal>
{/if}
{#if $project?.is_owner}
	<Portal target="#appBarRight">
		<ShareButton {project} />
	</Portal>
{/if}

{#if $project !== undefined}
	<TextsSidebar {project} {activeText} {textNamePlaceholder} {isEditable} />
	<div class="flex w-full flex-col items-center pb-[500px] pt-16">
		<div class="flex w-[44rem] flex-col">
			<div class="mb-8">
				<Player {project} {isEditable} />
			</div>
			<Textarea
				wrap="soft"
				autoresize={true}
				on:keydown={handleTextNameUpdate}
				readonly={isEditable ? null : true}
				class="no-border h-auto w-full rounded-none p-0 text-[40px] font-bold tracking-tight"
				placeholder={textNamePlaceholder}
				bind:value={$activeText.name}
			/>
			{#if $activeText}
				{#key $activeText.text_id}
					<Editor documentName={$activeText.text_id} {isEditable} />
				{/key}
			{/if}
		</div>
	</div>
{/if}
