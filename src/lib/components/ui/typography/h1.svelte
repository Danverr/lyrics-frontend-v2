<script lang="ts">
	let customClass: string = '';
	export { customClass as class };
</script>

<h1 class="text-4xl font-bold tracking-tight lg:text-5xl {customClass}" {...$$restProps}>
	<slot />
</h1>
