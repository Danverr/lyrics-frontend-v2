import { Extension, NodePos } from '@tiptap/core';
import { MarkType, Schema } from 'prosemirror-model';
import { Plugin, PluginKey, Transaction } from 'prosemirror-state';
import { VOWELS_SET } from '$lib/components/novel-editor/extensions/lyrics-line/constants';

const applyMark = (tr: Transaction, schema: Schema, from: number, to: number) => {
	const markType: MarkType = schema.marks.bold;
	return tr.addMark(from, to, markType.create());
};

const removeMark = (tr: Transaction, schema: Schema, from: number, to: number) => {
	const markType: MarkType = schema.marks.bold;
	tr.removeMark(from, to, markType);
};

// Define the extension
const BoldVowelsExtension = Extension.create({
	name: 'boldVowels',

	addProseMirrorPlugins() {
		const schema = this.editor.schema;
		const plugin = new Plugin({
			key: new PluginKey('boldVowels'),
			appendTransaction: (transactions, oldState, newState) => {
				// Check if any transaction has changed the document
				if (!transactions.some((transaction) => transaction.docChanged)) return;

				const tr = newState.tr;

				newState.doc.descendants((node, pos) => {
					if (node.type.name === 'lyricsLine') {
						for (let i = 0; i < node.textContent.length; i++) {
							const from = pos + i + 1;
							const to = from + 1;
							if (VOWELS_SET.has(node.textContent[i])) {
								applyMark(tr, schema, from, to);
							} else {
								removeMark(tr, schema, from, to);
							}
						}
					}
				});

				return tr;
			}
		});

		return [plugin];
	}
});

export default BoldVowelsExtension;
