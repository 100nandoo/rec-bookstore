<script lang="ts">
	import { goto } from '$app/navigation';

	let { data } = $props();

	let currentPicture = $state(0);
	const hasPictures = $derived(data.book.pictures && data.book.pictures.length > 0);
</script>

<div class="mx-auto max-w-4xl">
	<!-- Back button -->
	<button class="btn btn-ghost btn-sm mb-6" onclick={() => goto('/list')}>
		← Back to list
	</button>

	<div class="grid gap-8 md:grid-cols-2">
		<!-- Image gallery -->
		<div class="flex flex-col gap-3">
			<div class="bg-base-200 flex aspect-[3/4] w-full items-center justify-center rounded-xl overflow-hidden">
				{#if hasPictures}
					<img
						src={data.book.pictures[currentPicture]}
						alt={data.book.title}
						class="h-full w-full object-contain"
					/>
				{:else}
					<!-- Placeholder -->
					<div class="text-base-content/30 flex flex-col items-center gap-2">
						<svg xmlns="http://www.w3.org/2000/svg" class="h-24 w-24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
						</svg>
						<span class="text-sm">No image</span>
					</div>
				{/if}
			</div>
			{#if hasPictures && data.book.pictures.length > 1}
				<div class="flex gap-2 overflow-x-auto pb-1">
					{#each data.book.pictures as pic, i (i)}
						<button
							class="h-16 w-12 flex-shrink-0 overflow-hidden rounded-md border-2 transition {currentPicture === i ? 'border-primary' : 'border-transparent'}"
							onclick={() => (currentPicture = i)}
						>
							<img src={pic} alt="thumbnail {i + 1}" class="h-full w-full object-cover" />
						</button>
					{/each}
				</div>
			{/if}
		</div>

		<!-- Book info -->
		<div class="flex flex-col gap-4">
			<div>
				<h1 class="text-primary text-2xl font-bold leading-tight">{data.book.title}</h1>
				<p class="text-accent mt-1 text-base font-medium">{data.book.author}</p>
			</div>

			<p class="text-secondary text-2xl font-bold">${Number(data.book.price).toFixed(2)}</p>

			<!-- Stock -->
			<div class="flex gap-4">
				<div class="bg-base-200 rounded-lg px-4 py-2 text-center">
					<p class="text-base-content/60 text-xs uppercase">TWPC</p>
					<p class="text-lg font-bold">{data.book.stock_twpc}</p>
				</div>
				<div class="bg-base-200 rounded-lg px-4 py-2 text-center">
					<p class="text-base-content/60 text-xs uppercase">Alex</p>
					<p class="text-lg font-bold">{data.book.stock_alex}</p>
				</div>
			</div>

			<!-- Topics -->
			{#if data.book.topics && data.book.topics.length > 0}
				<div class="flex flex-wrap gap-2">
					{#each data.book.topics as topic (topic)}
						<span class="badge badge-outline badge-sm">{topic}</span>
					{/each}
				</div>
			{/if}

			<!-- Description -->
			{#if data.book.description}
				<div>
					<h3 class="text-base-content mb-1 text-sm font-semibold uppercase tracking-wide">Description</h3>
					<p class="text-base-content/80 text-sm leading-relaxed">{data.book.description}</p>
				</div>
			{/if}

			<!-- Details table -->
			{#if data.book.publisher || data.book.published_date || data.book.pages || data.book.dimensions || data.book.weight}
				<div class="bg-base-200 rounded-xl p-4">
					<h3 class="text-base-content mb-3 text-sm font-semibold uppercase tracking-wide">Details</h3>
					<dl class="space-y-2 text-sm">
						{#if data.book.publisher}
							<div class="flex justify-between gap-4">
								<dt class="text-base-content/60">Publisher</dt>
								<dd class="font-medium text-right">{data.book.publisher}</dd>
							</div>
						{/if}
						{#if data.book.published_date}
							<div class="flex justify-between gap-4">
								<dt class="text-base-content/60">Published</dt>
								<dd class="font-medium">{new Date(data.book.published_date).toLocaleDateString('en-SG', { year: 'numeric', month: 'long', day: 'numeric' })}</dd>
							</div>
						{/if}
						{#if data.book.pages}
							<div class="flex justify-between gap-4">
								<dt class="text-base-content/60">Pages</dt>
								<dd class="font-medium">{data.book.pages}</dd>
							</div>
						{/if}
						{#if data.book.dimensions}
							<div class="flex justify-between gap-4">
								<dt class="text-base-content/60">Dimensions</dt>
								<dd class="font-medium">{data.book.dimensions}</dd>
							</div>
						{/if}
						{#if data.book.weight}
							<div class="flex justify-between gap-4">
								<dt class="text-base-content/60">Weight</dt>
								<dd class="font-medium">{data.book.weight} g</dd>
							</div>
						{/if}
						{#if data.book.isbn}
							<div class="flex justify-between gap-4">
								<dt class="text-base-content/60">ISBN</dt>
								<dd class="font-mono font-medium">{data.book.isbn}</dd>
							</div>
						{/if}
					</dl>
				</div>
			{/if}
		</div>
	</div>
</div>
