/** @type {import('tailwindcss').Config} */

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./assets",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          neon: "#1E40AF", // ton bleu perso
          pink: "#E91E63", // tu peux en rajouter ici si tu veux
        },
      },
    },
  },
  plugins: [],
};
