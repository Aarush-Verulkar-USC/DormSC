/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Manrope', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: '#932210',
        gold: '#e8c84a',
        cream: '#fdf7d6',
        ink: '#2c2420',
        muted: '#8a7b74',
        faint: '#c4b8b0',
        line: '#e3d8d0',
        surface: '#f2ede8',
        danger: '#b94040',
      },
    },
  },
  plugins: [],
};
