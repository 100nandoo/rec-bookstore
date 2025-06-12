import { createBrowserClient, isBrowser, parse } from '@supabase/ssr';
import type { LayoutLoad } from './$types';
import { PUBLIC_ANON_KEY, PUBLIC_SUPABASE_URL } from '$env/static/public';

export const ssr = false;

export const load: LayoutLoad = async ({ fetch, data, depends }) => {
	depends('supabase:auth');

	const supabase = createBrowserClient(PUBLIC_SUPABASE_URL, PUBLIC_ANON_KEY, {
		global: {
			fetch
		},
		cookies: {
			get: (key) => {
				if (!isBrowser()) {
					return JSON.stringify(data.session);
				}
				const cookies = parse(document.cookie);
				return cookies[key];
			},
			set: (key, value) => {
				if (isBrowser()) {
					document.cookie = `${key}=${value}; path=/; max-age=${60 * 60 * 24 * 365}; sameSite=Lax`;
				}
			},
			remove: (key) => {
				if (isBrowser()) {
					document.cookie = `${key}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
				}
			}
		}
	});

	const {
		data: { session }
	} = await supabase.auth.getSession();

	return { supabase, session };
};
