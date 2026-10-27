/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cobalt: {
          DEFAULT: '#4169E1',
          hover: '#3154C4',
          light: '#EEF2FF',
          muted: '#8EA7F2'
        },
        navy: {
          DEFAULT: '#17294B',
          dark: '#0F1C34',
          light: '#223A69',
          border: '#2C4372'
        },
        surface: {
          light: '#F3F6FB',
          border: '#DCE3EF',
          card: '#FFFFFF'
        },
        brand: {
          text: '#24324A',
          secondary: '#68758B',
          muted: '#94A3B8'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 2px 10px rgba(23, 41, 75, 0.05)',
        'card-hover': '0 10px 25px rgba(65, 105, 225, 0.10)',
        'dropdown': '0 8px 30px rgba(23, 41, 75, 0.12)',
        'modal': '0 20px 40px rgba(23, 41, 75, 0.20)'
      }
    },
  },
  plugins: [],
}
