<script lang="ts">
	import BackIcon from '~icons/lets-icons/back';
	import PlusIcon from '~icons/ic/round-plus';
	import ShareIcon from '~icons/humbleicons/share';
	import DeleteIcon from '~icons/typcn/delete';
	import CheckIcon from '~icons/heroicons/check-20-solid';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import type { ProjectOut, TextVariantCompact } from '$lib/api/api';
	import { api } from '$lib/api';
	import { toast } from 'svelte-sonner';
	import { Editor } from '$lib/components/novel-editor/index.js';
	import { Input } from '$lib/components/ui/input';
	import { Player } from '$lib/components/audio-player';
	import Dropzone from 'svelte-file-dropzone';
	import { P } from '$lib/components/ui/typography';
	import { useDelay } from '$lib/utils';
	import { Button } from '$lib/components/ui/button';
	import Portal from 'svelte-portal';
	import { FE_PROJECTS_PAGE } from '$lib/api/constants';

	const projectId = $page.params['id'] ?? '';
	let project: ProjectOut;
	let activeText: TextVariantCompact;
	const textNamePlaceholder = 'Без названия';

	let handleTextNameUpdate = useDelay(async () => {
		try {
			await api.texts.updateText(activeText.text_id, { name: activeText.name });
			activeText = activeText;
		} catch (e) {
			toast.error('Не удалось обновить название варианта');
		}
	});

	const handleProjectNameUpdate = useDelay(async () => {
		try {
			await api.projects.updateProject(projectId, { name: project.name });
		} catch (e) {
			toast.error('Не удалось обновить Название проекта');
		}
	});

	const handleBpmUpdate = useDelay(async (bpm: number) => {
		try {
			await api.music.setMusicBpm(projectId, { custom_bpm: bpm });
			if (project.music) {
				project.music.custom_bpm = bpm;
			}
			project = project;
		} catch (e) {
			toast.error('Не удалось обновить заголовок');
		}
	});

	onMount(async () => {
		try {
			project = await api.projects.getProject(projectId);
			if (project.texts === undefined) {
				project.texts = [];
			}
			if (project.texts.length) {
				activeText = project.texts[project.texts.length - 1];
			}
		} catch (e) {
			toast.error('Не удалось загрузить проект');
		}
	});

	const deleteMusic = async () => {
		try {
			project = await api.music.deleteMusic(projectId);
		} catch (e) {
			toast.error('Не удалось удалить трек');
		}
	};

	const handleFilesSelect = async (e: any) => {
		if (e.detail.acceptedFiles.length !== 0) {
			toast.promise(api.music.uploadMusic(projectId, { music: e.detail.acceptedFiles[0] }), {
				loading: 'Загружаем трек...',
				success: (res) => {
					project.music = res;
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

	const copyLink = () => {
		navigator.clipboard.writeText(document.location.href);
		toast('Ссылка скопирована!', {
			description: 'Просто поделитесь ею для совместного редактирования'
		});
	};

	const addText = async () => {
		try {
			let text = await api.texts.createText({ project_id: projectId });
			project.texts?.push(text);
			selectText(text);
			project = project;
		} catch (e) {
			toast.error('Не удалось создать вариант текста');
		}
	};

	const selectText = (text: TextVariantCompact) => {
		activeText = text;
	};

	const deleteText = async (textId: string) => {
		if (project.texts?.length === 1) {
			toast.error('Нельзя удалить единственный вариант текста');
		}

		try {
			await api.texts.deleteText(textId);
			project.texts = project.texts?.filter((text) => text.text_id !== textId);
			if (project.texts?.length && activeText.text_id === textId) {
				activeText = project.texts[0];
			}
		} catch (e) {
			toast.error('Не удалось удалить вариант текста');
		}
	};
</script>

<Portal target="#appBarLeft">
	<Button variant="ghost" size="icon" on:click={returnBack}><BackIcon class="h-5 w-5" /></Button>
</Portal>
<Portal target="#appBarRight">
	<Button variant="ghost" size="icon" on:click={copyLink}><ShareIcon class="h-5 w-5" /></Button>
</Portal>

{#if project !== undefined}
	<Portal target="#leftSidebar">
		<div class="flex flex-col">
			<Input
				type="text"
				on:keydown={handleProjectNameUpdate}
				class="no-border mb-2 h-9 w-full rounded-none p-0 pl-6 text-xl font-bold tracking-tight"
				bind:value={project.name}
			/>
			{#key activeText}
				{#each project.texts ?? [] as text (text.text_id)}
					<div class="flex w-full">
						<Button
							variant="link"
							class="flex justify-start px-0 font-normal"
							on:click={() => selectText(text)}
						>
							<div class="mr-2 h-4 w-4 flex-shrink-0">
								{#if activeText.text_id === text.text_id}
									<CheckIcon class="h-4 w-4" />
								{/if}
							</div>
							<P class="text-overflow-ellipsis w-36 text-left">
								{!text.name ? textNamePlaceholder : text.name}
							</P>
						</Button>
						<Button
							class="ml-auto rounded-full"
							variant="ghost"
							size="icon"
							on:click={() => deleteText(text.text_id)}
						>
							<DeleteIcon />
						</Button>
					</div>
				{/each}
			{/key}
			<Button
				variant="ghost"
				class="muted-opacity -mx-2 mt-2 justify-start px-2"
				on:click={addText}
			>
				<PlusIcon class="mr-2 h-4 w-4" />Новый текст
			</Button>
		</div>
	</Portal>
	<div class="flex w-full flex-col items-center py-16">
		<div class="flex w-[44rem] flex-col">
			<div class="mb-8">
				{#if project?.music}
					<Player music={project.music} onDelete={deleteMusic} onBpmChange={handleBpmUpdate} />
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
			<Input
				type="text"
				on:keydown={handleTextNameUpdate}
				class="no-border h-auto w-full rounded-none p-0 text-[40px] font-bold tracking-tight"
				placeholder={textNamePlaceholder}
				bind:value={activeText.name}
			/>
			{#if activeText}
				{#key activeText.text_id}
					<Editor documentName={activeText.text_id} />
				{/key}
			{/if}
		</div>
	</div>
{/if}
