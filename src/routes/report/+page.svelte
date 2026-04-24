<script lang="ts">
	import { goto } from '$app/navigation';
	import { roleStore } from '$lib/state';
	import { browser } from '$app/environment';

	if (browser && $roleStore !== 'admin') goto('/list');

	let { data } = $props();
	const supabase = data.supabase;

	const today = new Date().toISOString().slice(0, 10);
	const firstOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1)
		.toISOString()
		.slice(0, 10);

	let dateFrom = $state(firstOfMonth);
	let dateTo = $state(today);
	let locationFilter = $state<'all' | 'twpc' | 'alex'>('all');
	let loading = $state(false);
	let error = $state('');

	type TxItem = {
		id: string;
		title: string;
		author: string;
		quantity: number;
		price: number;
		location: string;
	};

	type Tx = {
		id: string;
		created_at: string;
		payment_method: string;
		total_amount: number;
		transaction_items: TxItem[];
	};

	let transactions: Tx[] = $state([]);
	let loaded = $state(false);

	async function loadReport() {
		loading = true;
		error = '';
		const { data: rows, error: err } = await supabase
			.from('transactions')
			.select('*, transaction_items(*)')
			.gte('created_at', dateFrom)
			.lte('created_at', dateTo + 'T23:59:59')
			.order('created_at', { ascending: false });

		loading = false;
		if (err) {
			error = err.message;
			return;
		}
		transactions = rows ?? [];
		loaded = true;
	}

	const METHODS = ['cash', 'paynow', 'paylah'] as const;

	function filterItems(items: TxItem[]) {
		if (locationFilter === 'all') return items;
		return items.filter((i) => i.location === locationFilter);
	}

	let summary = $derived.by(() => {
		return METHODS.map((method) => {
			const txns = transactions.filter((t) => t.payment_method === method);
			const totalBooks = txns.reduce(
				(sum, t) => sum + filterItems(t.transaction_items).reduce((s, i) => s + i.quantity, 0),
				0
			);
			const totalAmount = txns.reduce(
				(sum, t) => sum + filterItems(t.transaction_items).reduce((s, i) => s + i.price * i.quantity, 0),
				0
			);
			return { method, count: txns.length, totalAmount, totalBooks };
		});
	});

	let grandTotal = $derived(summary.reduce((s, m) => s + m.totalAmount, 0));
	let grandBooks = $derived(summary.reduce((s, m) => s + m.totalBooks, 0));

	let filteredTransactions = $derived(
		transactions.filter((t) => filterItems(t.transaction_items).length > 0)
	);

	let expandedId = $state<string | null>(null);

	function formatDate(iso: string) {
		return new Date(iso).toLocaleString();
	}

	function methodLabel(m: string) {
		return m === 'paynow' ? 'PayNow' : m === 'paylah' ? 'PayLah' : 'Cash';
	}
</script>

<h1 class="text-primary mb-6 text-3xl font-bold">Report</h1>

<!-- Date filter -->
<div class="mb-6 space-y-3">
	<div class="flex flex-wrap items-end gap-3">
		<div>
			<label class="label text-sm" for="dateFrom">From</label>
			<input id="dateFrom" type="date" bind:value={dateFrom} class="input input-bordered input-sm" />
		</div>
		<div>
			<label class="label text-sm" for="dateTo">To</label>
			<input id="dateTo" type="date" bind:value={dateTo} class="input input-bordered input-sm" />
		</div>
		<button class="btn btn-primary btn-sm" onclick={loadReport} disabled={loading}>
			{loading ? 'Loading...' : 'Generate'}
		</button>
	</div>
	<div class="flex items-center gap-3">
		<p class="text-sm">Location</p>
		<div class="join">
			{#each [['all', 'All'], ['twpc', 'TWPC'], ['alex', 'Alex']] as [val, label] (val)}
				<button
					class="join-item btn btn-sm {locationFilter === val ? 'btn-primary' : 'btn-outline'}"
					onclick={() => (locationFilter = val as 'all' | 'twpc' | 'alex')}
				>{label}</button>
			{/each}
		</div>
	</div>
</div>

{#if error}
	<div role="alert" class="alert alert-error mb-4"><span>{error}</span></div>
{/if}

{#if loaded}
	<!-- Summary cards -->
	<div class="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
		{#each summary as s (s.method)}
			<div class="card bg-base-200 shadow">
				<div class="card-body p-4">
					<p class="text-base-content/60 text-sm font-medium uppercase">{methodLabel(s.method)}</p>
					<p class="text-primary text-2xl font-bold">${s.totalAmount.toFixed(2)}</p>
					<p class="text-base-content/60 text-xs">{s.totalBooks} books · {s.count} txn{s.count !== 1 ? 's' : ''}</p>
				</div>
			</div>
		{/each}
		<div class="card bg-primary text-primary-content shadow">
			<div class="card-body p-4">
				<p class="text-sm font-medium uppercase opacity-80">Total</p>
				<p class="text-2xl font-bold">${grandTotal.toFixed(2)}</p>
				<p class="text-xs opacity-70">{grandBooks} books · {transactions.length} txns</p>
			</div>
		</div>
	</div>

	<!-- Transactions table -->
	{#if transactions.length === 0}
		<p class="text-base-content/50 text-center">No transactions in this period.</p>
	{:else}
		<div class="overflow-x-auto">
			<table class="table table-zebra w-full">
				<thead>
					<tr>
						<th></th>
						<th>Date</th>
						<th>Transaction ID</th>
						<th>Payment</th>
						<th>Books</th>
						<th>Total</th>
					</tr>
				</thead>
				<tbody>
					{#each filteredTransactions as tx (tx.id)}
						<tr
							class="cursor-pointer"
							onclick={() => (expandedId = expandedId === tx.id ? null : tx.id)}
						>
							<td class="text-base-content/40 text-xs">{expandedId === tx.id ? '▼' : '▶'}</td>
							<td class="text-sm">{formatDate(tx.created_at)}</td>
							<td class="font-mono text-xs">{tx.id.slice(0, 8)}…</td>
							<td><span class="badge badge-outline badge-sm">{methodLabel(tx.payment_method)}</span></td>
							<td>{filterItems(tx.transaction_items).reduce((s, i) => s + i.quantity, 0)}</td>
							<td class="font-semibold">${filterItems(tx.transaction_items).reduce((s, i) => s + i.price * i.quantity, 0).toFixed(2)}</td>
						</tr>
						{#if expandedId === tx.id}
							<tr>
								<td colspan="6" class="bg-base-200 p-0">
									<table class="table table-sm w-full">
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
											{#each filterItems(tx.transaction_items) as item (item.id)}
												<tr>
													<td>{item.title}</td>
													<td>{item.author}</td>
													<td class="uppercase">{item.location}</td>
													<td>{item.quantity}</td>
													<td>${Number(item.price).toFixed(2)}</td>
													<td>${(Number(item.price) * item.quantity).toFixed(2)}</td>
												</tr>
											{/each}
										</tbody>
									</table>
								</td>
							</tr>
						{/if}
					{/each}
				</tbody>
			</table>
		</div>
	{/if}
{/if}
