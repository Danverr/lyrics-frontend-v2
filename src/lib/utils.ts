import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { cubicOut } from 'svelte/easing';
import type { TransitionConfig } from 'svelte/transition';
import { formatRelative, type FormatRelativeOptions } from 'date-fns';
import { ru } from 'date-fns/locale';

// FOR SHITCODE ONLY

// eslint-disable-next-line @typescript-eslint/no-explicit-any

// eslint-disable-next-line
// @ts-ignore

export type Undef<T> = T | undefined;
export type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;

export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export const noop = () => {
	// do nothing
};

export const asyncNoop = async () => {
	// do nothing
};

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

type FlyAndScaleParams = {
	y?: number;
	x?: number;
	start?: number;
	duration?: number;
};

export const flyAndScale = (
	node: Element,
	params: FlyAndScaleParams = { y: -8, x: 0, start: 0.95, duration: 150 }
): TransitionConfig => {
	const style = getComputedStyle(node);
	const transform = style.transform === 'none' ? '' : style.transform;

	const scaleConversion = (valueA: number, scaleA: [number, number], scaleB: [number, number]) => {
		const [minA, maxA] = scaleA;
		const [minB, maxB] = scaleB;

		const percentage = (valueA - minA) / (maxA - minA);
		return percentage * (maxB - minB) + minB;
	};

	const styleToString = (style: Record<string, number | string | undefined>): string => {
		return Object.keys(style).reduce((str, key) => {
			if (style[key] === undefined) return str;
			return str + `${key}:${style[key]};`;
		}, '');
	};

	return {
		duration: params.duration ?? 200,
		delay: 0,
		css: (t) => {
			const y = scaleConversion(t, [0, 1], [params.y ?? 5, 0]);
			const x = scaleConversion(t, [0, 1], [params.x ?? 0, 0]);
			const scale = scaleConversion(t, [0, 1], [params.start ?? 0.95, 1]);

			return styleToString({
				transform: `${transform} translate3d(${x}px, ${y}px, 0) scale(${scale})`,
				opacity: t
			});
		},
		easing: cubicOut
	};
};

export const firstLetterUpperCase = (text: string) => {
	return text.charAt(0).toUpperCase() + text.slice(1);
};

export function createDebouncedCallback<T extends (...args: any[]) => any>(
	callback: T,
	delay: number = 2000
) {
	let timeout: ReturnType<typeof setTimeout> | null = null;
	return (...args: Parameters<T>) => {
		if (timeout) clearTimeout(timeout);
		timeout = setTimeout(() => callback(...args), delay);
	};
}

export const timeFromNow = (date: string | number | Date, options: FormatRelativeOptions = {}) => {
	return formatRelative(date, new Date(), {
		locale: ru,
		...options
	});
};
