<script lang="ts">
	import Form from '$lib/Form.svelte';
	import Input from '$lib/Input.svelte';
	import { patchUserUsername } from '$lib/remote/user.remote';
	import { invalidateAll } from '$app/navigation';

	const { data } = $props();
	const { id, username } = patchUserUsername.fields;
	let isEditing: boolean = $state(false);
</script>

<h1 class="inline text-2xl">{data.selectedUser.username}</h1>

{#if data.isUser}
	<button>Edit</button>
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
			{/if}</Input
		>
	</Form>
{/if}

<!-- <Input label="Current Password" type="password" field={password} />
<Input label="New Password" type="password" field={newPassword} />
<Input
	label="Confirm New Password"
	type="password"
	field={confirmNewPassword}
/> -->
