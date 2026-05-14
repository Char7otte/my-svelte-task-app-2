<script lang="ts">
	import PatchPasswordForm from './patchPasswordForm.svelte';
	import PatchUsernameForm from './patchUsernameForm.svelte';

	const { data } = $props();
</script>

<h1 class="text-2xl">Viewing: {data.selectedUser.username}</h1>

{#if data.isUser}
	<PatchUsernameForm {data} />
	<PatchPasswordForm {data} />
{/if}

<!-- <Input label="Current Password" type="password" field={password} />
<Input label="New Password" type="password" field={newPassword} />
<Input
	label="Confirm New Password"
	type="password"
	field={confirmNewPassword}
/> -->
