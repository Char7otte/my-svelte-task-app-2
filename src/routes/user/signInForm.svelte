<script lang="ts">
	import Input from '$lib/Input.svelte';
	import { signIn } from '$lib/remote/auth.remote';

	const { email, password } = signIn.fields;
</script>

<form {...signIn} class="space-y-1" onchange={() => signIn.validate()}>
	<Input label="Email" type="email" field={email} />
	<Input label="Password" type="password" field={password} />
	<button class="mt-3 block border-2 px-1.5 py-1">Sign in</button>
</form>
