<script lang="ts">
	export let coords: { lat: number; lon: number };
</script>

<div class="card p-4">
	<header class="card-header text-2xl font-bold mb-4">Hurricane Radar</header>
	<iframe
		src={`https://www.rainviewer.com/hurricane-map.html?loc=${coords.lat},${coords.lon},6&oFa=0&oC=0&oCS=0&oF=0&oAP=0&layer=sat&hu=1`}
		frameborder="0"
		class="w-full rounded lg:h-96"
		allowfullscreen
		title="Hurricane Radar"
	></iframe>
</div>
