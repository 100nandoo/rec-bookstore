<script lang="ts">
	import '../app.css';
	import { goto } from '$app/navigation';
	import { themeChange } from 'theme-change';
	import { onMount } from 'svelte';
	import ThemeSwitcher from '$lib/components/ThemeSwitcher.svelte';
	import { sessionStore } from '$lib/state';
	import { get } from 'svelte/store';

	let { data, children } = $props();
	let { supabase } = data;
	let session = $state(data.session);

	sessionStore.set(data.session);
	sessionStore.subscribe((value) => {
		session = value;
	});

	supabase.auth.onAuthStateChange(async (event, _session) => {
		if (event === 'SIGNED_IN') {
			sessionStore.set(_session);
			session = _session;
			await goto('list');
		}

		if (event === 'SIGNED_OUT') {
			sessionStore.set(null);
			session = null;
			await goto('login');
		}
	});

	onMount(async () => {
		themeChange();
		const {
			data: { session: initialSession }
		} = await supabase.auth.getSession();
		if (initialSession) {
			sessionStore.set(initialSession);
			session = initialSession;
		}
	});
</script>

<div class="navbar bg-base-300">
	<div class="navbar-start">
		<div class="dropdown">
			<div tabindex="0" role="button" class="btn btn-ghost lg:hidden">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-5 w-5"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M4 6h16M4 12h8m-8 6h16"
					/>
				</svg>
			</div>
			<ul
				tabindex="0"
				class="menu dropdown-content menu-sm z-[1] mt-3 w-52 rounded-box bg-base-100 p-2 shadow"
			>
				<li><a href="/" class="hover:text-primary">Home</a></li>
				<li><a href="/list" class="hover:text-primary">Book List</a></li>
				<li><a href="/scanner" class="hover:text-primary">Scanner</a></li>
				<li><a href="">{session?.user?.email}</a></li>
			</ul>
		</div>
	</div>
	<div class="navbar-center hidden lg:flex">
		<ul class="menu menu-horizontal px-1">
			<li><a href="/" class="hover:text-primary">Home</a></li>
			<li><a href="/list" class="hover:text-primary">Book List</a></li>
			<li><a href="/scanner" class="hover:text-primary">Scanner</a></li>
			<li><a href="">{session?.user?.email}</a></li>
		</ul>
	</div>
	<div class="navbar-end">
		<div class="menu menu-sm flex flex-row items-center gap-4">
			{#if session}
				<li>
					<a
						href=""
						onclick={async () => {
							await supabase.auth.signOut();
						}}
						class="hover:text-primary">Logout</a
					>
				</li>
			{:else}
				<li><a href="/login" class="hover:text-primary">Login</a></li>
			{/if}
			<ThemeSwitcher />
		</div>
	</div>
</div>

<div class="container mx-auto max-w-screen-lg p-8">
	{@render children()}
</div>
