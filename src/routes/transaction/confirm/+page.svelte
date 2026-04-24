<script lang="ts">
	import { goto } from '$app/navigation';
	import { cartStore, sessionStore } from '$lib/state';
	import { browser } from '$app/environment';

	if (browser && !$sessionStore) goto('/login');

	let { data } = $props();
	const supabase = data.supabase;

	let cart = $state($cartStore.filter((i) => i.checked));
	let paymentMethod = $state<'cash' | 'paynow' | 'paylah'>('cash');
	let confirming = $state(false);
	let error = $state('');
	let successId = $state('');

	if (browser && cart.length === 0) goto('/transaction');

	let total = $derived(cart.reduce((sum, i) => sum + i.price * i.quantity, 0));

	async function confirm() {
		if (!$sessionStore?.user) return;
		confirming = true;
		error = '';

		const { data: txn, error: txnError } = await supabase
			.from('transactions')
			.insert({
				user_id: $sessionStore.user.id,
				payment_method: paymentMethod,
				total_amount: total
			})
			.select('id')
			.single();

		if (txnError || !txn) {
			error = txnError?.message ?? 'Failed to create transaction.';
			confirming = false;
			return;
		}

		const items = cart.map((i) => ({
			transaction_id: txn.id,
			book_id: i.book.id,
			title: i.book.title,
			author: i.book.author,
			price: i.price,
			quantity: i.quantity,
			location: i.location
		}));

		const { error: itemsError } = await supabase.from('transaction_items').insert(items);
		if (itemsError) {
			error = itemsError.message;
			confirming = false;
			return;
		}

		for (const item of cart) {
			const field = item.location === 'twpc' ? 'stock_twpc' : 'stock_alex';
			const current = item.location === 'twpc' ? item.book.stock_twpc : item.book.stock_alex;
			await supabase
				.from('book')
				.update({ [field]: current - item.quantity })
				.eq('id', item.book.id);
		}

		cartStore.set([]);
		successId = txn.id;
		confirming = false;
	}
</script>

<h1 class="text-primary mb-6 text-3xl font-bold">Confirm Transaction</h1>

{#if successId}
	<div role="alert" class="alert alert-success mb-6">
		<div>
			<p class="font-semibold">Transaction confirmed!</p>
			<p class="text-sm">ID: <span class="font-mono">{successId}</span></p>
		</div>
	</div>
	<button class="btn btn-primary" onclick={() => goto('/list')}>Back to Book List</button>
{:else}
	<!-- Items summary -->
	<div class="mb-6 overflow-x-auto">
		<table class="table table-zebra w-full">
			<thead>
				<tr>
					<th>Title</th>
					<th>Author</th>
					<th>Location</th>
					<th>Qty</th>
					<th>Price</th>
					<th>Subtotal</th>
				</tr>
			</thead>
			<tbody>
				{#each cart as item}
					<tr>
						<td>{item.book.title}</td>
						<td>{item.book.author}</td>
						<td class="uppercase">{item.location}</td>
						<td>{item.quantity}</td>
						<td>${item.price.toFixed(2)}</td>
						<td class="font-semibold">${(item.price * item.quantity).toFixed(2)}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>

	<!-- Payment method -->
	<div class="mb-6">
		<p class="mb-3 font-semibold">Payment Method</p>
		<div class="flex gap-3">
			{#each [['cash', 'Cash'], ['paynow', 'PayNow'], ['paylah', 'PayLah']] as [value, label]}
				<button
					class="btn flex-1 {paymentMethod === value ? 'btn-primary' : 'btn-outline'}"
					onclick={() => (paymentMethod = value as 'cash' | 'paynow' | 'paylah')}
				>{label}</button>
			{/each}
		</div>
	</div>

	<!-- Total -->
	<div class="mb-6 flex items-center justify-between">
		<p class="text-xl font-bold">Total: <span class="text-primary">${total.toFixed(2)}</span></p>
	</div>

	{#if error}
		<div role="alert" class="alert alert-error mb-4">
			<span>{error}</span>
		</div>
	{/if}

	<div class="flex gap-3">
		<button class="btn btn-ghost" onclick={() => goto('/transaction')}>← Back</button>
		<button class="btn btn-primary flex-1" onclick={confirm} disabled={confirming}>
			{confirming ? 'Confirming...' : 'Confirm & Pay'}
		</button>
	</div>
{/if}
