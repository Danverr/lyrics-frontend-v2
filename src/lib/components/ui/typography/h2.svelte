<script lang="ts">
	let customClass: string = '';
	export { customClass as class };
</script>

<h2 class="text-3xl font-semibold tracking-tight {customClass}" {...$$restProps}>
	<slot />
</h2>
