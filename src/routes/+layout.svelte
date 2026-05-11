<script lang="ts">
	import favicon from '$lib/assets/favicon.ico';
	import './layout.css';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>webi wabo 2</title>
</svelte:head>

{@render children()}
