<script>
	import { page } from '$app/stores';
	import QrCodeScanner from '../../lib/components/QrCodeScanner.svelte';
	import Book from '$lib/components/Book.svelte';
	import { ScanState } from '$lib/misc/ScanState.js';
	import { goto } from '$app/navigation';
	import { supabase } from '$lib/supabase/supabaseClient';

	let scanState = $state(ScanState.SCANNING);
	let bookFromUrl = $state();
	let showConfirmDialog = $state(false);
	let showButton = false;

	// Get book from URL parameters if it exists
	$effect(() => {
		const bookParam = $page.url.searchParams.get('book');
		if (bookParam) {
			bookFromUrl = JSON.parse(decodeURIComponent(bookParam));
		}
	});

	$effect(() => {
		if (scanState === ScanState.RESULT && bookFromUrl) {
			showConfirmDialog = true;
		}
	});

	let scanResult = $state('');
	let formatted = $derived.by(() => {
		if (scanResult) {
			scanResult.replace(/^(\d)(\d{6})(\d{6})$/, '$1-$2-$3');
		}
	});
	let qrCodeScanner = $state();
	let isGridView = false;

	function onclick() {
		qrCodeScanner.resume();
	}

	async function saveIsbn() {
		if (scanResult && bookFromUrl) {
			try {
				const { error } = await supabase
					.from('book')
					.update({ isbn: scanResult })
					.eq('id', bookFromUrl.id);

				if (error) {
					console.error('Error updating row:', error);
				} else {
					console.log('Row updated successfully');
				}

				// Navigate back to the list page after successful save
				goto('/list');
			} catch (error) {
				console.error('Error saving ISBN:', error);
			}
		}
	}

	async function findBook() {
		if (scanResult) {
			const response = await fetch('/book/' + scanResult);
			book = await response.json();
			return book;
		}
		return null;
	}

	let book = $derived.by(() => {
		if (scanState === ScanState.RESULT) {
			return findBook();
		}
		return bookFromUrl;
	});

	function handleConfirm() {
		showConfirmDialog = false;
		saveIsbn();
	}

	function handleCancel() {
		showConfirmDialog = false;
		qrCodeScanner.resume();
	}
</script>

<div class="mx-auto text-center">
	{#if bookFromUrl}
		<div class="mb-4">
			<h3 class="text-lg font-semibold">Adding ISBN to:</h3>
			<Book book={bookFromUrl} {isGridView} {showButton} />
		</div>
	{/if}
	<QrCodeScanner
		width={320}
		height={320}
		class="mx-auto w-full max-w-screen-sm rounded-lg bg-slate-700"
		bind:scanState
		bind:scanResult
		bind:this={qrCodeScanner}
	/>
	<div class="mt-4 flex flex-col items-center gap-y-4">
		{#if scanState === ScanState.RESULT}
			<button class="btn btn-primary" {onclick}>Scan Again</button>
		{/if}
		<p class="text-lg text-primary">{formatted}</p>
		{#if book && !bookFromUrl}
			<Book {book} {isGridView} {showButton} />
		{/if}
	</div>
</div>

{#if showConfirmDialog}
	<div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
		<div class="rounded-lg bg-base-100 p-6 shadow-xl">
			<h3 class="mb-4 text-lg font-bold">Confirm ISBN</h3>
			<p class="mb-4">Do you want to save ISBN {scanResult} to this book?</p>
			<div class="flex justify-end gap-4">
				<button class="btn btn-ghost" onclick={handleCancel}>Cancel</button>
				<button class="btn btn-primary" onclick={handleConfirm}>Save</button>
			</div>
		</div>
	</div>
{/if}
