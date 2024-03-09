<script lang="ts">
	let customClass: string = '';
	export { customClass as class };
</script>

<p class="leading-7 {customClass}" {...$$restProps}>
	<slot />
</p>
