<script lang="ts">
	import { resolve } from '$app/paths';
	import favicon from '$lib/assets/favicon.ico';
	import './layout.css';

	let { children, data } = $props();

	function onclick() {
		console.log('Log out clicked');
	}
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>webi wabo 2</title>
</svelte:head>

<nav class="mb-2 flex space-x-5 bg-gray-200 px-4 py-2 text-lg">
	<a href={resolve('/')}>Home</a>
	<a href={resolve('/user')}>User</a>
	{#if data.user}
		<div class="flex flex-1 justify-end">
			<button {onclick}>Log out</button>
		</div>
	{/if}
</nav>

{@render children()}
