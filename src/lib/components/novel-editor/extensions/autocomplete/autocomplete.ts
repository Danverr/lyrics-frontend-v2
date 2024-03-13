import { type Editor, Extension } from '@tiptap/core';
import { Plugin, TextSelection } from 'prosemirror-state';
import { Decoration, DecorationSet } from 'prosemirror-view';
import './styles.pcss';

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
					.command(({ tr }) => {
						const cursorPos = tr.selection.$head.pos;
						const currentNode = tr.selection.$head.node();
						const nextNode = tr.doc.nodeAt(cursorPos);

						if (
							this.editor.storage.autocompletePlugin.suggestion &&
							currentNode.content.size > 0 &&
							(!nextNode || nextNode.isBlock)
						) {
							tr.insertText(this.editor.storage.autocompletePlugin.suggestion);
							setAutocomplete(this.editor, {
								suggestion: '',
								loading: false
							});
						}
						return true;
					})
					.run()
		};
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
