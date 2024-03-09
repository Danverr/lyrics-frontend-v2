<script lang="ts">
	let customClass: string = '';
	export { customClass as class };
</script>

<h4 class="text-xl font-semibold tracking-tight {customClass}" {...$$restProps}>
	<slot />
</h4>
