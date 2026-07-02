/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        cafe: {
          50: "#fbf6ef",
          100: "#f3e8d8",
          200: "#e3c8a6",
          500: "#8c6239",
          700: "#4e3624",
        },
        sage: "#74856a",
        ink: "#241f1b",
      },
    },
  },
  plugins: [],
};
