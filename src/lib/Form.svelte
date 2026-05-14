<script lang="ts">
	let {
		action,
		children,
		oninput = () => {},
		onchange = () => {},
		enhanceBefore = () => {},
		enhanceAfter = () => {}
	} = $props();
	let isLoading: boolean = $state(false);
	let disabled = $derived(isLoading);
</script>

<form
	//@ts-expect-error implicitly typing props? IMGOODBROPIZZAMOVIE.png
	{...action.enhance(async ({ form, submit }) => {
		enhanceBefore();
		isLoading = true;
		if (await submit()) {
			form.reset();
		}
		isLoading = false;
		enhanceAfter();
	})}
	{onchange}
	{oninput}
>
	<fieldset {disabled}>
		{@render children()}
	</fieldset>
</form>

{#if isLoading}
	<p>Loading...</p>
{/if}
