<script lang="ts">
	import '../app.css';
	import { goto } from '$app/navigation';
	let { children } = $props();

	import { themeChange } from 'theme-change';
	import { onMount } from 'svelte';
	import ThemeSwitcher from '$lib/components/ThemeSwitcher.svelte';

	onMount(() => themeChange());
</script>

<nav class="bg-base-300">
	<ul class="flex items-center space-x-4 p-2 text-lg">
		<!-- <li><a href="/" class="hover:text-primary">Home</a></li> -->
		<li><a href="/list" class="hover:text-primary">Book List</a></li>
		<li><a href="/scanner" class="hover:text-primary">Scanner</a></li>
		<li class="flex-1"></li>
		<ThemeSwitcher />
	</ul>
</nav>
<div class="container mx-auto max-w-screen-lg p-8">
	{@render children()}
</div>
