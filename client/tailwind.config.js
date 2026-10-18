/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['Overpass Mono', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      colors: {
        brand: '#ff654f',
        gold: '#f0c75e',
        cream: '#2a2418',
        canvas: '#0b0c0e',
        panel: '#121316',
        ink: '#f3f1ed',
        muted: '#aaa7a1',
        faint: '#686a70',
        line: '#303238',
        surface: '#1a1c20',
        danger: '#ff6b6b',
      },
    },
  },
  plugins: [],
};
