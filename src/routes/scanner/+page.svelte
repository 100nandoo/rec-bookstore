<script lang="ts">
	import QrCodeScanner from '../../lib/components/QrCodeScanner.svelte';

    let isPaused = $state(false)
    let scanResult = $state("")
    let formatted = $derived(scanResult.replace(/^(\d)(\d{6})(\d{6})$/, "$1 $2 $3"))
    let qrCodeScanner = $state()
	function onclick() {
		qrCodeScanner.resume()
	}
</script>

<QrCodeScanner
    width={320}
    height={320}
    class="max-w-sm bg-slate-700 rounded-lg mx-auto" 
    bind:isPaused={isPaused}
    bind:scanResult={scanResult}
    bind:this={qrCodeScanner}
/>

<div class="flex flex-col items-center mx-auto {isPaused ? 'visible' : 'hidden'}">
    <p class="text-lg text-primary mt-4">{formatted}</p>
    <button class="btn btn-primary mt-4" {onclick}>Scan Again</button>
</div>