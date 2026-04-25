import { type Writable, writable } from 'svelte/store';
import type { Session } from '@supabase/supabase-js';

export const sessionStore: Writable<Session | null> = writable(null);
export const roleStore: Writable<'admin' | 'user' | null> = writable(null);

export type CartItem = {
	book: { id: string; title: string; author: string; price: number; stock_twpc: number; stock_alex: number; isbn: string | null };
	location: 'twpc' | 'alex';
	quantity: number;
	price: number;
	checked: boolean;
};

export const cartStore: Writable<CartItem[]> = writable([]);
