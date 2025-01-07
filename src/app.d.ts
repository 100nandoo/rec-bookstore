// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
import { SupabaseClient } from '@supabase/supabase-js';

declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		interface PageData {
			supabase: SupabaseClient;
		}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
