/** @type {import('tailwindcss').Config} */

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./assets",
  ],
  important: true,
  theme: {
    extend: {
      colors: {
        brand: {
          neon: "#1E40AF",
          pink: "#E91E63",
        },
      },
    },
  },
  plugins: [],
};
