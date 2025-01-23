<script lang="ts">
	import { onMount } from 'svelte';

	const themes = ['sunset', 'light'];

	let selectedTheme: string;

	function handleThemeChange(event: Event) {
		const target = event.target as HTMLInputElement;
		selectedTheme = target.value;
		localStorage.setItem('theme', selectedTheme);
		applyTheme(selectedTheme);
	}

	function applyTheme(theme: string) {
		document.documentElement.setAttribute('data-theme', theme);
	}

	onMount(() => {
		const savedTheme = localStorage.getItem('theme');
		if (savedTheme) {
			selectedTheme = savedTheme;
			applyTheme(savedTheme);
		} else {
			// Default theme if none is saved
			selectedTheme = themes[0];
			applyTheme(selectedTheme);
		}
	});
</script>

<div class="dropdown dropdown-end">
	<div tabindex="0" role="button" class="hover:text-primary">Theme</div>

	<ul class="dropdown-content rounded-box bg-base-300 p-2 shadow-2xl">
		{#each themes as theme}
			<li class="m-0 p-0">
				<input
					type="radio"
					name="theme-dropdown"
					class="theme-controller btn btn-ghost btn-sm btn-block justify-start"
					aria-label={theme}
					value={theme}
					checked={selectedTheme === theme}
					on:change={handleThemeChange}
				/>
			</li>
		{/each}
	</ul>
</div>
