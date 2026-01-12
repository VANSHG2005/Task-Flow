/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Syne', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace']
      },
      colors: {
        ink: {
          50: '#f5f3f0',
          100: '#e8e4dc',
          200: '#d4cdc0',
          300: '#b8af9e',
          400: '#9a8f7c',
          500: '#7d7264',
          600: '#655c50',
          700: '#504942',
          800: '#3d3832',
          900: '#2a2520',
          950: '#1a1712'
        },
        amber: {
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706'
        },
        emerald: {
          400: '#34d399',
          500: '#10b981',
          600: '#059669'
        },
        rose: {
          400: '#fb7185',
          500: '#f43f5e',
          600: '#e11d48'
        }
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'slide-in': 'slideIn 0.3s ease-out'
      },
      keyframes: {
        fadeIn: { from: { opacity: 0 }, to: { opacity: 1 } },
        slideUp: { from: { opacity: 0, transform: 'translateY(16px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        slideIn: { from: { opacity: 0, transform: 'translateX(-16px)' }, to: { opacity: 1, transform: 'translateX(0)' } }
      }
    }
  },
  plugins: []
}
