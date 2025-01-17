<script>
	let { book, isGridView = false } = $props();
</script>

<div
	class="card p-4 text-neutral-content shadow-lg transition duration-200 ease-in-out hover:-translate-y-2 hover:bg-base-300 hover:shadow-2xl"
>
	<div class="flex items-center justify-between p-4">
		<div class="flex flex-col">
			<h2 class={isGridView ? 'card-title text-primary' : 'card-title text-lg text-primary'}>
				{book.title}
			</h2>
			<p class="text-sm text-accent">
				<span class="font-medium">{book.author}</span>
			</p>
		</div>
		<p class="ml-4 mt-1 text-right font-bold text-secondary">
			<span class="font-medium">${book.price}</span>
		</p>
	</div>
</div>
