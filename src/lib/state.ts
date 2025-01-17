import { type Writable, writable } from 'svelte/store';
import type { Session } from '@supabase/supabase-js';

export const sessionStore: Writable<Session | null> = writable(null);
