<script>
	import QrCodeScanner from '../../lib/components/QrCodeScanner.svelte';
	import Book from '$lib/components/Book.svelte';
	import { ScanState } from '$lib/misc/ScanState.js';

	let scanState = $state(ScanState.SCANNING);

	let scanResult = $state('');
	let formatted = $derived.by(() => {
		if (scanResult){
			scanResult.replace(/^(\d)(\d{6})(\d{6})$/, '$1-$2-$3')
		}
	});
	let qrCodeScanner = $state();
	let isGridView = false;

	function onclick() {
		qrCodeScanner.resume();
	}

	async function findBook() {
		if (scanResult){
			const response = await fetch('/book/' + scanResult);
			book = await response.json();
			return book;
		}
		return null
	}

	let book = $derived.by(() => {
		if (scanState === ScanState.RESULT) {
			return findBook();
		}
	});
</script>


<div class="text-center mx-auto">
	<QrCodeScanner
		width={320}
		height={320}
		class="w-full max-w-screen-sm mx-auto rounded-lg bg-slate-700"
		bind:scanState
		bind:scanResult
		bind:this={qrCodeScanner}
	/>
	<div class="flex flex-col items-center gap-y-4 mt-4">
		{#if scanState === ScanState.RESULT}
			<button class="btn btn-primary" {onclick}>Scan Again</button>
		{/if}
		<p class="text-lg text-primary">{formatted}</p>
		{#if book}
			<Book {book} {isGridView} />
		{/if}
	</div>
</div>
