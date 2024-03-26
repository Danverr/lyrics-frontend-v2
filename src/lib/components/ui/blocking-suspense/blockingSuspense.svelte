<script lang="ts">
	export let tint = true;
	let className = '';
	export { className as class };

	let loading = false;

	const suspend = (promise: Promise<any>) => {
		loading = true;
		promise.then(() => {
			loading = false;
		});
	};
</script>

<div class="transition-all {loading && tint && 'opacity-75'} {className}">
	<fieldset disabled={loading}>
		<slot {suspend} {loading} />
	</fieldset>
</div>
