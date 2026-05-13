<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import { resolve } from '$app/paths';
	import favicon from '$lib/assets/favicon.ico';
	import { logout } from '$lib/remote/auth.remote.js';
	import './layout.css';

	let { children, data } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>webi wabo 2</title>
</svelte:head>

<nav class="mb-2 flex space-x-5 bg-gray-200 px-4 py-2 text-lg">
	<a href={resolve('/')}>Home</a>
	<a href={resolve('/task')}>Task</a>
	<div class="flex-1">
		{#if data.user}
			<a href={resolve('/user/[slug]', { slug: data.user.id })}>Account</a>
			<button
				onclick={async () => {
					await logout(data.session.id);
					invalidateAll();
				}}
				class="float-right">Logout</button
			>
		{:else}
			<a href={resolve('/user')} class="float-right">Login</a>
		{/if}
	</div>
</nav>

<div class="m-10">
	{@render children()}
</div>
