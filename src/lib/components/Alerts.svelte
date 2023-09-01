<script lang="ts">
	import type { Alert } from '$lib/types/weather';

	export let alerts: Alert[];
</script>

<div class="snap-x scroll-px-4 snap-mandatory scroll-smooth flex gap-4 overflow-x-auto px-4 py-10">
	{#each alerts as alert}
		<div class="alert">
			<p class="alert-title">{alert.title}</p>
			<p>Regions: {alert.regions.join(', ')}</p>
			<p>Severity: {alert.severity}</p>
			<p>Time: {new Date(alert.time * 1000).toLocaleString()}</p>
			<p>Expires: {new Date(alert.expires * 1000).toLocaleString()}</p>
			<p>Description: {alert.description}</p>
			<p><a class="underline" href={alert.uri} target="_blank">More info</a></p>
		</div>
	{/each}
</div>

<style>
	.alert {
		border: 1px solid red;
		padding: 10px;
		margin-bottom: 10px;
	}
	.alert-title {
		font-weight: bold;
	}
</style>
