<script>
	let { data } = $props();
	let searchQuery = $state({ value: '' });

	// Reactive effect to filter books when searchQuery changes
	let result = $derived.by(() => {
		// Filter the books based on the search query
		if (searchQuery.value === '') {
			return data.books;
		} else {
			return data.books.filter((book) => {
				let bookTitle = book.title ? book.title.toLowerCase() : '';
				let bookAuthor = book.author ? book.author.toLowerCase() : '';
				return (
					bookTitle.includes(searchQuery.value.toLowerCase()) ||
					bookAuthor.includes(searchQuery.value.toLowerCase())
				);
			});
		}
	});
</script>

<div class="container mx-auto my-8 px-4">
	<!-- Search Filter -->
	<div class="mb-8 text-center">
		<input
			type="text"
			bind:value={searchQuery.value}
			class="input input-bordered w-full max-w-xs"
			placeholder="Search by title or author"
		/>
	</div>

	<h1 class="mb-8 text-center text-3xl font-bold text-primary">Book List</h1>

	<div class="grid grid-cols-1 gap-8 md:grid-cols-2">
		{#each result as book}
			<div class="card bg-neutral text-neutral-content shadow-xl">
				<div class="card-body">
					<h2 class="card-title text-primary">{book.title}</h2>
					<p class="text-gray">
						<span class="font-medium">Author:</span>
						{book.author}
					</p>
					<p class="mt-2 text-xl font-bold text-secondary">
						<span class="font-medium">Price:</span> ${book.price}
					</p>
				</div>
			</div>
		{/each}
	</div>
</div>
