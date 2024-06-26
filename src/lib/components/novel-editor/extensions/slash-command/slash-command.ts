import { Editor, Extension, type Range } from '@tiptap/core';
import Suggestion from '@tiptap/suggestion';

import tippy from 'tippy.js';

import {
	CheckSquare,
	Code,
	Heading1,
	Heading2,
	Heading3,
	List,
	ListOrdered,
	Text,
	TextQuote,
	Feather
} from 'lucide-svelte';
import CommandList from './SlashCommand.svelte';
import type { SvelteComponent } from 'svelte';
import { LYRICS_LINE_NODE_NAME } from '$lib/components/novel-editor/extensions/lyrics-line/lyrics-line';

export interface CommandItemProps {
	title: string;
	description: string;
	icon: SvelteComponent;
}

interface CommandProps {
	editor: Editor;
	range: Range;
}

const Command = Extension.create({
	name: 'slash-command',
	addOptions() {
		return {
			suggestion: {
				char: '/',
				command: ({ editor, range, props }: { editor: Editor; range: Range; props: any }) => {
					props.command({ editor, range });
				}
			}
		};
	},
	addProseMirrorPlugins() {
		return [
			Suggestion({
				editor: this.editor,
				...this.options.suggestion
			})
		];
	}
});

const getSuggestionItems = ({ query }: { query: string }) => {
	return [
		{
			title: 'Строка песни',
			description: 'Как текст, только лучше',
			searchTerms: ['p', 'параграф', 'текст', 'песня', 'lyrics'],
			icon: Feather,
			command: ({ editor, range }: CommandProps) => {
				editor
					.chain()
					.focus()
					.deleteRange(range)
					.toggleNode('paragraph', LYRICS_LINE_NODE_NAME)
					.run();
			}
		},
		{
			title: 'Текст',
			description: 'Просто обычный текст',
			searchTerms: ['p', 'параграф', 'текст'],
			icon: Text,
			command: ({ editor, range }: CommandProps) => {
				editor.chain().focus().deleteRange(range).toggleNode('paragraph', 'paragraph').run();
			}
		},
		{
			title: 'Заголовок 1',
			description: 'Большой заголовок',
			searchTerms: ['h1', 'заголовок', 'большой'],
			icon: Heading1,
			command: ({ editor, range }: CommandProps) => {
				editor.chain().focus().deleteRange(range).setNode('heading', { level: 1 }).run();
			}
		},
		{
			title: 'Заголовок 2',
			description: 'Средний заголовок',
			searchTerms: ['h2', 'подзаголовок', 'средний'],
			icon: Heading2,
			command: ({ editor, range }: CommandProps) => {
				editor.chain().focus().deleteRange(range).setNode('heading', { level: 2 }).run();
			}
		},
		{
			title: 'Заголовок 3',
			description: 'Маленький заголовок',
			searchTerms: ['h3', 'подзаголовок', 'маленький'],
			icon: Heading3,
			command: ({ editor, range }: CommandProps) => {
				editor.chain().focus().deleteRange(range).setNode('heading', { level: 3 }).run();
			}
		},
		{
			title: 'Маркированный список',
			description: 'Список с точками',
			searchTerms: [],
			icon: List,
			command: ({ editor, range }: CommandProps) => {
				editor.chain().focus().deleteRange(range).toggleBulletList().run();
			}
		},
		{
			title: 'Нумерованый список',
			description: 'Список с числами',
			searchTerms: [],
			icon: ListOrdered,
			command: ({ editor, range }: CommandProps) => {
				editor.chain().focus().deleteRange(range).toggleOrderedList().run();
			}
		},
		{
			title: 'Чеклист',
			description: 'Он же todo лист',
			searchTerms: ['todo', 'туду', 'задача', 'список'],
			icon: CheckSquare,
			command: ({ editor, range }: CommandProps) => {
				editor.chain().focus().deleteRange(range).toggleTaskList().run();
			}
		},
		{
			title: 'Цитата',
			description: 'Для важных цитат из инсты',
			searchTerms: ['blockquote'],
			icon: TextQuote,
			command: ({ editor, range }: CommandProps) =>
				editor
					.chain()
					.focus()
					.deleteRange(range)
					.toggleNode('paragraph', 'paragraph')
					.toggleBlockquote()
					.run()
		},
		{
			title: 'Код',
			description: 'Зачем?.. Это не VSCode, чел',
			searchTerms: [''],
			icon: Code,
			command: ({ editor, range }: CommandProps) =>
				editor.chain().focus().deleteRange(range).toggleCodeBlock().run()
		}
		// {
		// 	title: 'Image',
		// 	description: 'Upload an image from your computer',
		// 	searchTerms: ['photo', 'picture', 'media'],
		// 	// icon: <ImageIcon size={18} />,
		// 	command: ({ editor, range }: CommandProps) => {
		// 		editor.chain().focus().deleteRange(range).run();
		// 		// upload image
		// 		const input = document.createElement('input');
		// 		input.type = 'file';
		// 		input.accept = 'image/*';
		// 		input.onchange = async () => {
		// 			if (input.files?.length) {
		// 				const file = input.files[0];
		// 				const pos = editor.view.state.selection.from;
		// 				// startImageUpload(file, editor.view, pos);
		// 			}
		// 		};
		// 		input.click();
		// 	}
		// }
	].filter((item) => {
		if (typeof query === 'string' && query.length > 0) {
			const search = query.toLowerCase();
			return (
				item.title.toLowerCase().includes(search) ||
				item.description.toLowerCase().includes(search) ||
				(item.searchTerms && item.searchTerms.some((term: string) => term.includes(search)))
			);
		}
		return true;
	});
};

export const updateScrollView = (container: HTMLElement, item: HTMLElement) => {
	const containerHeight = container.offsetHeight;
	const itemHeight = item ? item.offsetHeight : 0;

	const top = item.offsetTop;
	const bottom = top + itemHeight;

	if (top < container.scrollTop) {
		container.scrollTop -= container.scrollTop - top + 5;
	} else if (bottom > containerHeight + container.scrollTop) {
		container.scrollTop += bottom - containerHeight - container.scrollTop + 5;
	}
};

const renderItems = () => {
	let component: CommandList | null = null;
	let popup: any | null = null;

	return {
		onStart: (props: { editor: Editor; clientRect: DOMRect }) => {
			// component = new SvelteRenderer(CommandList, {
			// 	props,
			// 	editor: props.editor
			// });

			// component.dom;
			const el = document.createElement('div');
			component = new CommandList({
				target: el,
				props: props as any
			});

			popup = (tippy as any)('body', {
				getReferenceClientRect: props.clientRect,
				appendTo: () => document.body,
				content: el,
				showOnCreate: true,
				interactive: true,
				trigger: 'manual',
				placement: 'bottom-start'
			});
		},
		onUpdate: (props: { editor: Editor; clientRect: DOMRect }) => {
			component?.$set(props);

			popup &&
				popup[0].setProps({
					getReferenceClientRect: props.clientRect
				});
		},
		onKeyDown: (props: { event: KeyboardEvent }) => {
			if (props.event.key === 'Escape') {
				popup?.[0].hide();

				return true;
			}

			// return component?.ref?.onKeyDown(props);
		},
		onExit: () => {
			popup?.[0].destroy();
			// component?.destroy();
			component?.$destroy();
		}
	};
};

const SlashCommand = Command.configure({
	suggestion: {
		items: getSuggestionItems,
		render: renderItems
	}
});

export default SlashCommand;
