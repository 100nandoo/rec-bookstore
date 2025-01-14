<script lang="ts">
	import QrCodeScanner from '../../lib/components/QrCodeScanner.svelte';

    let isPaused = $state(false)
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
    bind:this={qrCodeScanner}
/>

<div class="flex flex-col items-center mx-auto {isPaused ? 'visible' : 'hidden'}">
    <button class="btn btn-primary m-8" {onclick}>Scan Again</button>
</div>