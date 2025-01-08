<script lang="ts">
	const themes = ['sunset', 'fantasy'];
</script>

<div class="dropdown dropdown-end">
	<!-- Dropdown Button -->
	<div tabindex="0" role="button" class="hover:text-primary">Theme</div>

	<!-- Dropdown Content -->
	<ul
		class="dropdown-content z-10 flex max-h-48 w-40 flex-col gap-y-2 overflow-auto rounded-box bg-base-300 p-2 shadow-2xl"
	>
		<!-- Theme Options -->
		{#each themes as theme}
			<li>
				<!-- Radio Button for Each Theme -->

				<input
					type="radio"
					name="theme-dropdown"
					class="theme-controller btn btn-ghost btn-sm btn-block justify-start"
					aria-label={theme}
					value={theme}
				/>
			</li>
		{/each}
	</ul>
</div>
