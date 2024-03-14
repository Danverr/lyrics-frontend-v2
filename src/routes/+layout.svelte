<script context="module" lang="ts">
	import '../app.pcss';
	import { AppOverlay } from '$lib/components/app-overlay';
	import { ModeWatcher } from 'mode-watcher';
	import { Toaster } from '$lib/components/ui/sonner';

	export let ssr = false;
</script>

<Toaster />
<ModeWatcher defaultMode={'dark'} />
<AppOverlay />
<slot />
