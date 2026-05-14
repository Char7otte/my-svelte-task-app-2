<script lang="ts">
	import Input from '$lib/Input.svelte';
	import { signIn } from '$lib/remote/auth.remote';

	const { email, password } = signIn.fields;
	let isLoading: boolean = $state(false);
</script>

<form
	{...signIn.enhance(async ({ form, submit }) => {
		try {
			isLoading = true;
			if (await submit()) {
				form.reset();
			}
		} catch (e) {
			throw new Error('Something went wrong in sign in form', { cause: e });
		} finally {
			isLoading = false;
		}
	})}
	class="space-y-1"
>
	<Input label="Email" type="email" field={email} />
	<Input label="Password" type="password" field={password} />
	<button class="mt-3 block border-2 px-1.5 py-1">Sign in</button>
</form>

{#if isLoading}
	<p>Signing in...</p>
{/if}
