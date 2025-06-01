/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
    "./error.vue"
  ],
  theme: {
    extend: {
      colors: {
        background: '#03000F',
        primary: {
          DEFAULT: '#a855f7',
          dark: '#9333ea',
        },
      },
    },
  },
  plugins: [],
}
