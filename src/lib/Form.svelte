<script lang="ts">
	let { action, children } = $props();
	let isLoading: boolean = $state(false);
	let disabled = $derived(isLoading);
</script>

<form
	//@ts-expect-error implicitly typing props? IMGOODBROPIZZAMOVIE.png
	{...action.enhance(async ({ form, submit }) => {
		// No try catch is needed here since
		// any errors will be handled by the remote form's trycatch.
		isLoading = true;
		if (await submit()) {
			form.reset();
		}
		isLoading = false;
	})}
>
	<fieldset {disabled}>
		{@render children()}
	</fieldset>
</form>

{#if isLoading}
	<p>Loading...</p>
{/if}
