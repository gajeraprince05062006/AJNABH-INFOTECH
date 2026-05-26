/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#050505",
        surface: "#111111",
        primary: "#ffffff",
        secondary: "#999999",
        accent: "#00d2ff", // Bright tech cyan-blue
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        display: ["ADLaM Display", "sans-serif"],
      }
    },
  },
  plugins: [],
}
