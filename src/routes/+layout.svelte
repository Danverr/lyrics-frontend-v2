<script context="module" lang="ts">
	import { ModeWatcher } from 'mode-watcher';
	import { ThemeToggle } from '../lib/components/theme-toggle';
	import '../app.pcss';

	export let ssr = false;
</script>

<ModeWatcher defaultMode={'dark'} />
<ThemeToggle />
<slot />
