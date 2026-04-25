<script>
	import { sessionStore, roleStore } from '$lib/state';
	const session = $sessionStore;
	const role = $roleStore;
</script>

<div class="hero bg-base-300 min-h-[40vh]">
	<div class="hero-content text-center">
		<div class="max-w-lg">
			<h1 class="text-primary text-4xl font-bold">Toko Buku REC</h1>
			{#if session}
				<p class="text-base-content/70 mt-2 text-sm">{session.user.email}</p>
				{#if role === 'admin'}
					<p class="mt-4 text-base leading-relaxed">
						You're logged in as an <span class="text-primary font-semibold">admin</span>. You can manage the book catalogue, process transactions, view sales reports, and import/export data.
					</p>
				{:else}
					<p class="mt-4 text-base leading-relaxed">
						Browse our book collection and bring books to the counter to make a transaction.
					</p>
				{/if}
				<div class="mt-6 flex flex-wrap justify-center gap-3">
					<a href="/list" class="btn btn-primary">Browse Books</a>
					{#if role === 'admin'}
						<a href="/transaction" class="btn btn-outline">New Transaction</a>
						<a href="/report" class="btn btn-outline">View Report</a>
					{/if}
				</div>
			{:else}
				<p class="mt-4 text-base leading-relaxed">
					A point-of-sale app for managing book inventory and sales. Browse the catalogue, or log in to make a transaction.
				</p>
				<div class="mt-6 flex flex-wrap justify-center gap-3">
					<a href="/list" class="btn btn-outline">Browse Books</a>
					<a href="/login" class="btn btn-primary">Login</a>
				</div>
			{/if}
		</div>
	</div>
</div>
