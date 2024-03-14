<script lang="ts">
	import { onMount } from 'svelte';
	import { FE_PROJECTS_PAGE } from '$lib/api/constants';

	onMount(() => {
		document.location.href = FE_PROJECTS_PAGE;
	});
</script>
