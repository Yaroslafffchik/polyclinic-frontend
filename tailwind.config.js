/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#16a34a', // bg-green-600
          hover: '#15803d',   // hover:bg-green-700
        },
        background: '#f0fdf4', // bg-green-50
      },
    },
  },
  plugins: [],
}