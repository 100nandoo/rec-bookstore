<script>
	import Book from '$lib/components/Book.svelte';
	import { supabase } from '$lib/supabase/supabaseClient';
	import { roleStore } from '$lib/state';
	import { invalidateAll } from '$app/navigation';

	const role = $roleStore;

	let { data } = $props();
	let searchQuery = $state({ value: '' });
	let isGridView = $state(false);
	let showAddDialog = $state(false);
	let saving = $state(false);
	let addError = $state('');
	let form = $state({ title: '', author: '', price: '', stock_twpc: '', stock_alex: '', isbn: '' });

	let result = $derived.by(() => {
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

	function openAdd() {
		form = { title: '', author: '', price: '', stock_twpc: '', stock_alex: '', isbn: '' };
		addError = '';
		showAddDialog = true;
	}

	async function saveBook() {
		if (!form.title || !form.author || !form.price) {
			addError = 'Title, author and price are required.';
			return;
		}
		saving = true;
		addError = '';

		const { error } = await supabase.from('book').insert({
			title: form.title,
			author: form.author,
			price: parseFloat(form.price),
			stock_twpc: parseInt(form.stock_twpc || '0'),
			stock_alex: parseInt(form.stock_alex || '0'),
			isbn: form.isbn || null
		});

		saving = false;
		if (error) {
			addError = error.message;
		} else {
			showAddDialog = false;
			await invalidateAll();
		}
	}
</script>

<h1 class="text-primary mb-6 text-3xl font-bold">Book List</h1>

<div class="mb-6 flex items-center gap-2">
	<input
		type="text"
		bind:value={searchQuery.value}
		class="input input-bordered flex-1"
		placeholder="Search by title or author"
	/>
	<button class="btn btn-square btn-ghost" title="List View" onclick={() => (isGridView = false)}>
		<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
			<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
		</svg>
	</button>
	<button class="btn btn-square btn-ghost" title="Grid View" onclick={() => (isGridView = true)}>
		<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
			<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
		</svg>
	</button>
	{#if role === 'admin'}
		<button class="btn btn-primary btn-sm" onclick={openAdd}>+ Add Book</button>
	{/if}
</div>

<!-- Display Books in Grid or List View -->
<div class={isGridView ? 'grid grid-cols-1 gap-2 md:grid-cols-2' : 'space-y-2'}>
	{#each result as book (book.id)}
		<Book {book} {isGridView}></Book>
	{/each}
</div>

{#if showAddDialog}
	<div class="bg-opacity-50 fixed inset-0 flex items-center justify-center bg-black">
		<div class="bg-base-100 w-full max-w-md rounded-lg p-6 shadow-xl">
			<h3 class="mb-4 text-lg font-bold">Add Book</h3>

			{#if addError}
				<div role="alert" class="alert alert-error mb-4 text-sm">
					<span>{addError}</span>
				</div>
			{/if}

			<div class="space-y-3">
				<input class="input input-bordered w-full" placeholder="Title *" bind:value={form.title} />
				<input class="input input-bordered w-full" placeholder="Author *" bind:value={form.author} />
				<input class="input input-bordered w-full" placeholder="Price *" type="number" step="0.01" bind:value={form.price} />
				<input class="input input-bordered w-full" placeholder="Stock TWPC" type="number" bind:value={form.stock_twpc} />
				<input class="input input-bordered w-full" placeholder="Stock Alex" type="number" bind:value={form.stock_alex} />
				<input class="input input-bordered w-full" placeholder="ISBN (optional)" bind:value={form.isbn} />
			</div>

			<div class="mt-4 flex justify-end gap-2">
				<button class="btn btn-ghost btn-sm" onclick={() => (showAddDialog = false)}>Cancel</button>
				<button class="btn btn-primary btn-sm" onclick={saveBook} disabled={saving}>
					{saving ? 'Saving...' : 'Save'}
				</button>
			</div>
		</div>
	</div>
{/if}
