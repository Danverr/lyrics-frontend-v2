<script lang="ts">
	import {
		DocumentIcon,
		PlusIcon,
		DeleteIcon,
		PeopleIcon,
		LogoutIcon
	} from '$lib/components/ui/icons';
	import { onMount } from 'svelte';
	import { api } from '$lib/api';
	import type { ProjectOut } from '$lib/api/api';
	import { H3, P } from '$lib/components/ui/typography';
	import { Button } from '$lib/components/ui/button';
	import { toast } from 'svelte-sonner';
	import { Skeleton } from '$lib/components/ui/skeleton';
	import { FE_AUTH_PAGE, FE_PROJECT_PAGE } from '$lib/constants';
	import { handleApiError } from '$lib/api/utils';
	import { timeFromNow } from '$lib/utils';
	import Portal from 'svelte-portal';
	import { authTokenStore } from '$lib/stores/authTokenStore';
	import { userInfoStore } from '$lib/stores/userInfoStore';

	let projects: ProjectOut[] = [];
	let dataLoaded = false;

	onMount(async () => {
		try {
			projects = await api.projects.getProjects();
			projects.sort((a, b) => (a.updated_at > b.updated_at ? -1 : 1));
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
					projects = [res, ...projects];
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

	const logOut = () => {
		$authTokenStore = '';
		$userInfoStore = null;
		document.location.href = FE_AUTH_PAGE;
	};
</script>

<Portal target="#appBarLeft">
	<Button variant="ghost" size="icon" on:click={logOut}><LogoutIcon /></Button>
</Portal>

<div class="flex h-screen w-full flex-col items-center justify-center">
	<div class="flex w-[480px] flex-col gap-4">
		<div class="flex flex-row justify-between">
			<H3>Проекты</H3>
			<Button class="rounded-full" variant="outline" size="icon" on:click={createProject}>
				<PlusIcon />
			</Button>
		</div>
		<div class="-ml-4 -mr-[4px] box-content flex max-h-96 flex-col gap-1 overflow-y-scroll pl-4">
			{#if !dataLoaded}
				<Skeleton class="h-9 w-full" />
				<Skeleton class="h-9 w-full" />
				<Skeleton class="h-9 w-full" />
			{:else if dataLoaded && projects.length === 0}
				<P class="text-sm text-muted-foreground">
					У вас пока нет проектов. Создайте новый или присоединитесь к существующему по ссылке от
					владельца документа
				</P>
			{:else}
				<div class="flex flex-col">
					{#each projects as project (project.project_id)}
						<div class="flex gap-2">
							<Button
								variant="ghost"
								class="-ml-2 flex w-full justify-start pl-2"
								on:click={() => (window.location.href = `${FE_PROJECT_PAGE}/${project.project_id}`)}
							>
								<div class="mr-auto flex items-center">
									{#if project.is_owner}
										<DocumentIcon class="mr-2 h-4 w-4" />
									{:else}
										<PeopleIcon class="mr-2 h-4 w-4" />
									{/if}
									{project.name}
								</div>
								<P
									class="flex items-center whitespace-nowrap text-sm font-normal text-muted-foreground"
								>
									{timeFromNow(project.updated_at.replace('Z', '') + 'Z')}
								</P>
							</Button>
							<Button
								class="flex-shrink-0"
								variant="ghost"
								size="icon"
								disabled={!project.is_owner}
								on:click={() => deleteProject(project.project_id)}
							>
								<DeleteIcon />
							</Button>
						</div>
					{/each}
				</div>
			{/if}
		</div>
	</div>
</div>
