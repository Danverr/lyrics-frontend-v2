<script lang="ts">
	import { onMount } from 'svelte';
	import { FE_AUTH_PAGE } from '$lib/api/constants';

	onMount(() => {
		window.YaSendSuggestToken(FE_AUTH_PAGE);
	});
</script>

<svelte:head>
	<script
		src="https://yastatic.net/s3/passport-sdk/autofill/v1/sdk-suggest-token-with-polyfills-latest.js"
	></script>
</svelte:head>
