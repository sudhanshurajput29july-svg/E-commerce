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
        primary: {
          50: '#f4f6fb',
          100: '#e8ecf6',
          200: '#cbd5ee',
          300: '#9cb3e1',
          400: '#688cd2',
          500: '#476bc0',
          600: '#3550a2',
          700: '#2b4084',
          800: '#26376c',
          900: '#23305b',
          950: '#151c37',
        },
      },
    },
  },
  plugins: [],
}
