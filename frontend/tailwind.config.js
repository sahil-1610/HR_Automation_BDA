/** @type {import('tailwindcss').Config} */

const mtConfig = require("@material-tailwind/react").mtConfig;



module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
     "./node_modules/@material-tailwind/react/**/*.{js,ts,jsx,tsx}"
  ],
  darkMode: 'class', // Enable dark mode with class strategy
  theme: {
    extend: {},
  },
  plugins: [mtConfig],
}