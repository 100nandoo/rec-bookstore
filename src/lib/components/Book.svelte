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
	class="card p-4 text-neutral-content shadow-lg {showButton
		? 'transition duration-200 ease-in-out hover:-translate-y-2 hover:bg-base-300 hover:shadow-2xl'
		: ''}"
>
	<div class="flex items-center justify-between p-4">
		<div class="flex flex-col">
			<h2 class={isGridView ? 'card-title text-primary' : 'card-title text-lg text-primary'}>
				{book.title}
			</h2>
			<p class="text-sm text-accent">
				<span class="font-medium">{book.author}</span>
			</p>
			{#if book.isbn}
				<p class="text-xs text-secondary">
					ISBN: {book.isbn}
				</p>
			{/if}
		</div>
		<div class="flex flex-col items-end">
			<p class="ml-4 mt-1 text-right font-bold text-secondary">
				<span class="font-medium">${book.price}</span>
			</p>
			{#if showButton && !book.isbn}
				<button class="btn btn-primary btn-sm mt-2" onclick={handleAddIsbn}>Add ISBN</button>
			{/if}
		</div>
	</div>
</div>
