/** @type {import('tailwindcss').Config} */
export default {
	content: ["./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			colors: {
				yellow: "#caaa4a",
				orange: "#c48042",
				gray: "#B0B0B0",
				green: "#96cb4d",
				red: "#bf4842",
			},
			fontFamily: {
				play: ["Play", "sans-serif"],
				amethysta: ["Amethysta", "serif"],
			},
		},
	},
	plugins: [],
};
