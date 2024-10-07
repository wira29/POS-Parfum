const flowbite = require("flowbite-react/tailwind")
const colors = require("tailwindcss/colors")

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
    '**/*.html',
    "./node_modules/flowbite/**/*.js",
    './node_modules/primereact/**/*.{js,jsx,ts,tsx}',
    flowbite.content()
  ],
  theme: {
    extend: {
      colors: {
        background: "#f5f5f5",
        primary: {
          50: '#f5f6fa',
          100: '#ebedf3',
          200: '#d2d6e5',
          300: '#abb4ce',
          400: '#7d8bb3',
          500: '#5d6d9a',
          600: '#495680',
          700: '#3c4568',
          800: '#353d57',
          900: '#2a2f42',
          950: '#202331',
        },
        danger: colors.red,
        warning: colors.yellow,
        success: colors.emerald,
        info: colors.indigo,
        subtitle: "#434343",
        title: "#161616",
        desc: "#8B8B8B"
      }
    }
  },
  plugins: [
    require("tailwindcss-animate"),
    flowbite.plugin(),
    require("flowbite/plugin")
  ],
}