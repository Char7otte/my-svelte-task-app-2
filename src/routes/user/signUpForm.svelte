<script lang="ts">
	import Input from '$lib/Input.svelte';
	import { signUp } from '$lib/remote/auth.remote';

	const { email, username, password, confirmPassword } = signUp.fields;
	let isLoading: boolean = $state(false);
</script>

<form
	{...signUp.enhance(async ({ form, submit }) => {
		try {
			isLoading = true;
			if (await submit()) {
				form.reset();
			}
		} catch (e) {
			throw new Error('Something went wrong in sign up form', { cause: e });
		} finally {
			isLoading = false;
		}
	})}
	class="space-y-1"
>
	<Input label="Email" type="email" field={email} />
	<Input label="Username" type="text" field={username} />
	<Input label="Password" type="password" field={password} />
	<Input label="Confirm Password" type="password" field={confirmPassword} />
	<button class="mt-3 block border-2 px-1.5 py-1">Sign up</button>
</form>

{#if isLoading}
	<p>Signing in...</p>
{/if}
