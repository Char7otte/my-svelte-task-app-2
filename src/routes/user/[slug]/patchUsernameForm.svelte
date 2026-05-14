<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import Form from '$lib/Form.svelte';
	import Input from '$lib/Input.svelte';
	import { patchUserUsername } from '$lib/remote/user.remote';

	const { data } = $props();
	const { id, username } = patchUserUsername.fields;
	let isEditing: boolean = $state(false);
</script>

<Form
	oninput={() => patchUserUsername.validate()}
	action={patchUserUsername}
	enhanceAfter={() => {
		isEditing = false;
		invalidateAll();
	}}
>
	<input {...id.as('hidden', data.user.id)} />
	<Input
		label="Username"
		type="email"
		field={username}
		placeholder={data.user.username}
		value={data.user.username}
		disabled={!isEditing}
	>
		{#if !isEditing}
			<button type="button" onclick={() => (isEditing = true)}>Edit</button>
		{:else}
			<button>Change</button>
		{/if}
	</Input>
</Form>
