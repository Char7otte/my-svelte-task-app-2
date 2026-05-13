<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import { logout } from '$lib/remote/user.remote.js';

	const { data } = $props();
</script>

<h1 class="text-2xl">{data.user.username}</h1>
<h2>Edit profile</h2>
<form>
	<label for="">
		Username:
		<input type="text" />
	</label>
	<label for="">
		Original Password:
		<input type="password" />
	</label>
</form>

<button
	onclick={async () => {
		await logout(data.session.id);
		invalidateAll();
	}}
	class="float-right">Logout</button
>
