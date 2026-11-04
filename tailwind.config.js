/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: { sans: ['"Inter"', "-apple-system", "BlinkMacSystemFont", '"Segoe UI"', "Roboto", "sans-serif"] },
      colors: {
        eco: { 50: "#f0faf4", 100: "#dcf3e4", 200: "#b9e6c9", 500: "#34a368", 600: "#2a8a58", 700: "#226f47", 900: "#14402a" },
      },
    },
  },
  plugins: [],
};
