import { type Editor, Extension } from '@tiptap/core';
import { Plugin, TextSelection } from 'prosemirror-state';
import { Decoration, DecorationSet } from 'prosemirror-view';
import './styles.pcss';
import { v4 as uuidv4 } from 'uuid';
import { createDebouncedCallback } from '$lib/utils';
import { api } from '$lib/api';
import { getPrevText } from '$lib/components/novel-editor/utils';
import { LYRICS_LINE_NODE_NAME } from '$lib/components/novel-editor/extensions/lyrics-line/lyrics-line';

let triggerAutocomplete = true;

const loaderDots = `
<div class="inline-flex loader-dots w-fit items-center gap-1">
<span class="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground"></span>
<span class="animation-delay-100 h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground"></span>
<span class="animation-delay-200 h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground"></span>
</div>
`;

type AutocompleteStorage = {
	suggestion: string;
	isLoading: boolean;
	isActive: boolean;
};

let currentQueryId: string = '';

const debounceAutocomplete = createDebouncedCallback(async (editor: Editor) => {
	const id = uuidv4();
	currentQueryId = id;

	setAutocomplete(editor, {
		suggestion: '',
		isLoading: true
	});

	let completion = '';

	try {
		const completions = await api.completions.createCompletion({
			text: getPrevText(editor, 1000)
		});
		if (completions.length) {
			completion = completions[0].completion;
			completion = completion.replace(/\n\s*\n/g, '\n');
		}
	} catch (e) {
		// Do nothing
	}

	if (currentQueryId === id) {
		setAutocomplete(editor, {
			suggestion: completion,
			isLoading: false
		});
	}
});

const isSelectionValid = (editor: Editor) => {
	const cursorPos = editor.state.selection.$head;
	const currentNode = cursorPos.node();
	const textAfter = cursorPos.nodeAfter?.text?.trim() ?? '';

	return (
		editor.state.selection.empty &&
		currentNode.type === editor.schema.nodes.lyricsLine &&
		textAfter === ''
	);
};

const handleEditorUpdate = (editor: Editor) => {
	currentQueryId = '';
	setAutocomplete(editor, {
		suggestion: '',
		isLoading: false
	});

	if (isSelectionValid(editor)) {
		debounceAutocomplete(editor);
	}
};

type SetAutocompleteValueType = Partial<Omit<AutocompleteStorage, 'isActive'>>;

export const setAutocomplete = (editor: Editor | undefined, value: SetAutocompleteValueType) => {
	if (editor === undefined) {
		return;
	}

	let isUpdated = false;
	const storage: AutocompleteStorage = editor.storage.autocompletePlugin;

	for (const stringKey of Object.keys(value)) {
		const key = stringKey as keyof SetAutocompleteValueType;
		if (storage[key] !== value[key]) {
			isUpdated = true;
			// eslint-disable-next-line
			// @ts-ignore
			storage[key] = value[key];
		}
	}

	storage.isActive = storage.isLoading || storage.suggestion !== '';
	editor.storage.autocompletePlugin = storage;

	// Hack to update editor
	if (isUpdated) {
		editor.commands.setMeta('triggerAutocomplete', triggerAutocomplete);
		triggerAutocomplete = !triggerAutocomplete;
	}
};

export const AutocompletePlugin = Extension.create({
	name: 'autocompletePlugin',

	addOptions() {
		return {
			className: 'autocomplete'
		};
	},

	addStorage() {
		return {
			suggestion: '',
			isLoading: false,
			isActive: false
		};
	},

	addKeyboardShortcuts() {
		return {
			Tab: () =>
				this.editor
					.chain()
					.focus()
					.command(({ tr, editor }) => {
						const cursorPos = tr.selection.$head.pos;

						if (this.editor.storage.autocompletePlugin.suggestion && isSelectionValid(editor)) {
							const lines = this.editor.storage.autocompletePlugin.suggestion.split('\n');
							let pos = cursorPos;

							for (let i = 0; i < lines.length; i += 1) {
								const line = lines[i];
								if (i == 0) {
									tr.insertText(line);
									pos += line.length;
								} else {
									const node = editor.schema.node(
										LYRICS_LINE_NODE_NAME,
										null,
										editor.schema.text(line)
									);
									tr.insert(pos, node);
									pos += node.nodeSize;
								}
							}

							tr.setSelection(new TextSelection(tr.doc.resolve(pos)));
						}
						return true;
					})
					.run()
		};
	},

	onUpdate() {
		handleEditorUpdate(this.editor);
	},
	onSelectionUpdate() {
		handleEditorUpdate(this.editor);
	},

	addProseMirrorPlugins() {
		return [
			new Plugin({
				state: {
					init() {
						return DecorationSet.empty;
					},
					apply: (transaction) => {
						let decorationSet = DecorationSet.empty;

						const selection = transaction.selection;
						if (!(selection instanceof TextSelection)) {
							return decorationSet;
						}

						const params: AutocompleteStorage = this.editor.storage.autocompletePlugin;
						let textContent = params.suggestion ?? '';
						if (params.isLoading) {
							textContent = loaderDots;
						} else {
							textContent = textContent.replaceAll('\n', '<br/>');
						}

						if (textContent === '') {
							return decorationSet;
						}

						const cursorPos = selection.$head.pos;

						if (isSelectionValid(this.editor)) {
							const suggestionDecoration = Decoration.widget(
								cursorPos,
								() => {
									const parentNode = document.createElement('span');
									parentNode.innerHTML = textContent;
									parentNode.classList.add(this.options.className);
									return parentNode;
								},
								{ side: 1 }
							);

							decorationSet = decorationSet.add(transaction.doc, [suggestionDecoration]);
						}

						return decorationSet;
					}
				},
				props: {
					decorations(state) {
						return this.getState(state);
					}
				}
			})
		];
	}
});
