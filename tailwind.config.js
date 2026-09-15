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
          DEFAULT: "#2e358c",
          light:   "#30368b",
          dark:    "#242c67",
        },
        secondary: {
          DEFAULT: "#009ee2",
          light:   "#0089d0",
        },
        accent: "#009ee2",
        background: "#eeeeeF",
        black: "#000100",
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