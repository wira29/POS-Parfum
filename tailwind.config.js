const flowbite = require("flowbite-react/tailwind")

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
    flowbite.content()
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f5f6fa',
          100: '#ebedf3',
          200: '#d2s6e5',
          300: '#abb4ce',
          400: '#7d8bb3',
          500: '#5d6d9a',
          600: '#495680',
          700: '#3c4568',
          800: '#353d57',
          900: '#2a2f42',
          950: '#202331',
        }
      }
    }
  },
  plugins: [
    require("tailwindcss-animate"),
    flowbite.plugin()
  ],
}