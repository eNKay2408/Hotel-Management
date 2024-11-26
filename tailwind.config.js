/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        yellow: '#d1b04d',
        orange: '#c97120',
        gray: '#B0B0B0',
        green: '#67ba43',
        red: '#bf4842',
      },
      fontFamily: {
        play: ['Play', 'sans-serif'],
        amethysta: ['Amethysta', 'serif'],
      },
    },
  },
  plugins: [],
};
