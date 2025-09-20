<script>
	import { sessionStore } from '$lib/state';
	const session = $sessionStore;
	let { book, isGridView = false, showButton } = $props();
	showButton = showButton ?? session?.user?.email;
	import { goto } from '$app/navigation';

	function handleAddIsbn() {
		goto('/scanner?book=' + encodeURIComponent(JSON.stringify(book)));
	}
</script>

<div
	class="card text-neutral-content hover:bg-base-300 p-4 shadow-lg transition duration-200 ease-in-out hover:-translate-y-2 hover:shadow-2xl"
>
	<div class="flex items-center justify-between p-4">
		<div class="flex flex-col">
			<h2 class={isGridView ? 'card-title text-primary' : 'card-title text-primary text-lg'}>
				{book.title}
			</h2>
			<p class="text-accent text-sm">
				<span class="font-medium">{book.author}</span>
			</p>
			<p class="text-base-content text-sm">
				<span class="font-light">Twpc:</span>
				<span class="text-base font-medium">{book.stock_twpc}</span>
				<span class="font-light">Alex:</span>
				<span class="text-base font-medium">{book.stock_alex}</span>
			</p>
			{#if book.isbn}
				<p class="text-secondary text-xs">
					ISBN: {book.isbn}
				</p>
			{/if}
		</div>
		<div class="flex flex-col items-end">
			<p class="text-secondary mt-1 ml-4 text-right font-bold">
				<span class="font-medium">${book.price}</span>
			</p>
			{#if showButton && !book.isbn}
				<button class="btn btn-primary btn-sm mt-2" onclick={handleAddIsbn}>Add ISBN</button>
			{/if}
		</div>
	</div>
</div>
