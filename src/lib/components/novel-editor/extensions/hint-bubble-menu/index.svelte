<script lang="ts">
	import { type Editor } from '@tiptap/core';
	import { BubbleMenuPlugin, type BubbleMenuPluginProps } from '@tiptap/extension-bubble-menu';
	import { onDestroy, onMount } from 'svelte';
	import { Card, CardContent } from '$lib/components/ui/card/index.js';
	import { Button } from '$lib/components/ui/button';
	import { api } from '$lib/api';
	import type { WordMeaning } from '$lib/api/api';
	import { type Undef } from '$lib/utils';
	import { P } from '$lib/components/ui/typography';
	import { toast } from 'svelte-sonner';
	import { Skeleton } from '$lib/components/ui/skeleton';
	import { getApiErrorMessage } from '$lib/api/utils';

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
		if (text.length > 3 && !text.includes(' ')) {
			selectedText = text;
			return true;
		}

		return false;
	};

	export let updateDelay: BubbleMenuPluginProps['updateDelay'] = 250;

	let element: HTMLElement;
	let selectedText = '';
	let meaning: Undef<WordMeaning>;
	let meaningPromise: Promise<any>;
	let synonyms: string[] = [];
	let synonymsPromise: Promise<any>;
	let rhymes: string[] = [];
	let rhymesPromise: Promise<any>;
	const SYNONYMS_TO_DISPLAY = 5;
	const RHYMES_TO_DISPLAY = 5;

	if (!editor) {
		throw new Error('Missing editor instance');
	}

	$: if (selectedText) {
		// Загрузка значения
		meaning = undefined;
		meaningPromise = api.words
			.getWordMeanings({ word: selectedText })
			.then((res) => {
				if (res.length) {
					meaning = res[0];
				}
			})
			.catch();

		// Загрузка синонимов
		synonyms = [];
		synonymsPromise = api.words
			.getWordSynonyms({ word: selectedText })
			.then((res) => {
				synonyms = res.slice(0, SYNONYMS_TO_DISPLAY);
			})
			.catch();

		// Загрузка рифм
		rhymes = [];
		rhymesPromise = api.words
			.getWordRhyming({ word: selectedText })
			.then((res) => {
				rhymes = res.slice(0, RHYMES_TO_DISPLAY);
				// rhymes.map((value) => {
				// 	return firstLetterUpperCase(value);
				// });
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

	const copyText = (text: string) => {
		navigator.clipboard.writeText(text);
		toast.success(`Слово "${text}" скопировано`);
	};
</script>

<div class="w-96 overflow-auto" bind:this={element}>
	<Card class="p-5 pt-3">
		<CardContent class="flex flex-col gap-2">
			<div>
				<P class="font-semibold">Значение</P>
				{#await meaningPromise}
					<Skeleton class="mt-1 h-8 w-full" />
				{:then _}
					{#if meaning}
						<P>{meaning.meaning}</P>
					{:else}
						<P>Значение не найдено</P>
					{/if}
				{:catch err}
					<P>{getApiErrorMessage(err)}</P>
				{/await}
			</div>
			<div>
				<P class="mb-1 font-semibold">Синонимы</P>
				<div class="flex flex-wrap gap-2">
					{#await synonymsPromise}
						<Skeleton class="h-8 w-full" />
					{:then _}
						{#if synonyms.length}
							{#each synonyms as synonym}
								<Button variant="outline" on:click={() => replaceText(synonym)}>
									{synonym}
								</Button>
							{/each}
						{:else}
							<P>Синонимы не найдены</P>
						{/if}
					{:catch err}
						<P>{getApiErrorMessage(err)}</P>
					{/await}
				</div>
			</div>
			<div>
				<P class="mb-1 font-semibold">Рифмы</P>
				{#await rhymesPromise}
					<Skeleton class="h-8 w-full" />
				{:then _}
					{#if rhymes.length}
						<div class="flex flex-wrap gap-2">
							{#each rhymes as rhyme}
								<Button variant="outline" on:click={() => copyText(rhyme)}>
									{rhyme}
								</Button>
							{/each}
						</div>
					{:else}
						<P>Рифмы не найдены</P>
					{/if}
				{:catch err}
					<P>{getApiErrorMessage(err)}</P>
				{/await}
			</div>
		</CardContent>
	</Card>
</div>
