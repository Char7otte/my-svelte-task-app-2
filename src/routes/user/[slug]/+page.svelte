<script lang="ts">
	import Form from '$lib/Form.svelte';
	import Input from '$lib/Input.svelte';
	import { patchUserUsername } from '$lib/remote/user.remote';

	const { data } = $props();
	const { id, username } = patchUserUsername.fields;
	let isEditting: boolean = $state(false);
</script>

<h1 class="inline text-2xl">{data.selectedUser.username}</h1>

{#if data.isUser}
	<button>Edit</button>
	<Form action={patchUserUsername}>
		<input {...id.as('hidden', data.user.id)} />
		<Input
			label="Username"
			type="email"
			field={username}
			placeholder={data.user.username}
			value={data.user.username}
			disabled={!isEditting}
		>
			{#if !isEditting}
				<button type="button" onclick={() => (isEditting = true)}>Edit</button>
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
