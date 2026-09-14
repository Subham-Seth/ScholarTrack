/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: '#0F3040',      // Primary dark navy/teal
          charcoal: '#464858',  // Secondary charcoal/slate
          terracotta: '#A56F63',// Muted terracotta
          peach: '#D99B7F',     // Warm peach/sand accent
          dark: '#081C26',
          surface: '#F8FAFC',
          card: '#FFFFFF',
          border: '#E2E8F0',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(15, 48, 64, 0.07), 0 4px 6px -2px rgba(15, 48, 64, 0.04)',
        'premium': '0 10px 30px -5px rgba(15, 48, 64, 0.08), 0 4px 6px -2px rgba(15, 48, 64, 0.03)',
      },
      borderRadius: {
        'xl': '14px',
        '2xl': '18px',
      }
    },
  },
  plugins: [],
}
