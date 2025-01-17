import { createBrowserClient, isBrowser, parse } from '@supabase/ssr';
import type { LayoutLoad } from './$types';
import { PUBLIC_ANON_KEY, PUBLIC_SUPABASE_URL } from '$env/static/public';

export const ssr = false;

type CookieOptions = {
	path?: string;
	domain?: string;
	maxAge?: number;
	secure?: boolean;
	httpOnly?: boolean; // Not applicable in browser
	sameSite?: 'Strict' | 'Lax' | 'None';
};

export const load: LayoutLoad = async ({ fetch, data, depends }: any) => {
	depends('supabase:auth');

	const supabase = createBrowserClient(PUBLIC_SUPABASE_URL, PUBLIC_ANON_KEY, {
		global: {
			fetch
		},
		cookies: {
			getAll: (): { name: string; value: string }[] | null => {
				if (!isBrowser()) {
					// On the server, return the session data as a cookie array
					return [{ name: 'session', value: JSON.stringify(data.session) }];
				}

				// In the browser, parse `document.cookie` and return an array
				const cookies = parse(document.cookie);
				return Object.entries(cookies).map(([name, value]) => ({ name, value }));
			},
			setAll: (cookies: { name: string; value: string; options: CookieOptions }[]): void => {
				if (isBrowser()) {
					// Set cookies in the browser
					cookies.forEach(({ name, value, options }) => {
						const { path = '/', domain, maxAge, secure, sameSite } = options;

						// Build cookie string
						let cookieString = `${name}=${value}; Path=${path}`;
						if (domain) cookieString += `; Domain=${domain}`;
						if (maxAge) cookieString += `; Max-Age=${maxAge}`;
						if (secure) cookieString += `; Secure`;
						if (sameSite) cookieString += `; SameSite=${sameSite}`;

						// Set the cookie
						document.cookie = cookieString;
					});
				}
			}
		}
	});

	const {
		data: { session }
	} = await supabase.auth.getSession();

	return { supabase, session };
};
