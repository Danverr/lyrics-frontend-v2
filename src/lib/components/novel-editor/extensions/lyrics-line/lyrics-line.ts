import { Paragraph } from '@tiptap/extension-paragraph';
import './styles.pcss';
import { VOWELS_SET } from '$lib/components/novel-editor/extensions/lyrics-line/constants';

const countVowels = (text: string) => {
	let count = 0;
	for (const ch of text) {
		if (VOWELS_SET.has(ch.toLowerCase())) {
			count += 1;
		}
	}
	return count;
};

export const LyricsLine = Paragraph.extend({
	name: 'lyricsLine',

	addAttributes() {
		return {
			vowels: 0
		};
	},

	onUpdate() {
		this.editor.state.doc.descendants((node, pos) => {
			const count = countVowels(node.textContent);

			if (node.type.name === 'lyricsLine' && node.attrs.vowels !== count) {
				this.editor.view.dispatch(
					this.editor.view.state.tr.setNodeMarkup(pos, undefined, {
						vowels: count
					})
				);
			}
		});
	},

	addNodeView() {
		return ({ editor, node, getPos }) => {
			const container = document.createElement('p');
			container.classList.add('lyricsLine');

			const content = document.createElement('span');
			content.contentEditable = 'true';
			content.innerHTML = node.textContent;
			container.appendChild(content);

			if (typeof getPos === 'function') {
				const counter = document.createElement('div');
				counter.classList.add('counter');
				counter.contentEditable = 'false';
				const vowelsCount = countVowels(node.textContent);
				counter.innerHTML = vowelsCount > 0 ? vowelsCount.toString() : '';
				container.appendChild(counter);
			}

			return {
				dom: container,
				contentDOM: content
			};
		};
	},

	addKeyboardShortcuts() {
		return {
			Enter: () => {
				const selection = this.editor.state.selection;
				const pos = selection.from;
				const resPos = this.editor.state.doc.resolve(pos);
				const parNode = resPos.parent;

				if (!selection.empty) {
					return false;
				}

				if (parNode.type.name === this.name) {
					this.editor.commands.insertContentAt(pos, {
						type: this.name
					});
					return true;
				}

				return false;
			}
		};
	}
});
