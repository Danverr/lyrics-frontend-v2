<script lang="ts">
	import { onMount } from 'svelte';

	onMount(() => {
		window.YaSendSuggestToken('http://localhost:5173/auth');
	});
</script>

<svelte:head>
	<script
		src="https://yastatic.net/s3/passport-sdk/autofill/v1/sdk-suggest-token-with-polyfills-latest.js"
	></script>
</svelte:head>
