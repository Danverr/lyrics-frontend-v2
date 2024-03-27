<script>
	import { ThemeToggle } from '$lib/components/theme-toggle';
</script>

<div class="fixed left-0 right-0 top-0 flex h-[68px] w-full justify-between p-4">
	<div id="appBarLeft" class="flex items-center justify-start gap-1"></div>
	<div id="appBarCenter" class="absolute-center flex items-center justify-center gap-1"></div>
	<div id="appBarRight" class=" flex flex-row-reverse items-center gap-1">
		<ThemeToggle />
	</div>
</div>
<div id="leftSidebar" class="sidebar left-0"></div>
<div id="rightSidebar" class="sidebar right-0"></div>

<style>
	.sidebar {
		@apply fixed top-0 z-[99999] mt-[68px] max-w-80;
		max-height: calc(100vh - 68px);
	}
</style>
