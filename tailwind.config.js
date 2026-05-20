/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0fdff',
          100: '#ccf7fe',
          200: '#99eefd',
          300: '#5ce0fa',
          400: '#00D9FF',
          500: '#00b8d9',
          600: '#0093b0',
          700: '#05748f',
          800: '#0a5f74',
          900: '#0e4f62',
        },
        dark: {
          50: '#f7f7f8',
          100: '#e3e4e6',
          200: '#c1c2c6',
          300: '#a0a2a8',
          400: '#6e7178',
          500: '#4a4d55',
          600: '#2d3036',
          700: '#1f2128',
          800: '#1a1b21',
          900: '#0f1014',
        },
      },
    },
  },
  plugins: [],
}
