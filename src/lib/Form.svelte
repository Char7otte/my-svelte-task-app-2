<script lang="ts">
	let { action, children } = $props();
	let isLoading: boolean = $state(false);
	let disabled = $derived(isLoading);
</script>

<form
	//@ts-expect-error implicitly typing props? IMGOODBROPIZZAMOVIE.png
	{...action.enhance(async ({ form, submit }) => {
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
>
	<fieldset {disabled}>
		{@render children()}
	</fieldset>
</form>

{#if isLoading}
	<p>Loading...</p>
{/if}
