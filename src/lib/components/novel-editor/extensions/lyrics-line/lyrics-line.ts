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

export const LYRICS_LINE_NODE_NAME = 'lyricsLine';

export const LyricsLine = Paragraph.extend({
	name: LYRICS_LINE_NODE_NAME,

	addAttributes() {
		return {
			vowels: 0
		};
	},

	onUpdate() {
		this.editor.state.doc.descendants((node, pos) => {
			const count = countVowels(node.textContent);

			if (node.type.name === LYRICS_LINE_NODE_NAME && node.attrs.vowels !== count) {
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
			container.classList.add(LYRICS_LINE_NODE_NAME);

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
				const currentNode = selection.$head.node();
				const textBefore = selection.$from.nodeBefore?.text ?? '';
				const textAfter = selection.$to.nodeAfter?.text ?? '';

				if (currentNode.type.name === this.name && (textAfter === '' || textBefore === '')) {
					const insertAfter = textAfter === '' && textBefore !== '';
					this.editor
						.chain()
						.deleteSelection()
						.insertContentAt(
							selection.from - (insertAfter ? 0 : 1),
							{
								type: this.name
							},
							{ updateSelection: insertAfter }
						)
						.run();
					return true;
				}

				return false;
			}
		};
	}
});
