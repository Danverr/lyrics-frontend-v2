<script lang="ts">
	import './styles.pcss';
	import * as Y from 'yjs';
	import { noop } from '$lib/components/novel-editor/utils.js';
	import { Editor, Extension, InputRule } from '@tiptap/core';
	import type { EditorProps } from '@tiptap/pm/view';
	import ImageResizer from '$lib/components/novel-editor/extensions/image/ImageResizer.svelte';
	import { onMount } from 'svelte';
	import { defaultEditorProps } from './props.js';
	import EditorBubbleMenu from '$lib/components/novel-editor/extensions/bubble-menu/index.svelte';
	import EditorHintBubbleMenu from '$lib/components/novel-editor/extensions/hint-bubble-menu/index.svelte';
	import { Collaboration } from '@tiptap/extension-collaboration';
	import { TiptapCollabProvider } from '@hocuspocus/provider';
	import StarterKit from '@tiptap/starter-kit';
	import HorizontalRule from '@tiptap/extension-horizontal-rule';
	import TiptapLink from '@tiptap/extension-link';
	import TiptapImage from '@tiptap/extension-image';
	import UploadImagesPlugin from '$lib/components/novel-editor/extensions/image/upload-images';
	import UpdatedImage from '$lib/components/novel-editor/extensions/image/updated-image';
	import Placeholder from '@tiptap/extension-placeholder';
	import { AutocompletePlugin } from '$lib/components/novel-editor/extensions/autocomplete/autocomplete';
	import SlashCommand from '$lib/components/novel-editor/extensions/slash-command/slash-command';
	import TiptapUnderline from '@tiptap/extension-underline';
	import TextStyle from '@tiptap/extension-text-style';
	import { Typography } from '@tiptap/extension-typography';
	import { Color } from '@tiptap/extension-color';
	import Highlight from '@tiptap/extension-highlight';
	import TaskList from '@tiptap/extension-task-list';
	import TaskItem from '@tiptap/extension-task-item';
	import { Markdown } from 'tiptap-markdown';
	import { createDebouncedCallback, type Undef } from '$lib/utils';
	import {
		LYRICS_LINE_NODE_NAME,
		LyricsLine
	} from '$lib/components/novel-editor/extensions/lyrics-line/lyrics-line';
	import { api } from '$lib/api';
	import BoldVowelsExtension from '$lib/components/novel-editor/extensions/lyrics-line/bold-vowels';
	import { Skeleton } from '$lib/components/ui/skeleton';
	import { handleApiError } from '$lib/api/utils';

	/**
	 * Document name for a collaboration
	 */
	export let documentName: string;
	/**
	 * Additional classes to add to the editor container.
	 * Defaults to "relative min-h-[500px] w-full max-w-screen-lg border-stone-200 bg-white p-12 px-8 sm:mb-[calc(20vh)] sm:rounded-lg sm:border sm:px-12 sm:shadow-lg".
	 */
	let className = '';
	export { className as class };
	/**
	 * A list of extensions to use for the editor, in addition to the default Novel extensions.
	 * Defaults to [].
	 */
	export let extensions: Extension[] = [];
	/**
	 * Props to pass to the underlying Tiptap editor, in addition to the default Novel editor props.
	 * Defaults to {}.
	 */
	export let editorProps: EditorProps = {};
	/**
	 * A callback function that is called whenever the editor is updated.
	 * Defaults to () => {}.
	 */
	export let onUpdate: (editor?: Editor) => void | Promise<void> = noop;
	/**
	 * A callback function that is called whenever the editor is updated, but only after the defined debounce duration.
	 * Defaults to () => {}.
	 */
	export let onDebouncedUpdate: (editor?: Editor) => void | Promise<void> = noop;
	/**
	 * The duration (in milliseconds) to debounce the onDebouncedUpdate callback.
	 * Defaults to 750.
	 */
	export let debounceDuration = 750;
	/**
	 * Is editor editable after loading
	 * Defaults to true.
	 */
	export let isEditable = true;
	/**
	 * The editor instance. Bind to it to get access to the editor.
	 * @example
	 * <script lang="ts">
	 * 	import { type EditorType, Editor } from 'novel-svelte';
	 * 	let editor: EditorType;
	 * < /script>
	 *
	 * <Editor bind:editor />
	 */
	export let editor: Undef<Editor> = undefined;

	let provider: Undef<TiptapCollabProvider>;
	const doc = new Y.Doc();
	let ready = false;
	let element: Element;

	const defaultExtensions = [
		StarterKit.configure({
			history: false,
			// paragraph: false,
			bulletList: {
				HTMLAttributes: {
					class: 'ml-6 list-disc list-outside' // 'list-disc list-outside leading-3 -mt-2'
				}
			},
			orderedList: {
				HTMLAttributes: {
					class: 'ml-6 list-decimal list-outside' // 'list-decimal list-outside leading-3 -mt-2'
				}
			},
			listItem: {
				HTMLAttributes: {
					class: 'leading-normal'
				}
			},
			blockquote: {
				HTMLAttributes: {
					class: 'mt-6 border-l-2 pl-6 italic'
				}
			},
			codeBlock: {
				HTMLAttributes: {
					class: 'rounded-lg bg-muted p-5 my-4 font-mono font-medium text-sm'
				}
			},
			code: {
				HTMLAttributes: {
					class: 'rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono font-medium text-sm',
					spellcheck: 'false'
				}
			},
			horizontalRule: false,
			dropcursor: {
				width: 3,
				class: 'dropcursor'
			},
			gapcursor: false
		}),
		// patch to fix horizontal rule bug: https://github.com/ueberdosis/tiptap/pull/3859#issuecomment-1536799740
		HorizontalRule.extend({
			addInputRules() {
				return [
					new InputRule({
						find: /^(?:---|—-|___\s|\*\*\*\s)$/,
						handler: ({ state, range }) => {
							const attributes = {};

							const { tr } = state;
							const start = range.from;
							const end = range.to;

							tr.insert(start - 1, this.type.create(attributes)).delete(
								tr.mapping.map(start),
								tr.mapping.map(end)
							);
						}
					})
				];
			}
		}).configure({
			HTMLAttributes: {
				class: 'mt-4 mb-6 border-t bg-muted-foreground'
			}
		}),
		TiptapLink.configure({
			HTMLAttributes: {
				class: 'underline underline-offset-[3px] transition-colors cursor-pointer'
			}
		}),
		TiptapImage.extend({
			addProseMirrorPlugins() {
				return [UploadImagesPlugin()];
			}
		}).configure({
			allowBase64: true,
			HTMLAttributes: {
				class: 'rounded-lg border border-stone-200'
			}
		}),
		UpdatedImage.configure({
			HTMLAttributes: {
				class: 'rounded-lg border border-stone-200'
			}
		}),
		Collaboration.configure({
			document: doc
		}),
		Placeholder.configure({
			placeholder: ({ node, editor }) => {
				if (editor.storage.autocompletePlugin.isActive) {
					return '';
				}
				if (node.type.name === 'heading') {
					return `Заголовок ${node.attrs.level}`;
				}
				return "Нажми '/' для ввода комманд...";
			},
			includeChildren: true
		}),
		SlashCommand,
		TiptapUnderline,
		TextStyle,
		Typography,
		Color,
		Highlight.configure({
			multicolor: true
		}),
		TaskList.configure({
			HTMLAttributes: {
				class: 'not-prose pl-2'
			}
		}),
		TaskItem.configure({
			HTMLAttributes: {
				class: 'flex items-baseline'
			},
			nested: true
		}),
		Markdown.configure({
			html: false,
			transformCopiedText: true
		}),
		AutocompletePlugin,
		LyricsLine,
		BoldVowelsExtension
	];

	const debouncedUpdates = createDebouncedCallback(async ({ editor }) => {
		onDebouncedUpdate(editor);
	}, debounceDuration);

	onMount(() => {
		(async () => {
			try {
				let token = await api.tiptap.getTiptapToken(documentName);

				provider = new TiptapCollabProvider({
					name: documentName,
					appId: 'ykod4jm5',
					token: token.access_token,
					document: doc
				});

				provider.on('synced', () => {
					ready = true;
					editor?.setEditable(isEditable);
				});

				editor = new Editor({
					editable: false,
					element: element,
					onTransaction: () => {
						// force re-render so `editor.isActive` works as expected
						editor = editor;
					},
					autofocus: false,
					extensions: [...defaultExtensions, ...extensions],
					editorProps: {
						...defaultEditorProps,
						...editorProps
					},
					onUpdate: (e) => {
						if (e.editor.isEditable && e.editor.isEmpty) {
							e.editor.commands.insertContent({ type: LYRICS_LINE_NODE_NAME });
						}

						onUpdate(e.editor);
						debouncedUpdates(e);
					}
				});
			} catch (e) {
				handleApiError(e, 'Не удалось загрузить редактор');
			}
		})();

		return () => {
			provider?.destroy();
			editor?.destroy();
		};
	});
</script>

{#if editor && editor.isEditable}
	<EditorBubbleMenu {editor} />
	<EditorHintBubbleMenu {editor} />
{/if}

{#if !ready}
	<Skeleton class="mt-2 h-36 w-full rounded-xl" />
{/if}
<div id="editor" class={className} bind:this={element}>
	<slot />
	{#if editor?.isActive('image')}
		<ImageResizer {editor} />
	{/if}
</div>
