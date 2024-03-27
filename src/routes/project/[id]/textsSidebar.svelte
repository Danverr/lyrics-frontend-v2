<script lang="ts">
	import Portal from 'svelte-portal';
	import { Button } from '$lib/components/ui/button/index.js';
	import { PlusIcon, DeleteIcon, CheckIcon, MenuIcon } from '$lib/components/ui/icons';
	import { Textarea } from '$lib/components/ui/textarea/index.js';
	import { P } from '$lib/components/ui/typography/index.js';
	import type { ProjectOut, TextVariantCompact } from '$lib/api/api';
	import { api } from '$lib/api';
	import { toast } from 'svelte-sonner';
	import { createDebouncedCallback } from '$lib/utils';
	import type { Writable } from 'svelte/store';
	import { handleApiError } from '$lib/api/utils';
	import { Toggle } from '$lib/components/ui/toggle';

	export let project: Writable<ProjectOut>;
	export let isEditable: boolean;
	export let textNamePlaceholder: string;
	export let activeText: Writable<TextVariantCompact>;
	export let isOpen = false;

	const handleProjectNameUpdate = createDebouncedCallback(async () => {
		try {
			await api.projects.updateProject($project.project_id, { name: $project.name });
			toast.success('Новое название проекта сохранено');
		} catch (e) {
			handleApiError(e, 'Не удалось обновить название проекта');
		}
	}, 1000);

	const addText = async () => {
		try {
			let text = await api.texts.createText({ project_id: $project.project_id });
			$project.texts?.push(text);
			$activeText = text;
		} catch (e) {
			handleApiError(e, 'Не удалось создать вариант текста');
		}
	};

	const deleteText = async (textId: string) => {
		try {
			await api.texts.deleteText(textId);
			$project.texts = $project.texts?.filter((text) => text.text_id !== textId);
			if ($project.texts?.length && $activeText.text_id === textId) {
				$activeText = $project.texts[0];
			}
		} catch (e) {
			handleApiError(e, 'Не удалось удалить вариант текста');
		}
	};

	const toggleOpen = () => {
		isOpen = !isOpen;
	};
</script>

<Portal target="#appBarLeft">
	<Button variant="ghost" size="icon" on:click={toggleOpen}>
		<MenuIcon />
	</Button>
</Portal>

<Portal target="#leftSidebar">
	{#if isOpen}
		<div class="rounded-r-xl border border-l-0 bg-background p-4 pr-2 shadow-lg">
			<Textarea
				wrap="soft"
				readonly={isEditable ? null : true}
				autoresize={true}
				on:keydown={handleProjectNameUpdate}
				class="no-border mb-2 h-9 w-full rounded-none p-0 pl-6 text-xl font-bold tracking-tight"
				bind:value={$project.name}
			/>
			{#key $activeText}
				<div class="-mx-2 max-h-[450px] overflow-y-scroll px-2">
					{#each $project.texts ?? [] as text (text.text_id)}
						<div class="flex w-full">
							<Button
								variant="ghost"
								class="-ml-2 flex-1 overflow-hidden pl-2 text-left font-normal"
								on:click={() => ($activeText = text)}
							>
								<div class="mr-2 h-4 w-4 flex-shrink-0">
									{#if $activeText.text_id === text.text_id}
										<CheckIcon class="h-4 w-4" />
									{/if}
								</div>
								<P class="text-overflow-ellipsis flex-1">
									{!text.name ? textNamePlaceholder : text.name}
								</P>
							</Button>
							{#if isEditable}
								<Button
									class="ml-auto shrink-0"
									variant="ghost"
									size="icon"
									on:click={() => deleteText(text.text_id)}
								>
									<DeleteIcon />
								</Button>
							{/if}
						</div>
					{/each}
				</div>
			{/key}
			{#if isEditable}
				<Button
					variant="ghost"
					class="muted-opacity -mx-2 mt-2 w-full justify-start px-2"
					on:click={addText}
				>
					<PlusIcon class="mr-2 h-4 w-4" />Новый текст
				</Button>
			{/if}
		</div>
	{/if}
</Portal>
