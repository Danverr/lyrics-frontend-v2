<script context="module" lang="ts">
	export interface BubbleMenuItem {
		name: string;
		command: () => void;
		icon: typeof BoldIcon;
	}
</script>

<script lang="ts">
	import { BoldIcon, CodeIcon, ItalicIcon, StrikethroughIcon, UnderlineIcon } from 'lucide-svelte';
	import type { Editor } from '@tiptap/core';
	import { Button } from '$lib/components/ui/button';

	export let editor: Editor;

	const items: BubbleMenuItem[] = [
		{
			name: 'bold',
			command: () => editor.chain().focus().toggleBold().run(),
			icon: BoldIcon
		},
		{
			name: 'italic',
			command: () => editor.chain().focus().toggleItalic().run(),
			icon: ItalicIcon
		},
		{
			name: 'underline',
			command: () => editor.chain().focus().toggleUnderline().run(),
			icon: UnderlineIcon
		},
		{
			name: 'strike',
			command: () => editor.chain().focus().toggleStrike().run(),
			icon: StrikethroughIcon
		},
		{
			name: 'code',
			command: () => editor.chain().focus().toggleCode().run(),
			icon: CodeIcon
		}
	];
</script>

<div class="flex">
	{#each items as item, index (index)}
		<Button
			on:click={item.command}
			variant="ghost"
			class="rounded-none p-2 {index === items.length - 1 && 'pr-3'} {editor.isActive(item.name) &&
				'!text-blue-500'}"
		>
			<svelte:component this={item.icon} class="h-4 w-4" />
		</Button>
	{/each}
</div>
