<script>
    let { book, isGridView = false } = $props();
</script>

<div class="flex items-center justify-between">
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
