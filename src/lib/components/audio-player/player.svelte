<script lang="ts">
	import './styles.pcss';
	import WaveSurfer from 'wavesurfer.js';
	import RegionsPlugin from 'wavesurfer.js/dist/plugins/regions.esm.js';
	import Minimap from 'wavesurfer.js/dist/plugins/minimap.esm.js';
	import TimelinePlugin from 'wavesurfer.js/plugins/timeline';
	import PauseIcon from '~icons/akar-icons/pause';
	import PlayIcon from '~icons/akar-icons/play';
	import RepeatIcon from '~icons/solar/repeat-bold';
	import MagnetIcon from '~icons/solar/magnet-line-duotone';
	import DeleteIcon from '~icons/typcn/delete';
	import UndoIcon from '~icons/solar/undo-left-round-linear';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { onMount } from 'svelte';
	import ZoomPlugin from 'wavesurfer.js/plugins/zoom';
	import { P } from '$lib/components/ui/typography';
	import {
		PopoverContent,
		PopoverClose,
		Popover,
		PopoverTrigger
	} from '$lib/components/ui/popover';
	import type { MusicOut } from '$lib/api/api';
	import { Skeleton } from '$lib/components/ui/skeleton';
	import HoverPlugin from 'wavesurfer.js/plugins/hover';
	import type { Region } from 'wavesurfer.js/plugins/regions';
	import { useDelay } from '$lib/utils/useDelay';

	const EPS = 0.000001; // For float numbers comparison

	export let music: MusicOut;
	export let onDelete: () => void;
	export let onBpmChange: (bpm: number) => void;

	$: bpm = music.custom_bpm ?? music.bpm ?? 120;
	$: trackTick = (4 * 60) / bpm; // 4 beats in seconds
	$: fileName = decodeURIComponent(new URL(music.url).pathname.split('/').at(-1) ?? '');
	let isPlaying = false;
	let loopEnabled = true;
	let snapEnabled = true;
	let activeRegion: Region | undefined;
	let offset = 0; // Offset to compensate silence in the beginning, sec
	let endOffset = 0.067; // Magic const to compensate latency, sec
	let ws: WaveSurfer;
	let wsRegions: RegionsPlugin;
	let wsLoaded = false;
	let wsBpm = bpm;
	let bpmHandler = useDelay(
		async () => {
			if (ws && wsBpm !== bpm) {
				initWavesurfer();
			}
		},
		'',
		1000
	);

	onMount(() => {
		initWavesurfer();
	});

	const extractOffset = (audioData: number[], duration: number) => {
		const minValue = 0.01;
		const scale = duration / audioData.length;

		for (let i = 0; i < audioData.length; i++) {
			if (audioData[i] >= minValue) {
				return scale * Math.max(i - 1, 0);
			}
		}

		return 0;
	};

	const initWavesurfer = () => {
		wsLoaded = false;
		document.querySelector('#waveform').innerHTML = '';

		wsBpm = bpm;
		ws = WaveSurfer.create({
			container: '#waveform',
			waveColor: '#999',
			progressColor: '#ddd',
			url: music.url,
			height: 128,
			normalize: true,
			hideScrollbar: false,
			autoScroll: false,
			autoCenter: false,
			plugins: [
				TimelinePlugin.create({
					formatTimeCallback: (sec: number) => {
						// let beat = Math.round(sec / msPerBeat);
						// return beat % 4 == 0 ? beat.toString() : '';
						return '';
					},
					primaryLabelSpacing: 4,
					secondaryLabelSpacing: 1,
					timeInterval: trackTick
				}),
				Minimap.create({
					height: 20,
					waveColor: '#999',
					progressColor: '#ddd',
					normalize: true,
					dragToSeek: true
				}),
				ZoomPlugin.create({
					deltaThreshold: 5,
					scale: 0.25
				}),
				HoverPlugin.create({})
			]
		});

		ws.on('decode', (duration) => {
			const decodedData = ws.getDecodedData();
			if (decodedData) {
				offset = extractOffset(decodedData.getChannelData(0), duration);
				console.log('OFFSET FOUND:', offset);
			}
		});

		ws.on('ready', () => {
			wsLoaded = true;
		});

		wsRegions = ws.registerPlugin(RegionsPlugin.create());

		wsRegions.enableDragSelection({
			color: '#CC8C3469'
		});

		wsRegions.on('region-updated', (region) => {
			regionUpdate(region);
		});
		wsRegions.on('region-created', (region) => {
			for (let reg of wsRegions.getRegions()) {
				if (reg.id !== region.id) {
					reg.remove();
				}
			}
			regionUpdate(region);
		});

		wsRegions.on('region-in', (region) => {
			activeRegion = region;
		});
		wsRegions.on('region-out', (region) => {
			if (activeRegion?.id === region.id) {
				if (loopEnabled && isPlaying) {
					ws.setTime(activeRegion.start);
				} else {
					activeRegion = undefined;
				}
			}
		});

		wsRegions.on('region-clicked', (region, e) => {
			e.stopPropagation();
			loopEnabled = true;
			activeRegion = region;
			ws.setTime(region.start);
			region.setOptions({ color: 'rgba(208,126,14,0.41)' });
		});
		wsRegions.on('region-double-clicked', (region, e) => {
			e.stopPropagation();
			activeRegion = undefined;
			pause();
			region.remove();
		});

		ws.on('finish', () => {
			isPlaying = false;
		});
	};

	const nearestBeat = (sec: number) => {
		let time = Math.round(sec / trackTick) * trackTick + offset;
		return Math.min(Math.max(time, 0), ws.getDuration());
	};

	const regionUpdate = (region: Region) => {
		if (snapEnabled) {
			let start = nearestBeat(region.start);
			let end = nearestBeat(region.end);

			if (end - start < EPS) {
				region.remove();
				activeRegion = undefined;
				return;
			}

			region.setOptions({
				start: start,
				end: end - endOffset
			});
		}

		activeRegion = region;
	};

	// $: if (ws) {
	// 	bpm;
	// 	initWavesurfer();
	// }

	$: if (ws && wsRegions) {
		offset;
		endOffset;
		for (let region of wsRegions.getRegions()) {
			regionUpdate(region);
		}
	}

	$: {
		bpmHandler();
		if (bpm !== music.custom_bpm) {
			onBpmChange(bpm);
		}
	}

	const play = () => {
		isPlaying = true;
		ws.play();
	};

	const pause = () => {
		isPlaying = false;
		ws.pause();
	};

	const playPause = () => {
		isPlaying = !isPlaying;
		ws.playPause();
	};

	const resetBpm = () => {
		bpm = music.bpm ?? 120;
		music.custom_bpm = null;
	};

	const toggleLoop = () => {
		loopEnabled = !loopEnabled;
	};

	const toggleSnap = () => {
		snapEnabled = !snapEnabled;
	};
</script>

<div class="flex flex-col gap-4">
	<div class="relative flex h-9 items-end justify-between">
		<div class="flex w-32 items-end gap-2">
			<div>
				<Label class="text-muted-foreground">BPM</Label>
				<Input
					type="number"
					class="w-full"
					value={bpm}
					on:input={(e) => (bpm = Number(e.target.value))}
				/>
			</div>
			<Button variant="outline" size="icon" class="shrink-0" on:click={resetBpm}>
				<UndoIcon />
			</Button>
		</div>
		<div class="absolute-center flex items-center gap-1">
			<P class="font-medium">
				{fileName}
			</P>
			<Popover>
				<PopoverTrigger asChild let:builder>
					<Button builders={[builder]} size="icon" class="rounded-full" variant="ghost">
						<DeleteIcon />
					</Button>
				</PopoverTrigger>
				<PopoverContent class="flex w-fit flex-col gap-2 rounded-xl">
					<P>Удалить трек из проекта?</P>
					<PopoverClose class="flex w-full content-stretch gap-2">
						<Button class="flex-1" variant="destructive" on:click={onDelete}>Да</Button>
						<Button class="flex-1">Нет</Button>
					</PopoverClose>
				</PopoverContent>
			</Popover>
		</div>
		<div class="flex gap-2">
			<Button variant="outline" size="icon" on:click={playPause}>
				{#if isPlaying}
					<PauseIcon />
				{:else}
					<PlayIcon />
				{/if}
			</Button>
			<Button variant={loopEnabled ? 'default' : 'outline'} size="icon" on:click={toggleLoop}>
				<RepeatIcon />
			</Button>
			<Button variant={snapEnabled ? 'default' : 'outline'} size="icon" on:click={toggleSnap}>
				<MagnetIcon />
			</Button>
		</div>
	</div>
	{#if !wsLoaded}
		<Skeleton class="h-[185px] rounded-xl" />
	{/if}
	<div id="waveform" class={!wsLoaded ? 'hidden' : ''} />
</div>
