<script lang="ts">
	import { goto } from '$app/navigation';
	import { cartStore, sessionStore, type CartItem } from '$lib/state';
	import { browser } from '$app/environment';

	if (browser && !$sessionStore) goto('/login');

	let { data } = $props();
	let searchQuery = $state('');
	let validationErrors: string[] = $state([]);

	let cart: CartItem[] = $state($cartStore);
	cartStore.subscribe((v) => (cart = v));

	let searchResult = $derived.by(() => {
		if (!searchQuery.trim()) return [];
		const q = searchQuery.toLowerCase();
		return data.books.filter(
			(b: any) =>
				b.title?.toLowerCase().includes(q) || b.author?.toLowerCase().includes(q)
		);
	});

	function addToCart(book: any) {
		const existing = cart.find((i) => i.book.id === book.id);
		if (existing) return;
		cartStore.update((c) => [
			...c,
			{ book, location: 'twpc', quantity: 1, price: book.price, checked: true }
		]);
		searchQuery = '';
	}

	function removeFromCart(bookId: string) {
		cartStore.update((c) => c.filter((i) => i.book.id !== bookId));
	}

	function updateItem(bookId: string, patch: Partial<CartItem>) {
		cartStore.update((c) =>
			c.map((i) => (i.book.id === bookId ? { ...i, ...patch } : i))
		);
	}

	let total = $derived(
		cart
			.filter((i) => i.checked)
			.reduce((sum, i) => sum + i.price * i.quantity, 0)
	);

	function proceed() {
		validationErrors = [];
		const checked = cart.filter((i) => i.checked);
		if (!checked.length) {
			validationErrors = ['Please select at least one book.'];
			return;
		}
		const errors: string[] = [];
		for (const item of checked) {
			const stock = item.location === 'twpc' ? item.book.stock_twpc : item.book.stock_alex;
			if (item.quantity > stock) {
				errors.push(
					`"${item.book.title}" — ${item.location.toUpperCase()} stock is ${stock} (requested ${item.quantity})`
				);
			}
		}
		if (errors.length) {
			validationErrors = errors;
			return;
		}
		goto('/transaction/confirm');
	}
</script>

<h1 class="text-primary mb-6 text-3xl font-bold">New Transaction</h1>

<!-- Search -->
<div class="mb-6">
	<input
		type="text"
		bind:value={searchQuery}
		class="input input-bordered w-full"
		placeholder="Search books by title or author..."
	/>
	{#if searchResult.length > 0}
		<div class="bg-base-100 border-base-300 mt-1 rounded-lg border shadow-lg">
			{#each searchResult as book}
				<button
					class="hover:bg-base-200 w-full cursor-pointer px-4 py-2 text-left"
					onclick={() => addToCart(book)}
				>
					<div class="flex items-center justify-between">
						<span class="font-medium">{book.title}</span>
						<span class="text-base-content/60 text-sm">{book.author}</span>
					</div>
					<div class="text-base-content/50 mt-0.5 text-xs">
						TWPC: {book.stock_twpc} &nbsp;|&nbsp; Alex: {book.stock_alex}
					</div>
				</button>
			{/each}
		</div>
	{/if}
</div>

<!-- Validation errors -->
{#if validationErrors.length}
	<div role="alert" class="alert alert-error mb-4">
		<ul class="list-disc pl-4">
			{#each validationErrors as err}
				<li class="text-sm">{err}</li>
			{/each}
		</ul>
	</div>
{/if}

<!-- Cart -->
{#if cart.length > 0}
	<div class="mb-4 space-y-3">
		{#each cart as item (item.book.id)}
			<div class="card bg-base-200 shadow">
				<div class="card-body p-4">
					<div class="flex items-start justify-between gap-2">
						<div class="flex items-start gap-3">
							<input
								type="checkbox"
								class="checkbox checkbox-primary mt-1"
								checked={item.checked}
								onchange={(e) => updateItem(item.book.id, { checked: (e.target as HTMLInputElement).checked })}
							/>
							<div>
								<p class="font-semibold">{item.book.title}</p>
								<p class="text-base-content/60 text-sm">{item.book.author}</p>
								<p class="text-base-content/50 mt-1 text-xs">
									Stock — TWPC: {item.book.stock_twpc} &nbsp;|&nbsp; Alex: {item.book.stock_alex}
								</p>
							</div>
						</div>
						<button class="btn btn-ghost btn-xs text-error" onclick={() => removeFromCart(item.book.id)}>✕</button>
					</div>

					<div class="mt-3 flex flex-wrap items-center gap-3">
						<!-- Location toggle -->
						<div class="join">
							<button
								class="join-item btn btn-sm {item.location === 'twpc' ? 'btn-primary' : 'btn-ghost'}"
								onclick={() => updateItem(item.book.id, { location: 'twpc' })}
							>TWPC</button>
							<button
								class="join-item btn btn-sm {item.location === 'alex' ? 'btn-primary' : 'btn-ghost'}"
								onclick={() => updateItem(item.book.id, { location: 'alex' })}
							>Alex</button>
						</div>

						<!-- Quantity -->
						<div class="flex items-center gap-1">
							<span class="text-sm">Qty:</span>
							<input
								type="number"
								min="1"
								class="input input-bordered input-sm w-16"
								value={item.quantity}
								oninput={(e) => updateItem(item.book.id, { quantity: Math.max(1, parseInt((e.target as HTMLInputElement).value) || 1) })}
							/>
						</div>

						<!-- Price -->
						<div class="flex items-center gap-1">
							<span class="text-sm">$</span>
							<input
								type="number"
								min="0"
								step="0.01"
								class="input input-bordered input-sm w-20"
								value={item.price}
								oninput={(e) => updateItem(item.book.id, { price: parseFloat((e.target as HTMLInputElement).value) || 0 })}
							/>
						</div>

						<span class="ml-auto text-sm font-semibold">
							= ${(item.price * item.quantity).toFixed(2)}
						</span>
					</div>
				</div>
			</div>
		{/each}
	</div>

	<div class="flex items-center justify-between">
		<p class="text-lg font-bold">Total: <span class="text-primary">${total.toFixed(2)}</span></p>
		<button class="btn btn-primary" onclick={proceed}>Proceed →</button>
	</div>
{:else}
	<p class="text-base-content/50 text-center">Search and add books to start a transaction.</p>
{/if}
