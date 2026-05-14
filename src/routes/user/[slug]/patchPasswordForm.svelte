<script lang="ts">
	import Form from '$lib/Form.svelte';
	import Input from '$lib/Input.svelte';
	import { patchUserPassword } from '$lib/remote/user.remote';

	const { data } = $props();

	const { id, password, newPassword, confirmNewPassword } =
		patchUserPassword.fields;
	let isEditing: boolean = $state(false);
</script>

<Form action={patchUserPassword}>
	<input {...id.as('hidden', data.user.id)} />
	<fieldset disabled={!isEditing}>
		<Input label="Current Password" type="password" field={password}></Input>
		<Input label="New Password" type="password" field={newPassword}></Input>
		<Input
			label="Confirm New Password"
			type="password"
			field={confirmNewPassword}
		></Input>
	</fieldset>
	{#if !isEditing}
		<button type="button" onclick={() => (isEditing = true)}>Edit</button>
	{:else}
		<button>Change</button>
	{/if}
</Form>
