import { type Editor } from '@tiptap/core';
import { type Node } from 'prosemirror-model';
import { LYRICS_LINE_NODE_NAME } from '$lib/components/novel-editor/extensions/lyrics-line/lyrics-line';

export function isValidUrl(url: string) {
	try {
		new URL(url);
		return true;
	} catch (e) {
		return false;
	}
}

export function getUrlFromString(str: string) {
	if (isValidUrl(str)) return str;
	try {
		if (str.includes('.') && !str.includes(' ')) {
			return new URL(`https://${str}`).toString();
		}
	} catch (e) {
		return null;
	}
}

export function isBrowser() {
	return typeof window !== 'undefined';
}

export function anyify(obj: unknown) {
	return obj as any;
}

export const getPrevText = (editor: Editor, chars: number, offset: number = 0) => {
	let pos = editor.state.selection.from - offset;
	const lines: string[] = [];
	let collectedTextLength = 0;

	const collectTextFromNode = (node: Node) => {
		if (node.type.name === LYRICS_LINE_NODE_NAME) {
			const nodeText = node.textContent;
			const remainingChars = chars - collectedTextLength;

			const sliceLen = Math.min(nodeText.length, remainingChars);

			if (sliceLen > 0) {
				lines.push(nodeText.slice(-sliceLen));
			}

			collectedTextLength += sliceLen;
			return sliceLen;
		}
		return 0; // Return 0 if no text was collected from this node
	};

	// Traverse the document backwards from the current selection
	editor.state.doc.nodesBetween(0, pos, (node) => {
		if (collectedTextLength < chars) {
			const textLength = collectTextFromNode(node);
			pos -= textLength; // Adjust position based on text collected
			if (textLength > 0) {
				// Adjust the position to skip over the collected text
				pos -= node.isBlock ? 1 : 0; // Optionally adjust for block nodes
			}
		} else {
			return false; // Stop iteration if we've collected enough characters
		}
	});

	return lines.join('\n');
};
