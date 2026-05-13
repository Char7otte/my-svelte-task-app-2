<script lang="ts">
	import Input from "$lib/Input.svelte";

	const { data } = $props();
</script>

<h1 class="text-2xl">{data.selectedUser.username}</h1>

{#if data.isUser}
	<form>
	<Input label="Username" type="email" field={} />
	<Input label="Current Password" type="password" field={} />
	<Input label="New Password" type="password" field={} />
	<Input label="Confirm New Password" type="password" field={} />
		<button type="button">Edit</button>
	</form>
{/if}
