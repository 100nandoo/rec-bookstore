import { supabase } from '$lib/supabase/supabaseClient';

export const load = async () => {
	const { data, error } = await supabase.from('book').select();
	if (error) {
		console.error('Error fetching books:', error.message);
	}
	return { books: data ?? [] };
};
