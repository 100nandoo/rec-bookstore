<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { Html5QrcodeScanner, Html5QrcodeScanType, Html5QrcodeSupportedFormats } from 'html5-qrcode';
	import { ScanState } from '$lib/misc/ScanState';

	let { class: klass, width, height, scanState = $bindable(), scanResult = $bindable() } = $props();
	let scanner: Html5QrcodeScanner;

	function scanSuccess(decodedText: string) {
		scanResult = decodedText;
		scanner?.pause(true);
		scanState = ScanState.RESULT;
	}

	export function resume() {
		scanResult = scanResult.SCANNING;
		scanner?.resume();
	}

	onMount(() => {
		scanner = new Html5QrcodeScanner(
			'qr-scanner',
			{
				fps: 10,
				qrbox: { width, height },
				aspectRatio: 1,
				supportedScanTypes: [Html5QrcodeScanType.SCAN_TYPE_CAMERA],
				formatsToSupport: [Html5QrcodeSupportedFormats.EAN_13, Html5QrcodeSupportedFormats.EAN_8]
			},
			false // non-verbose
		);
		scanner.render(scanSuccess, undefined);
	});

	onDestroy(() => {
		scanner?.clear();
	});
</script>

<div id="qr-scanner" class={klass}></div>

<style>
    /* Hide unwanted icons */
    #qr-scanner :global(img[alt='Info icon']),
    #qr-scanner :global(img[alt='Camera based scan']) {
        display: none;
    }

    /* Change camera permission button text */
    #qr-scanner :global(#html5-qrcode-button-camera-permission) {
        visibility: hidden;
    }

    #qr-scanner :global(#html5-qrcode-button-camera-permission::after) {
        position: absolute;
        inset: auto 0 0;
        display: block;
        content: 'Allow camera access';
        visibility: visible;
        padding: 10px 0;
    }
</style>
