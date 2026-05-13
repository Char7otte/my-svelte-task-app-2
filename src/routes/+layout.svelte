<script lang="ts">
	import { resolve } from '$app/paths';
	import favicon from '$lib/assets/favicon.ico';
	import { logout } from '$lib/remote/user.remote.js';
	import './layout.css';

	let { children, data } = $props();
	$inspect(data);
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
			<form {...logout}>
				<input {...logout.fields.sessionID.as('hidden', data.session.id)} />
				<button>Log out</button>
			</form>
		</div>
	{/if}
</nav>

<div class="m-10">
	{@render children()}
</div>
