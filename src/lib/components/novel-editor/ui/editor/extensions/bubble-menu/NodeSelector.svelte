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
		CheckSquare
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
			name: 'Text',
			icon: TextIcon,
			command: () => editor.chain().focus().toggleNode('paragraph', 'paragraph').run(),
			// I feel like there has to be a more efficient way to do this – feel free to PR if you know how!
			isActive:
				editor.isActive('paragraph') &&
				!editor.isActive('bulletList') &&
				!editor.isActive('orderedList')
		},
		{
			name: 'Heading 1',
			icon: Heading1,
			command: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
			isActive: editor.isActive('heading', { level: 1 })
		},
		{
			name: 'Heading 2',
			icon: Heading2,
			command: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
			isActive: editor.isActive('heading', { level: 2 })
		},
		{
			name: 'Heading 3',
			icon: Heading3,
			command: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
			isActive: editor.isActive('heading', { level: 3 })
		},
		{
			name: 'To-do List',
			icon: CheckSquare,
			command: () => editor.chain().focus().toggleTaskList().run(),
			isActive: editor.isActive('taskItem')
		},
		{
			name: 'Bullet List',
			icon: ListOrdered,
			command: () => editor.chain().focus().toggleBulletList().run(),
			isActive: editor.isActive('bulletList')
		},
		{
			name: 'Numbered List',
			icon: ListOrdered,
			command: () => editor.chain().focus().toggleOrderedList().run(),
			isActive: editor.isActive('orderedList')
		},
		{
			name: 'Quote',
			icon: TextQuote,
			command: () =>
				editor.chain().focus().toggleNode('paragraph', 'paragraph').toggleBlockquote().run(),
			isActive: editor.isActive('blockquote')
		},
		{
			name: 'Code',
			icon: Code,
			command: () => editor.chain().focus().toggleCodeBlock().run(),
			isActive: editor.isActive('codeBlock')
		}
	];

	$: activeItem = items.filter((item) => item.isActive).pop() ?? {
		name: 'Multiple'
	};
</script>

<Popover>
	<PopoverTrigger asChild let:builder>
		<Button
			builders={[builder]}
			variant="ghost"
			class="flex h-full items-center gap-1 whitespace-nowrap rounded-none p-2 pl-3 text-sm font-medium hover:bg-accent active:bg-accent"
		>
			<span>{activeItem?.name}</span>
			<ChevronDown class="h-4 w-4" />
		</Button>
	</PopoverTrigger>
	<PopoverContent class="z-[9999] flex w-44 flex-col p-1">
		{#each items as item, index (index)}
			<PopoverClose>
				<Button
					variant="ghost"
					class="h-8 w-full justify-between px-2 py-1"
					on:click={() => {
						item.command();
					}}
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
