<script>
	import { ThemeToggle } from '$lib/components/theme-toggle';
</script>

<div class="fixed top-0 z-[9999] flex w-screen justify-between p-4">
	<div id="appBarLeft" class="flex items-center justify-start gap-1"></div>
	<div id="appBarCenter" class="absolute-center flex items-center justify-center gap-1"></div>
	<div id="appBarRight" class="flex flex-row-reverse items-center gap-1">
		<ThemeToggle />
	</div>
</div>
