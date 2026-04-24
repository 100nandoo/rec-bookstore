import { supabase } from '$lib/supabase/supabaseClient';
import { error } from '@sveltejs/kit';

export const load = async ({ params }) => {
	const { data, error: err } = await supabase
		.from('book')
		.select('*')
		.eq('id', params.id)
		.single();

	if (err || !data) {
		error(404, 'Book not found');
	}

	return { book: data };
};
