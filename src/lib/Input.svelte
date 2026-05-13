<script lang="ts">
	import FormIssues from './formIssues.svelte';
	const { label, type, field } = $props();
</script>

<label class="block"
	>{label}: <br />
	<input {...field.as({ type })} class="border-2 p-1" />
	<FormIssues issues={field.issues()} />
</label>
