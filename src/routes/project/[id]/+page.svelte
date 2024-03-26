<script lang="ts">
	import { BackIcon } from '$lib/components/ui/icons';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import type { ProjectOut, TextVariantCompact } from '$lib/api/api';
	import { api } from '$lib/api';
	import { toast } from 'svelte-sonner';
	import { Editor } from '$lib/components/novel-editor/index.js';
	import { Player } from '$lib/components/audio-player';
	import Dropzone from 'svelte-file-dropzone';
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

	let handleTextNameUpdate = createDebouncedCallback(async () => {
		try {
			await api.texts.updateText($activeText.text_id, { name: $activeText.name });
			toast.success('Новое название текста сохранено');
		} catch (e) {
			handleApiError(e, 'Не удалось обновить название варианта');
		}
	}, 1000);

	const handleBpmUpdate = createDebouncedCallback(async (bpm: number) => {
		try {
			await api.music.setMusicBpm(projectId, { custom_bpm: bpm });
			if ($project.music) {
				$project.music.custom_bpm = bpm;
			}
		} catch (e) {
			handleApiError(e, 'Не удалось обновить BPM трека');
		}
	});

	onMount(async () => {
		try {
			$project = await api.projects.getProject(projectId);
			if ($project.texts === undefined) {
				$project.texts = [];
			}
			if ($project.texts.length) {
				$activeText = $project.texts[$project.texts.length - 1];
			}
		} catch (e) {
			handleApiError(e, 'Не удалось загрузить проект');
		}
	});

	const deleteMusic = async () => {
		try {
			// TODO: Пофиксить ручку, не приходят тексты
			await api.music.deleteMusic(projectId);
			$project.music = null;
		} catch (e) {
			handleApiError(e, 'Не удалось удалить трек');
		}
	};

	const handleFilesSelect = async (e: any) => {
		if (e.detail.acceptedFiles.length !== 0) {
			toast.promise(api.music.uploadMusic(projectId, { music: e.detail.acceptedFiles[0] }), {
				loading: 'Загружаем трек...',
				success: (res) => {
					$project.music = res;
					return 'Трек загружен';
				},
				error: 'Не удалось загрузить файл'
			});
		} else {
			toast.error('Неверный формат файла');
		}
	};

	const returnBack = () => {
		document.location.href = FE_PROJECTS_PAGE;
	};
</script>

<Portal target="#appBarLeft">
	<Button variant="ghost" size="icon" on:click={returnBack}><BackIcon class="h-5 w-5" /></Button>
</Portal>
{#if $project?.is_owner}
	<Portal target="#appBarRight">
		<ShareButton {project} />
	</Portal>
{/if}

{#if $project !== undefined}
	<TextsSidebar {project} {activeText} {textNamePlaceholder} />
	<div class="flex w-full flex-col items-center pb-[500px] pt-16">
		<div class="flex w-[44rem] flex-col">
			<div class="mb-8">
				{#if $project?.music}
					<Player music={$project.music} onDelete={deleteMusic} onBpmChange={handleBpmUpdate} />
				{:else}
					<Dropzone
						accept="audio/*"
						multiple={false}
						disableDefaultStyles
						containerClasses="flex flex-col items-center justify-center bg-background h-[237px] border-2 rounded-xl text-foreground border-dashed transition-all"
						on:drop={handleFilesSelect}
					>
						<P class="text-muted-foreground">
							Перетащите сюда файл или нажмите на область для загрузки трека
						</P>
					</Dropzone>
				{/if}
			</div>
			<Textarea
				wrap="soft"
				autoresize={true}
				on:keydown={handleTextNameUpdate}
				class="no-border h-auto w-full rounded-none p-0 text-[40px] font-bold tracking-tight"
				placeholder={textNamePlaceholder}
				bind:value={$activeText.name}
			/>
			{#if $activeText}
				{#key $activeText.text_id}
					<Editor documentName={$activeText.text_id} />
				{/key}
			{/if}
		</div>
	</div>
{/if}
