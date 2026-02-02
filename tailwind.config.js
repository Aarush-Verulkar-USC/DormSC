/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    // Corrected paths to scan for files at the root level
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // Font families setup for Inter and JetBrains Mono
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'], // Sets Inter as the default font
        mono: ['var(--font-jetbrains-mono)', 'monospace'], // Sets JetBrains Mono as the mono font
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      // Your custom keyframes and animations
      keyframes: {
        fadeInUp: {
          '0%': {
            opacity: '0',
            transform: 'translateY(30px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        slideInLeft: {
          '0%': {
            opacity: '0',
            transform: 'translateX(-50px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateX(0)',
          },
        },
        flowRight: {
          '0%': {
            transform: 'translateX(-12px)',
            opacity: '0',
            scale: '0.8',
          },
          '15%': {
            opacity: '1',
            scale: '1',
          },
          '85%': {
            opacity: '1',
            scale: '1',
          },
          '100%': {
            transform: 'translateX(40px)',
            opacity: '0',
            scale: '0.8',
          },
        },
        arrowPulse: {
          '0%, 100%': {
            opacity: '0.6',
            transform: 'scale(1)',
          },
          '50%': {
            opacity: '1',
            transform: 'scale(1.1)',
          },
        },
      },
      animation: {
        fadeInUp: 'fadeInUp 0.8s ease-out forwards',
        slideInLeft: 'slideInLeft 0.6s ease-out forwards',
        flowRight: 'flowRight 2.5s ease-in-out infinite',
        arrowPulse: 'arrowPulse 2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};

