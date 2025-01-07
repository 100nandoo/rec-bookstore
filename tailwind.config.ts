import containerQueries from '@tailwindcss/container-queries';
import forms from '@tailwindcss/forms';
import typography from '@tailwindcss/typography';
import daisyui from 'daisyui';
import type { Config } from 'tailwindcss';

export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	daisyui: {
		themes: ['sunset', 'fantasy']
	},
	theme: {
		extend: {}
	},

	plugins: [typography, forms, containerQueries, daisyui]
} satisfies Config;
