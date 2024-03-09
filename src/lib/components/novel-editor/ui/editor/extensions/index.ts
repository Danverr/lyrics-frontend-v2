import { InputRule } from '@tiptap/core';
import { Color } from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import HorizontalRule from '@tiptap/extension-horizontal-rule';
import TiptapImage from '@tiptap/extension-image';
import TiptapLink from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import TaskItem from '@tiptap/extension-task-item';
import TaskList from '@tiptap/extension-task-list';
import TextStyle from '@tiptap/extension-text-style';
import TiptapUnderline from '@tiptap/extension-underline';
import StarterKit from '@tiptap/starter-kit';
import { Markdown } from 'tiptap-markdown';
import UploadImagesPlugin from './image/upload-images.js';
import SlashCommand from './slash-command/slash-command.js';
import UpdatedImage from './image/updated-image.js';
import { Typography } from '@tiptap/extension-typography';

export const defaultExtensions = [
	StarterKit.configure({
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
			color: '#DBEAFE',
			width: 4
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
	Placeholder.configure({
		placeholder: ({ node }: any) => {
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
	})
];
