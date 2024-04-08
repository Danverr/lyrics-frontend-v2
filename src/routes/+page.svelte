<script lang="ts">
	import { H1, H2, P } from '$lib/components/ui/typography';
	import { Player } from '$lib/components/audio-player';
	import { Editor } from '$lib/components/novel-editor';
	import { type Writable, writable } from 'svelte/store';
	import { type ProjectOut } from '$lib/api/api';
	import { onMount } from 'svelte';
	import { Card } from '$lib/components/ui/card';
	import { Ambient } from '$lib/ambient/ambient';
	import { CardDescription, CardHeader, CardTitle } from '$lib/components/ui/card/index.js';
	import { asyncNoop } from '$lib/utils';
	import { Button } from '$lib/components/ui/button';
	import Portal from 'svelte-portal';
	import { FE_AUTH_PAGE } from '$lib/constants';

	const textId = 'demo';
	const DEMO_TIPTAP_TOKEN =
		'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MTI0Mzk4NzMsImlzcyI6Imh0dHBzOi8vbHlyaWNzLWJhY2tlbmQuazhzLTEuc3NsYW5lLnJ1IiwibmJmIjoxNzEyNDM5ODczLCJhdWQiOiJ5a29kNGptNSIsImFsbG93ZWREb2N1bWVudE5hbWVzIjpbImRlbW8iLCJkZW1vMSIsImRlbW8yIiwiZGVtbzMiXSwicmVhZG9ubHlEb2N1bWVudE5hbWVzIjpbXSwiZXhwIjoxNzQzOTc1ODczfQ.hjAe80gGfa_BQDgVvm2JR1YoBA702v_UIgDpu5p724g';
	const MUSIC_URL = 'https://lyrics-ide.storage.yandexcloud.net/Demo%20Track%20-%20132%20BPM.mp3';

	let project: Writable<ProjectOut> = writable({
		name: 'demo',
		description: 'demo',
		project_id: 'demo',
		owner_user_id: '',
		is_owner: true,
		grant_level: null,
		created_at: '',
		updated_at: '',
		texts: [],
		music: {
			url: MUSIC_URL,
			custom_bpm: 132,
			bpm: 132,
			duration_seconds: 150
		}
	});

	onMount(() => {
		let ambient = new Ambient();
		ambient.mount();
	});

	const ctaButtonClick = () => {
		document.location.href = FE_AUTH_PAGE;
	};
</script>

<Portal target="#appBarRight">
	<Button on:click={ctaButtonClick}>Начать пользоваться</Button>
</Portal>

<div class="flex h-screen w-full flex-col items-center justify-center gap-4 p-12">
	<div class="text-center">
		<H1 class="mb-1">Lirix</H1>
		<P class="text-muted-foreground">Онлайн редактор для текстов песен</P>
	</div>
	<div class="min-h-0 [&>*]:h-full [&_#video]:h-full [&_#video]:rounded-xl">
		<video
			data-ambient
			id="video"
			src="https://pico.msk.sslane.ru/-aWchBNU7fv/demo_lyrics_ide.mp4"
			controls
			muted
			preload="auto"
		></video>
	</div>
</div>
<div class="flex min-h-screen w-full flex-col items-center gap-12 p-12">
	<div class="text-center">
		<H2 class="mb-1">Функции и демо</H2>
		<P class="text-muted-foreground">Этот редактор доступен всем посетителям страницы</P>
	</div>
	<div class="flex w-full justify-center gap-16">
		<div class="sticky top-8 flex h-fit w-96 flex-col gap-4">
			<Card>
				<CardHeader>
					<CardTitle>Notion-like редактор</CardTitle><CardDescription>
						Поддерживающий подсчет и выделение гласных букв, подсветку рифм
					</CardDescription>
				</CardHeader>
			</Card>
			<Card>
				<CardHeader>
					<CardTitle>Автодополнение c AI</CardTitle><CardDescription>
						ChatGPT предложит продолжение текста
					</CardDescription>
				</CardHeader>
			</Card>
			<Card>
				<CardHeader>
					<CardTitle>Cовместное редактирование</CardTitle><CardDescription>
						Все изменения синхронизируются в реальном времени между всеми пользователями
					</CardDescription>
				</CardHeader>
			</Card>
		</div>
		<div class="min-h-[500px] max-w-[700px] flex-1">
			{#if $project !== undefined}
				<div class="mb-8">
					<Player {project} onBpmUpdate={asyncNoop} disableDelete={true} />
				</div>
				<Editor documentName={textId} tiptapToken={DEMO_TIPTAP_TOKEN} />
			{/if}
		</div>
	</div>
</div>
