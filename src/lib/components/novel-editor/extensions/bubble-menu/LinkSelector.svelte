<script lang="ts">
	import { cn, getUrlFromString } from '$lib/components/novel-editor/utils.js';
	import type { Editor } from '@tiptap/core';
	import { Check, Trash } from 'lucide-svelte';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import {
		Popover,
		PopoverContent,
		PopoverTrigger,
		PopoverClose
	} from '$lib/components/ui/popover';

	export let editor: Editor;
	let inputValue = editor.getAttributes('link').href ?? '';

	const setLink = () => {
		const url = getUrlFromString(inputValue);
		url && editor.chain().focus().setLink({ href: url }).run();
	};

	const removeLink = () => {
		editor.chain().focus().unsetLink().run();
	};

	const onInputKeydown = (e: KeyboardEvent) => {
		if (e.key == 'Enter') {
			if (!editor.getAttributes('link').href) {
				setLink();
			}
		}
	};
</script>

<Popover>
	<PopoverTrigger>
		<Button
			variant="ghost"
			class="flex h-full items-center space-x-2 rounded-none px-3 py-1.5 text-sm font-medium"
		>
			<p class="text-base">↗</p>
			<p
				class={cn('underline decoration-stone-400 underline-offset-4', {
					'text-blue-500': editor.isActive('link')
				})}
			>
				Ссылка
			</p>
		</Button>
	</PopoverTrigger>
	<PopoverContent class="flex gap-1 overflow-clip p-0">
		<Input
			autofocus
			bind:value={inputValue}
			on:keydown={onInputKeydown}
			type="text"
			placeholder="Введите ссылку"
			class="no-border border-none"
		/>
		<PopoverClose>
			{#if editor.getAttributes('link').href}
				<Button variant="destructive" on:click={removeLink} class="rounded-none">
					<Trash class="h-4 w-4" />
				</Button>
			{:else}
				<Button variant="ghost" on:click={setLink} class="rounded-none">
					<Check class="h-4 w-4" />
				</Button>
			{/if}
		</PopoverClose>
	</PopoverContent>
</Popover>
