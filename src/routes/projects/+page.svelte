<script lang="ts">
	import { DocumentIcon, PlusIcon, DeleteIcon, PeopleIcon } from '$lib/components/ui/icons';
	import { onMount } from 'svelte';
	import { api } from '$lib/api';
	import type { ProjectOut } from '$lib/api/api';
	import { H3, P } from '$lib/components/ui/typography';
	import { Button } from '$lib/components/ui/button';
	import { toast } from 'svelte-sonner';
	import { Skeleton } from '$lib/components/ui/skeleton';
	import { FE_PROJECT_PAGE } from '$lib/constants';
	import { handleApiError } from '$lib/api/utils';

	let projects: ProjectOut[] = [];
	let dataLoaded = false;

	onMount(async () => {
		try {
			projects = await api.projects.getProjects();
		} catch (e) {
			handleApiError(e, 'Ошибка во время загрузки проектов');
		} finally {
			dataLoaded = true;
		}
	});

	const createProject = async () => {
		toast.promise(
			api.projects.createProject({
				name: 'Новый проект'
			}),
			{
				loading: 'Создаем новый проект...',
				success: (res) => {
					projects.push(res);
					projects = projects;
					return 'Новый проект создан';
				},
				error: 'Произошла ошибка'
			}
		);
	};

	const deleteProject = async (id: string) => {
		let projectsCopy = projects;

		try {
			let prjName: string | null | undefined;
			projects = projects.filter((prj) => {
				if (prj.project_id === id) {
					prjName = prj.name;
				}
				return prj.project_id !== id;
			});

			await api.projects.deleteProject(id);
			toast.success(
				`Проект ${prjName !== undefined && prjName !== null ? `"${prjName}"` : ''} удален`
			);
		} catch (e) {
			projects = projectsCopy;
			handleApiError(e, 'Ошибка во время удаления проекта');
		}
	};
</script>

<div class="flex h-screen w-full flex-col items-center justify-center">
	<div class="flex w-96 flex-col gap-4">
		<div class="flex flex-row justify-between">
			<H3>Проекты</H3>
			<Button class="rounded-full" variant="outline" size="icon" on:click={createProject}>
				<PlusIcon />
			</Button>
		</div>
		<div class="-mx-2 box-content flex max-h-96 w-[388px] flex-col gap-1 overflow-y-scroll px-2">
			{#if !dataLoaded}
				<Skeleton class="h-9 w-full" />
				<Skeleton class="h-9 w-full" />
				<Skeleton class="h-9 w-full" />
			{/if}
			{#if dataLoaded && projects.length === 0}
				<P class="text-sm text-muted-foreground">
					У вас пока нет проектов. Создайте новый или присоединитесь к существующему по ссылке от
					владельца документа
				</P>
			{/if}
			{#each [...projects].reverse() as project (project.project_id)}
				<div class="flex justify-between">
					<Button
						variant="ghost"
						class="-ml-2 flex w-full justify-start pl-2"
						on:click={() => (window.location.href = `${FE_PROJECT_PAGE}/${project.project_id}`)}
					>
						<div class="flex items-center">
							{#if project.is_owner}
								<DocumentIcon class="mr-2 h-4 w-4" />
							{:else}
								<PeopleIcon class="mr-2 h-4 w-4" />
							{/if}
							{project.name}
						</div>
					</Button>
					{#if project.is_owner}
						<Button
							class="shrink-0"
							variant="ghost"
							size="icon"
							on:click={() => deleteProject(project.project_id)}
						>
							<DeleteIcon />
						</Button>
					{/if}
				</div>
			{/each}
		</div>
	</div>
</div>
