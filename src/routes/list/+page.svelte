<script>
	import Book from '$lib/components/Book.svelte';

	let { data } = $props();
	let searchQuery = $state({ value: '' });
	let isGridView = $state(false); // True for grid view, false for list view

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

<!-- Search Filter -->
<div class="mb-8 text-center">
	<input
		type="text"
		bind:value={searchQuery.value}
		class="input input-bordered w-full max-w-xs"
		placeholder="Search by title or author"
	/>
</div>

<!-- Toggle Button for Grid/List View -->
<div class="mb-4 flex hidden justify-center md:flex">
	<button class="btn btn-secondary mr-2" onclick={() => (isGridView = false)}> List View</button>
	<button class="btn btn-primary" onclick={() => (isGridView = true)}> Grid View</button>
</div>

<h1 class="mb-8 text-center text-3xl font-bold text-primary">Book List</h1>

<!-- Display Books in Grid or List View -->
<div class={isGridView ? 'grid grid-cols-1 gap-2 md:grid-cols-2' : 'space-y-2'}>
	{#each result as book (book.id)}
		<Book {book} {isGridView}></Book>
	{/each}
</div>
