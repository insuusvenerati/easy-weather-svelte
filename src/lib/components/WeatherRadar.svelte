<script lang="ts">
	export let coords: { lat: string; lon: string } | undefined;
</script>

{#if coords}
	<iframe
		src={`https://www.rainviewer.com/map.html?loc=${coords.lat},${coords.lon},7&oFa=0&oC=0&oU=0&oCS=1&oF=0&oAP=0&c=3&o=83&lm=1&layer=radar&sm=1&sn=1&hu=true`}
		frameborder="0"
		class="w-full h-full rounded"
		allow="fullscreen"
		title="Weather Radar"
	></iframe>
{/if}
