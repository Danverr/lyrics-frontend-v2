<script context="module" lang="ts">
	import '../app.pcss';
	import { AppBar } from '$lib/components/appbar';
	import { ModeWatcher } from 'mode-watcher';
	import { Toaster } from '$lib/components/ui/sonner';

	export let ssr = false;
</script>

<Toaster />
<ModeWatcher defaultMode={'dark'} />
<AppBar />
<slot />
