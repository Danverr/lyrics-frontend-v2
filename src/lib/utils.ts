import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { cubicOut } from 'svelte/easing';
import type { TransitionConfig } from 'svelte/transition';
import { v4 as uuidv4 } from 'uuid';

// FOR SHITCODE ONLY
// eslint-disable-next-line @typescript-eslint/no-explicit-any

export type Undef<T> = T | undefined;
export type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;

export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

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

const lastCalledMap = new Map();

export const useDelay = <T extends (...args: any[]) => any>(
	callback: T,
	timeout: number = 2000
) => {
	const id = uuidv4();
	return (...args: Parameters<T>) => {
		lastCalledMap.set(id, new Date());
		setTimeout(async () => {
			if (
				lastCalledMap.get(id) !== undefined &&
				new Date().getTime() - lastCalledMap.get(id).getTime() >= timeout
			) {
				lastCalledMap.delete(id);
				callback(...args);
			}
		}, timeout);
	};
};

export const firstLetterUpperCase = (text: string) => {
	return text.charAt(0).toUpperCase() + text.slice(1);
};
