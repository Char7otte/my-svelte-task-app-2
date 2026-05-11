<script lang="ts">
	import { createUser } from '$lib/remote/user.remote';
	import { email } from 'zod';

	// const { email, username, password, confirmPassword } = createUser.fields;
</script>

<form {...createUser}>
	<input {...createUser.fields.email.as('email')} class="border-2" />
	<button>asdf</button>
</form>

<!-- <form class="m-10 space-y-1" {...createUser}>
	<label class="block"
		>Email:
		<input {...email.as('email')} class="block border-2 p-1" />
	</label>
	<label class="block"
		>Username:
		<input {...username.as('text')} class="block border-2 p-1" />
	</label>
	<label class="block"
		>Password:
		<input {...password.as('password')} class="block border-2 p-1" />
	</label>
	<label class="block"
		>Confirm Password:
		<input {...confirmPassword.as('password')} class="block border-2 p-1" />
	</label>
	<button class="mt-3 block border-2 px-1.5 py-1">Sign up</button>
</form> -->
<!-- <label for="email" class="block">Email:</label>
	<input type="email" name="email" id="email" class="border-2" />
	<label for="username" class="block">Username:</label>
	<input type="text" name="username" id="username" class="border-2" />
	<label for="password" class="block">Password:</label>
	<input type="password" name="password" id="password" class="border-2" />
	<label for="confirm-password" class="block">Confirm password:</label>
	<input type="password" name="confirm-password" id="confirm-password" class="border-2" /> -->
