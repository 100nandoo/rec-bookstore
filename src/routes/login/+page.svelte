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
			style: { input: 'color: #fff' }
		}}
	/>
</div>
