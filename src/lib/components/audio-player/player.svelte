<script lang="ts">
	import './styles.pcss';
	import WaveSurfer from 'wavesurfer.js';
	import RegionsPlugin from 'wavesurfer.js/dist/plugins/regions.esm.js';
	import Minimap from 'wavesurfer.js/dist/plugins/minimap.esm.js';
	import TimelinePlugin from 'wavesurfer.js/plugins/timeline';
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
	import type { ProjectOut } from '$lib/api/api';
	import { Skeleton } from '$lib/components/ui/skeleton';
	import HoverPlugin from 'wavesurfer.js/plugins/hover';
	import type { Region } from 'wavesurfer.js/plugins/regions';
	import { createDebouncedCallback } from '$lib/utils';
	import {
		PauseIcon,
		DeleteIcon,
		TrashIcon,
		PlayIcon,
		RepeatIcon,
		MagnetIcon
	} from '$lib/components/ui/icons';
	import { api } from '$lib/api';
	import { handleApiError } from '$lib/api/utils';
	import type { Writable } from 'svelte/store';
	import { toast } from 'svelte-sonner';
	import Dropzone from 'svelte-file-dropzone';
	import { tick } from 'svelte';

	const EPS = 0.000001; // For float numbers comparison

	export let project: Writable<ProjectOut>;
	export let isEditable: boolean = true;
	export let disableDelete: boolean = false;
	export let onBpmUpdate: (bpm: number) => Promise<void>;

	$: bpm = Math.max(1, Math.min($project.music?.custom_bpm ?? $project.music?.bpm ?? 120, 999));
	$: trackTick = 4 * (60 / bpm); // 4 beats or 1 bar
	$: musicUrl = $project.music?.url ?? '';
	$: fileName = musicUrl
		? decodeURIComponent(new URL(musicUrl).pathname.split('/').at(-1) ?? '')
		: 'Неизвестное имя';
	let isPlaying = false;
	let loopEnabled = true;
	let snapEnabled = true;
	let activeRegion: Region | undefined;
	let offset = 0; // Offset to compensate silence in the beginning, sec
	let endOffset = 0.067; // Magic const to compensate latency, sec
	let ws: WaveSurfer;
	let wsBpm: number;
	let wsRegions: RegionsPlugin;
	let wsLoaded = false;
	let transitionStart = 0;
	let mounted = false;

	onMount(() => {
		mounted = true;
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
		if (!musicUrl || !document) {
			return;
		}

		let el = document.querySelector('#waveform');
		if (el) {
			el.innerHTML = '';
		} else {
			return;
		}

		if (wsLoaded === true) {
			wsLoaded = false;
		}

		wsBpm = bpm;
		ws = WaveSurfer.create({
			container: '#waveform',
			waveColor: '#999',
			progressColor: '#ddd',
			url: musicUrl,
			height: 128,
			normalize: true,
			hideScrollbar: false,
			autoScroll: false,
			autoCenter: false,
			plugins: [
				TimelinePlugin.create({
					formatTimeCallback: (sec) => {
						let beat = Math.round(sec / trackTick);
						return beat % 4 == 0 ? beat.toString() : '';
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
			console.log('Transition', new Date().getTime() - transitionStart);
		});
		wsRegions.on('region-out', (region) => {
			if (activeRegion?.id === region.id) {
				if (loopEnabled && isPlaying) {
					transitionStart = new Date().getTime();
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

	$: if (ws && wsRegions) {
		offset;
		endOffset;
		for (let region of wsRegions.getRegions()) {
			regionUpdate(region);
		}
	}

	$: if (musicUrl && mounted) {
		tick().then(() => {
			initWavesurfer();
		});
	}

	$: if (ws && bpm !== wsBpm) {
		handleBpmUpdateDebounced();
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

	const toggleLoop = () => {
		loopEnabled = !loopEnabled;
	};

	const toggleSnap = () => {
		snapEnabled = !snapEnabled;
	};

	const handleFilesSelect = async (e: any) => {
		if (e.detail.acceptedFiles.length !== 0) {
			toast.promise(
				api.music.uploadMusic($project.project_id, { music: e.detail.acceptedFiles[0] }),
				{
					loading: 'Загружаем трек...',
					success: (res) => {
						$project.music = res;
						return 'Трек загружен';
					},
					error: 'Не удалось загрузить файл'
				}
			);
		} else {
			toast.error('Неверный формат файла');
		}
	};

	const deleteMusic = async () => {
		try {
			await api.music.deleteMusic($project.project_id);
			$project.music = null;
		} catch (e) {
			handleApiError(e, 'Не удалось удалить трек');
		}
	};

	const defaultHandler = async (bpm: number) => {
		if (!$project.music) {
			return;
		}

		try {
			await api.music.setMusicBpm($project.project_id, { custom_bpm: bpm });

			if ($project.music) {
				$project.music.custom_bpm = bpm;
			}
		} catch (e) {
			handleApiError(e, 'Не удалось обновить BPM трека');
		}
	};

	const handleBpmUpdate = async () => {
		if (onBpmUpdate) {
			await onBpmUpdate(bpm);
		} else {
			await defaultHandler(bpm);
		}

		initWavesurfer();
	};

	const handleBpmUpdateDebounced = createDebouncedCallback(handleBpmUpdate);
</script>

{#if $project.music?.url}
	<div class="flex flex-col gap-3">
		<div class="relative flex h-7 items-end justify-between">
			<div class="flex h-full gap-1.5">
				<Button class="h-full" variant="outline" size="icon" on:click={playPause}>
					{#if isPlaying}
						<PauseIcon />
					{:else}
						<PlayIcon />
					{/if}
				</Button>
				<Button
					class="h-full"
					variant={loopEnabled ? 'default' : 'outline'}
					size="icon"
					on:click={toggleLoop}
				>
					<RepeatIcon />
				</Button>
				<Button
					class="h-full"
					variant={snapEnabled ? 'default' : 'outline'}
					size="icon"
					on:click={toggleSnap}
				>
					<MagnetIcon />
				</Button>
			</div>
			<div class="absolute-center flex items-center gap-1">
				<P class="text-overflow-ellipsis max-w-80 font-medium">
					{fileName}
				</P>
				{#if !disableDelete}
					<Popover>
						<PopoverTrigger asChild let:builder>
							<Button
								builders={[builder]}
								size="icon"
								class="absolute right-0 translate-x-full"
								variant="ghost"
							>
								<DeleteIcon />
							</Button>
						</PopoverTrigger>
						<PopoverContent class="w-fit p-1.5">
							<PopoverClose>
								<Button size="icon" variant="destructive" on:click={deleteMusic}>
									<TrashIcon />
								</Button>
							</PopoverClose>
						</PopoverContent>
					</Popover>
				{/if}
			</div>
			<div class="flex h-full items-center gap-2">
				<Label class="text-muted-foreground">BPM</Label>
				<Input
					class="m-0 box-border h-full w-12 p-0 text-center"
					type="number"
					value={bpm}
					on:input={(e) => (bpm = Number(e.target.value))}
				/>
			</div>
		</div>
		{#if !wsLoaded}
			<Skeleton class="h-[185px] rounded-xl" />
		{/if}
		<div id="waveform" class={!wsLoaded ? 'hidden' : ''} />
	</div>
{:else}
	<Dropzone
		disabled={!isEditable}
		accept="audio/*"
		multiple={false}
		disableDefaultStyles
		containerClasses="flex flex-col items-center justify-center bg-background h-[237px] border-2 rounded-xl text-foreground border-dashed transition-all"
		on:drop={handleFilesSelect}
	>
		<P class="text-muted-foreground">
			Перетащите сюда файл или нажмите на область для загрузки трека
		</P>
	</Dropzone>
{/if}
