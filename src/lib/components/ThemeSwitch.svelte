<script lang="ts">
	import { enhance } from '$app/forms';
	import { storeTheme } from '$lib/stores';
	import { LightSwitch, popup } from '@skeletonlabs/skeleton';
	import type { SubmitFunction } from '@sveltejs/kit';

	const themes = [
		{ type: 'skeleton', name: 'Skeleton', icon: '💀' },
		{ type: 'wintry', name: 'Wintry', icon: '🌨️', badge: 'New' },
		{ type: 'modern', name: 'Modern', icon: '🤖' },
		{ type: 'rocket', name: 'Rocket', icon: '🚀' },
		{ type: 'seafoam', name: 'Seafoam', icon: '🧜‍♀️' },
		{ type: 'vintage', name: 'Vintage', icon: '📺' },
		{ type: 'sahara', name: 'Sahara', icon: '🏜️' },
		{ type: 'hamlindigo', name: 'Hamlindigo', icon: '👔' },
		{ type: 'gold-nouveau', name: 'Gold Nouveau', icon: '💫' },
		{ type: 'crimson', name: 'Crimson', icon: '⭕' }
	];

	const setTheme: SubmitFunction = ({ formData }) => {
		const theme = formData.get('theme')?.toString();

		if (theme) {
			document.body.setAttribute('data-theme', theme);
			$storeTheme = theme;
		}
	};
</script>

<!-- Theme -->
<div>
	<!-- trigger -->
	<button
		class="btn variant-filled"
		use:popup={{ event: 'click', target: 'theme', closeQuery: 'a[href]' }}
	>
		<i class="fa-solid fa-palette text-lg md:!hidden" />
		<span class="hidden md:inline-block">Theme</span>
		<i class="fa-solid fa-caret-down opacity-50" />
	</button>
	<!-- popup -->
	<div class="card p-4 w-60 shadow-xl" data-popup="theme">
		<div class="space-y-4">
			<section class="flex justify-between items-center">
				<h6 class="h6">Mode</h6>
				<LightSwitch />
			</section>
			<hr />
			<nav class="list-nav p-4 -m-4 max-h-64 lg:max-h-[500px] overflow-y-auto">
				<form action="/?/setTheme" method="POST" use:enhance={setTheme}>
					<ul>
						{#each themes as { icon, name, type, badge }}
							<li>
								<button
									class="option w-full h-full"
									type="submit"
									name="theme"
									value={type}
									class:bg-primary-active-token={$storeTheme === type}
								>
									<span>{icon}</span>
									<span class="flex-auto text-left">{name}</span>
									{#if badge}<span class="badge variant-filled-secondary">{badge}</span>{/if}
								</button>
							</li>
						{/each}
					</ul>
				</form>
			</nav>
		</div>
	</div>
</div>
