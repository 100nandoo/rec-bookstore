<script>
	import { sessionStore } from '$lib/state';
	const session = $sessionStore;
</script>

<div class="hero bg-base-300 min-h-[50vh]">
	<div class="hero-content">
		<div class="text-center">
			{#if session != null}
				<h1 class="text-4xl text-white">Welcome</h1>
				{#if session?.user?.email}
					<p class="text-primary text-2xl font-bold">{session.user.email}</p>
				{/if}
			{:else}
				<h1 class="text-primary text-4xl font-bold">Welcome to Toko Buku REC</h1>
				<p class="py-6">Create an account or login to make transaction</p>
			{/if}
		</div>
	</div>
</div>
