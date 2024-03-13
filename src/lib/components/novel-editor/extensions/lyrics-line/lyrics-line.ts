import { Paragraph } from '@tiptap/extension-paragraph';
import { NodePos } from '@tiptap/core';
import './styles.pcss';

const VOWELS_SET = new Set(['а', 'у', 'о', 'и', 'э', 'ы']);

const countVowels = (text: string) => {
	let count = 0;
	for (const ch of text) {
		if (VOWELS_SET.has(ch)) {
			count += 1;
		}
	}
	return count;
};

export const LyricsLine = Paragraph.extend({
	addAttributes() {
		return {
			vowels: 0
		};
	},

	addNodeView() {
		return ({ editor, node, getPos }) => {
			const container = document.createElement('p');
			container.classList.add('lyrics-line');
			const content = document.createElement('span');

			content.innerHTML = node.textContent;
			container.appendChild(content);

			if (typeof getPos === 'function') {
				const nodePos = new NodePos(editor.state.doc.resolve(getPos()), editor);

				if (nodePos.depth === 0) {
					const counter = document.createElement('div');
					counter.classList.add('counter');
					counter.contentEditable = 'false';
					counter.innerHTML = node.attrs.vowels > 0 ? node.attrs.vowels : '';
					container.appendChild(counter);

					editor.on('update', () => {
						this.editor.state.doc.descendants((node, pos) => {
							const nodePos = new NodePos(this.editor.state.doc.resolve(pos), this.editor);
							const count = countVowels(node.textContent);

							if (
								node.type.name === 'paragraph' &&
								nodePos.depth === 0 &&
								node.attrs.vowels !== count
							) {
								this.editor.view.dispatch(
									this.editor.view.state.tr.setNodeMarkup(pos, undefined, {
										vowels: count
									})
								);
							}
						});
					});
				}
			}

			return {
				dom: container,
				contentDOM: content
			};
		};
	}
});
