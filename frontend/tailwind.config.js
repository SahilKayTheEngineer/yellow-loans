/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        yellow: {
          primary: '#FFD700',
          secondary: '#FFA500',
        },
      },
    },
  },
  plugins: [],
}

