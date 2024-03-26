<script lang="ts">
	import { Sun, Moon } from '$lib/components/ui/icons';
	import { Button } from '$lib/components/ui/button';

	import { toggleMode } from 'mode-watcher';
</script>

<Button on:click={toggleMode} variant="ghost" size="icon">
	<Sun
		class="h-4 w-4 rotate-0 scale-100 outline-none transition-all dark:-rotate-90 dark:scale-0"
	/>
	<Moon
		class="absolute h-4 w-4 rotate-90 scale-0 outline-none transition-all dark:rotate-0 dark:scale-100"
	/>
	<span class="sr-only">Toggle theme</span>
</Button>
