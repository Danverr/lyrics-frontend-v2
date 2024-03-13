<script lang="ts">
	import BackIcon from '~icons/lets-icons/back';
	import ShareIcon from '~icons/humbleicons/share';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import type { ProjectOut } from '$lib/api/api';
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

	const handleTitleUpdate = useDelay(
		async () => {
			// TODO: Дождаться PATCH метод на беке
			console.log('UPDATE!');
		},
		() => toast.error('Не удалось обновить заголовок')
	);

	const handleBpmUpdate = useDelay(
		async (bpm: number) => {
			// TODO: Пофиксить баг на беке - отдается неверный URL для файла
			await api.music.setMusicBpm(projectId, { custom_bpm: bpm });
			if (project.music) {
				project.music.custom_bpm = bpm;
			}
			project = project;
		},
		() => toast.error('Не удалось обновить BPM трека')
	);

	onMount(async () => {
		try {
			project = await api.projects.getProject(projectId);
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
</script>

<Portal target="#appBarLeft">
	<Button variant="ghost" size="icon" on:click={returnBack}><BackIcon class="h-5 w-5" /></Button>
</Portal>
<Portal target="#appBarRight">
	<Button variant="ghost" size="icon" on:click={copyLink}><ShareIcon class="h-5 w-5" /></Button>
</Portal>

{#if project !== undefined}
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
				on:keydown={handleTitleUpdate}
				class="no-border h-auto w-full rounded-none p-0 text-[40px] font-bold tracking-tight"
				bind:value={project.name}
			/>
			<Editor documentName={projectId} />
		</div>
	</div>
{/if}
