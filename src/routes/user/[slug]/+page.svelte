<script lang="ts">
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
