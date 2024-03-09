<script lang="ts">
	let customClass: string = '';
	export { customClass as class };
</script>

<h3 class="text-2xl font-semibold tracking-tight {customClass}" {...$$restProps}>
	<slot />
</h3>
