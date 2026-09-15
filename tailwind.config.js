// tailwind.config.js

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,jsx}", 
    "./components/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#6F5D4E",
          light:   "#8A7563",
          dark:    "#57483D",
        },
        secondary: {
          DEFAULT: "#D8C8B6",
          light:   "#E8DDD0",
        },
        accent: "#B89B7A",
        background: "#F3EEE8",
        black: "#292622",
        white: "#ffffff"
      },
      fontFamily: {
        sans: ["Inter Tight", "Roboto", "sans-serif"],
        title: ["Anton", "sans-serif"]
      }
    }
  },
  plugins: [],
}