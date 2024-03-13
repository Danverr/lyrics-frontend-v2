import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { Editor } from '@tiptap/core';

export const noop = () => {
	// do nothing
};

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

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

export function createDebouncedCallback<T extends (...args: any[]) => any>(
	callback: T,
	delay: number
) {
	let timeout: ReturnType<typeof setTimeout> | null = null;
	return (...args: Parameters<T>) => {
		if (timeout) clearTimeout(timeout);
		timeout = setTimeout(() => callback(...args), delay);
	};
}

export function anyify(obj: unknown) {
	return obj as any;
}

export const getPrevText = (
	editor: Editor,
	{
		chars,
		offset = 0
	}: {
		chars: number;
		offset?: number;
	}
) => {
	// for now, we're using textBetween for now until we can figure out a way to stream markdown text
	// with proper formatting: https://github.com/steven-tey/novel/discussions/7
	return editor.state.doc.textBetween(
		Math.max(0, editor.state.selection.from - chars),
		editor.state.selection.from - offset,
		'\n'
	);
	// complete(editor.storage.markdown.getMarkdown());
};
