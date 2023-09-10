<script lang="ts">
	import { goto } from '$app/navigation';
	import { navigating } from '$app/stores';
	import { ProgressRadial } from '@skeletonlabs/skeleton';

	let zipcode = '';
	async function getWeather(event: SubmitEvent) {
		event.preventDefault();
		await goto(`/weather/${zipcode}`);
	}
</script>

<form on:submit={getWeather}>
	<div class="input-group input-group-divider grid-cols-[auto_1fr_auto] max-w-md">
		<div class="input-group-shim">zipcode</div>
		<input
			bind:value={zipcode}
			name="zipcode"
			required
			class="input"
			type="text"
			placeholder="32204"
		/>
		{#if $navigating}
			<ProgressRadial
				width="w-8 m-1"
				stroke={50}
				meter="stroke-primary-500"
				track="stroke-primary-500/30"
			/>
		{:else}
			<button class="variant-filled-secondary">Submit</button>
		{/if}
	</div>
</form>
