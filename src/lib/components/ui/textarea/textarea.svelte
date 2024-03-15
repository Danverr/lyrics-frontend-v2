<script lang="ts">
	import type { HTMLTextareaAttributes } from 'svelte/elements';
	import { cn } from '$lib/utils';
	import type { TextareaEvents } from '.';
	import { onMount } from 'svelte';

	type $$Props = HTMLTextareaAttributes | { autoresize: boolean };
	type $$Events = TextareaEvents;

	let className: $$Props['class'] = undefined;
	export { className as class };

	export let value: $$Props['value'] = undefined;

	export let autoresize = false;

	let elem: HTMLTextAreaElement;

	onMount(() => {
		if (autoresize) {
			elem.style.overflowY = 'hidden';
			elem.style.resize = 'none';
			elem.rows = 1;
			onInput();
		}
	});

	const onInput = () => {
		if (autoresize === true) {
			elem.style.height = 'auto';
			elem.style.height = `${elem.scrollHeight}px`;
		}
	};
</script>

<textarea
	bind:this={elem}
	class={cn(
		'flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
		className
	)}
	bind:value
	on:blur
	on:change
	on:click
	on:focus
	on:keydown
	on:keypress
	on:keyup
	on:mouseover
	on:mouseenter
	on:mouseleave
	on:paste
	on:input
	on:input={onInput}
	{...$$restProps}
/>
