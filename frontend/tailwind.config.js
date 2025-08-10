/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          400: '#B45880', // disabled
          500: '#A04476', // default
          600: '#8C3A6C', // hover
        },
        ink: '#2E2E2E',   // primary text
        muted: '#787878', // label text
      },
      fontFamily: {
        sans: ['Helvetica', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}