import { supabase } from '$lib/supabase/supabaseClient';
import { json } from '@sveltejs/kit';

export async function GET(event) {
	const isbn = event.params.isbn;
	console.log('param:' + isbn);

	const { data, error } = await supabase.from('book').select().eq('isbn', isbn.trim()).single();
	if (data) {
		console.log('data:' + data.title);
		return json(data);
	}

	if (error) {
		console.error('Error fetching data:', error.message);
	}

	return json(null);
}
