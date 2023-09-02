<script lang="ts">
	export let coords: { lat: number; lon: number } | undefined;
</script>

{#if coords}
	<iframe
		src={`https://www.rainviewer.com/hurricane-map.html?loc=${coords.lat},${coords.lon},6&oFa=0&oC=0&oCS=0&oF=0&oAP=0&layer=sat&hu=1`}
		frameborder="0"
		class="w-full h-full rounded"
		allowfullscreen
		title="Hurricane Radar"
	></iframe>
{/if}
