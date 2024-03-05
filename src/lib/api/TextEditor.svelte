<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { Editor } from '@tiptap/core';
	import StarterKit from '@tiptap/starter-kit';
	import { TiptapCollabProvider } from '@hocuspocus/provider';
	import { Collaboration } from '@tiptap/extension-collaboration';
	import * as Y from 'yjs';

	let element: HTMLElement;
	let editor: Editor;
	let provider: TiptapCollabProvider;
	const doc = new Y.Doc();

	onMount(() => {
		provider = new TiptapCollabProvider({
			name: '123', // any identifier - all connections sharing the same identifier will be synced
			appId: 'ykod4jm5', // replace with YOUR_APP_ID
			token:
				'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE3MDc2NTczNTUsIm5iZiI6MTcwNzY1NzM1NSwiZXhwIjoxNzA3NzQzNzU1LCJpc3MiOiJodHRwczovL2Nsb3VkLnRpcHRhcC5kZXYiLCJhdWQiOiJ5a29kNGptNSJ9.Ahi3Ym2VCmzWA_-Byv7i6qLf_tk9MWTz24kFPcT5Slk', // replace with your JWT
			document: doc
		});

		editor = new Editor({
			element: element,
			extensions: [
				StarterKit.configure({
					history: false // important because history will now be handled by Y.js
				}),
				Collaboration.configure({
					document: doc
				})
			],
			content: '<p>Hello World! 🌍️ </p>',
			onTransaction: () => {
				// force re-render so `editor.isActive` works as expected
				editor = editor;
			}
		});
	});

	onDestroy(() => {
		editor?.destroy();
		provider?.destroy();
	});
</script>

{#if editor}
	<button
		on:click={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
		class:active={editor.isActive('heading', { level: 1 })}
	>
		H1
	</button>
	<button
		on:click={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
		class:active={editor.isActive('heading', { level: 2 })}
	>
		H2
	</button>
	<button
		on:click={() => editor.chain().focus().setParagraph().run()}
		class:active={editor.isActive('paragraph')}
	>
		P
	</button>
{/if}

<div bind:this={element} />

<style>
	button.active {
		background: black;
		color: white;
	}
</style>
