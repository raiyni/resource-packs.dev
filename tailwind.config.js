/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	daisyui: {
		themes: ["light", "dark", "cupcake"],
	},
	plugins: [require('@tailwindcss/typography'), require('daisyui')],
}
