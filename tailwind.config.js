/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Включаємо підтримку темної теми на основі класу
  theme: {
    extend: {
      colors: {
        // Світла тема
        primary: {
          50: '#e6f1fe',
          100: '#cce3fd',
          200: '#99c8fb',
          300: '#66acf9',
          400: '#3391f7',
          500: '#0066FF', // Основний колір
          600: '#0052cc',
          700: '#003d99',
          800: '#002966',
          900: '#001433',
        },
        // Кольори для темної теми
        dark: {
          bg: '#121212',
          card: '#1e1e1e',
          border: '#333333',
          text: {
            primary: '#ffffff',
            secondary: '#a0a0a0',
          },
        },
        border: 'hsl(var(--border))',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'dark': '0 4px 6px rgba(0, 0, 0, 0.3)',
      },
      borderColor: {
        DEFAULT: 'hsl(var(--border))',
      }
    },
  },
  plugins: [],
}; 