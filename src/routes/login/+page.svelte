<script lang="ts">
	export let data;
	import { Auth } from '@supabase/auth-ui-svelte';
	import { ThemeSupa } from '@supabase/auth-ui-shared';
	import { goto } from '$app/navigation';

	let { supabase, session } = data;
	$: ({ supabase, session } = data);

	$: if (session) {
		goto('/');
	}
</script>

<div class="mx-auto flex flex-col lg:max-w-[400px]">
	<p>Create an account or login below!</p>
	<Auth
		supabaseClient={supabase}
		theme="dark"
		appearance={{
			theme: ThemeSupa,
			style: {
				input:
					'color: hsl(var(--pc)); background-color: hsl(var(--b1)); border-color: hsl(var(--bc));',
				button: 'background-color: hsl(var(--p)); color: hsl(var(--pc));',
				label: 'color: hsl(var(--bc));',
				container: 'background-color: hsl(var(--b1));'
			}
		}}
	/>
</div>
