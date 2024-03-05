<script lang="ts">
	export let href: string;
</script>

<a {href} class="font-medium text-primary underline underline-offset-4" {...$$restProps}>
	<slot />
</a>
