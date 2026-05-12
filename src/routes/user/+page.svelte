<script lang="ts">
	import SignInForm from './signInForm.svelte';
	import SignUpForm from './signUpForm.svelte';

	let signOption: 'sign up' | 'sign in' = $state('sign in');
</script>

<input type="radio" id="sign-in" value="sign in" bind:group={signOption} />
<label for="sign-in">Sign in</label>
<input type="radio" id="sign-up" value="sign up" bind:group={signOption} />
<label for="sign-up">Sign up</label>

{#if signOption === 'sign in'}
	<SignInForm />
{:else}
	<SignUpForm />
{/if}
