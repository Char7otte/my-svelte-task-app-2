<script lang="ts">
	const { data } = $props();
</script>

{#if data.user}
	<p>Hello, {data.user.username}</p>
{/if}
