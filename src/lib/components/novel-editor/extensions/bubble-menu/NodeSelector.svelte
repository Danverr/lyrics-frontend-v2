<script lang="ts">
	import type { Editor } from '@tiptap/core';
	import {
		Check,
		ChevronDown,
		Heading1,
		Heading2,
		Heading3,
		TextQuote,
		ListOrdered,
		TextIcon,
		Code,
		CheckSquare,
		Feather
	} from 'lucide-svelte';
	import {
		PopoverContent,
		Popover,
		PopoverTrigger,
		PopoverClose
	} from '$lib/components/ui/popover';
	import { Button } from '$lib/components/ui/button';

	export let editor: Editor;

	$: items = [
		{
			name: 'Текст',
			icon: TextIcon,
			command: () => editor.chain().focus().toggleNode('paragraph', 'paragraph').run(),
			isActive:
				editor.isActive('paragraph') &&
				!editor.isActive('bulletList') &&
				!editor.isActive('orderedList')
		},
		{
			name: 'Строка песни',
			icon: Feather,
			command: () => editor.chain().focus().toggleNode('paragraph', 'lyricsLine').run(),
			isActive: editor.isActive('lyricsLine')
		},
		{
			name: 'Заголовок 1',
			icon: Heading1,
			command: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
			isActive: editor.isActive('heading', { level: 1 })
		},
		{
			name: 'Заголовок 2',
			icon: Heading2,
			command: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
			isActive: editor.isActive('heading', { level: 2 })
		},
		{
			name: 'Заголовок 3',
			icon: Heading3,
			command: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
			isActive: editor.isActive('heading', { level: 3 })
		},
		{
			name: 'Марк. список',
			icon: ListOrdered,
			command: () => editor.chain().focus().toggleBulletList().run(),
			isActive: editor.isActive('bulletList')
		},
		{
			name: 'Нум. список',
			icon: ListOrdered,
			command: () => editor.chain().focus().toggleOrderedList().run(),
			isActive: editor.isActive('orderedList')
		},
		{
			name: 'Чеклист',
			icon: CheckSquare,
			command: () => editor.chain().focus().toggleTaskList().run(),
			isActive: editor.isActive('taskItem')
		},
		{
			name: 'Цитата',
			icon: TextQuote,
			command: () =>
				editor.chain().focus().toggleNode('paragraph', 'paragraph').toggleBlockquote().run(),
			isActive: editor.isActive('blockquote')
		},
		{
			name: 'Код',
			icon: Code,
			command: () => editor.chain().focus().toggleCodeBlock().run(),
			isActive: editor.isActive('codeBlock')
		}
	];

	$: activeItem = items.filter((item) => item.isActive).pop() ?? {
		name: 'Разные'
	};
</script>

<Popover>
	<PopoverTrigger>
		<Button
			variant="ghost"
			class="flex h-full items-center gap-1 whitespace-nowrap rounded-none p-2 pl-3 text-sm font-medium hover:bg-accent active:bg-accent"
		>
			<span>{activeItem?.name}</span>
			<ChevronDown class="h-4 w-4" />
		</Button>
	</PopoverTrigger>
	<PopoverContent class="flex w-44 flex-col p-1">
		{#each items as item, index (index)}
			<PopoverClose>
				<Button
					variant="ghost"
					class="h-8 w-full justify-between px-2 py-1"
					on:click={item.command}
				>
					<div class="flex items-center space-x-2">
						<div class="rounded-sm border border-muted-foreground p-1">
							<svelte:component this={item.icon} class="h-3 w-3" />
						</div>
						<p class="text-sm font-normal">{item.name}</p>
					</div>
					{#if activeItem.name === item.name}
						<Check class="h-4 w-4" />
					{/if}
				</Button>
			</PopoverClose>
		{/each}
	</PopoverContent>
</Popover>
