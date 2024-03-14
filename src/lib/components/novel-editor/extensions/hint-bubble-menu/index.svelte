<script lang="ts">
	import { type Editor } from '@tiptap/core';
	import { BubbleMenuPlugin, type BubbleMenuPluginProps } from '@tiptap/extension-bubble-menu';
	import { onDestroy, onMount } from 'svelte';
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card/index.js';
	import { Button } from '$lib/components/ui/button';
	import { api } from '$lib/api';
	import type { WordMeaning } from '$lib/api/api';
	import type { Undef } from '$lib/utils';

	export let editor: Editor;

	export let tippyOptions: BubbleMenuPluginProps['tippyOptions'] = {
		moveTransition: 'transform 0.15s ease-out',
		placement: 'bottom'
	};

	export let pluginKey: BubbleMenuPluginProps['pluginKey'] = 'SvelteTiptapHintBubbleMenu';

	export let shouldShow: BubbleMenuPluginProps['shouldShow'] = ({ editor }) => {
		if (!editor.isActive('lyricsLine')) {
			return false;
		}
		const { from, to } = editor.view.state.selection;

		let text = editor.state.doc.textBetween(from, to).trim();
		if (text.length > 1 && !text.includes(' ')) {
			selectedText = text;
			return true;
		}

		return false;
	};

	export let updateDelay: BubbleMenuPluginProps['updateDelay'] = 250;

	let element: HTMLElement;
	let selectedText = '';
	let meaning: Undef<WordMeaning>;
	let synonyms: string[] = [];
	const SYNONYMS_TO_DISPLAY = 5;

	if (!editor) {
		throw new Error('Missing editor instance');
	}

	$: if (selectedText) {
		meaning = undefined;
		synonyms = [];

		// Загрузка значения
		api.words
			.getWordMeanings({ word: selectedText })
			.then((res) => {
				if (res.length) {
					meaning = res[0];
				}
			})
			.catch();

		// Загрузка синонимов
		api.words
			.getWordSynonyms({ word: selectedText })
			.then((res) => {
				synonyms = res.slice(0, SYNONYMS_TO_DISPLAY);
			})
			.catch();
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

	const replaceText = (text: string) => {
		const selection = editor.view.state.selection;
		editor
			.chain()
			.focus()
			.insertContentAt(
				{
					from: selection.from,
					to: selection.to
				},
				text
			)
			.run();
	};
</script>

<div class="w-[343px]" bind:this={element}>
	{#if meaning && synonyms.length}
		<Card class="p-5">
			<CardHeader>
				<CardTitle tag="h4" class="leading-normal">{meaning.meaning}</CardTitle>
			</CardHeader>
			<CardContent>
				<div class="flex flex-wrap gap-2">
					{#each synonyms as synonym (synonym)}
						<Button variant="outline" on:click={() => replaceText(synonym)}>
							{synonym}
						</Button>
					{/each}
				</div>
			</CardContent>
		</Card>
	{/if}
</div>
