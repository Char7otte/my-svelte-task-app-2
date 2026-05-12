<script lang="ts">
	import FormIssues from '$lib/formIssues.svelte';
	import { signUp } from '$lib/remote/user.remote';

	const { email, username, password, confirmPassword } = signUp.fields;
</script>

<form {...signUp} class="m-10 space-y-1" onchange={() => signUp.validate()}>
	<label class="block"
		>Email: <br />
		<input {...email.as('text')} class="border-2 p-1" />
		<FormIssues issues={email.issues()} />
	</label>
	<label class="block"
		>Username: <br />
		<input {...username.as('text')} class="border-2 p-1" />
		<FormIssues issues={username.issues()} />
	</label>
	<label class="block"
		>Password: <br />
		<input {...password.as('password')} class="border-2 p-1" />
		<FormIssues issues={password.issues()} />
	</label>
	<label class="block"
		>Confirm Password: <br />
		<input {...confirmPassword.as('password')} class="border-2 p-1" />
		<FormIssues issues={confirmPassword.issues()} />
	</label>

	<button class="mt-3 block border-2 px-1.5 py-1">Sign up</button>
</form>
