/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          900: '#0f172a', // Dark blue background
          800: '#1e293b',
          700: '#334155',
          accent: '#8b5cf6', // Purple for AI
        }
      }
    },
  },
  plugins: [],
}