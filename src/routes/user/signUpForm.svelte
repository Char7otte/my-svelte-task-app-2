<script lang="ts">
	import Form from '$lib/Form.svelte';
	import Input from '$lib/Input.svelte';
	import { signUp } from '$lib/remote/auth.remote';

	const { email, username, password, confirmPassword } = signUp.fields;
</script>

<Form action={signUp}>
	<Input label="Email" type="email" field={email} />
	<Input label="Username" type="text" field={username} />
	<Input label="Password" type="password" field={password} />
	<Input label="Confirm Password" type="password" field={confirmPassword} />
	<button class="mt-3 block border-2 px-1.5 py-1">Sign up</button>
</Form>
