import { type Editor, Extension } from '@tiptap/core';
import { Plugin, TextSelection } from 'prosemirror-state';
import { Decoration, DecorationSet } from 'prosemirror-view';
import './styles.pcss';
import { v4 as uuidv4 } from 'uuid';
import { createDebouncedCallback } from '$lib/utils';
import { api } from '$lib/api';
import { getPrevText } from '$lib/components/novel-editor/utils';

let triggerAutocomplete = true;

const loaderDots = `
<span class="inline-flex loader-dots w-fit items-center gap-1">
<span class="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground"></span>
<span class="animation-delay-100 h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground"></span>
<span class="animation-delay-200 h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground"></span>
</span>
`;

type AutocompleteStorage = {
	suggestion: string;
	loading: boolean;
};

let currentQueryId: string = '';

const debounceAutocomplete = createDebouncedCallback(async (editor: Editor) => {
	const id = uuidv4();
	currentQueryId = id;

	setAutocomplete(editor, {
		suggestion: '',
		loading: true
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
			loading: false
		});
	}
});

const handleEditorUpdate = (editor: Editor) => {
	currentQueryId = '';
	setAutocomplete(editor, {
		suggestion: '',
		loading: false
	});
	debounceAutocomplete(editor);
};

export const setAutocomplete = (
	editor: Editor | undefined,
	value: Partial<AutocompleteStorage>
) => {
	if (editor === undefined) {
		return;
	}

	let isUpdated = false;

	for (const key in editor.storage.autocompletePlugin) {
		if (key in value && editor.storage.autocompletePlugin[key] !== (value as any)[key]) {
			isUpdated = true;
			editor.storage.autocompletePlugin[key] = (value as any)[key];
		}
	}

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
			loading: false
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
						const currentNode = tr.selection.$head.node();
						const nextNode = tr.doc.nodeAt(cursorPos);

						if (
							this.editor.storage.autocompletePlugin.suggestion &&
							currentNode.content.size > 0 &&
							(!nextNode || nextNode.isBlock)
						) {
							const lines = this.editor.storage.autocompletePlugin.suggestion.split('\n');
							let pos = cursorPos;

							for (let i = 0; i < lines.length; i += 1) {
								const line = lines[i];
								if (i == 0) {
									tr.insertText(line);
									pos += line.length;
								} else {
									const node = editor.schema.node('lyricsLine', null, editor.schema.text(line));
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
						if (params.loading) {
							textContent = loaderDots;
						} else {
							textContent = textContent.replaceAll('\n', '<br/>');
						}

						if (textContent === '') {
							return decorationSet;
						}

						const cursorPos = selection.$head.pos;
						const currentNode = selection.$head.node();
						const nextNode = transaction.doc.nodeAt(cursorPos);

						if (currentNode.content.size > 0 && (!nextNode || nextNode.isBlock)) {
							const suggestionDecoration = Decoration.widget(
								cursorPos,
								() => {
									const parentNode = document.createElement('span');

									// Create a span for the suggestion
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
