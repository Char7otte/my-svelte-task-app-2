<script lang="ts">
	const { issues } = $props();
</script>

{#each issues as i, index (index)}
	<span class="text-sm text-red-600">{i.message}</span>
{/each}
