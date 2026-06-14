/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['Syne', 'sans-serif'],
        body: ['DM Sans', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        ink: {
          50: '#f0f4ff',
          100: '#e0e9ff',
          200: '#c7d7ff',
          300: '#a4baff',
          400: '#7b93ff',
          500: '#5c6fff',
          600: '#4255f5',
          700: '#3444e0',
          800: '#2c39b5',
          900: '#1a2270',
          950: '#0d1240',
        },
        sage: {
          400: '#6ee7b7',
          500: '#34d399',
          600: '#10b981',
        },
        coral: {
          400: '#fb8f8f',
          500: '#f87171',
          600: '#ef4444',
        },
        amber: {
          400: '#fbbf24',
          500: '#f59e0b',
        }
      },
      backgroundImage: {
        'mesh-gradient': 'radial-gradient(at 40% 20%, hsla(240,100%,74%,0.15) 0px, transparent 50%), radial-gradient(at 80% 0%, hsla(259,100%,70%,0.1) 0px, transparent 50%), radial-gradient(at 0% 50%, hsla(220,100%,70%,0.1) 0px, transparent 50%)',
        'card-gradient': 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'slide-up': 'slideUp 0.5s ease-out',
        'fade-in': 'fadeIn 0.6s ease-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        'glass': '0 8px 32px rgba(31, 38, 135, 0.15)',
        'glass-sm': '0 4px 16px rgba(31, 38, 135, 0.1)',
        'glow': '0 0 20px rgba(92, 111, 255, 0.4)',
        'glow-sm': '0 0 10px rgba(92, 111, 255, 0.25)',
      }
    },
  },
  plugins: [],
}
