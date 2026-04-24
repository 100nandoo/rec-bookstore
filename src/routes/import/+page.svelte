<script lang="ts">
	import { roleStore } from '$lib/state';
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';

	let { data } = $props();
	let { supabase } = data;

	const role = $roleStore;
	if (browser && role !== 'admin') goto('/list');

	type Book = {
		title: string;
		author: string;
		price: number;
		stock_twpc: number;
		stock_alex: number;
		isbn: string | null;
		pages: number | null;
		dimensions: string | null;
		weight: number | null;
		publisher: string | null;
		published_date: string | null;
		description: string | null;
		topics: string[] | null;
		pictures: string[] | null;
	};

	let activeTab = $state<'import' | 'export'>('import');
	let preview: Book[] = $state([]);
	let error = $state('');
	let success = $state('');
	let importing = $state(false);
	let showConfirm = $state(false);

	function splitCSVLine(line: string): string[] {
		const fields: string[] = [];
		let current = '';
		let inQuotes = false;
		for (let i = 0; i < line.length; i++) {
			const ch = line[i];
			if (ch === '"') {
				inQuotes = !inQuotes;
			} else if (ch === ',' && !inQuotes) {
				fields.push(current.trim());
				current = '';
			} else {
				current += ch;
			}
		}
		fields.push(current.trim());
		return fields;
	}

	function parseCSV(text: string): Book[] {
		const lines = text.trim().split('\n').filter(Boolean);
		return lines.slice(1).map((line) => {
			const [title, author, price, stock_twpc, stock_alex, isbn, pages, dimensions, weight, publisher, published_date, description, topics, pictures] = splitCSVLine(line);
			return {
				title: title?.trim() ?? '',
				author: author?.trim() ?? '',
				price: parseFloat(price?.trim().replace(/[^0-9.]/g, '') ?? '0') || 0,
				stock_twpc: parseInt(stock_twpc?.trim() ?? '0'),
				stock_alex: parseInt(stock_alex?.trim() ?? '0'),
				isbn: isbn?.trim() || null,
				pages: pages?.trim() ? parseInt(pages.trim()) : null,
				dimensions: dimensions?.trim() || null,
				weight: weight?.trim() ? parseFloat(weight.trim()) : null,
				publisher: publisher?.trim() || null,
				published_date: published_date?.trim() || null,
				description: description?.trim() || null,
				topics: topics?.trim() ? topics.trim().split('|').map((t) => t.trim()).filter(Boolean) : null,
				pictures: pictures?.trim() ? pictures.trim().split('|').map((p) => p.trim()).filter(Boolean) : null
			};
		});
	}

	function handleFile(e: Event) {
		error = '';
		success = '';
		preview = [];
		const file = (e.target as HTMLInputElement).files?.[0];
		if (!file) return;

		const reader = new FileReader();
		reader.onload = (ev) => {
			try {
				preview = parseCSV(ev.target?.result as string);
			} catch {
				error = 'Failed to parse CSV. Make sure the format is correct.';
			}
		};
		reader.readAsText(file);
	}

	async function handleImport() {
		if (!preview.length) return;
		showConfirm = false;
		importing = true;
		error = '';
		success = '';

		const { error: deleteError } = await supabase.from('book').delete().neq('id', '00000000-0000-0000-0000-000000000000');
		if (deleteError) {
			error = deleteError.message;
			importing = false;
			return;
		}

		const { error: dbError } = await supabase.from('book').insert(preview);

		importing = false;
		if (dbError) {
			error = dbError.message;
		} else {
			success = `Successfully imported ${preview.length} book${preview.length !== 1 ? 's' : ''}.`;
			preview = [];
		}
	}

	function csvCell(v: unknown): string {
		const s = String(v ?? '');
		return s.includes(',') || s.includes('"') || s.includes('\n') ? `"${s.replace(/"/g, '""')}"` : s;
	}

	async function exportCSV() {
		const { data: books } = await supabase.from('book').select();
		if (!books?.length) return;
		const header = 'title,author,price,stock_twpc,stock_alex,isbn,pages,dimensions,weight,publisher,published_date,description,topics,pictures';
		const rows = books.map((b) =>
			[
				b.title,
				b.author,
				b.price,
				b.stock_twpc,
				b.stock_alex,
				b.isbn ?? '',
				b.pages ?? '',
				b.dimensions ?? '',
				b.weight ?? '',
				b.publisher ?? '',
				b.published_date ?? '',
				b.description ?? '',
				Array.isArray(b.topics) ? b.topics.join('|') : '',
				Array.isArray(b.pictures) ? b.pictures.join('|') : ''
			]
				.map(csvCell)
				.join(',')
		);
		const csv = [header, ...rows].join('\n');
		const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
		const a = document.createElement('a');
		a.href = url;
		a.download = 'books.csv';
		a.click();
		URL.revokeObjectURL(url);
	}
</script>

<h1 class="mb-6 text-2xl font-bold">Import / Export</h1>

{#if role === 'admin'}
	<div role="tablist" class="tabs tabs-bordered mb-6">
		<button
			role="tab"
			class="tab {activeTab === 'import' ? 'tab-active' : ''}"
			onclick={() => { activeTab = 'import'; error = ''; success = ''; }}
		>
			Import
		</button>
		<button
			role="tab"
			class="tab {activeTab === 'export' ? 'tab-active' : ''}"
			onclick={() => { activeTab = 'export'; error = ''; success = ''; }}
		>
			Export
		</button>
	</div>

	{#if activeTab === 'import'}
		<div class="mb-4">
			<p class="text-base-content mb-2 text-sm">
				Upload a CSV file with columns: <code>title, author, price, stock_twpc, stock_alex, isbn, pages, dimensions, weight, publisher, published_date, description, topics, pictures</code>
			</p>
			<p class="text-base-content/60 mb-2 text-xs">Array fields (topics, pictures) should be pipe-separated (e.g. <code>topic1|topic2</code>).</p>
			<input
				type="file"
				accept=".csv"
				onchange={handleFile}
				class="file-input file-input-bordered w-full max-w-sm"
			/>
		</div>

		{#if error}
			<div role="alert" class="alert alert-error mb-4">
				<span>{error}</span>
			</div>
		{/if}

		{#if success}
			<div role="alert" class="alert alert-success mb-4">
				<span>{success}</span>
			</div>
		{/if}

		{#if preview.length > 0}
			<div class="mb-4 flex items-center justify-between">
				<h2 class="text-lg font-semibold">Preview ({preview.length} rows)</h2>
				<button class="btn btn-primary" onclick={() => (showConfirm = true)} disabled={importing}>
					{importing ? 'Importing...' : `Import ${preview.length} books`}
				</button>
			</div>
			<div class="overflow-x-auto">
				<table class="table table-zebra w-full">
					<thead>
						<tr>
							<th>Title</th>
							<th>Author</th>
							<th>Price</th>
							<th>Stock TWPC</th>
							<th>Stock Alex</th>
							<th>ISBN</th>
							<th>Pages</th>
							<th>Dimensions</th>
							<th>Weight</th>
							<th>Publisher</th>
							<th>Published Date</th>
							<th>Description</th>
							<th>Topics</th>
							<th>Pictures</th>
						</tr>
					</thead>
					<tbody>
						{#each preview as book}
							<tr>
								<td>{book.title}</td>
								<td>{book.author}</td>
								<td>${book.price}</td>
								<td>{book.stock_twpc}</td>
								<td>{book.stock_alex}</td>
								<td>{book.isbn ?? '-'}</td>
								<td>{book.pages ?? '-'}</td>
								<td>{book.dimensions ?? '-'}</td>
								<td>{book.weight ?? '-'}</td>
								<td>{book.publisher ?? '-'}</td>
								<td>{book.published_date ?? '-'}</td>
								<td class="max-w-xs truncate">{book.description ?? '-'}</td>
								<td>{book.topics?.join(', ') ?? '-'}</td>
								<td>{book.pictures?.length ? `${book.pictures.length} image(s)` : '-'}</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{/if}
	{/if}

	{#if showConfirm}
		<div class="bg-opacity-50 fixed inset-0 flex items-center justify-center bg-black">
			<div class="bg-base-100 rounded-lg p-6 shadow-xl">
				<h3 class="mb-2 text-lg font-bold">Confirm Import</h3>
				<p class="mb-4 text-sm">This will <span class="text-error font-semibold">replace all existing books</span> with {preview.length} books from the CSV. This cannot be undone.</p>
				<div class="flex justify-end gap-2">
					<button class="btn btn-ghost btn-sm" onclick={() => (showConfirm = false)}>Cancel</button>
					<button class="btn btn-primary btn-sm" onclick={handleImport}>Confirm</button>
				</div>
			</div>
		</div>
	{/if}

	{#if activeTab === 'export'}
		<p class="text-base-content mb-4 text-sm">Download all books from the database as a CSV file.</p>
		<button class="btn btn-secondary" onclick={exportCSV}>Download books.csv</button>
	{/if}
{/if}
