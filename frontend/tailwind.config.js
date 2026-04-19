/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        sliit: {
          navy: '#003087',
          deep: '#001f5b',
          gold: '#F5A623',
          light: '#FFD580',
          surface: '#0a1628',
          muted: '#94a3b8'
        }
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
      }
    },
  },
  plugins: [],
}