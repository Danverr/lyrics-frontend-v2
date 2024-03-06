<script lang="ts">
	import DocumentTextBold from '~icons/solar/document-text-bold';
	import Plus from '~icons/ic/round-plus';
	import DeleteIcon from '~icons/typcn/delete';
	import { onMount } from 'svelte';
	import { api } from '$lib/api';
	import type { ProjectOut } from '$lib/api/api';
	import { H3 } from '$lib/components/ui/typography';
	import { Button } from '$lib/components/ui/button';
	import { toast } from 'svelte-sonner';
	import { Toaster } from '$lib/components/ui/sonner';
	import { Skeleton } from '$lib/components/ui/skeleton';

	let projects: ProjectOut[] = [];
	let dataLoaded = false;

	onMount(async () => {
		try {
			projects = await api.projects.getProjects();
		} catch (e) {
			toast('Ошибка во время загрузки проектов');
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
			toast.error('Произошла ошибка');
		}
	};
</script>

<Toaster />
<div class="flex h-screen w-screen flex-col items-center justify-center">
	<div class="flex w-96 flex-col gap-4">
		<div class="flex flex-row justify-between">
			<H3>Проекты</H3>
			<Button class="rounded-full" variant="outline" size="icon" on:click={createProject}>
				<Plus />
			</Button>
		</div>
		<div class="flex flex-col gap-1">
			{#if !dataLoaded}
				<Skeleton class="h-9 w-full" />
				<Skeleton class="h-9 w-full" />
				<Skeleton class="h-9 w-full" />
			{/if}
			{#each [...projects].reverse() as project (project.project_id)}
				<div class="flex justify-between">
					<Button
						variant="link"
						class="flex w-full justify-start px-0"
						on:click={() => (window.location.href = `/project/${project.project_id}`)}
					>
						<div class="flex items-center">
							<DocumentTextBold class="mr-2 h-4 w-4" />
							{project.name}
						</div>
					</Button>
					<Button
						class="rounded-full"
						variant="ghost"
						size="icon"
						on:click={(e) => {
							e.stopPropagation();
							deleteProject(project.project_id);
						}}
					>
						<DeleteIcon />
					</Button>
				</div>
			{/each}
		</div>
	</div>
</div>
