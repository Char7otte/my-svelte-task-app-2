<script lang="ts">
	import FormIssues from './formIssues.svelte';
	const {
		label,
		type,
		field,
		value = '',
		placeholder = '',
		children = null,
		disabled = false
	} = $props();
</script>

<label class="block"
	>{label}: <br />
	<input
		{...field.as({ type })}
		class="border-2 p-1"
		{value}
		{placeholder}
		{disabled}
	/>
	{@render children?.()}
	<FormIssues issues={field.issues()} />
</label>
