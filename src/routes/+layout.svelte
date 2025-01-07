<script lang="ts">
	import '../app.css';
	import { goto } from '$app/navigation';
	let { children } = $props();
</script>

<nav class="bg-base-300">
	<ul class="flex items-center space-x-4 p-2 text-lg">
		<!-- <li><a href="/" class="hover:text-primary">Home</a></li> -->
		<li><a href="/list" class="hover:text-primary">Book List</a></li>
		<!-- <li class="flex-1"></li>
		<li><input type="search" class="border px-2 py-1" placeholder="Search" /></li> -->
	</ul>
</nav>
{@render children()}
