<script lang="ts" context="module">
</script>

<script lang="ts">
	import type { Editor } from '@tiptap/core';
	import { BubbleMenuPlugin, type BubbleMenuPluginProps } from '@tiptap/extension-bubble-menu';
	import { onDestroy, onMount } from 'svelte';
	import LinkSelector from './LinkSelector.svelte';
	import NodeSelector from './NodeSelector.svelte';
	import FormatSelector from './FormatSelector.svelte';

	let element: HTMLElement;

	export let editor: Editor;
	export let tippyOptions: BubbleMenuPluginProps['tippyOptions'] = {
		moveTransition: 'transform 0.15s ease-out',
		placement: 'top'
	};
	export let pluginKey: BubbleMenuPluginProps['pluginKey'] = 'SvelteTiptapBubbleMenu';
	export let shouldShow: BubbleMenuPluginProps['shouldShow'] = ({ editor }) => {
		// don't show if image is selected
		if (editor.isActive('image')) {
			return false;
		}
		return editor.view.state.selection.content().size > 0;
	};
	export let updateDelay: BubbleMenuPluginProps['updateDelay'] = 250;

	if (!editor) {
		throw new Error('Missing editor instance.');
	}

	onMount(() => {
		const plugin = BubbleMenuPlugin({
			pluginKey,
			editor,
			element,
			tippyOptions,
			shouldShow,
			updateDelay
		});

		editor.registerPlugin(plugin);
	});

	onDestroy(() => {
		editor.unregisterPlugin(pluginKey);
	});
</script>

<div
	bind:this={element}
	class="flex w-fit divide-x divide-muted overflow-clip rounded-xl border bg-popover shadow-xl"
>
	<NodeSelector {editor} />
	<LinkSelector {editor} />
	<FormatSelector {editor}></FormatSelector>
	<!--	<ColorSelector {editor} bind:isOpen={$isColorSelectorOpen} />-->
</div>
