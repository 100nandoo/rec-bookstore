<script>
	import QrCodeScanner from '../../lib/components/QrCodeScanner.svelte';

	let isPaused = $state(false);
	let scanResult = $state('');
	let formatted = $derived(scanResult.replace(/^(\d)(\d{6})(\d{6})$/, '$1-$2-$3'));
	let qrCodeScanner = $state();
	let result = $state();
    let showResult = $state(false);

	function onclick() {
		qrCodeScanner.resume();
	}

    async function findBook() {
		const response = await fetch('/book/' + scanResult);
		result = await response.json();
        if(result) {
            showResult = true;
        }
	}
</script>

<QrCodeScanner
	width={320}
	height={320}
	class="mx-auto max-w-sm rounded-lg bg-slate-700"
	bind:isPaused
	bind:scanResult
	bind:this={qrCodeScanner}
/>

<div class="text-center">
    <div class="mx-auto flex flex-col items-center {isPaused ? 'visible' : 'hidden'}">
        <p class="mt-4 text-lg text-primary">{formatted}</p>
        
        <button class="btn btn-primary mt-4" {onclick}>Scan Again</button>
    </div>

    <button class="btn btn-secondary mt-4" onclick={findBook}>Submit</button>

    {#if showResult}
        <div class="flex flex-row gap-8 mt-4 justify-center">
            <h1 class="text-4xl text-primary font-bold">{result.title}</h1>
            <p class="text-4xl text-right font-bold text-secondary">
                <span class="font-medium">${result.price}</span>
            </p>
        </div>
    {/if}
</div>
