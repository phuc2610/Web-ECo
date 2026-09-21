/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Inter', 'Roboto', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        'display': ['Inter', 'sans-serif'],
      },
      colors: {
        cps: {
          red: '#d70018',
          darkRed: '#b70014',
          lightRed: '#fef2f2',
          orange: '#e11d48',
          bg: '#f4f6f8'
        },
        primary: {
          50: '#fef2f2',
          100: '#fee2e2',
          500: '#d70018',
          600: '#b70014',
          700: '#991b1b',
        },
        navy: {
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617',
        },
        tech: {
          blue: '#d70018',
          dark: '#1f2937',
          light: '#f4f6f8',
          accent: '#b70014',
        }
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'slideInUp': 'slideInUp 0.5s ease-out',
        'fadeIn': 'fadeIn 0.3s ease-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        slideInUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0px)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        }
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
}