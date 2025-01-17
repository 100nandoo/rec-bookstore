<script>
	import { sessionStore } from '$lib/state';
	import { get } from 'svelte/store';
	const session = get(sessionStore);
</script>

<div class="hero min-h-[50vh] bg-base-300">
	<div class="hero-content">
		<div class="text-center">
			{#if session != null}
				<h1 class="text-4xl text-white">Welcome</h1>
				{#if session?.user?.email}
					<p class="text-2xl font-bold text-primary">{session.user.email}</p>
				{/if}
			{:else}
				<h1 class="text-4xl font-bold text-primary">Welcome to Toko Buku REC</h1>
				<p class="py-6">Create an account or login to make transaction</p>
			{/if}
		</div>
	</div>
</div>
