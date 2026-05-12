<script lang="ts">
	import FormIssues from '$lib/formIssues.svelte';
	import { signIn } from '$lib/remote/user.remote';

	const { email, password } = signIn.fields;
</script>

<form {...signIn} class="space-y-1" onchange={() => signIn.validate()}>
	<label class="block"
		>Email: <br />
		<input {...email.as('email')} class="border-2 p-1" />
		<FormIssues issues={email.issues()} />
	</label>
	<label class="block"
		>Password: <br />
		<input {...password.as('password')} class="border-2 p-1" />
		<FormIssues issues={password.issues()} />
	</label>
	<button class="mt-3 block border-2 px-1.5 py-1">Sign in</button>
</form>
